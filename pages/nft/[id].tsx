import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Sort from "../../src/components/atoms/Sort";
import ListNFTItem from "../../src/components/molecules/ListNFTItem";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import { formatLongString } from "../../src/contract-abi/consts";

import { useAppDispatch, useAppSelector } from "../../src/redux/hook";
import {
  fetchListNFTOfNFT,
  fetchNFTDetail,
} from "../../src/redux/nft/nftSlice";

const NFT = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const nftData = useAppSelector((store) => store.nft.nftData.response);
  const { response } = useAppSelector((store) => store.nft.listNFTData);
  const LIMIT = 20;
  const [sort, setSort] = React.useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchNFTDetail({ id: String(id) }));
    }
  }, [id]);

  React.useEffect(() => {
    if (id) {
      dispatch(
        fetchListNFTOfNFT({
          id: String(id),
          page: currentPage,
          limit: LIMIT,
          sort: sort,
        })
      );
    }
  }, [currentPage, id, sort]);
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="mt-10 flex flex-col space-y-10 md:space-y-0 md:flex-row md:space-x-20 lg:space-x-30 xl:space-x-40">
          <div className="w-full md:w-[40%] min-w-[40%]">
            <Image
              src={nftData?.image || ""}
              width={200}
              height={200}
              className="flex w-full aspect-square rounded-[20px] object-cover"
              alt="mock"
            />
          </div>
          <div className="w-full">
            <p className="text-black dark:text-white text-[24px] mt-4 md:mt-[26px] md:text-[36px] font-medium">
              {nftData?.name}
            </p>
            <div className="flex w-full items-center space-x-2">
              <div className="">
                <Image
                  alt="logo-lp"
                  src={nftData?.collection?.logo || ""}
                  width={36}
                  height={26}
                  className="w-[36px] h-[36px] min-w-[36px] mt-2 md:mt-0 object-contain rounded-full"
                />
              </div>
              <Link href={"/collection/1"}>
                <p className="external mt-2 md:text-[20px] text-black dark:text-white font-display">
                  {nftData?.collection?.name}
                </p>
              </Link>
            </div>
            <div className="bg-white border shadow dark:bg-gray-800 p-6 rounded-[20px] flex items-center justify-between mt-6">
              <div className="text-black dark:text-white">
                <p className="text-[20px]">Current Price :</p>
                <p className="text-[24px] font-bold">1.97 (~$30.125)</p>
              </div>
              <button className=" primaryButton text-white text-[20px] h-[45px] px-10 rounded-full ">
                Buy Now
              </button>
            </div>
            <div className="mt-[36px] space-y-[10px]">
              <p className="text-[20px] font-bold text-black dark:text-white">
                Details
              </p>
              <hr className="border-none bg-black dark:bg-white h-[1px]" />

              {nftData?.owner && (
                <div className="text-black dark:text-white flex items-center justify-between">
                  <span>Owner Address</span>
                  <span className="text-[18px] font-bold ">
                    {formatLongString(nftData.owner.address.address)}
                  </span>
                </div>
              )}
              <div className="text-black dark:text-white flex items-center justify-between">
                <span>Transaction Fee</span>
                <span className="text-[18px] font-bold ">2%</span>
              </div>
              <div className="text-black dark:text-white flex items-center justify-between">
                <span>Royalties Fee</span>
                <span className="text-[18px] font-bold ">8%</span>
              </div>
              <div className="text-black dark:text-white flex items-center justify-between">
                <span>Listing/Bidding/Cancel</span>
                <span className="text-[18px] font-bold ">Free</span>
              </div>
            </div>
            {nftData?.properties && nftData.properties.length > 0 && (
              <div className="mt-[36px] space-y-[10px]">
                <p className="text-[20px] font-bold text-black dark:text-white">
                  Properties
                </p>
                <hr className="border-none bg-black dark:bg-white h-[1px]" />
                <div className="grid gap-5 grid-cols-2 lg:grid-cols-3 pt-1">
                  {nftData.properties.map((i) => {
                    return (
                      <div
                        key={i.name}
                        className="bg-white text-black flex justify-center items-center space-y-1 flex-col px-4 py-[10px] rounded-[10px] border border-[#892DF0]"
                      >
                        <p className="text-[#842DF1] text-sm font-semibold">
                          {i.name.toUpperCase()}
                        </p>
                        <p className="text-[#827E7E] font-semibold">
                          {i.value.toUpperCase()}
                        </p>
                        {/* <p className="text-[#464646] text-[12px]">
                          11.00% has this trait
                        </p> */}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 md:mt-20">
          <div className="flex items-center justify-between">
            <p className="text-black dark:text-white font-bold">
              More from this collection
            </p>
            <Sort onChange={setSort} />
          </div>
          <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {response?.data?.map((i) => {
              return <ListNFTItem key={i.id} data={i} />;
            })}
          </div>
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
  );
};
export default NFT;
