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
  const LIMIT = 20;
  const [sort, setSort] = React.useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = React.useState(1);

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
  }, [currentPage, id, sort]);

  return collectionData ? (
    <BaseComponent>
      <div className="py-4 md:py-8">
        {collectionStatus === FetchStatus.idle ||
        collectionStatus === FetchStatus.pending ? (
          <CollectionDetailTopSkeleton />
        ) : (
          <>
            <div className="flex space-y-5 md:items-center flex-col md:flex-row md:justify-between md:space-x-10">
              <div className="flex w-full md:items-center space-x-2 md:space-x-4">
                <div className="">
                  <Image
                    alt="logo-lp"
                    src={collectionData?.logo}
                    width={1000}
                    height={1000}
                    className="w-8 h-8 mt-2 md:mt-0 md:w-[64px] md:h-[64px] object-cover rounded-full"
                  />
                </div>

                <div className="w-full">
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <p className="external text-[32px] text-black dark:text-white font-display">
                        {collectionData?.name}
                      </p>
                    </div>
                    <div className=" hidden lg:flex items-center space-x-3 md:space-x-6">
                      <SocialView response={collectionData} />
                    </div>
                  </div>

                  <div className="flex text-black dark:text-white">
                    Items {Number(collectionData?.totalNfts).toLocaleString()}
                  </div>
                  <div className="flex lg:hidden items-center space-x-3 mt-[28px]">
                    <SocialView response={collectionData} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[30px] space-y-10">
              <p className="text-black dark:text-white"></p>
              <div className="text-black dark:text-white">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                >
                  {collectionData.description}
                </ReactMarkdown>
              </div>
              <Image
                src={
                  collectionData.banner && validURL(collectionData.banner)
                    ? collectionData.banner
                    : "/default.jpeg"
                }
                width={1280}
                height={1024}
                className="flex w-full aspect-[1300/500] rounded-[20px] object-cover"
                alt="banner"
              />
            </div>
          </>
        )}

        <div className="mt-[114px]">
          {status === FetchStatus.idle || status === FetchStatus.pending ? (
            <NFTListSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-black dark:text-white font-bold">Items</p>
                <Sort
                  onChange={(sort) => {
                    console.log("=sort", sort);
                    setSort(sort);
                  }}
                  sort={sort}
                />
              </div>
              {response && response.data && response.data.length > 0 ? (
                <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                  {response?.data.map((i) => {
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
          {response &&
            response.data &&
            currentPage < response.meta.totalPages && (
              <div className="mt-[70px] flex justify-center">
                <button
                  onClick={() => {
                    if (
                      response?.meta.currentPage < response?.meta.totalPages
                    ) {
                      setCurrentPage(response?.meta.currentPage + 1);
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
