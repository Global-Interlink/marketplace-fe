import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Sort from "../../src/components/atoms/Sort";
import Empty from "../../src/components/molecules/EmptyView";
import ListNFTItem from "../../src/components/molecules/ListNFTItem";
import SocialView from "../../src/components/molecules/SocialView";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import {
  fetchCollectionDetail,
  fetchListNFTOfCollection,
} from "../../src/redux/collection/collectionSlice";
import { useAppDispatch, useAppSelector } from "../../src/redux/hook";

const Collection = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const collectionData = useAppSelector(
    (store) => store.collection.collectionData.response
  );
  const { response } = useAppSelector((store) => store.collection.nftData);
  const LIMIT = 20;
  const [sort, setSort] = React.useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchCollectionDetail({ id: String(id) }));
    }
  }, [id]);

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
        <div className="flex space-y-5 md:items-center flex-col md:flex-row md:justify-between md:space-x-10">
          <div className="flex w-full md:items-center space-x-2 md:space-x-4">
            <div className="">
              <Image
                alt="logo-lp"
                src={collectionData?.logo}
                width={64}
                height={64}
                className="w-8 h-8 mt-2 md:mt-0 md:w-[64px] md:h-[64px] object-contain rounded-full"
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
                  <SocialView response={undefined} />
                </div>
              </div>

              <div className="flex text-black dark:text-white">
                Items {Number(collectionData?.totalNfts).toLocaleString()}
              </div>
              <div className="flex lg:hidden items-center space-x-3 mt-[28px]">
                <SocialView response={undefined} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[30px] space-y-10">
          <p className="text-black dark:text-white">
            {collectionData.description}
          </p>
          <Image
            src={collectionData.banner}
            width={200}
            height={200}
            className="flex w-full aspect-[1300/500] rounded-t-[20px] object-cover"
            alt="banner"
          />
        </div>
        <div className="mt-[114px]">
          <div className="flex items-center justify-between">
            <p className="text-black dark:text-white font-bold">Items</p>
            <Sort onChange={setSort} />
          </div>
          {response && response.data ? (
            <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {response?.data.map((i) => {
                return <ListNFTItem key={i.id} data={i} />;
              })}
            </div>
          ) : (
            <Empty />
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
                  className="bg-white text-primary font-bold rounded-lg border w-[189px] h-[49px]"
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
