import { MoreTicket } from "../../organisms/MoreTicketList";
import { LoadingOutlined } from "@ant-design/icons";
interface Props {
  title: string;
  description: string;
  status: "available" | "bought" | "unavailable";
  mission: "1" | "2" | "3";
  onHandleBuy: (
    type: "forEvery" | "completedAnyTask" | "completedAllTask"
  ) => void;
  data?: MoreTicket;
  isFetching: boolean;
}
const MoreTicketItem: React.FC<Props> = ({
  title,
  description,
  status,
  mission,
  onHandleBuy,
  data,
  isFetching,
}) => {
  const buttonColor = !data
    ? "text-[#D0D5DD] bg-gray-50"
    : status === "available"
    ? `bg-[#F9D8F5] text-[#EB77DC]`
    : status === "unavailable"
    ? "text-[#D0D5DD] bg-gray-50"
    : "bg-gray-50 text-[#475467]";
  return mission === "2" ? (
    <div className="relative">
      <div className="bg-white dark:bg-boxTaskDarkNew py-2 px-4 md:px-6 border rounded-lg flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-[12px] text-[#98A2B3]">{description}</p>
        </div>
        <button
          onClick={() => {
            if (status === "available") {
              onHandleBuy("completedAnyTask");
            }
          }}
          className={`md:text-sm h-8 min-h-[32px] rounded-full px-3 ${buttonColor}  text-[12px]`}
        >
          {!isFetching ? (
            <>{status === "bought" ? "Bought" : "Buy 1 ticket"}</>
          ) : (
            <LoadingOutlined className="text-[#E23DCC]" size={20} />
          )}
        </button>
      </div>
      {status === "unavailable" && (
        <div className="absolute top-0 px-4 md:px-0 flex w-full h-full items-center justify-center bg-white/50 dark:bg-transparent">
          <div className="bg-[#FEF0C7] px-[10px] p-1 rounded-full flex items-center space-x-2 h-[40px] md:h-[30px]">
            <span className="bg-[#FFFAEB] text-[#B54708] px-2 py-[2px] text-xs rounded-full">
              Notice
            </span>
            <span className="text-[#B54708] text-xs font-medium">
              Complete at least one task to unlock
            </span>
          </div>
        </div>
      )}
    </div>
  ) : mission === "1" ? (
    <div className="bg-white dark:bg-boxTaskDarkNew py-2 px-4 md:px-6 border rounded-lg flex justify-between items-center">
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-[12px] text-[#98A2B3]">{description}</p>
      </div>
      <button
        className={`md:text-sm h-8 min-h-[32px] rounded-full px-3 ${buttonColor} text-[12px]`}
        onClick={() => {
          if (status === "available") {
            onHandleBuy("forEvery");
          }
        }}
      >
        {!isFetching ? (
          <>{status === "bought" ? "Bought" : "Buy 1 ticket"}</>
        ) : (
          <LoadingOutlined className="text-[#E23DCC]" size={20} />
        )}
      </button>
    </div>
  ) : (
    <div className="relative">
      <div className="bg-white dark:bg-boxTaskDarkNew py-2 px-4 md:px-6 border rounded-lg flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-[12px] text-[#98A2B3]">{description}</p>
        </div>
        <button
          onClick={() => {
            if (status === "available") {
              onHandleBuy("completedAllTask");
            }
          }}
          className={`md:text-sm h-8 min-h-[32px] rounded-full px-3 ${buttonColor}  text-[12px]`}
        >
          {!isFetching ? (
            <>{status === "bought" ? "Bought" : "Buy 3 tickets"}</>
          ) : (
            <LoadingOutlined className="text-[#E23DCC]" size={20} />
          )}
        </button>
      </div>
      {status === "unavailable" && (
        <div className="absolute top-0 px-4 md:px-0 flex w-full h-full items-center justify-center bg-white/50 dark:bg-transparent">
          <div className="bg-[#FEF0C7] px-[10px] p-1 rounded-full flex items-center space-x-2 h-[40px] md:h-[30px]">
            <span className="bg-[#FFFAEB] text-[#B54708] px-2 py-[2px] text-xs rounded-full">
              Notice
            </span>
            <span className="text-[#B54708] text-xs font-medium">
              Complete all daily tasks in a week to unlock
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default MoreTicketItem;
