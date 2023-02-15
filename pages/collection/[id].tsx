import Image from "next/image";
import Link from "next/link";
import React from "react";
import Sort from "../../src/components/atoms/Sort";
import ListNFTItem from "../../src/components/molecules/ListNFTItem";
import SocialView from "../../src/components/molecules/SocialView";
import BaseComponent from "../../src/components/organisms/BaseComponent";

const Collection = () => {
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="flex space-y-5 md:items-center flex-col md:flex-row md:justify-between md:space-x-10">
          <div className="flex w-full md:items-center space-x-2 md:space-x-4">
            <div className="">
              <Image
                alt="logo-lp"
                src={"/img-mock-logo-1.png"}
                width={64}
                height={64}
                className="w-8 h-8 mt-2 md:mt-0 md:w-[64px] md:h-[64px] object-contain rounded-full"
              />
            </div>

            <div className="w-full">
              <div className="w-full flex items-center justify-between">
                <div>
                  <p className="external text-[32px] text-black dark:text-white font-display">
                    Sayaka CollectionNFT
                  </p>
                </div>
                <div className=" hidden lg:flex items-center space-x-3 md:space-x-6">
                  <SocialView response={undefined} />
                </div>
              </div>

              <div className="flex text-black dark:text-white">Items 2,500</div>
              <div className="flex lg:hidden items-center space-x-3 mt-[28px]">
                <SocialView response={undefined} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[30px] space-y-10">
          <p className="text-black dark:text-white">
            Yuliverse is the World’s very First Parallel Reality Gaming
            Metaverse on BSC chain, Inspired by Pokemon Go & Tinder. Growing new
            and meaningful friendships at the same time earning in Yuliverse
            with ease, by just moving around in your neighbourhood!
            YuliOriginGenOne, the first generation of the Yuliverse NFT
          </p>
          <Image
            src={"/img-banner-mock.svg"}
            width={200}
            height={200}
            className="flex w-full aspect-[1300/500] rounded-t-[20px] object-cover"
            alt="mock"
          />
        </div>
        <div className="mt-[114px]">
          <div className="flex items-center justify-between">
            <p className="text-black dark:text-white font-bold">Items</p>
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
