import { useWallet } from "@suiet/wallet-kit";
import useWalletBalance from "../../../hooks/useWalletBalance";
import { formatLongString } from "../../../contract-abi/consts";
import { SUI_DECIMAL } from "../../../api/constants";

const AccountBalance = () => {
  const { address, chain } = useWallet();
  const { totalBalance, fetched } = useWalletBalance(address, chain?.id);
  return (
    <div className="accountBalance flex flex-col justify-center items-center">
      <p className="accountBalanceAddress">{formatLongString(address || "")}</p>
      <div className="flex justify-end w-full px-5">
        <p className="accountBalanceAddress font-bold">
          {!fetched
            ? 0
            : Number(Number(totalBalance) / SUI_DECIMAL).toLocaleString()}{" "}
          SUI
        </p>
      </div>
    </div>
  );
};
export default AccountBalance;
