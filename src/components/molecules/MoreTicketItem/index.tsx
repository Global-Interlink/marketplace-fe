interface Props {
  title: string;
  description: string;
  status: "available" | "bought" | "unavailable";
  mission: "1" | "2" | "3";
  onHandleBuy: (
    type: "forEvery" | "completedAnyTask" | "completedAllTask"
  ) => void;
}
const MoreTicketItem: React.FC<Props> = ({
  title,
  description,
  status,
  mission,
  onHandleBuy,
}) => {
  const buttonColor =
    status === "available"
      ? `bg-[#F9D8F5]  h-8 text-[#EB77DC]`
      : status === "unavailable"
      ? "text-[#D0D5DD] bg-gray-50"
      : "bg-gray-50 text-gray-600";
  return mission === "2" ? (
    <div className="relative">
      <div className="bg-white dark:bg-boxTaskDarkNew py-2 px-6 border rounded-lg flex justify-between items-center">
        <div>
          <p className="text-sm">{title}</p>
          <p className="text-[12px] text-gray-400">{description}</p>
        </div>
        <button
          onClick={() => {
            if (status === "available") {
              onHandleBuy("completedAnyTask");
            }
          }}
          className={`text-sm h-8 rounded-full px-3 ${buttonColor}`}
        >
          {status === "bought" ? "Bought" : "Buy 1 ticket"}
        </button>
      </div>
      {status === "unavailable" && (
        <div className="absolute top-0 flex w-full h-full items-center justify-center">
          <div className="bg-[#FEF0C7] px-[10px] p-1 rounded-full flex items-center space-x-2 h-[30px]">
            <span className="bg-[#FFFAEB] text-[#B54708] px-2 py-[2px] text-xs rounded-full">
              Notice
            </span>
            <span className="text-[#B54708] text-xs">
              Complete all daily tasks in a week to unlock
            </span>
          </div>
        </div>
      )}
    </div>
  ) : mission === "1" ? (
    <div className="bg-white dark:bg-boxTaskDarkNew py-2 px-6 border rounded-lg flex justify-between items-center">
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-[12px] text-gray-400">{description}</p>
      </div>
      <button
        className={`text-sm  h-8 rounded-full px-3 ${buttonColor}`}
        onClick={() => {
          if (status === "available") {
            onHandleBuy("forEvery");
          }
        }}
      >
        {status === "bought" ? "Bought" : "Buy 1 ticket"}
      </button>
    </div>
  ) : (
    <div className="relative">
      <div className="bg-white dark:bg-boxTaskDarkNew py-2 px-6 border rounded-lg flex justify-between items-center">
        <div>
          <p className="text-sm">{title}</p>
          <p className="text-[12px] text-gray-400">{description}</p>
        </div>
        <button
          onClick={() => {
            if (status === "available") {
              onHandleBuy("completedAllTask");
            }
          }}
          className={`text-sm  h-8 rounded-full px-3 ${buttonColor}`}
        >
          {status === "bought" ? "Bought" : "Buy 3 ticket"}
        </button>
      </div>
      {status === "unavailable" && (
        <div className="absolute top-0 flex w-full h-full items-center justify-center">
          <div className="bg-[#FEF0C7] px-[10px] p-1 rounded-full flex items-center space-x-2 h-[30px]">
            <span className="bg-[#FFFAEB] text-[#B54708] px-2 py-[2px] text-xs rounded-full">
              Notice
            </span>
            <span className="text-[#B54708] text-xs">
              Complete all daily tasks in a week to unlock
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default MoreTicketItem;
