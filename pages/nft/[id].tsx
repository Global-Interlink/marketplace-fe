import { TransactionBlock } from "@mysten/sui.js";
import { useWallet } from "@suiet/wallet-kit";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import SaleModal from "../../src/components/molecules/SaleModal";
import Empty from "../../src/components/molecules/EmptyView";
import ListNFTItem, {
  validURL,
} from "../../src/components/molecules/ListNFTItem";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import { formatLongString } from "../../src/contract-abi/consts";

import { useAppDispatch, useAppSelector } from "../../src/redux/hook";
import {
  clear,
  fetchListNFTOfNFT,
  fetchNFTDetail,
} from "../../src/redux/nft/nftSlice";
import { toast } from "react-toastify";
import { verifyBuyTransaction } from "../../src/redux/verify/verifySlice";
import { Spin } from "antd";
import { SUI_DECIMAL } from "../../src/api/constants";
import DelistModal from "../../src/components/molecules/DelistModal";
import { setSuccess } from "../../src/redux/app/appSlice";
import NFTListSkeleton from "../../src/components/molecules/NFTListSkeleton";
import { APIFunctions, FetchStatus } from "../../src/api/APIFunctions";
import NFTDetailTopSkeleton from "../../src/components/molecules/NFTDetailTopSkeleton";
import CopyIcon from "../../src/components/atoms/Icons/CopyIcon";
import { createAxiosCoinGecko } from "../../src/api/axiosWallet";
import {
  createKioskAndShare,
  getOwnedKiosks,
  mainnetEnvironment,
  place,
  purchaseAndResolvePolicies,
  queryTransferPolicy,
} from "@mysten/kiosk";
import { getConnectedChain, getRPCConnection } from "../../src/utils/common";

