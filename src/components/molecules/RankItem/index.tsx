import { Image } from "antd";
import {
  formatUserLeaderBoarddAddress,
  formatLeaderBoardAddress,
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
    ? formatUserLeaderBoarddAddress(address)
    : formatLeaderBoardAddress(address);
  return (
    <div className="bg-gray-50 dark:bg-boxTaskDarkNew dark:text-[#EAECF0] break-all flex items-center border-2 py-[14px] text-[#344054] px-4 lg:px-6 rounded-lg">
      <div className="flex w-full justify-between space-x-2 lg:space-x-4">
        <div className="relative flex items-center justify-start w-10 lg:w-[44px] xl:w-[55px] 2xl:w-[60px]">
          <Image
            preview={false}
            width={60}
            height={43}
            src={image}
            alt={image}
            className="object-contain"
          />
          {no && (
            <div className="absolute flex items-center justify-center w-full">
              <p className="text-md text-white w-1/2 font-medium text-center">
                {no}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center w-[220px] justify-center">
          {formatedAddress}
          {isYou ? " (you)" : ""}
        </div>
        <div className="flex items-center space-x-1 w-36">
          <Image
            preview={false}
            width={48}
            height={48}
            src="/ticket.svg"
            alt="ticket"
            className="!w-6 !min-w-[24px] lg:!w-8 lg:!min-w-[32px] xl:!w-12 xl:!min-w-[48px]"
          />
          <div className="flex w-full">{tickets}</div>
        </div>
        <div className="flex items-center space-x-1  justify-start w-60">
          <Image
            preview={false}
            width={48}
            height={48}
            src="/medal.svg"
            alt="medal"
            className="!w-6 !min-w-[24px] lg:!w-8 lg:!min-w-[32px] xl:!w-12 xl:!min-w-[48px]"
          />
          <div className="text-[#D92D20] flex w-full">
            {Number(percent).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankItem;
