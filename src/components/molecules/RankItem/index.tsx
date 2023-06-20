import { Image } from "antd";
import { formatLongString } from "../../../contract-abi/consts";

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
  return (
    <div className="bg-gray-50 dark:bg-boxTaskDarkNew dark:text-[#EAECF0] break-all flex items-center border-2 py-[14px] text-[#344054] px-4 lg:px-6 rounded-lg space-x-2 md:space-x-4 justify-between">
      <div className="relative flex items-center justify-start">
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
            <p className="text-md font-medium text-white">{no}</p>
          </div>
        )}
      </div>
      <div className="justify-start">{formatLongString(address)}</div>
      <div className="flex items-center">
        <Image
          preview={false}
          width={48}
          height={48}
          src="/ticket.svg"
          alt="ticket"
        />
        <p>{tickets}</p>
      </div>
      <div className="flex items-center justify-start space-x-2">
        <Image
          preview={false}
          width={48}
          height={48}
          src="/medal.svg"
          alt="medal"
        />
        <p className="text-[#D92D20]">{percent}%</p>
      </div>
    </div>
  );
};

export default RankItem;
