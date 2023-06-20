import { Image } from "antd";
import {
  formatRewardAddress,
  formatUserRewardAddress,
} from "../../../contract-abi/consts";
import { useWallet } from "@suiet/wallet-kit";

interface Props {
  image: string;
  address: string;
  percent: number;
  tickets: string;
  no?: string;
}
const RankItem: React.FC<Props> = ({
  image,
  address,
  percent,
  tickets,
  no,
}) => {
  const wallet = useWallet();
  const isYou = wallet.address?.toLowerCase() === address.toLowerCase();
  const formatedAddress = isYou
    ? formatUserRewardAddress(address)
    : formatRewardAddress(address);
  return (
    <div className="bg-gray-50 dark:bg-boxTaskDarkNew dark:text-[#EAECF0] break-all flex items-center border-2 py-[14px] text-[#344054] px-4 lg:px-6 rounded-lg">
      <div className="flex w-full justify-between space-x-2 lg:space-x-4">
        <div className="relative flex items-center justify-start w-[60px]">
          <Image
            preview={false}
            width={60}
            height={43}
            className="w-[40px] lg:min-w-[60px]"
            src={image}
            alt={image}
          />
          {no && (
            <div className="absolute flex items-center justify-center w-full">
              <p className="text-md text-white w-1/2 font-medium text-center">
                {no}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center w-[220px]">
          {formatedAddress}
          {isYou ? " (you)" : ""}
        </div>
        <div className="flex items-center justify-start space-x-2 w-[90px]">
          <Image
            preview={false}
            width={48}
            height={48}
            src="/ticket.svg"
            alt="ticket"
          />
          <p>{tickets}</p>
        </div>
        <div className="flex items-center space-x-2  justify-start w-[130px]">
          <Image
            preview={false}
            width={48}
            height={48}
            src="/medal.svg"
            alt="medal"
          />
          <p className="text-[#D92D20]">{Number(percent).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default RankItem;
