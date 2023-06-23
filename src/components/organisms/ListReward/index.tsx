import { Image } from "antd";
import RewardItem from "../../molecules/RewardItem";

export interface Reward {
  winPrizeId: number;
  walletAddress: string;
  currency: string;
  amount: number;
  winPrizeOrder: number;
  ticketNumber: number;
  targetDate: string;
  createdAt: string;
  deletedAt: null;
}
interface Props {
  rank: "gold" | "silver" | "bronze";
  data: Reward[];
}
const ListReward: React.FC<Props> = ({ rank, data }) => {
  const bgColor =
    rank === "gold"
      ? "bg-[#FFFAEB] dark:bg-boxReward"
      : rank === "silver"
      ? "bg-[#F9FAFB] dark:bg-boxRewardSilver"
      : "bg-[#FFF9F4] dark:bg-boxRewardBronze";
  return (
    <div
      className={`relative flex flex-col w-full min-h-[260px] lg:w-[380px] xl:w-[480px] 2xl:w-[580px]  py-6 pl-6 pr-6 md:pr-0 rounded-xl ${bgColor}`}
    >
      {data.slice(0, 4).map((i) => {
        return <RewardItem key={i.winPrizeId} rank={rank} reward={i} />;
      })}
      <div className="absolute -right-[70px] md:-right-[160px] md:-top-[40px] w-[140px] md:w-[300px] md:h-[240px]">
        <Image
          src={
            rank === "gold"
              ? "/reward-gold.png"
              : rank === "silver"
              ? "/reward-silver.png"
              : "/reward-bronze.png"
          }
          preview={false}
          alt="reward1"
          className="object-contain"
        />
      </div>
      {data.length > 4 && (
        <div className="absolute w-full flex -bottom-[26px] h-8 justify-center items-center">
          <Image
            preview={false}
            src={"/more-icon.svg"}
            alt="more"
            className="cursor-pointer"
          />
        </div>
      )}
      {data.length === 0 && (
        <div className="absolute w-full flex justify-center h-full top-0 left-0 items-center">
          <p className="text-[#344054] dark:text-white">No Reward</p>
        </div>
      )}
    </div>
  );
};
export default ListReward;
