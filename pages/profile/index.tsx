import { Tabs } from "antd";
import Image from "next/image";
import React from "react";
import ListNFTItem from "../../src/components/molecules/ListNFTItem";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import { useAppDispatch, useAppSelector } from "../../src/redux/hook";
import {
  fetchMyListingNFTs,
  fetchMyNFTs,
} from "../../src/redux/profile/profileSlice";

const Collection = () => {
  const dispatch = useAppDispatch();
  const { response } = useAppSelector((store) => store.profie.profileData);
  const { response: listed } = useAppSelector(
    (store) => store.profie.listedData
  );
  const LIMIT = 20;
  const [sort, setSort] = React.useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = React.useState(1);
  React.useEffect(() => {
    dispatch(fetchMyNFTs());
    dispatch(
      fetchMyListingNFTs({
        page: currentPage,
        limit: LIMIT,
        sort: sort,
      })
    );
  }, []);

  const tabs = [
    {
      label: (
        <div className="flex items-center space-x-[6px]">
          <p>My items</p>
          <span className="text-white dark:text-gray-300 bg-gray-500 dark:bg-inputBg text-base px-1 rounded">
            {(response?.result && response?.result.length) || 0}
          </span>
        </div>
      ),
      children: (
        <div>
          <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {response?.result?.map((i) => {
              return <ListNFTItem key={i.onChainId} data={i} />;
            })}
          </div>
          <div className="mt-[70px] flex justify-center">
            <button className="bg-white text-primary font-bold rounded-lg border w-[189px] h-[49px]">
              Load more
            </button>
          </div>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div className="flex items-center space-x-[6px]">
          <p>Listing</p>
          <span className="text-white dark:text-gray-300 bg-gray-500 dark:bg-inputBg text-base px-1 rounded">
            {(listed?.data && listed?.data.length) || 0}
          </span>
        </div>
      ),
      children: (
        <div>
          <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {listed?.data?.map((i) => {
              return <ListNFTItem key={i.onChainId} data={i} />;
            })}
          </div>
          {listed && listed.data && currentPage < listed.meta.totalPages && (
            <div className="mt-[70px] flex justify-center">
              <button
                onClick={() => {
                  if (listed?.meta.currentPage < listed?.meta.totalPages) {
                    setCurrentPage(listed?.meta.currentPage + 1);
                  }
                }}
                className="bg-white text-primary font-bold rounded-lg border w-[189px] h-[49px]"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      ),
      key: "2",
    },
  ];
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="py-4 md:py-8">
          <div className="mt-10 flex flex-col space-y-10 md:space-y-0 md:flex-row md:space-x-20 lg:space-x-30 xl:space-x-40">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex w-full items-center space-x-6">
                  <div className="">
                    <Image
                      alt="logo-lp"
                      src={"/img-mock-logo-1.png"}
                      width={78}
                      height={78}
                      className="w-[44px] h-[44px] min-w-[44px] md:w-[78px] md:h-[78px] mt-2 md:mt-0 object-contain rounded-full"
                    />
                  </div>
                  <div className="text-black dark:text-white">
                    <p className="external text-[36px]">Sayaka CollectionNFT</p>
                    <p>0x24a1...c5d46717</p>
                  </div>
                </div>
              </div>
              <div className="bg-white text-black dark:text-white border shadow dark:bg-gray-800 p-6 rounded-[20px] justify-between flex mt-6">
                <div>
                  <p>Total Items</p>
                  <p>{response?.result?.length || 0}</p>
                </div>
                <div>
                  <p>Listed Items</p>
                  <p>{(listed?.data && listed?.data?.length) || 0}</p>
                </div>
                <div>
                  <p>Total Volume</p>
                  <p>-</p>
                </div>
                <div>
                  <p>Estimated Value</p>
                  <p>-</p>
                </div>
              </div>
              <div className="mt-[36px] space-y-[10px]">
                <Tabs
                  items={tabs}
                  className="dark:text-gray-500 text-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Collection;
