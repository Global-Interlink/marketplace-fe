interface Props {
  title: string;
  description: string;
  status: "done" | "fail" | "new";
}
const TodayTaskItem: React.FC<Props> = ({ title, description, status }) => {
  const statusColor =
    status === "new"
      ? "bg-[#F9D8F5] text-[#EB77DC]"
      : status === "done"
      ? "bg-[#D1FADF]  text-[#039855]"
      : "bg-[#FEF3F2] text-[#D92D20]";
  const statusText =
    status === "new" ? "Do it now" : status === "done" ? "Done" : "Fail";
  const boxBgr =
    status === "new"
      ? "bg-white"
      : status === "done"
      ? "bg-[#F6FEF9]"
      : "bg-[#FFFBFA]";
  return (
    <div
      className={`${boxBgr} py-2 px-6 border rounded-lg flex justify-between items-center`}
    >
      <div>
        <p className="uppercase text-sm">{title}</p>
        <p className="text-[12px] text-gray-400">{description}</p>
      </div>
      <button className={`text-sm h-8 rounded-full px-3 ${statusColor}`}>
        {statusText}
      </button>
    </div>
  );
};
export default TodayTaskItem;