const NFT = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { response: nftData, status: nftStatus } = useAppSelector(
    (store) => store.nft.nftData
  );
  const { response, status } = useAppSelector((store) => store.nft.listNFTData);
  const { signAndExecuteTransactionBlock, connected, address, chain } =
    useWallet();
  const [openListing, setOpenListing] = React.useState(false);
  const [openDelist, setOpenDelist] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [dataCoingecko, setDataCoingecko] = React.useState<number>();
  const api = createAxiosCoinGecko();

  const fetchDataCoinGecko = async () => {
    api
      .get<{
        [x: string]: any;
        data: any;
      }>("/coins/sui")
      .then((res) => {
        setDataCoingecko(res.data.market_data.current_price.usd);
      })
      .catch(() => {});
  };

  React.useEffect(() => {
    fetchDataCoinGecko();
  }, []);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchNFTDetail({ id: String(id) }));
    }
  }, [id]);

  const handleFetchData = () => {
    if (id) {
      dispatch(
        fetchListNFTOfNFT({
          id: String(id),
        })
      );
    }
  };

  React.useEffect(() => {
    return () => {
      dispatch(clear());
    };
  }, []);

  React.useEffect(() => {
    handleFetchData();
  }, [id]);

  const handleCreateKiosk = async () => {
    try {
      const txb = new TransactionBlock();
      const kiosk_cap = createKioskAndShare(txb);
      txb.transferObjects([kiosk_cap], txb.pure(address, "address"));
      const tx = (await signAndExecuteTransactionBlock({
        transactionBlock: txb as any,
        options: {
          showEffects: true,
        },
      })) as any;
      const { status } = tx.effects.status;
      if (status === "success") {
        toast.success("Create Kiosk success!");
        return true;
      } else {
        toast.error("Create Kiosk error!");
        return false;
      }
    } catch (e: any) {
      setLoading(false);
      if (e.message.includes("amount sufficient for the required gas amount")) {
        toast.error("Your SUI balance is not enough to buy this item!");
        return;
      }

      toast.error(e.message);
    }
  };

  const handleBuyNow = async (
    nftId: string,
    nftType: string,
    price: number,
    kioskId?: string
  ) => {
    setLoading(true);
    const packageObjectId = process.env.NEXT_PUBLIC_PACKAGE_OBJECT_ID;
    const contractModule = process.env.NEXT_PUBLIC_MODULE;
    const marketId = process.env.NEXT_PUBLIC_MARKET_OBJECT_ID;
    const kioskMarketId = process.env.NEXT_PUBLIC_KIOSK_MARKET_ID;
    const kioskModule = process.env.NEXT_PUBLIC_KIOSK_MODULE;
    const kioskPackageId = process.env.NEXT_PUBLIC_KIOSK_PACKAGE_ID;
    if (
      !marketId ||
      !packageObjectId ||
      !contractModule ||
      !address ||
      !kioskMarketId ||
      !kioskPackageId ||
      !kioskModule
    ) {
      setLoading(false);
      return;
    }

    try {
      const txb = new TransactionBlock();
      const chainConnected = getConnectedChain(chain?.id);
      const provider = getRPCConnection(chainConnected);
      if (kioskId && provider) {
        const kiosk = await getOwnedKiosks(provider, address);
        if (kiosk.kioskOwnerCaps.length === 0) {
          const createdNewKisok = await handleCreateKiosk();
          if (createdNewKisok) {
            handleBuyNow(nftId, nftType, price, kioskId);
          } else {
            setLoading(false);
          }
          return;
        }
        const policies = await queryTransferPolicy(provider, nftType);

        const policyId = policies[0]?.id;
        if (!policyId) {
          throw new Error(
            `This item doesn't have a Transfer Policy attached so it can't be traded through kiosk.`
          );
        }
        const buyerKiosk = kiosk.kioskOwnerCaps[0];
        txb.setGasBudget(100000000);
        const environment = mainnetEnvironment;

        const result = purchaseAndResolvePolicies(
          txb,
          nftType,
          String(price),
          kioskId, // kiosk id của nft
          nftId,
          policies[0],
          environment,
          {
            ownedKiosk: buyerKiosk?.kioskId, // kiosk id của ví mua
            ownedKioskCap: buyerKiosk?.objectId, // kiosk cap của ví mua
          }
        );

        if (result.canTransfer) {
          place(
            txb,
            nftType,
            buyerKiosk?.kioskId,
            buyerKiosk?.objectId,
            result.item
          );
        }
      } else {
        const fee = 0.12 * SUI_DECIMAL;
        txb.moveCall({
          target: `${packageObjectId}::${contractModule}::buy`,
          arguments: [
            txb.pure(marketId),
            txb.pure(nftId),
            txb.makeMoveVec({
              objects: [
                txb.splitCoins(txb.gas, [txb.pure(String(price + fee))]),
              ],
            }),
          ],
          typeArguments: [nftType],
        });
      }
      const tx = (await signAndExecuteTransactionBlock({
        transactionBlock: txb as any,
        options: {
          showEffects: true,
        },
      })) as any;
      const { digest } = tx;
      const { status, error } = tx.effects.status;
      if (status === "success") {
        dispatch(
          verifyBuyTransaction({
            id: nftData?.id || "",
            params: {
              txhash: digest,
              chain: "SUI",
            },
          })
        );

        setTimeout(() => {
          dispatch(fetchNFTDetail({ id: String(id) }));
          setLoading(false);
          dispatch(
            setSuccess({
              isOpen: true,
              title: "Congratulations !",
              message: "This item has been added to your wallet",
            })
          );
        }, 3000);
      } else {
        toast.error(error);
        setLoading(false);
      }
    } catch (e: any) {
      setLoading(false);
      if (e.message.includes("amount sufficient for the required gas amount")) {
        toast.error("Your SUI balance is not enough to buy this item!");
        return;
      }

      toast.error(e.message);
    }
  };
  console.log(
    "Number(nftData.saleStatus.price)",
    Number(nftData?.saleStatus?.price)
  );

  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        {nftStatus === FetchStatus.idle || nftStatus === FetchStatus.pending ? (
          <NFTDetailTopSkeleton />
        ) : (
          <div className="mt-10 flex flex-col space-y-10 md:space-y-0 md:flex-row md:space-x-20 lg:space-x-30 xl:space-x-40">
            <div className="w-full md:w-[40%] min-w-[40%] wrap-ratio-[1/1]">
              <Image
                src={validURL(nftData?.image || "/default.jpeg")}
                width={200}
                height={200}
                className="flex w-full aspect-square rounded-[20px] !h-auto object-cover"
                alt="mock"
              />
            </div>
            <div className="w-full">
              <p className="text-black whitespace-pre-wrap break-all line-clamp-1 dark:text-white text-[24px] md:text-[36px] font-medium">
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
                      className="w-[36px] h-[36px] min-w-[36px] md:mt-0 object-cover rounded-full md:block flex justify-center items-center mx-auto mt-5"
                    />
                  </div>
                  <Link href={`/collection/${nftData.collection.id}`}>
                    <p className="external mt-2 md:text-[20px] text-black dark:text-white font-display break-all">
                      {nftData?.collection?.name}
                    </p>
                  </Link>
                </div>
              )}
              <div className="bg-white border shadow dark:bg-[#2B294F] dark:border-[#3D2662] p-6 rounded-[20px] md:flex items-center justify-between mt-6">
                {nftData?.saleStatus ? (
                  <div className="text-black dark:text-white flex flex-col">
                    <p className="text-[20px]">Current Price :</p>
                    <p className="text-[20px] md:text-[24px] font-bold">
                      {Number(nftData.saleStatus.price).toPrecision()} SUI{" "}
                      {dataCoingecko &&
                        dataCoingecko > 0 &&
                        `(~ $${(
                          dataCoingecko * Number(nftData?.saleStatus.price)
                        ).toFixed(2)})`}
                      {/* {`(~ $${Number(
                        nftData.saleStatus.usdPrice
                      ).toPrecision()})`} */}
                    </p>
                  </div>
                ) : (
                  <div />
                )}
                {nftData &&
                  nftData.owner?.address &&
                  nftData.owner &&
                  !nftData?.saleStatus &&
                  nftData.owner?.address?.address === address && (
                    <button
                      className=" primaryButton text-white text-[20px] h-[45px] px-10 rounded-full  w-full mt-5 md:mt-0 md:w-auto"
                      onClick={() => {
                        if (nftData.collection) {
                          setOpenListing(true);
                        } else {
                          toast.error("This NFT isn't supported on SAKAYA");
                        }
                      }}
                    >
                      List Now
                    </button>
                  )}
                {nftData?.saleStatus &&
                  nftData.owner?.address &&
                  nftData.saleStatus.onSale &&
                  nftData.owner?.address.address !== address && (
                    <button
                      disabled={isLoading || !connected}
                      className="primaryButton text-white text-[20px] h-[45px] px-10 rounded-full  w-full mt-5 md:mt-0 md:w-auto"
                      onClick={() => {
                        if (nftData) {
                          handleBuyNow(
                            nftData?.onChainId,
                            nftData?.nftType,
                            Number(nftData.saleStatus?.price) * SUI_DECIMAL,
                            nftData.kioskId
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
                  nftData.owner?.address &&
                  nftData.owner?.address.address === address &&
                  nftData.saleStatus.onSale && (
                    <button
                      disabled={isLoading || !connected}
                      className="primaryButton text-white text-[20px] h-[45px] px-10 rounded-full w-full mt-5 md:mt-0 md:w-auto"
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
                <hr className="border-none bg-[#C9C6C6] h-[1px]" />

                {nftData?.owner && nftData.owner?.address && (
                  <div className="text-black dark:text-white flex items-center justify-between">
                    <span>Owner Address</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-[18px] font-bold ">
                        {formatLongString(nftData.owner?.address.address)}
                      </span>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            nftData.owner?.address.address
                          );
                          toast.info("Copied to clipboard!");
                        }}
                      >
                        <CopyIcon />
                      </div>
                    </div>
                  </div>
                )}
                <div className="text-black dark:text-white flex items-center justify-between">
                  <span>Transaction Fee</span>
                  <span className="text-[18px] font-bold ">0.12 SUI</span>
                </div>
                <div className="text-black dark:text-white flex items-center justify-between">
                  <span>Royalties Fee</span>
                  <span className="text-[18px] font-bold ">0%</span>
                </div>
                {/* <div className="text-black dark:text-white flex items-center justify-between">
                  <span>Listing/Bidding/Cancel</span>
                  <span className="text-[18px] font-bold ">Free</span>
                </div> */}
              </div>
              {nftData?.properties && nftData.properties.length > 0 && (
                <div className="mt-[36px] space-y-[10px]">
                  <p className="text-[20px] font-bold text-black dark:text-white">
                    Properties
                  </p>
                  <hr className="border-none bg-[#969696] h-[1px]" />
                  <div className="grid gap-5 grid-cols-2 lg:grid-cols-3 pt-1">
                    {nftData.properties.map((i) => {
                      return (
                        <div
                          key={i.name}
                          className="bg-white text-black dark:bg-[#2B294F] flex justify-center items-center space-y-1 flex-col px-4 py-[10px] rounded-[10px] border border-[#892DF0]"
                        >
                          <p className="text-[#F626D1] text-sm font-semibold">
                            {i.name.toUpperCase()}
                          </p>
                          <p className="text-[#827E7E] whitespace-pre-wrap break-all line-clamp-1 dark:text-white font-semibold">
                            {i.value.toUpperCase() || "-"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 md:mt-20">
          {status === FetchStatus.idle || status === FetchStatus.pending ? (
            <NFTListSkeleton hideSort />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-black dark:text-white font-bold">
                  More from this collection
                </p>
              </div>
              {response && response.data && response.data.length > 0 ? (
                <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                  {response?.data?.map((i) => {
                    return (
                      <ListNFTItem
                        key={i.id}
                        data={i}
                        onBuySuccess={handleFetchData}
                        onDelistSuccess={handleFetchData}
                        onListSuccess={handleFetchData}
                      />
                    );
                  })}
                </div>
              ) : (
                <Empty />
              )}
            </>
          )}

          {openListing && nftData && (
            <SaleModal
              close={() => {
                setOpenListing(false);
              }}
              onSuccess={() => {
                setOpenListing(false);
                dispatch(fetchNFTDetail({ id: String(id) }));
                dispatch(
                  setSuccess({
                    isOpen: true,
                    title: "List Success",
                    message: "Your item has been listed!",
                  })
                );
              }}
              item={nftData}
            />
          )}
          {openDelist && nftData && (
            <DelistModal
              close={() => {
                setOpenDelist(false);
              }}
              nftId={nftData.onChainId}
              nftType={nftData.nftType}
              kioskId={nftData.kioskId}
              kioskOwnerCapId={nftData.kioskOwnerCapId}
              id={nftData.id}
              onSuccess={() => {
                setOpenDelist(false);
                dispatch(fetchNFTDetail({ id: String(id) }));
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
        <div className="mt-[70px] flex justify-center">
          <Link href={`/collection/${nftData?.collection?.id}`}>
            <button className="bg-white text-primary dark:bg-[#71659C] dark:text-white font-bold rounded-lg border border-[#c2c2c2] w-[189px] h-[49px]">
              View Collection
            </button>
          </Link>
        </div>
      </div>
    </BaseComponent>
  );
};
export default NFT;
