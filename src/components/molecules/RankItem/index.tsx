import { Image } from "antd";

interface Props {
  image: string;
  address: string;
  percent: string;
  tickets: number;
}
const RankItem: React.FC<Props> = ({ image, address, percent, tickets }) => {
  return (
    <div className="bg-gray-50 flex items-center border-2 py-[14px] text-gray-700 px-6 rounded-lg space-x-4 justify-between">
      <Image width={60} height={43} src={image} alt={image} />
      <p>{address}</p>
      <div className="flex items-center">
        <Image width={48} height={48} src="/ticket.svg" alt="ticket" />
        <p>{tickets}</p>
      </div>
      <div className="flex items-center">
        <Image width={48} height={48} src="/medal.svg" alt="medal" />
        <p className="text-[#D92D20]">{percent}</p>
      </div>
    </div>
  );
};

export default RankItem;
