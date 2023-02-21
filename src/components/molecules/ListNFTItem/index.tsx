import { useWallet } from "@suiet/wallet-kit";
import { Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { NFT } from "../../../api/types";
import { LoadingOutlined } from "@ant-design/icons";
import { JsonRpcProvider } from "@mysten/sui.js";
import { toast } from "react-toastify";
import { SUI_DECIMAL, SUI_TESTNET } from "../../../api/constants";
import { verifyBuyTransaction } from "../../../redux/verify/verifySlice";
import { useAppDispatch } from "../../../redux/hook";
import { fetchMyListingNFTs } from "../../../redux/profile/profileSlice";
import SaleModal from "../SaleModal";
import DelistModal from "../DelistModal";
import SuccessModal from "../SuccessModal";
interface Props {
  data?: NFT;
}
const ListNFTItem: React.FC<Props> = ({ data }) => {
  const { signAndExecuteTransaction, connected, address } = useWallet();
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const [openListing, setOpenListing] = React.useState(false);
  const [openDelist, setOpenDelist] = React.useState(false);
  const [success, setSuccess] = React.useState({
    title: "",
    message: "",
    isOpen: false,
  });
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
          dispatch(fetchMyListingNFTs({ page: 1, limit: 20, sort: "DESC" }));
          setLoading(false);
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
    <Link href={`/nft/${data?.id || data?.objectId}`}>
      <div className="flex flex-col w-full bg-transparent rounded-[20px] bg-white hover:scale-101 shadow">
        <Image
          src={data?.image || "/img-mock-1.png"}
          width={200}
          height={200}
          className="flex w-full aspect-[310/216] rounded-t-[20px] object-cover"
          alt="mock"
        />
        <div className="flex p-5 space-x-[14px] bg-white rounded-b-[20px]">
          <div className="w-full">
            <p className="text-[24px] text-primary font-medium">{data?.name}</p>
            <span className="text-primary">Sayaka CollectionNFT</span>
            {data?.saleStatus && (
              <div className="flex items-center mt-[18px] space-x-[30px]">
                {data?.saleStatus ? (
                  <div className="h-[36px] flex-1 text-center text-[12px] py-2 text-[#4B5563] border rounded-[5px] border-black">
                    {data.saleStatus.price} SUI
                  </div>
                ) : (
                  <div className="flex-1" />
                )}
                <div className="flex-1">
                  {data &&
                    !data?.saleStatus &&
                    data.owner?.address?.address === address && (
                      <button
                        className=" primaryButton h-[36px] w-full text-center text-[12px] py-2 text-white border rounded-[5px] "
                        onClick={() => {
                          setOpenListing(true);
                        }}
                      >
                        Put on sale
                      </button>
                    )}
                  {data?.saleStatus &&
                    data.saleStatus.onSale &&
                    data.owner?.address?.address !== address && (
                      <button
                        className=" primaryButton h-[36px] w-full text-center text-[12px] py-2 text-white border rounded-[5px] "
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
                            indicator={
                              <LoadingOutlined className="text-white" />
                            }
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
                        className=" primaryButton h-[36px] w-full text-center text-[12px] py-2 text-white border rounded-[5px] "
                        onClick={() => {
                          setOpenDelist(true);
                        }}
                      >
                        {isLoading ? (
                          <Spin
                            indicator={
                              <LoadingOutlined className="text-white" />
                            }
                          />
                        ) : (
                          "Delist"
                        )}
                      </button>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {openListing && data && (
        <SaleModal
          close={() => {
            setOpenListing(false);
          }}
          nftId={data.onChainId}
          nftType={data.nftType}
          id={data.id}
          onSuccess={() => {}}
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
    </Link>
  );
};

export default ListNFTItem;
