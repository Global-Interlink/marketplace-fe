import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { Image } from "antd";
import React from "react";
import { NFT } from "../../../api/types";
import { LoadingOutlined } from "@ant-design/icons";
import { TransactionBlock } from "@mysten/sui.js";
import { toast } from "react-toastify";
import { SUI_DECIMAL } from "../../../api/constants";
import { verifyBuyTransaction } from "../../../redux/verify/verifySlice";
import { useAppDispatch } from "../../../redux/hook";
import SaleModal from "../SaleModal";
import DelistModal from "../DelistModal";
import { useRouter } from "next/router";
import { setSuccess } from "../../../redux/app/appSlice";
interface Props {
  data?: NFT;
  onListSuccess: (onChainId?: string) => void;
  onBuySuccess: () => void;
  onDelistSuccess: (onChainId?: string) => void;
}
export function validURL(url: string) {
  if (url) {
    let ipfs_pattern = new RegExp('^ipfs:\/\/')
    if(ipfs_pattern.test(url)) {
      url = url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    if(!!pattern.test(url)) {
      return url;
    }
  }
  return "/default.jpeg";
}
const ListNFTItem: React.FC<Props> = ({
  data,
  onListSuccess,
  onBuySuccess,
  onDelistSuccess,
}) => {
  const { signAndExecuteTransactionBlock, address, connected } = useWallet();
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openListing, setOpenListing] = React.useState(false);
  const [openDelist, setOpenDelist] = React.useState(false);
  const handleBuyNow = async (
    nftId: string,
    nftType: string,
    price: number
  ) => {
    setLoading(true);
    const packageObjectId = process.env.NEXT_PUBLIC_PACKAGE_OBJECT_ID;
    const contractModule = process.env.NEXT_PUBLIC_MODULE;
    const marketId = process.env.NEXT_PUBLIC_MARKET_OBJECT_ID;
    if (!marketId || !packageObjectId || !contractModule || !address) {
      setLoading(false);
      return;
    }

    const fee = 0.12 * SUI_DECIMAL;
    try {
      const txb = new TransactionBlock();
      txb.moveCall({
        target: `${packageObjectId}::${contractModule}::buy`,
        arguments: [
          txb.pure(marketId),
          txb.pure(nftId),
          txb.makeMoveVec({
            objects: [txb.splitCoins(txb.gas, [txb.pure(String(price + fee))])],
          }),
        ],
        typeArguments: [nftType],
      });
      const tx = (await signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: {
          showEffects: true,
        },
      })) as any;
      const { digest } = tx;
      const { status, error } = tx.effects.status;
      if (status === "success") {
        dispatch(
          verifyBuyTransaction({
            id: data?.id || "",
            params: {
              txhash: digest,
              chain: "SUI",
            },
          })
        );
        setTimeout(() => {
          onBuySuccess();
          dispatch(
            setSuccess({
              isOpen: true,
              title: "Congratulations !",
              message: "This item has been added to your wallet",
            })
          );
          setLoading(false);
        }, 3000);
      } else {
        setLoading(false);
        toast.error(error);
      }
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message);
    }
  };
  const isShowList =
    data && !data?.saleStatus && data.owner?.address?.address === address;
  const isShowBuy =
    data?.saleStatus &&
    data.saleStatus.onSale &&
    data.owner?.address?.address !== address;
  const isShowDelist =
    address &&
    data?.saleStatus &&
    data.owner?.address?.address === address &&
    data.saleStatus.onSale;
  return (
    <div>
      <div className="flex flex-col w-full rounded-[20px] bg-bgLinearNFTItem dark:bg-bgLinearCollectionItem drop-shadow-xl shadow-xl hover:shadow-2xl sm:hover:scale-105 transition duration-300 ease-in-out">
        <div className="flex w-full">
          <Image
            src={validURL(data?.image || '/default.jpeg')}
            className="rounded-[32px] object-cover cursor-pointer aspect-[1/1] min-h-[310px] min-w-[310px] p-4"
            height={"auto"}
            alt="mock"
            preview={false}
            onClick={(e: any) => {
              router.push(`/nft/${data?.id}`);
            }}
            fallback="/default.jpeg"
          />
        </div>
        <div className="flex p-5 space-x-[14px]  rounded-b-[20px] pt-0">
          <div className="w-full">
            <div
              onClick={(e: any) => {
                router.push(`/nft/${data?.id}`);
              }}
              className="cursor-pointer"
            >
              <p
                title={data?.name}
                className="text-[24px] truncate text-primary font-medium dark:text-white"
              >
                {data?.name}
              </p>
            </div>

            <div className="flex items-center mt-[18px] space-x-5 h-[48px]">
              {data?.saleStatus ? (
                <div className="">
                  <div className="flex-1 text-[14px] font-normal text-[#475467] ] dark:text-white">
                    Price
                  </div>
                  <div className="flex-1 text-[14px] font-semibold text-[#1D2939] ] dark:text-white">
                    {Number(data.saleStatus.price).toPrecision()} SUI
                  </div>
                </div>
              ) : (
                <div className="flex-1" />
              )}
              <div className="flex-1 flex items-center justify-end parent">
                {isShowList && (
                  <button
                    disabled={!connected || isLoading}
                    className="primaryButton h-[36px] w-full text-center text-[14px] text-white rounded-full max-w-[120px]"
                    onClick={() => {
                      if (data.collection) {
                        setOpenListing(true);
                      } else {
                        toast.error("This NFT isn't supported on SAKAYA");
                      }
                    }}
                  >
                    List Now
                  </button>
                )}
                {isShowBuy && connected && (
                  <button
                    disabled={!connected || isLoading}
                    className="primaryButton h-[36px] w-full text-center text-[14px] text-white rounded-full max-w-[120px]"
                    onClick={() => {
                      if (data) {
                        handleBuyNow(
                          data?.onChainId,
                          data?.nftType,
                          Number(data.saleStatus?.price) * SUI_DECIMAL
                        );
                      }
                    }}
                  >
                    {isLoading ? (
                      <LoadingOutlined className="text-white" size={20} />
                    ) : (
                      "BUY"
                    )}
                  </button>
                )}
                {/* {isShowBuy && <ConnectButton />} */}
                {!connected && (
                  <ConnectButton
                    label="Connect wallet"
                    className="primaryButton h-[36px] w-full text-center !text-[12px] text-white !rounded-full max-w-[160px] !p-0 uppercase ml-auto"
                  />
                )}
                {isShowDelist && (
                  <button
                    disabled={!connected || isLoading}
                    className="primaryButton h-[36px] w-full text-center text-[14px] text-white border dark:border-none rounded-full max-w-[120px]"
                    onClick={(e: any) => {
                      setOpenDelist(true);
                    }}
                  >
                    {isLoading ? (
                      <LoadingOutlined className="text-white" size={20} />
                    ) : (
                      "DELIST"
                    )}
                  </button>
                )}
                {!isShowList && !isShowBuy && !isShowDelist && connected && (
                  <div className="h-[36px]" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {openListing && data && (
        <SaleModal
          close={() => {
            setOpenListing(false);
          }}
          item={data}
          onSuccess={() => {
            setOpenListing(false);
            onListSuccess(data.onChainId);
            dispatch(
              setSuccess({
                isOpen: true,
                title: "List Success",
                message: "Your item has been listed!",
              })
            );
          }}
        />
      )}
      {openDelist && data && (
        <DelistModal
          close={() => {
            setOpenDelist(false);
          }}
          nftId={data.onChainId}
          nftType={data.nftType}
          id={data.id}
          onSuccess={() => {
            setOpenDelist(false);
            onDelistSuccess(data.onChainId);
            dispatch(
              setSuccess({
                isOpen: true,
                title: "Delist Success",
                message: "Your item has been delisted!",
              })
            );
          }}
        />
      )}
    </div>
  );
};

export default ListNFTItem;
