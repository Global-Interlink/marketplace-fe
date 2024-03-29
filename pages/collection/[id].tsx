import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/router";
import React from "react";
import Sort from "../../src/components/atoms/Sort";
import Empty from "../../src/components/molecules/EmptyView";
import ListNFTItem, {
  validURL,
} from "../../src/components/molecules/ListNFTItem";
import SocialView from "../../src/components/molecules/SocialView";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import {
  clear,
  fetchCollectionDetail,
  fetchListNFTOfCollection,
} from "../../src/redux/collection/collectionSlice";
import { useAppDispatch, useAppSelector } from "../../src/redux/hook";
import NFTListSkeleton from "../../src/components/molecules/NFTListSkeleton";
import { FetchStatus } from "../../src/api/APIFunctions";
import CollectionDetailTopSkeleton from "../../src/components/molecules/CollectionDetailTopSkeleton";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { NFT } from "../../src/api/types";
import { getUnique } from "../../src/utils/localStorage";
import SearchForm from "../../src/components/molecules/Search";
import { debounce } from "lodash";
var canLoad = true;
const Collection = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { response: collectionData, status: collectionStatus } = useAppSelector(
    (store) => store.collection.collectionData
  );
  const { response, status } = useAppSelector(
    (store) => store.collection.nftData
  );
  const LIMIT = 12;
  const [sort, setSort] = React.useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showMore, setShowMore] = React.useState(false);
  const [isShow, setIsShow] = React.useState(false);
  const [listNFT, setListNFT] = React.useState<NFT[]>([]);

  const init = () => {
      canLoad = true;  
      setListNFT([]);
      setCurrentPage(1);
  }
  React.useEffect(() => {
    if (id) {
      dispatch(fetchCollectionDetail({ id: String(id) }));
    }
    console.log("hello collection")
  }, [id]);

  React.useEffect(() => {
    return () => {
      dispatch(clear());
    };
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', checkScroll);
    return () => {
        window.removeEventListener('scroll', checkScroll);
    }
  }, [response?.meta?.totalPages]);

  const checkScroll = () => {
    const list = document.getElementById('list-nft')
    if(list?.clientHeight ){
      const x = window.scrollY + window.innerHeight
      const y = list?.clientHeight + list?.offsetTop
      if (x >= y && status != FetchStatus.pending && canLoad) {
        if(response?.meta?.totalPages && currentPage < Number(response?.meta?.totalPages)) {
          setCurrentPage(prev => prev + 1)
        }
        canLoad = false;     
      }
    }
  }   
  const [isFocus, setFocus] = React.useState(false);
  const [text, setText] = React.useState("");

  const handleFetchData = () => {
    if (id) {
      init()
      dispatch(
        fetchListNFTOfCollection({
          id: String(id),
          page: 1,
          limit: LIMIT,
          sort: sort,
          nameNft: text,
        })
      );
    }
  };

  const debounceSearch = React.useCallback(
    debounce((nextValue) => {
      if (id) {
        init()
        dispatch(
          fetchListNFTOfCollection({
            id: String(id),
            page: 1,
            limit: LIMIT,
            sort: sort,
            nameNft: nextValue,
          })
        );
      }
    }, 2000),
    [id,sort]
  );

  React.useEffect(() => {
    if (id ) {
      dispatch(
        fetchListNFTOfCollection({
          id: String(id),
          page: currentPage,
          limit: LIMIT,
          sort: sort,
          nameNft: text,
        })
      );
    }
  }, [id, currentPage]);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchCollectionDetail({ id: String(id) }));
    }
  }, [id]);

  React.useEffect(() => {
    return () => {
      dispatch(clear());
    };
  }, []);

  React.useEffect(() => {
    if (listNFT && listNFT.length > 0) {
     handleFetchData()
    }
  }, [sort]);

  React.useEffect(() => {
    const divElement = document.querySelector(".collection-description");
    if (divElement) {
      const divHeight = divElement.getBoundingClientRect().height;
      if (divHeight > 72) {
        setIsShow(true);
      }
    }
  }, [collectionData]);

  React.useEffect(() => {
    if (response?.data) {
      setListNFT((s) => {
        return getUnique([...s, ...response.data], "id");
      });
      canLoad = true
    }
  }, [response]);

  return collectionData ? (
    <BaseComponent>
      <div className="">
        {collectionStatus === FetchStatus.idle ||
        collectionStatus === FetchStatus.pending ? (
          <CollectionDetailTopSkeleton />
        ) : (
          <div>
            <Image
              src={validURL(collectionData.banner || "/default.jpeg")}
              width={1305}
              height={228}
              className="flex w-full aspect-[1305/228] rounded-[20px] object-cover mt-5"
              alt="banner"
            />
            <div className="flex w-[80%] mx-[10%] bg-white dark:bg-[#1F0844] rounded-[10px] -mt-0 sm:-mt-14 z-[9999] relative">
              <Image
                alt="logo-lp"
                src={collectionData?.logo}
                width={160}
                height={160}
                className=" w-[60px] h-[60px] sm:w-[160px] sm:h-[160px] aspect-[1/1] object-cover rounded-[10px] m-[14px] sm:m-[24px] items-center"
              />
              <div className="w-full my-auto">
                <p
                   className="text-xl md:text-[24px] external leading-8 font-semibold text-black dark:text-white font-display break-all mt-[12px] mr-[24px]"
                  title={collectionData?.name}
                >
                  {collectionData?.name}
                </p>
                <div className="mt-[12px] mr-[12px]">
                  <div
                    className={
                      "collection-description text-transparent absolute -z-10 break-all"
                    }
                  >
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {collectionData.description}
                    </ReactMarkdown>
                  </div>
                  <div
                    className={` text-black dark:text-white transition-all duration-300 ${
                      showMore ? "" : "ellipsis-multi"
                    }`}
                  >
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {collectionData.description}
                    </ReactMarkdown>
                  </div>
                  <button
                    className={`${
                      isShow ? "flex" : "hidden"
                    } gap-1 justify-between items-center text-[#f626d1] py-2 px-3 rounded-[100px] mx-auto text-sm `}
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "Show less" : "Show more"}{" "}
                    {showMore ? <BsChevronUp /> : <BsChevronDown />}
                  </button>
                </div>
                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                  <SocialView response={collectionData} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-[40px]">
          {(status === FetchStatus.idle || status === FetchStatus.pending) && currentPage == 1 ? (
            <NFTListSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-black dark:text-white">
                  <div
                    className={` ${
                      isFocus ? "border" : "border border-transparent"
                    } px-6 py-4 flex items-center space-x-4 w-[100%] lg:w-[300px] xl:w-[380px] h-12 bg-white dark:bg-[#392B4A]/50 rounded-full`}
                  >
                    <Image src="/ic_search.svg" width={20} height={20} alt="ic-search"/>
                    <input
                      placeholder="Search NFTs"
                      className="bg-transparent text-sm flex-1 outline-none dark:caret-white dark:text-white"
                      onChange={(e) => {
                        const { value } = e.target;
                        setText(value);
                        debounceSearch(value);
                      }}
                      value={text}
                      onFocus={() => {
                        setFocus(true);
                      }}
                      onBlur={() => {
                        setFocus(false);
                      }}
                    />
                    {text.length > 0 && (
                      <button
                        onClick={() => {
                          setText("");
                          debounceSearch("");
                        }}
                      >
                        <Image width={24} height={24} src="/ic-close.svg" alt="ic-close" />
                      </button>
                    )}
                  </div>
                </div>
                <Sort
                  onChange={(sort) => {
                    setSort(sort);
                  }}
                  sort={sort}
                  firstChoose="High to low"
                  secondChoose="Low to high"
                />
              </div>
              {listNFT && listNFT.length > 0 ? (
                <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5" id="list-nft">
                  {listNFT.map((i) => {
                    return (
                      <ListNFTItem
                        key={i.id}
                        data={i}
                        onBuySuccess={handleFetchData}
                        onDelistSuccess={handleFetchData}
                        onListSuccess={handleFetchData}
                      />
                    );
                  })}
                </div>
              ) : (
                <Empty />
              )}
            </>
          )}
        </div>
      </div>
    </BaseComponent>
  ) : null;
};
export default Collection;
