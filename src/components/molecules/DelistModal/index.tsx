import { Modal, Spin } from "antd";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useWallet } from "@suiet/wallet-kit";
import { toast } from "react-toastify";
import { verifyDelistTransaction } from "../../../redux/verify/verifySlice";
import { useAppDispatch } from "../../../redux/hook";
import CloseIcon from "../../atoms/Icons/CloseIcon";
import { readTransactionObject } from "../../../utils/readTransactionObject";
import { TransactionBlock } from "@mysten/sui.js";
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
  const { signAndExecuteTransactionBlock, connected } = useWallet();
  const [isLoading, setLoading] = React.useState(false);

  // React.useEffect(() => {
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "unset";
  //   };
  // });

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
      const txb = new TransactionBlock();
      txb.moveCall({
        target: `${packageObjectId}::${contractModule}::delist`,
        arguments: [txb.pure(marketId), txb.pure(nftId)],
        typeArguments: [nftType],
      });
      txb.setGasBudget(
        Number(process.env.NEXT_PUBLIC_SUI_GAS_BUDGET) || 100000
      );
      const tx = (await signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: {
          showEffects: true,
        },
      })) as any;

      const { status, error, txhash } = readTransactionObject(tx);
      if (status === "success") {
        dispatch(
          verifyDelistTransaction({
            id: id,
            params: {
              txhash,
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
      setLoading(false);
      toast.error(e.message);
      close && close();
    }
  };
  return (
    <Modal
      centered
      open={true}
      footer={null}
      width={650}
      onCancel={close}
      closeIcon={<CloseIcon />}
    >
      <div className="flex flex-col justify-center">
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
              <Spin indicator={<LoadingOutlined className="text-white" />} />
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
      </div>
    </Modal>
  );
};

export default DelistModal;
