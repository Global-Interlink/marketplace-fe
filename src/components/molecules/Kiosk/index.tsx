import { useWallet } from "@suiet/wallet-kit";
import { getConnectedChain, getRPCConnection } from "../../../utils/common";
import {
  Kiosk,
  OwnedKiosks,
  getKioskObject,
  getOwnedKiosks,
  withdrawFromKiosk,
} from "@mysten/kiosk";
import React from "react";
import { TransactionBlock } from "@mysten/sui.js";
import { toast } from "react-toastify";
import { SUI_DECIMAL } from "../../../api/constants";

// interface KioskObject
const KioskInfo = () => {
  const { chain, address, connected, signAndExecuteTransactionBlock } =
    useWallet();
  const [listKiosk, setListKiosk] = React.useState<Kiosk[]>();
  const [ownedKiosk, setOwnedKiosk] = React.useState<OwnedKiosks>();
  const getKiosk = async () => {
    const chainConnected = getConnectedChain(chain?.id);
    const provider = getRPCConnection(chainConnected);

    if (!provider || !connected || !address) {
      return;
    }
    const kiosk = await getOwnedKiosks(provider, address);
    setOwnedKiosk(kiosk);
    const balances = kiosk.kioskIds.map((i) => {
      return getKioskObject(provider, i);
    });
    Promise.all(balances).then((res) => {
      setListKiosk(res);
      console.log("=res", res);
    });
  };
  React.useEffect(() => {
    getKiosk();
  }, [address]);

  const withdraw = async (kiosk: Kiosk) => {
    const kioskOwnerCap = ownedKiosk?.kioskOwnerCaps.find(
      (i) => i.kioskId === kiosk.id
    )?.objectId;
    if (!kioskOwnerCap) {
      toast.error("Missing KioskOwnerCap!");
      return;
    }
    const txb = new TransactionBlock();
    const coin = withdrawFromKiosk(txb, kiosk.id, kioskOwnerCap, String(Number(kiosk.profits) * SUI_DECIMAL));

    txb.transferObjects([coin], txb.pure(address, "address"));
    const tx = (await signAndExecuteTransactionBlock({
      transactionBlock: txb as any,
      options: {
        showEffects: true,
      },
    })) as any;
    const { status, error } = tx.effects.status;
    if (status === "success") {
      toast.success("Withdraw profit success!");
    } else {
      toast.error(error);
      close && close();
    }
  };

  return (
    <div>
      <div className="mt-10 bg-white shadow dark:bg-[#2B294F] dark:text-white text-[#101828]">
        <table className="w-full whitespace-pre-wrap block md:table overflow-x-auto">
          <thead>
            <tr className="text-left">
              <th className="flex-1 px-6 py-4">Kiosk</th>
              <th className="px-6 py-4">Profit</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {listKiosk?.map((item) => {
              return (
                <tr className="" key={item.id}>
                  <td className="flex-1 px-6 py-4 text-[#101828] dark:text-white">
                    {item.id}
                  </td>
                  <td className=" px-6 py-4 text-[#101828] dark:text-white">
                    {item.profits}
                  </td>
                  <td className="px-6 py-4 text-[#101828] dark:text-white ">
                    <button
                      onClick={() => {
                        withdraw(item);
                      }}
                      className="hover:text-[#E23DCC]"
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default KioskInfo;
