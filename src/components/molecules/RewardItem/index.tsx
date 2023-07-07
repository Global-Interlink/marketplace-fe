import { formatRewardAddress } from "../../../contract-abi/consts";
import { Reward } from "../../organisms/ListReward";

interface Props {
  rank: "gold" | "silver" | "bronze";
  reward: Reward;
}
const RewardItem: React.FC<Props> = ({ rank, reward }) => {
  const bgColor =
    rank === "gold"
      ? "bg-[#FEF0C7] dark:bg-boxRewardItem"
      : rank === "silver"
      ? "bg-[#EAECF0] dark:bg-boxRewardSilverItem"
      : "bg-[#EFE5DE] dark:bg-boxRewardBronzeItem";
  return (
    <div
      className={`flex items-center mt-4 justify-around w-full py-2 px-5 rounded-lg gap-2 ${bgColor}`}
    >
      <p className="text-ellipsis overflow-hidden">
        {formatRewardAddress(reward.walletAddress)}
      </p>
      <p className="min-w-fit">
        {reward.amount} {reward.currency.toUpperCase()}
      </p>
    </div>
  );
};
export default RewardItem;
