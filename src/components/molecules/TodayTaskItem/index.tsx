import { useRouter } from "next/router";

interface Props {
  title: string;
  description: string;
  status: boolean;
}
const TodayTaskItem: React.FC<Props> = ({ title, description, status }) => {
  const { push } = useRouter();
  const statusColor = status
    ? "bg-[#D1FADF]  text-[#039855]"
    : "bg-[#F9D8F5] text-[#EB77DC]";
  const statusText = status ? "Done" : "Do it now";
  const boxBgr = status
    ? "bg-[#F6FEF9] dark:bg-boxTaskDark"
    : "bg-white dark:bg-boxTaskDarkNew";
  return (
    <div
      className={`${boxBgr} py-2 px-6 border rounded-lg flex justify-between items-center`}
    >
      <div>
        <p className="uppercase text-sm">{title}</p>
        <p className="text-[12px] text-gray-400">{description}</p>
      </div>
      <button
        className={`text-sm h-8 rounded-full px-3 ${statusColor}`}
        onClick={() => {
          if (!status) {
            push("/");
          }
        }}
      >
        {statusText}
      </button>
    </div>
  );
};
export default TodayTaskItem;
