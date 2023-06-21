import TodayTaskItem from "../../molecules/TodayTaskItem";

export interface StatusTask {
  statusTask: boolean;
  title: string;
  tokenNumber: number;
  tiket: number;
  content: string;
}
interface Props {
  data?: StatusTask[];
}
const ListTodayTask: React.FC<Props> = ({ data }) => {
  return (
    <>
      <p className="font-normal">Today tasks</p>
      <div className="mt-6 space-y-6">
        {data?.map((i, idx) => {
          return (
            <TodayTaskItem
              key={idx}
              title={i.content}
              description={`${i.tokenNumber} tGIL + ${i.tiket} ticket`}
              status={i.statusTask}
              event={i.title}
            />
          );
        })}
      </div>
    </>
  );
};
export default ListTodayTask;
