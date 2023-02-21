import { JsonRpcProvider } from "@mysten/sui.js";
import { useWallet } from "@suiet/wallet-kit";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Sort from "../../src/components/atoms/Sort";
import SaleModal from "../../src/components/molecules/SaleModal";
import Empty from "../../src/components/molecules/EmptyView";
import ListNFTItem from "../../src/components/molecules/ListNFTItem";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import { formatLongString } from "../../src/contract-abi/consts";

import { useAppDispatch, useAppSelector } from "../../src/redux/hook";
import {
  fetchListNFTOfNFT,
  fetchNFTDetail,
} from "../../src/redux/nft/nftSlice";
import { toast } from "react-toastify";
import {
  verifyBuyTransaction,
  verifyDelistTransaction,
} from "../../src/redux/verify/verifySlice";
import { Spin } from "antd";
import { SUI_DECIMAL, SUI_TESTNET } from "../../src/api/constants";
import DelistModal from "../../src/components/molecules/DelistModal";
import SuccessModal from "../../src/components/molecules/SuccessModal";

const NFT = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const nftData = useAppSelector((store) => store.nft.nftData.response);
  const { response } = useAppSelector((store) => store.nft.listNFTData);
  const { signAndExecuteTransaction, connected, address } = useWallet();
  const [openListing, setOpenListing] = React.useState(false);
  const [openDelist, setOpenDelist] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState({
    title: "",
    message: "",
    isOpen: false,
  });
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
        })
      );
    }
  }, [id]);

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
            id: nftData?.id || "",
            params: {
              txhash: tx.certificate.transactionDigest,
              chain: "SUI",
            },
          })
        );
        setTimeout(() => {
          dispatch(fetchNFTDetail({ id: String(id) }));
          setLoading(false);
          setSuccess({
            isOpen: true,
            title: "Congratulations !",
            message: "This item has been added to your wallet",
          });
        }, 3000);
      } else {
        toast.error(error);
      }
    } catch (e: any) {
      console.log("=e", e);
      setLoading(false);
      toast.error(e.message);
    }
  };

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
            {nftData?.collection && (
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
            )}
            <div className="bg-white border shadow dark:bg-gray-800 p-6 rounded-[20px] flex items-center justify-between mt-6">
              {nftData?.saleStatus ? (
                <div className="text-black dark:text-white">
                  <p className="text-[20px]">Current Price :</p>
                  <p className="text-[24px] font-bold">
                    {nftData.saleStatus.price} SUI
                  </p>
                </div>
              ) : (
                <div />
              )}
              {nftData &&
                !nftData?.saleStatus &&
                nftData.owner.address.address === address && (
                  <button
                    className=" primaryButton text-white text-[20px] h-[45px] px-10 rounded-full "
                    onClick={() => {
                      setOpenListing(true);
                    }}
                  >
                    Put on sale
                  </button>
                )}
              {nftData?.saleStatus &&
                nftData.saleStatus.onSale &&
                nftData.owner.address.address !== address && (
                  <button
                    className=" primaryButton text-white text-[20px] h-[45px] px-10 rounded-full "
                    onClick={() => {
                      if (nftData) {
                        handleBuyNow(
                          nftData?.onChainId,
                          nftData?.nftType,
                          Number(nftData.saleStatus?.price) * SUI_DECIMAL
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
              {nftData?.saleStatus &&
                nftData.owner.address.address === address &&
                nftData.saleStatus.onSale && (
                  <button
                    className=" primaryButton text-white text-[20px] h-[45px] px-10 rounded-full "
                    onClick={() => {
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
          </div>
          {response && response.data ? (
            <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {response?.data?.map((i) => {
                return <ListNFTItem key={i.id} data={i} />;
              })}
            </div>
          ) : (
            <Empty />
          )}
          {openListing && nftData && (
            <SaleModal
              close={() => {
                setOpenListing(false);
              }}
              nftId={nftData.onChainId}
              nftType={nftData.nftType}
              id={nftData.id}
              onSuccess={() => {
                setOpenListing(false);
                setSuccess({
                  isOpen: true,
                  title: "Congratulations !",
                  message: "Your item has been activated for sale",
                });
              }}
            />
          )}
          {openDelist && nftData && (
            <DelistModal
              close={() => {
                setOpenDelist(false);
              }}
              nftId={nftData.onChainId}
              nftType={nftData.nftType}
              id={nftData.id}
              onSuccess={() => {
                setOpenDelist(false);
                setSuccess({
                  isOpen: true,
                  title: "Delist Success",
                  message: "Your item has been delisted!",
                });
              }}
            />
          )}
          {success.isOpen && (
            <SuccessModal
              close={() => {
                setSuccess({
                  isOpen: false,
                  title: "",
                  message: "",
                });
              }}
              title={success.title}
              message={success.message}
            />
          )}
        </div>
      </div>
    </BaseComponent>
  );
};
export default NFT;
