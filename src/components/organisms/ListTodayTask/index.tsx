import TodayTaskItem from "../../molecules/TodayTaskItem";

export interface StatusTask {
  statusTask: boolean;
  title: string;
  tokenNumber: number;
  tiket: number;
}
interface Props {
  data?: StatusTask[];
}
const ListTodayTask: React.FC<Props> = ({ data }) => {
  return (
    <>
      <p>Today tasks</p>
      <div className="mt-6 space-y-6">
        {data?.map((i, idx) => {
          return (
            <TodayTaskItem
              key={idx}
              title={i.title}
              description={`${i.tokenNumber} tGIL + ${i.tiket} ticket`}
              status={i.statusTask}
            />
          );
        })}
      </div>
    </>
  );
};
export default ListTodayTask;
