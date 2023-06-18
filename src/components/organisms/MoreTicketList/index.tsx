import MoreTicketItem from "../../molecules/MoreTicketItem";

export interface MoreTicket {
  for_every?: boolean;
  completed_any_task?: boolean;
  completed_all_task?: true;
}

interface Props {
  data?: MoreTicket;
  onHandleBuy: (
    type: "forEvery" | "completedAnyTask" | "completedAllTask"
  ) => void;
}
const MoreTicketList: React.FC<Props> = ({ data, onHandleBuy }) => {
  return (
    <div className="mt-8 space-y-6">
      <MoreTicketItem
        title="1 ticket (1000 - 2000 tGIL)"
        description="One lucky chance for everyone"
        status={data?.for_every ? "bought" : "available"}
        mission="1"
        onHandleBuy={onHandleBuy}
      />
      <MoreTicketItem
        title="1 tickets (1000 tGIL)"
        description="For complete at least 1 task"
        status={
          data?.completed_any_task
            ? "bought"
            : data?.for_every
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
          data?.completed_all_task
            ? "bought"
            : data?.for_every && data.completed_any_task
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
