import { Image } from "antd";
import dayjs from "dayjs";

const WeeklyProgress = () => {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mockTaskCompleted = [2, 3, 2, 0, 0, 0, 0];
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
                src={getProgressBar(mockTaskCompleted[idx], i)}
                alt="s"
              />
              <div className="absolute text-sm top-0 h-full w-full flex justify-center items-center font-medium">
                <p className="mt-2 text-gray-700">{mockTaskCompleted[idx]}/3</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center font-medium">
              {i}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default WeeklyProgress;
