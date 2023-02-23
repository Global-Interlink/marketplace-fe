import { Spin } from "antd";
import Image from "next/image";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { SUI_DECIMAL } from "../../../api/constants";
import { useWallet } from "@suiet/wallet-kit";
import { toast } from "react-toastify";
import {
  verifyDelistTransaction,
  verifySaleTransaction,
} from "../../../redux/verify/verifySlice";
import { useAppDispatch } from "../../../redux/hook";
import { fetchNFTDetail } from "../../../redux/nft/nftSlice";
import { fetchListNFTOfCollection } from "../../../redux/collection/collectionSlice";
import {
  fetchMyListingNFTs,
  fetchMyNFTs,
} from "../../../redux/profile/profileSlice";
interface Props {
  close?: () => void;
  nftId: string;
  nftType: string;
  id: string;
  onSuccess: () => void;
}

const DelistModal: React.FC<Props> = ({
  close,
  nftId,
  nftType,
  id,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { signAndExecuteTransaction, connected } = useWallet();
  const [isLoading, setLoading] = React.useState(false);

  const handleDelist = async (nftId: string, nftType: string, id: string) => {
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
            function: "delist",
            typeArguments: [nftType],
            arguments: [marketId, nftId],
            gasBudget: Number(process.env.NEXT_PUBLIC_SUI_GAS_BUDGET) || 100000,
          },
        },
      })) as any;
      console.log("===tx", tx);
      const { status, error } = tx.effects.status;
      if (status === "success") {
        dispatch(
          verifyDelistTransaction({
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
          <div className="modal-content relative w-[572px]">
            <div className="my-8 space-y-2">
              <p className="text-[24px] text-[#892DF0] dark:text-white font-bold text-center">
                Do you want to delist this item?
              </p>
            </div>

            {/* footer */}
            <div className="font-light flex items-center justify-center space-x-5 mb-11">
              <button
                className="hoverCommon primaryButton  text-white font-medium w-1/2 h-12 rounded-full"
                disabled={!connected || isLoading}
                onClick={() => {
                  handleDelist(nftId, nftType, id);
                }}
              >
                {isLoading ? (
                  <Spin
                    indicator={<LoadingOutlined className="text-white" />}
                  />
                ) : (
                  "Yes"
                )}
              </button>
              <button
                onClick={() => {
                  close && close();
                }}
                disabled={isLoading}
                className="border dark:text-white dark:bg-[#A6A1FA] dark:border-[#CDC2FF] hoverCommon bg-white text-[#892DF0] border-[#892DF0] font-medium rounded-full w-1/2 h-12"
              >
                No
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

export default DelistModal;
