import Image from "next/image";
import Link from "next/link";
import React from "react";
import Sort from "../../src/components/atoms/Sort";
import ListNFTItem from "../../src/components/molecules/ListNFTItem";
import BaseComponent from "../../src/components/organisms/BaseComponent";

const Collection = () => {
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="mt-10 flex flex-col space-y-10 md:space-y-0 md:flex-row md:space-x-20 lg:space-x-30 xl:space-x-40">
          <div className="w-full md:w-[40%] min-w-[40%]">
            <Image
              src={"/img-banner-mock.svg"}
              width={200}
              height={200}
              className="flex w-full aspect-square rounded-[20px] object-cover"
              alt="mock"
            />
          </div>
          <div className="w-full">
            <p className="text-black dark:text-white text-[24px] mt-4 md:mt-[26px] md:text-[36px] font-medium">
              Name NFT#12345
            </p>
            <div className="flex w-full items-center space-x-2">
              <div className="">
                <Image
                  alt="logo-lp"
                  src={"/img-mock-logo-1.png"}
                  width={36}
                  height={26}
                  className="w-[36px] h-[36px] min-w-[36px] mt-2 md:mt-0 object-contain rounded-full"
                />
              </div>
              <Link href={"/collection/1"}>
                <p className="external mt-2 md:text-[20px] text-black dark:text-white font-display">
                  Sayaka CollectionNFT
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

              <div className="text-black dark:text-white flex items-center justify-between">
                <span>Owner Address</span>
                <span className="text-[18px] font-bold ">
                  0xd8ea75495989fa...a5b55243e095f228
                </span>
              </div>
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
            <div className="mt-[36px] space-y-[10px]">
              <p className="text-[20px] font-bold text-black dark:text-white">
                Properties
              </p>
              <hr className="border-none bg-black dark:bg-white h-[1px]" />
              <div className="grid gap-5 grid-cols-2 lg:grid-cols-3 pt-1">
                {Array.from(Array(9).keys()).map((i) => {
                  return (
                    <div
                      key={i}
                      className="bg-white text-black flex justify-center items-center space-y-1 flex-col px-4 py-[10px] rounded-[10px] border border-[#892DF0]"
                    >
                      <p className="text-[#842DF1] text-sm font-semibold">
                        BACKGROUND
                      </p>
                      <p className="text-[#827E7E] font-semibold">DARK GRAY</p>
                      <p className="text-[#464646] text-[12px]">
                        11.00% has this trait
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 md:mt-20">
          <div className="flex items-center justify-between">
            <p className="text-black dark:text-white font-bold">
              More from this collection
            </p>
            <Sort />
          </div>
          <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {Array.from(Array(5).keys()).map((i) => {
              return <ListNFTItem key={i} />;
            })}
          </div>
          <div className="mt-[70px] flex justify-center">
            <button className="bg-white text-primary font-bold rounded-lg border w-[189px] h-[49px]">
              Load more
            </button>
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Collection;
