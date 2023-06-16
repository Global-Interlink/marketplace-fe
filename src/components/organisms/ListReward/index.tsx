import { Image } from "antd";
import RewardItem from "../../molecules/RewardItem";

interface Props {
  rank: "gold" | "silver" | "bronze";
}
const ListReward: React.FC<Props> = ({ rank }) => {
  const bgColor =
    rank === "gold"
      ? "bg-[#FFFAEB] dark:bg-boxReward"
      : rank === "silver"
      ? "bg-[#F9FAFB] dark:bg-boxRewardSilver"
      : "bg-[#FFF9F4] dark: bg-boxRewardBronze";
  return (
    <div className={`relative flex flex-col space-y-4 w-full  md:w-[580px]  py-6 pl-6 pr-6 md:pr-0 rounded-xl ${bgColor}`}>
      <RewardItem rank={rank} />
      <RewardItem rank={rank} />
      <RewardItem rank={rank} />
      <RewardItem rank={rank} />
      <div className="absolute -right-[160px] -top-[40px]">
        <Image
          src={
            rank === "gold"
              ? "/reward-gold.svg"
              : rank === "silver"
              ? "/reward-silver.svg"
              : "/reward-bronze.svg"
          }
          preview={false}
          alt="reward1"
          width={301}
          height={239}
        />
      </div>
      <div className="absolute w-full flex -bottom-[26px] h-8 justify-center items-center">
        <Image
          preview={false}
          src={"/more-icon.svg"}
          alt="more"
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};
export default ListReward;
