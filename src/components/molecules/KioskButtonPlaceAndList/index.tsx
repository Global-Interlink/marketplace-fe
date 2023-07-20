import {
  objArg,
  queryTransferPolicy,
  getOwnedKiosks,
  getKioskObject,
  withdrawFromKiosk,
  confirmRequest,
  purchaseAndResolvePolicies,
  mainnetEnvironment,
  place,
} from "@mysten/kiosk";
import { TransactionBlock, mainnetConnection } from "@mysten/sui.js";
import { useWallet } from "@suiet/wallet-kit";
import { Button } from "antd";
import { formatSui, getRPCConnection, mistToSui } from "../../../utils/common";
import React from "react";

const KioskButtonPlaceAndList = () => {
  const { account, signAndExecuteTransactionBlock } = useWallet();

  const getOwnedObject = async (address: string) => {
    const provider = getRPCConnection("MAINNET");

    if (!provider) {
      return;
    }
    const a = await getOwnedKiosks(provider, address);
    console.log("=-a", a);
    const policies = await queryTransferPolicy(
      provider,
      "0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0x8894fa02fc6f36cbc485ae9145d05f247a78e220814fb8419ab261bd81f08f32::bullshark::Bullshark>"
    );
    const kiosk = await getKioskObject(
      provider,
      "0x6d9029240e2a11bcb94239efe639f9f3f8c7cc58527c2dcde3a8fb9270d330ef"
    );
    console.log("=avcd", kiosk);
    const profits = formatSui(mistToSui(kiosk?.profits));
    console.log("=profits", profits);
    console.log("=policies", policies);
    const { data } = await provider.getOwnedObjects({
      owner: address,
      options: {
        showDisplay: true,
        showType: true,
      },
    });

    if (!data) return;
    console.log(
      "=data",
      data.filter((i) => i.data?.type?.includes(""))
    );
  };

  React.useEffect(() => {
    if (account?.address) {
      getOwnedObject(account?.address);
    }
  }, [account]);
  const kiosk =
    "0x4a12a0285f034c9c0053476d7fa0bab5200898715aa3896491eed30f4e1ade08";
  const kioskCap =
    "0x1d4a6878e16237bb58c18b8ce7df96be39c3769f9cb9f1193eed9bb84bced10e";
  const itemType =
    "0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0x8894fa02fc6f36cbc485ae9145d05f247a78e220814fb8419ab261bd81f08f32::bullshark::Bullshark>";
  const itemId =
    "0xee926f5f69b31950e3dd8acfa14a8bfff3d9cfb2a33cfd723e0647a0bc8bb448";
  const market =
    "0xac639a5c0295fe3f304789fa0cee65dfbc7a5f65f63d8e270ae32f7a8f9fd9db";
  const price = "9000000000";
  const target =
    "0x7e7503503615f086e4cf7aafe6d047be6b1af70c2e1751ff1ae17731280baa36::kiosk_marketplace::";

  const list = async () => {
    const txb = new TransactionBlock();
    txb.setGasBudget(100000000);
    txb.moveCall({
      target: `${target}list`,
      typeArguments: [itemType],
      arguments: [
        txb.pure(market),
        objArg(txb, kiosk),
        objArg(txb, kioskCap),
        txb.pure(itemId, "address"),
        txb.pure(price, "u64"),
      ],
    });
    console.log("=txb", txb);
    // list(txb, itemType, kiosk, kioskCap, item, price);
    const tx = (await signAndExecuteTransactionBlock({
      transactionBlock: txb as any,
      options: {
        showEffects: true,
      },
    })) as any;
    console.log("=tx", tx);
  };

  const delist = async () => {
    const txb = new TransactionBlock();
    txb.setGasBudget(1000000000);
    txb.moveCall({
      target: `${target}delist`,
      typeArguments: [itemType],
      arguments: [
        txb.pure(market),
        objArg(txb, kiosk),
        objArg(txb, kioskCap),
        txb.pure(itemId, "address"),
      ],
    });
    console.log("=txb", txb);
    // list(txb, itemType, kiosk, kioskCap, item, price);
    const tx = (await signAndExecuteTransactionBlock({
      transactionBlock: txb as any,
      options: {
        showEffects: true,
      },
    })) as any;
    console.log("=tx", tx);
  };

  const buy = async () => {
    const provider = getRPCConnection("MAINNET");

    if (!provider) {
      return;
    }
    const policies = await queryTransferPolicy(provider, itemType);
    // // const buyFee = (Number(price) * 2) / 100;
    // // const totalPrice = buyFee + Number(price);
    // // console.log("=totalPrice", totalPrice)
    // const txb = new TransactionBlock();
    // txb.setGasBudget(100000000);
    // txb.moveCall({
    //   target: `${target}buy`,
    //   typeArguments: [itemType],
    //   arguments: [
    //     txb.pure(market),
    //     txb.pure(policies[0].id),
    //     objArg(txb, "0x6d9029240e2a11bcb94239efe639f9f3f8c7cc58527c2dcde3a8fb9270d330ef"), // kiosk
    //     txb.pure(itemId, "address"),
    //     txb.makeMoveVec({
    //       objects: [txb.splitCoins(txb.gas, [txb.pure(String(price), "u64")])],
    //     }),
    //   ],
    // });

			const policyId = policies[0]?.id;
			if (!policyId) {
				throw new Error(
					`This item doesn't have a Transfer Policy attached so it can't be traded through kiosk.`,
				);
			}

			const txb = new TransactionBlock();
      txb.setGasBudget(100000000);
			const environment = mainnetEnvironment;

			const result = purchaseAndResolvePolicies(
				txb,
				itemType,
				price,
				"811ac5d8f175d384f15ed9d0c1bd35a451671a8988acea3c67469fde2b650811", // kiosk id của nft 
				itemId,
				policies[0],
				environment,
				{
					ownedKiosk: kiosk, // kiosk id của ví mua
					ownedKioskCap: kioskCap, // kiosk cap của ví mua
				},
			);

			if (result.canTransfer)
				place(txb, itemType, kiosk, kioskCap, result.item);

    console.log("=txb", txb);
    // list(txb, itemType, kiosk, kioskCap, item, price);
    const tx = (await signAndExecuteTransactionBlock({
      transactionBlock: txb as any,
      options: {
        showEffects: true,
      },
    })) as any;
    console.log("=tx", tx);
  };

  const withdraw = async () => {
    const txb = new TransactionBlock();
    const coin = withdrawFromKiosk(txb, "811ac5d8f175d384f15ed9d0c1bd35a451671a8988acea3c67469fde2b650811", "0xd329c28599b7fd6a2ed7883f82fc92b27642a843e5e8d12e6d554b4ecee81536", "9000000000");

    txb.transferObjects(
      [coin],
      txb.pure(
        "0x865a4061eb4d36b8d6e4298c06c4b210df0acf71474462c3a51f67875a14ba91",
        "address"
      )
    );
    const tx = (await signAndExecuteTransactionBlock({
      transactionBlock: txb as any,
      options: {
        showEffects: true,
      },
    })) as any;
  };

  return <Button onClick={delist}>ABCD</Button>;
};

export default KioskButtonPlaceAndList;
