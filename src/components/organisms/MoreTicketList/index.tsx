import MoreTicketItem from "../../molecules/MoreTicketItem";
import { StatusTask } from "../ListTodayTask";

export interface MoreTicket {
  data?: {
    forEvery?: boolean;
    completedAnyTask?: boolean;
    completedAllTask?: boolean;
  };
}

interface Props {
  data?: MoreTicket;
  onHandleBuy: (
    type: "forEvery" | "completedAnyTask" | "completedAllTask"
  ) => void;
  statusTask: StatusTask[];
}
const MoreTicketList: React.FC<Props> = ({ data, onHandleBuy, statusTask }) => {
  const completed_any_task = data?.data?.completedAnyTask;
  const for_every = data?.data?.forEvery;
  const completed_all_task = data?.data?.completedAllTask;
  return (
    <div className="mt-8 space-y-6">
      <MoreTicketItem
        title="1 ticket (1000 - 2000 tGIL)"
        description="One lucky chance for everyone"
        status={for_every ? "bought" : "available"}
        mission="1"
        onHandleBuy={onHandleBuy}
      />
      <MoreTicketItem
        title="1 ticket (1000 tGIL)"
        description="For complete at least 1 task"
        status={
          completed_any_task
            ? "bought"
            : statusTask.find((i) => i.statusTask === true)
            ? "available"
            : "unavailable"
        }
        mission="2"
        onHandleBuy={onHandleBuy}
      />
      <MoreTicketItem
        title="3 tickets"
        description="For complete all daily tasks the whole week"
        status={
          completed_all_task
            ? "bought"
            : !statusTask.find((i) => i.statusTask === false)
            ? "available"
            : "unavailable"
        }
        mission="3"
        onHandleBuy={onHandleBuy}
      />
    </div>
  );
};

export default MoreTicketList;
