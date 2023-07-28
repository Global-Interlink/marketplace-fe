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
  clear,
} from "../../src/redux/profile/profileSlice";
import { NFT } from "../../src/api/types";
import { getUnique } from "../../src/utils/localStorage";
import { BackToTop } from "../../src/components/molecules/BackToTop";
var canLoadMyItem = true;
var canLoadListing = true;
const Collection = () => {
  const dispatch = useAppDispatch();
  const { response, status } = useAppSelector(
    (store) => store.profie.profileData
  );
  const { response: user } = useAppSelector((store) => store.profie.userData);
  const { response: listed, status: listedStatus } = useAppSelector(
    (store) => store.profie.listedData
  );
  const { push } = useRouter();
  const { address, connected } = useWallet();
  const LIMIT = 12;
  const [sort, setSort] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageItems, setCurrentPageItems] = useState(1);
  const [listNFT, setListNFT] = useState<NFT[]>([]);
  const [listedNFT, setListedNFT] = useState<NFT[]>([]);
  const [isFocus, setFocus] = React.useState(false);
  const [text, setText] = React.useState("");

  const init = () => {
    setListNFT([])
    setListedNFT([])
    setCurrentPage(1)
    setCurrentPageItems(1)
    canLoadListing = true
    canLoadMyItem = true
  }
  const handleFetchData = () => {
    setTimeout(() => {
      init()
      dispatch(fetchUser());
      dispatch(fetchMyListingNFTs({ page: 1, limit: LIMIT, sort: "DESC" }));
      dispatch(fetchMyNFTs({ page: 1, limit: LIMIT, sort: "DESC" }));
    }, 2000);
  };

  useEffect(() => {
    dispatch(fetchUser());
    return () => {
      dispatch(clear());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!connected) {
      dispatch(clear());
    }
  }, [connected]);

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

  useEffect(() => {
    if (response?.data) {
      setListNFT(getUnique([...listNFT, ...response?.data], "id"));
      canLoadMyItem = true
    }
  }, [response]);

  useEffect(() => {
    if (listed?.data) {
      setListedNFT(getUnique([...listedNFT, ...listed?.data], "id"));
      canLoadListing = true
    }
  }, [listed]);
  React.useEffect(() => {
    window.addEventListener('scroll', checkScroll);
    return () => {
        window.removeEventListener('scroll', checkScroll);
    }
  }, [response, listed]);

  const checkScroll = () => {
    const MyItems = document.getElementById('my-items')
    if(MyItems?.clientHeight ){
      const x = window.scrollY + window.innerHeight
      const y = MyItems?.clientHeight + MyItems?.offsetTop
      if (x >= y && status != FetchStatus.pending && canLoadMyItem) {
        if(response?.meta?.totalPages && currentPageItems < Number(response?.meta?.totalPages)) {
          setCurrentPageItems(prev => prev + 1)
        }
        canLoadMyItem = false;     
      }
    }
    const Listing = document.getElementById('listing')
    if(Listing?.clientHeight ){
      const x = window.scrollY + window.innerHeight
      const y = Listing?.clientHeight + Listing?.offsetTop
      if (x >= y && listedStatus != FetchStatus.pending && canLoadListing) {
        if(currentPage < Number(listed?.meta?.totalPages)) {
          setCurrentPage(prev => prev + 1)
          console.log("currentPage 11", currentPage)
        }
        canLoadListing = false;     
      }
    }
  }  
  const tabs = [
    {
      label: (
        <div className="flex items-center space-x-[6px]">
          <p>My items</p>
          <span className="text-white dark:text-[#D0D5DD] bg-gray-500 dark:bg-inputBg text-base px-1 rounded">
            {response?.meta.totalItems}
          </span>
        </div>
      ),
      children: (
        <div>
          {status === FetchStatus.pending && currentPageItems === 1 ? (
            <NFTListSkeleton hideTab />
          ) : (
            <div>
              {response?.data && response.data.length > 0 ? (
                <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5" id="my-items">
                  {listNFT.map((i) => {
                    return (
                      <ListNFTItem
                        key={i.onChainId}
                        data={i}
                        onBuySuccess={handleFetchData}
                        onDelistSuccess={(onChainId) => {
                          setListedNFT(
                            listedNFT.filter((i) => i.onChainId !== onChainId)
                          );
                          handleFetchData();
                        }}
                        onListSuccess={(onChainId) => {
                          setListNFT(
                            listNFT.filter((i) => i.onChainId !== onChainId)
                          );
                          handleFetchData();
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                status !== FetchStatus.pending && <Empty />
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
          <span className="text-white dark:text-[#D0D5DD] bg-gray-500 dark:bg-inputBg text-base px-1 rounded">
            {listed?.meta.totalItems}
          </span>
        </div>
      ),
      children: (
        <div>
          {listedStatus === FetchStatus.pending && currentPage === 1 ? (
            <NFTListSkeleton hideTab />
          ) : (
            <div>
              {listed?.data && listed.data.length > 0 ? (
                <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5" id="listing">
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
                status !== FetchStatus.pending && <Empty />
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
                          className="w-[44px] h-[44px] min-w-[44px] md:w-[78px] md:h-[78px] md:mt-0 object-contain rounded-full"
                        />
                      </div>
                      <div className="text-black dark:text-white">
                        {address && (
                          <div className="border px-2 py-[2px] rounded border-black dark:border-white items-center flex space-x-[6px]">
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
                  onChange={e=> console.log('e', e)}
                  // tabBarExtraContent={
                  //   <div className="text-black dark:text-white">
                  //     <div
                  //       className={` ${
                  //         isFocus ? "border" : "border border-transparent"
                  //       } px-6 py-4 flex items-center space-x-4 w-[100%] lg:w-[300px] xl:w-[380px] h-12 bg-white dark:bg-[#392B4A]/50 rounded-full`}
                  //     >
                  //       <Image src="/ic_search.svg" width={20} height={20} alt="ic-search"/>
                  //       <input
                  //         placeholder="Search NFTs"
                  //         className="bg-transparent text-sm flex-1 outline-none dark:caret-white dark:text-white"
                  //         onChange={(e) => {
                  //           const { value } = e.target;
                  //           setText(value);
                  //           debounceSearch(value);
                  //         }}
                  //         value={text}
                  //         onFocus={() => {
                  //           setFocus(true);
                  //         }}
                  //         onBlur={() => {
                  //           setFocus(false);
                  //         }}
                  //       />
                  //       {text.length > 0 && (
                  //         <button
                  //           onClick={() => {
                  //             setText("");
                  //             debounceSearch("");
                  //           }}
                  //         >
                  //           <Image width={24} height={24} src="/ic-close.svg" alt="ic-close" />
                  //         </button>
                  //       )}
                  //     </div>
                  //   </div>
                  // }
                />
              </div>

              {/* {(status === FetchStatus.idle ||
                status === FetchStatus.pending ||
                listedStatus === FetchStatus.idle ||
                listedStatus === FetchStatus.pending) && (
                <NFTListSkeleton hideTab />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Collection;
