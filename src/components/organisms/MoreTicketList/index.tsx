import { useWallet } from "@suiet/wallet-kit";
import MoreTicketItem from "../../molecules/MoreTicketItem";
import { AllTaskDay } from "../../molecules/WeeklyProgress";
import { StatusTask } from "../ListTodayTask";

export interface MoreTicket {
  data?: {
    forEvery?: boolean;
    completedAnyTask?: boolean;
    completedAllTask?: boolean;
  };
  numberDynamicNft: number;
}

interface Props {
  data?: MoreTicket;
  onHandleBuy: (
    type: "forEvery" | "completedAnyTask" | "completedAllTask"
  ) => void;
  weeklyProgress?: AllTaskDay;
  isFetching: boolean;
}
const MoreTicketList: React.FC<Props> = ({
  data,
  onHandleBuy,
  weeklyProgress,
  isFetching
}) => {
  const { connected } = useWallet();
  const completed_any_task = data?.data?.completedAnyTask;
  const for_every = data?.data?.forEvery;
  const completed_all_task = data?.data?.completedAllTask;
  const weeklyTask = Object.values(weeklyProgress || {});
  const isNotCompletedAllWeeklyTask = !weeklyProgress
    ? true
    : weeklyTask.filter((i) => i !== 3).length > 0;
  const isCompletedAtLeastOneTask = weeklyTask.filter((i) => i > 0).length > 0;
  return (
    <div className="mt-8 space-y-6">
      <MoreTicketItem
        title="1 ticket (1000 - 2000 tGIL)"
        description="One lucky chance for everyone"
        status={for_every ? "bought" : !connected ? "unavailable" : "available"}
        mission="1"
        data={data}
        onHandleBuy={onHandleBuy}
        isFetching={isFetching}
      />
      <MoreTicketItem
        title="1 ticket (1000 tGIL)"
        description="For complete at least 1 task"
        status={
          !connected || !data
            ? "unavailable"
            : completed_any_task
            ? "bought"
            : isCompletedAtLeastOneTask
            ? "available"
            : "unavailable"
        }
        mission="2"
        onHandleBuy={onHandleBuy}
        data={data}
        isFetching={isFetching}
      />
      <MoreTicketItem
        title="3 tickets"
        description="For complete all daily tasks the whole week"
        status={
          !connected || !data
            ? "unavailable"
            : completed_all_task
            ? "bought"
            : isNotCompletedAllWeeklyTask
            ? "unavailable"
            : "available"
        }
        mission="3"
        onHandleBuy={onHandleBuy}
        data={data}
        isFetching={isFetching}
      />
    </div>
  );
};

export default MoreTicketList;
