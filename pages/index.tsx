import Image from "next/image";
import Link from "next/link";
import React from "react";
import ImgIcon from "../src/components/atoms/Icons/ImgIcon";
import Sort from "../src/components/atoms/Sort";
import ListCollectionItem from "../src/components/molecules/ListCollectionItem";
import BaseComponent from "../src/components/organisms/BaseComponent";

export default function Home() {
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="flex items-center justify-end mt-10">
          <Sort />
        </div>
        <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {Array.from(Array(10).keys()).map((i) => {
            return <ListCollectionItem key={i} />;
          })}
        </div>
        <div className="mt-[70px] flex justify-center">
          <button className="bg-white text-primary font-bold rounded-lg border w-[189px] h-[49px]">
            Load more
          </button>
        </div>
      </div>
    </BaseComponent>
  );
}
