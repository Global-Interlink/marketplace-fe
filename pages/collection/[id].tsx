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

  const handleFetchData = () => {
    if (id) {
      setListNFT([]);
      setCurrentPage(1);
      dispatch(
        fetchListNFTOfCollection({
          id: String(id),
          page: 1,
          limit: LIMIT,
          sort: sort,
        })
      );
    }
  };

  React.useEffect(() => {
    if (id) {
      dispatch(
        fetchListNFTOfCollection({
          id: String(id),
          page: currentPage,
          limit: LIMIT,
          sort: sort,
        })
      );
    }
  }, [id]);

  React.useEffect(() => {
    if (listNFT && listNFT.length > 0) {
      setListNFT([]);
      setCurrentPage(1);
      dispatch(
        fetchListNFTOfCollection({
          id: String(id),
          page: 1,
          limit: LIMIT,
          sort: sort,
        })
      );
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
  // console.log("==", listNFT);
  React.useEffect(() => {
    if (response?.data) {
      setListNFT((s) => {
        return getUnique([...s, ...response.data], "id");
      });
    }
  }, [response]);

  return collectionData ? (
    <BaseComponent>
      <div className="">
        {collectionStatus === FetchStatus.idle ||
        collectionStatus === FetchStatus.pending ? (
          <CollectionDetailTopSkeleton />
        ) : (
          <div className="relative">
            <Image
            src={
              validURL(collectionData.banner || "/default.jpeg")
            }
              width={1305}
              height={228}
              className="flex w-full aspect-[1305/228] rounded-[20px] object-cover mt-5"
              alt="banner"
            />
            <div className="flex h-[208px] w-[80%] mx-[10%] bg-white rounded-[10px] absolute -mt-14">
              <Image
                alt="logo-lp"
                src={collectionData?.logo}
                width={160}
                height={160}
                className="md:w-[160px] md:h-[160px] rounded-[10px] m-[24px]"
              />

              <div className="w-full my-auto">
                <div className="w-full flex items-center justify-between">
                  <div className="md:w-4/5">
                    <p
                      className="text-xl md:text-[24px] external leading-8 font-semibold text-black dark:text-white font-display break-all"
                      title={collectionData?.name}
                    >
                      {collectionData?.name}
                    </p>
                  </div>
                  {/* <div className="hidden lg:flex items-center space-x-3 md:space-x-6">
                      <SocialView response={collectionData} />
                    </div> */}
                </div>

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
                  {/* <button
                    className={`${
                      isShow ? "flex" : "hidden"
                    } gap-1 justify-between items-center text-[#f626d1] py-2 px-3 rounded-[100px] mx-auto text-sm `}
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "Show less" : "Show more"}{" "}
                    {showMore ? <BsChevronUp /> : <BsChevronDown />}
                  </button> */}
                </div>
                <div className="flex items-center space-x-3 mt-[12px]">
                  <SocialView response={collectionData} />
                </div>
                {/* <div className="flex text-black dark:text-white md:mt-2">
                    Items {Number(collectionData?.totalNfts).toLocaleString()}
                  </div> */}
              </div>
            </div>
          </div>
        )}

        <div className="mt-[200px]">
          {status === FetchStatus.idle || status === FetchStatus.pending ? (
            <NFTListSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between">
                {/* <p className="text-black dark:text-white font-bold">Items</p> */}
                <div className="text-black">
                  <SearchForm />
                </div>
                <Sort
                  onChange={(sort) => {
                    setSort(sort);
                  }}
                  sort={sort}
                />
              </div>
              {listNFT && listNFT.length > 0 ? (
                <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
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
          {listNFT &&
            listNFT.length > 0 &&
            response &&
            currentPage < response.meta.totalPages && (
              <div className="mt-[70px] flex justify-center">
                <button
                  onClick={() => {
                    if (
                      response?.meta.currentPage < response?.meta.totalPages
                    ) {
                      setCurrentPage(response?.meta.currentPage + 1);
                      dispatch(
                        fetchListNFTOfCollection({
                          id: String(id),
                          page: response?.meta.currentPage + 1,
                          limit: LIMIT,
                          sort: sort,
                        })
                      );
                    }
                  }}
                  className="bg-white text-primary dark:bg-[#71659C] dark:text-white font-bold rounded-lg border border-[#c2c2c2] w-[189px] h-[49px]"
                >
                  Load more
                </button>
              </div>
            )}
        </div>
      </div>
    </BaseComponent>
  ) : null;
};
export default Collection;
