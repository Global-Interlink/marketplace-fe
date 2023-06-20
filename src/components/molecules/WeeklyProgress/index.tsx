import { Image } from "antd";

export interface AllTaskDay {
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
  Sunday: number;
}
interface Props {
  data?: AllTaskDay;
}

const WeeklyProgress: React.FC<Props> = ({ data }) => {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const taskCompleted = [
    data?.Monday || 0,
    data?.Tuesday || 0,
    data?.Wednesday || 0,
    data?.Thursday || 0,
    data?.Friday || 0,
    data?.Saturday || 0,
    data?.Sunday || 0,
  ];
  const currentDate = new Date();
  const currentDayName = currentDate.toLocaleString("en-US", {
    weekday: "short",
  });

  const getProgressBar = (completedTask: number, weekDay: string) => {
    switch (completedTask) {
      case 1:
        return currentDayName === weekDay
          ? "/completed-1.svg"
          : "old-completed-1.svg";
      case 2:
        return currentDayName === weekDay
          ? "/completed-2.svg"
          : "old-completed-2.svg";
      case 3:
        return currentDayName === weekDay
          ? "/completed.svg"
          : "old-completed.svg";
      default:
        return "/completed-0.svg";
    }
  };

  return (
    <div className="flex items-center justify-between space-x-1 mt-4">
      {weekdays.map((i, idx) => {
        return (
          <div className="flex flex-col" key={i}>
            <div className="relative h-[35px]">
              <Image
                preview={false}
                className="w-full h-full"
                src={getProgressBar(taskCompleted[idx], i)}
                alt="s"
              />
              <div className="absolute text-sm top-0 h-full w-full flex justify-center items-center font-medium">
                <p className="mt-2 text-[#344054] dark:text-[#D0D5DD]">
                  {taskCompleted[idx]}/3
                </p>
              </div>
            </div>
            <div className="text-xs text-[#667085] dark:text-[#D0D5DD] text-center font-medium">
              {i}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default WeeklyProgress;
