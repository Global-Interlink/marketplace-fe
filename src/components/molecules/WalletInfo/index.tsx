import { useAccountBalance, useWallet } from "@suiet/wallet-kit";
import { Popover } from "antd";
import { SUI_DECIMAL } from "../../../api/constants";
import { formatLongString } from "../../../contract-abi/consts";

const WalletInfo = () => {
  const { address, disconnect } = useWallet();
  const suiBalance = useAccountBalance();
  return (
    <Popover
      placement="bottom"
      className="bg-transparent"
      content={
        <div className="bg-[#EAE7E7">
          <button
            className="w-[123px]"
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      }
      arrow={false}
      //   arrow={mergedArrow}
    >
      <div className="bg-white border border-[#BD28E0] py-2 px-3 rounded-md select-none cursor-pointer">
        <p className="commonGradientText">{formatLongString(address || "")}</p>
        <p className="commonGradientTextBold text-right">
          {Number(Number(suiBalance.balance) / SUI_DECIMAL).toFixed(4)} SUI
        </p>
      </div>
    </Popover>
  );
};
export default WalletInfo;
