interface Props {
  rank: "gold" | "silver" | "bronze";
}
const RewardItem: React.FC<Props> = ({ rank }) => {
  const bgColor =
    rank === "gold"
      ? "bg-[#FEF0C7] dark:bg-boxRewardItem"
      : rank === "silver"
      ? "bg-[#EAECF0] dark:bg-boxRewardSilverItem"
      : "bg-[#EFE5DE] dark:bg-boxRewardBronzeItem";
  return (
    <div
      className={`flex items-center justify-between w-full md:w-[417px] py-2 px-5 rounded-lg ${bgColor}`}
    >
      <p>0x12abc2ab2ab...123a123a</p>
      <p>100 SUI</p>
    </div>
  );
};
export default RewardItem;
