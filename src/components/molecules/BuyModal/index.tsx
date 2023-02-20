import { Spin } from "antd";
import Image from "next/image";
import React from "react";

import { formatLongString } from "../../../contract-abi/consts";
import { useAppSelector } from "../../../redux/hook";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
interface Props {
  close?: () => void;
  txHash?: string;
  owner?: string;
  price?: number;
}

const BuyModal: React.FC<Props> = ({ close }) => {
  const router = useRouter();
  return (
    <div>
      <div className={"modal fade show block"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content relative w-[572px]">
            <div className="mt-8 space-y-2">
              <p className="text-[24px] font-bold text-left">Sayaka NFT #17</p>
              <div className="flex w-full items-center space-x-2">
                <div className="">
                  <Image
                    alt="logo-lp"
                    src={"/img-mock-logo-1.png"}
                    width={36}
                    height={36}
                    className="w-[36px] h-[36px] min-w-[36px] mt-2 md:mt-0 object-contain rounded-full"
                  />
                </div>
                <Link href={"/collection/1"}>
                  <span className="external mt-2 md:text-[20px] text-black dark:text-white font-display">
                    Sayaka
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-10 mb-10 space-y-5">
              <p className="text-xl font-bold">Price</p>
              <div className="flex items-center space-x-10">
                <div className="flex items-center space-x-3 bg-white w-[140px] rounded-md h-12 justify-center">
                  <Image
                    src={"/ic-sui.jpeg"}
                    alt="sui"
                    width={18}
                    height={28}
                  />
                  <p className="text-black font-medium">SUI</p>
                </div>
                <div className="w-full">
                  <input
                    className="h-12 w-full bg-white px-5 rounded-md"
                    placeholder="0.0"
                  />
                </div>
              </div>
              <p className="text-xl font-bold">Fee</p>
              <div className="bg-white dark:bg-gray-800 border py-[10px] px-[28px] rounded-[20px]">
                <div className="flex items-center justify-between">
                  <p>Service Fee</p>
                  <p className="font-bold text-lg">2.5%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Owner Fee</p>
                  <p className="font-bold text-lg">5%</p>
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="font-light flex items-center justify-center space-x-5 mb-11">
              <button
                className="hoverCommon primaryButton  text-white font-medium w-1/2 h-12 rounded-full"
                onClick={() => {
                  router.push("/profile");
                }}
              >
                List
              </button>
              <button className="border hoverCommon text-[#892DF0] border-[#892DF0] font-medium rounded-full w-1/2 h-12">
                Cancel
              </button>
            </div>
            <button
              type="button"
              className="absolute right-4 top-4"
              onClick={() => {
                close && close();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="fill-jacarta-700 h-6 w-6 dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
