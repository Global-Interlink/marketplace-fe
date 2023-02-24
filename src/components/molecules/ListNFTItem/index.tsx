import { useWallet } from "@suiet/wallet-kit";
import { Spin } from "antd";
import Image from "next/image";
import React from "react";
import { NFT } from "../../../api/types";
import { LoadingOutlined } from "@ant-design/icons";
import { JsonRpcProvider } from "@mysten/sui.js";
import { toast } from "react-toastify";
import { SUI_DECIMAL, SUI_TESTNET } from "../../../api/constants";
import { verifyBuyTransaction } from "../../../redux/verify/verifySlice";
import { useAppDispatch } from "../../../redux/hook";
import SaleModal from "../SaleModal";
import DelistModal from "../DelistModal";
import { useRouter } from "next/router";
import { setSuccess } from "../../../redux/app/appSlice";
interface Props {
  data?: NFT;
  onListSuccess: () => void;
  onBuySuccess: () => void;
  onDelistSuccess: () => void;
}
export function validURL(url: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
}
const ListNFTItem: React.FC<Props> = ({
  data,
  onListSuccess,
  onBuySuccess,
  onDelistSuccess,
}) => {
  const { signAndExecuteTransaction, address, connected } = useWallet();
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
    const provider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_SUI_NETWORK_RPC || SUI_TESTNET
    );
    const userBalance = (await provider.getCoinBalancesOwnedByAddress(
      address
    )) as any;
    const filteredData = userBalance.filter(
      (i: any) => i.details.data.type === "0x2::coin::Coin<0x2::sui::SUI>"
    );
    console.log("==userBalance", filteredData);
    const params = [] as string[];
    let prevAmount = 0;
    filteredData.forEach((i: any) => {
      if (prevAmount > price) {
        return;
      }
      const newAmount = prevAmount + Number(i.details.data.fields.balance);
      console.log("==newAmount", newAmount);
      if (newAmount > price) {
        prevAmount = newAmount;
        params.push(i.details.data.fields.id.id);
        return;
      } else {
        params.push(i.details.data.fields.id.id);
        prevAmount = newAmount;
      }
    });

    try {
      const payload = {
        transaction: {
          kind: "moveCall",
          data: {
            packageObjectId: packageObjectId,
            module: contractModule,
            function: "buy",
            typeArguments: [nftType],
            arguments: [marketId, nftId, params],
            gasBudget: Number(process.env.NEXT_PUBLIC_SUI_GAS_BUDGET) || 100000,
          },
        },
      };
      console.log("=payload", payload);
      const tx = (await signAndExecuteTransaction({
        transaction: {
          kind: "moveCall",
          data: {
            packageObjectId: packageObjectId,
            module: contractModule,
            function: "buy",
            typeArguments: [nftType],
            arguments: [marketId, nftId, params],
            gasBudget: Number(process.env.NEXT_PUBLIC_SUI_GAS_BUDGET) || 100000,
          },
        },
      })) as any;
      const { status, error } = tx.effects.status;
      if (status === "success") {
        dispatch(
          verifyBuyTransaction({
            id: data?.id || "",
            params: {
              txhash: tx.certificate.transactionDigest,
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
      console.log("=e", e);
      setLoading(false);
      toast.error(e.message);
    }
  };
  return (
    <div>
      <div className="flex flex-col w-full rounded-[20px]  bg-bgLinearNFTItem dark:bg-bgLinearCollectionItem  backdrop-blur-[12.5px]  shadow-collectionItem hover:-translate-y-1 transition duration-300 ease-in-out">
        <Image
          src={
            data?.image && validURL(data?.image) ? data?.image : "/default.jpeg"
          }
          width={200}
          height={200}
          className="flex w-full aspect-[310/216] rounded-t-[20px] object-cover cursor-pointer"
          alt="mock"
          onClick={(e: any) => {
            router.push(`/nft/${data?.id}`);
          }}
          onErrorCapture={() => {
            console.log("==error");
          }}
        />
        <div className="flex p-5 space-x-[14px]  rounded-b-[20px]">
          <div className="w-full">
            <div
              onClick={(e: any) => {
                router.push(`/nft/${data?.id}`);
              }}
              className="cursor-pointer"
            >
              <p className="text-[24px] text-primary font-medium dark:text-white">
                {data?.name}
              </p>
              {data?.collection?.name ? (
                <span className="text-primary dark:text-white">
                  {data?.collection?.name}
                </span>
              ) : (
                <div className="h-[24px]" />
              )}
            </div>

            <div className="flex items-center mt-[18px] space-x-[30px] ">
              {data?.saleStatus ? (
                <div className="h-[36px] flex-1 text-center text-[12px] py-2 text-[#4B5563] dark:border-[#897DBC] dark:bg-[#71659C] dark:text-white border rounded-[5px] border-black">
                  Price {Number(data.saleStatus.price).toLocaleString()} SUI
                </div>
              ) : (
                <div className="flex-1" />
              )}
              <div className="flex-1">
                {data &&
                  !data?.saleStatus &&
                  data.owner?.address?.address === address && (
                    <button
                      disabled={!connected || isLoading}
                      className=" primaryButton h-[36px] w-full text-center text-[12px] py-2 text-white border dark:border-none rounded-[5px] "
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
                {data?.saleStatus &&
                  data.saleStatus.onSale &&
                  data.owner?.address?.address !== address && (
                    <button
                      disabled={!connected || isLoading}
                      className=" primaryButton h-[36px] w-full text-center text-[12px] py-2 text-white border dark:border-none rounded-[5px] "
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
                        <Spin
                          indicator={<LoadingOutlined className="text-white" />}
                        />
                      ) : (
                        "Buy Now"
                      )}
                    </button>
                  )}
                {data?.saleStatus &&
                  data.owner?.address?.address === address &&
                  data.saleStatus.onSale && (
                    <button
                      disabled={!connected || isLoading}
                      className=" primaryButton h-[36px] w-full text-center text-[12px] py-2 text-white border dark:border-none rounded-[5px] "
                      onClick={(e: any) => {
                        setOpenDelist(true);
                      }}
                    >
                      {isLoading ? (
                        <Spin
                          indicator={<LoadingOutlined className="text-white" />}
                        />
                      ) : (
                        "Delist"
                      )}
                    </button>
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
            onListSuccess();
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
            onDelistSuccess();
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
