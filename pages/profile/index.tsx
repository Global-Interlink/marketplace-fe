import { useWallet } from "@suiet/wallet-kit";
import { Tabs } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FetchStatus } from "../../src/api/APIFunctions";
import CopyIcon from "../../src/components/atoms/Icons/CopyIcon";
import Empty from "../../src/components/molecules/EmptyView";
import ListNFTItem from "../../src/components/molecules/ListNFTItem";
import NFTListSkeleton from "../../src/components/molecules/NFTListSkeleton";
import ProfileTopSkeleton from "../../src/components/molecules/ProfileTopSkeleton";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import { formatLongString } from "../../src/contract-abi/consts";
import { useAppDispatch, useAppSelector } from "../../src/redux/hook";
import {
  fetchMyListingNFTs,
  fetchMyNFTs,
  fetchUser,
} from "../../src/redux/profile/profileSlice";
import { NFT } from "../../src/api/types";
import { getUnique } from "../../src/utils/localStorage";

const Collection = () => {
  const dispatch = useAppDispatch();
  const { response, status } = useAppSelector(
    (store) => store.profie.profileData
  );
  const { response: user, status: userStatus } = useAppSelector(
    (store) => store.profie.userData
  );
  const { response: listed, status: listedStatus } = useAppSelector(
    (store) => store.profie.listedData
  );
  const { push } = useRouter();
  const { address, connected } = useWallet();
  const LIMIT = 4;
  const [sort, setSort] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageItems, setCurrentPageItems] = useState(1);

  const handleFetchData = () => {
    setTimeout(() => {
      dispatch(fetchUser());
      dispatch(fetchMyListingNFTs({ page: 1, limit: LIMIT, sort: "DESC" }));
      dispatch(fetchMyNFTs({ page: 1, limit: LIMIT, sort: "DESC" }));
    }, 2000);
  };

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (address && connected) {
      dispatch(
        fetchMyNFTs({
          page: currentPageItems,
          limit: LIMIT,
          sort: sort,
        })
      );
    }
  }, [address, connected, currentPageItems, dispatch, sort]);

  const [oldAddress, setOldAddress] = useState("");
  useEffect(() => {
    if (address) {
      setOldAddress(address);
    } else if (!address && oldAddress) {
      push("/");
    }
  }, [address]);

  useEffect(() => {
    console.log(currentPage);

    if (address) {
      dispatch(
        fetchMyListingNFTs({
          page: currentPage,
          limit: LIMIT,
          sort: sort,
        })
      );
    }
  }, [currentPage, sort, address, connected, dispatch]);

  const [listNFT, setListNFT] = useState<NFT[]>([]);
  const [listedNFT, setListedNFT] = useState<NFT[]>([]);

  useEffect(() => {
    if (response?.data) {
      setListNFT(getUnique([...listNFT, ...response?.data], 'id'));
    }
  }, [currentPageItems, response?.data])

  useEffect(() => {
    if (listed?.data) {
      setListedNFT(getUnique([...listedNFT, ...listed?.data], 'id'));
    }
  }, [currentPageItems, listed?.data])

  const tabs = [
    {
      label: (
        <div className="flex items-center space-x-[6px]">
          <p>My items</p>
          <span className="text-white dark:text-gray-300 bg-gray-500 dark:bg-inputBg text-base px-1 rounded">
            {user?.totalInMyWallet}
          </span>
        </div>
      ),
      children: (
        <div>
          {status === FetchStatus.pending ? (
            <NFTListSkeleton hideTab />
          ) : (
            <div>
              {response?.data && response.data.length > 0 ? (
                <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                  {listNFT.map((i) => {
                    return (
                      <ListNFTItem
                        key={i.onChainId}
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
              {response &&
                response.data &&
                currentPageItems < response?.meta.totalPages && (
                  <div className="mt-[70px] flex justify-center">
                    <button
                      onClick={() => {
                        if (currentPageItems < response?.meta.totalPages) {
                          setCurrentPageItems(currentPageItems + 1);
                        }
                      }}
                      className="bg-white text-primary dark:bg-[#71659C] dark:text-white font-bold rounded-lg border border-[#c2c2c2] w-[189px] h-[49px]"
                    >
                      Load more
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div className="flex items-center space-x-[6px]">
          <p>Listing</p>
          <span className="text-white dark:text-gray-300 bg-gray-500 dark:bg-inputBg text-base px-1 rounded">
            {user?.listedItems}
          </span>
        </div>
      ),
      children: (
        <div>
          {listedStatus === FetchStatus.pending ? (
            <NFTListSkeleton hideTab />
          ) : (
            <div>
              {listed?.data && listed.data.length > 0 ? (
                <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                  {listedNFT.map((i) => {
                    return (
                      <ListNFTItem
                        key={"listed_" + i.onChainId}
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
              {listed &&
                listed.data &&
                currentPage < listed?.meta.totalPages && (
                  <div className="mt-[70px] flex justify-center">
                    <button
                      onClick={() => {
                        if (currentPage < listed?.meta.totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      className="bg-white text-primary dark:bg-[#71659C] dark:text-white font-bold rounded-lg border border-[#c2c2c2] w-[189px] h-[49px]"
                    >
                      Load more
                    </button>
                  </div>
                )}
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
              {!address ? (
                <ProfileTopSkeleton />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex w-full items-center space-x-6">
                      <div className="">
                        <Image
                          alt="logo-lp"
                          src={"/img-default-acc.svg"}
                          width={78}
                          height={78}
                          className="w-[44px] h-[44px] min-w-[44px] md:w-[78px] md:h-[78px] mt-2 md:mt-0 object-contain rounded-full"
                        />
                      </div>
                      <div className="text-black dark:text-white">
                        {address && (
                          <div className="border px-2 py-[2px] w-[150px] rounded border-black dark:border-white items-center flex space-x-[6px]">
                            <p>{formatLongString(address)}</p>
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                navigator.clipboard.writeText(address);
                                toast.info("Copied to clipboard!");
                              }}
                            >
                              <CopyIcon />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="mt-[36px] space-y-[10px]">
                <Tabs
                  items={tabs}
                  className="dark:text-gray-500 text-primary"
                />
              </div>
              {(status === FetchStatus.idle ||
                status === FetchStatus.pending ||
                listedStatus === FetchStatus.idle ||
                listedStatus === FetchStatus.pending) && (
                <NFTListSkeleton hideTab />
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Collection;
