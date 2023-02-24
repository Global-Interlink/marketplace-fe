import { Spin } from "antd";
import Image from "next/image";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { SUI_DECIMAL } from "../../../api/constants";
import { useWallet } from "@suiet/wallet-kit";
import { toast } from "react-toastify";
import { verifySaleTransaction } from "../../../redux/verify/verifySlice";
import { useAppDispatch } from "../../../redux/hook";
import { fetchNFTDetail } from "../../../redux/nft/nftSlice";
import { NFT } from "../../../api/types";
import { fetchListNFTOfCollection } from "../../../redux/collection/collectionSlice";
import {
  fetchMyListingNFTs,
  fetchMyNFTs,
} from "../../../redux/profile/profileSlice";
interface Props {
  close?: () => void;
  onSuccess: () => void;
  item?: NFT;
}

const SaleModal: React.FC<Props> = ({ close, item, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { signAndExecuteTransaction, connected } = useWallet();
  const [price, setPrice] = React.useState("0");
  const [isLoading, setLoading] = React.useState(false);

  const handleListing = async (
    nftId: string,
    price: number,
    nftType: string,
    id: string
  ) => {
    setLoading(true);
    const packageObjectId = process.env.NEXT_PUBLIC_PACKAGE_OBJECT_ID;
    const contractModule = process.env.NEXT_PUBLIC_MODULE;
    const marketId = process.env.NEXT_PUBLIC_MARKET_OBJECT_ID;
    if (!marketId || !packageObjectId || !contractModule) {
      setLoading(false);
      return;
    }

    try {
      const tx = (await signAndExecuteTransaction({
        transaction: {
          kind: "moveCall",
          data: {
            packageObjectId: packageObjectId,
            module: contractModule,
            function: "list",
            typeArguments: [nftType],
            arguments: [marketId, nftId, String(price * SUI_DECIMAL)],
            gasBudget: Number(process.env.NEXT_PUBLIC_SUI_GAS_BUDGET) || 100000,
          },
        },
      })) as any;
      const { status, error } = tx.effects.status;
      if (status === "success") {
        dispatch(
          verifySaleTransaction({
            id: id,
            params: {
              txhash: tx.certificate.transactionDigest,
              chain: "SUI",
            },
          })
        );
        setTimeout(() => {
          setLoading(false);
          onSuccess();
        }, 3000);
      } else {
        toast.error(error);
        setLoading(false);
        close && close();
      }
    } catch (e: any) {
      console.log("=e", e);
      setLoading(false);
      toast.error(e.message);
      close && close();
    }
  };
  return (
    <div className="text-black dark:text-white">
      <div className={"modal fade show block"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content relative w-[734px]">
            <div className="mt-8 space-y-2">
              <p className="text-[24px] font-bold text-left">{item?.name}</p>
              {item?.collection && (
                <div className="flex w-full items-center space-x-2">
                  <div className="">
                    <Image
                      alt="logo-lp"
                      src={item?.collection?.logo || ""}
                      width={36}
                      height={36}
                      className="w-[36px] h-[36px] min-w-[36px] mt-2 md:mt-0 object-contain rounded-full"
                    />
                  </div>
                  <span className="external mt-2 md:text-[20px] text-black dark:text-white font-display">
                    {item?.collection?.name}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-10 mb-10 space-y-5">
              <p className="text-xl font-bold">Price</p>
              <div className="flex items-center space-x-10">
                <div className="flex items-center space-x-3 bg-white dark:bg-[#514E89] w-[146px] rounded-md h-12 justify-center">
                  <Image src={"/ic-sui.svg"} alt="sui" width={18} height={28} />
                  <p className="text-black dark:text-white font-medium">SUI</p>
                </div>
                <div className="w-full">
                  <input
                    className="h-12 w-full bg-white dark:bg-[#514E89] dark:text-white px-5 rounded-md text-black"
                    placeholder="0.0"
                    value={price}
                    type="number"
                    onChange={(e) => {
                      if (Number(e.target.value) >= 0) {
                        setPrice(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
              <p className="text-xl font-bold">Fee</p>
              <div className="bg-white dark:bg-[#514E89] border dark:border-[#897DBC] py-[10px] px-[28px] rounded-[20px]">
                <div className="flex items-center justify-between">
                  <p>Service Fee</p>
                  <p className="font-bold text-lg">0%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Owner Fee</p>
                  <p className="font-bold text-lg">0%</p>
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="font-light flex items-center justify-center space-x-5 mb-11">
              <button
                className="hoverCommon primaryButton  text-white font-medium w-1/2 h-12 rounded-full"
                disabled={!connected || isLoading}
                onClick={() => {
                  if (item?.collection) {
                    handleListing(
                      item?.onChainId || "",
                      Number(price),
                      item?.nftType || "",
                      item?.id || ""
                    );
                  } else {
                    toast.error("This NFT isn't supported on SAKAYA");
                  }
                }}
              >
                {isLoading ? (
                  <Spin
                    indicator={<LoadingOutlined className="text-white" />}
                  />
                ) : (
                  "List Now"
                )}
              </button>
              <button
                onClick={() => {
                  close && close();
                }}
                disabled={isLoading}
                className="border hoverCommon text-[#892DF0] dark:text-white dark:bg-[#A6A1FA] dark:border-[#CDC2FF] border-[#892DF0] font-medium rounded-full w-1/2 h-12"
              >
                Cancel
              </button>
            </div>
            <button
              type="button"
              className="absolute right-4 top-4"
              disabled={isLoading}
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

export default SaleModal;
