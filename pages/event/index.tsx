import CountDown from "../../src/components/molecules/Countdown";
import MoreTicketItem from "../../src/components/molecules/MoreTicketItem";
import TodayTaskItem from "../../src/components/molecules/TodayTaskItem";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import ListRanking from "../../src/components/organisms/ListRanking";
import ListReward from "../../src/components/organisms/ListReward";
import WeeklyProgress, {
  AllTaskDay,
} from "../../src/components/molecules/WeeklyProgress";
import * as jose from "jose";
import React from "react";
import axios from "axios";
import ListTodayTask, {
  StatusTask,
} from "../../src/components/organisms/ListTodayTask";
import { useTheme } from "next-themes";
const getAccessToken = async () => {
  const secret = new TextEncoder().encode("ABBCD");
  const token = await new jose.SignJWT({
    walletAddress:
      "0x2eb3ce5badd1ce6452d1b03edb878c8c4ec7f511da6c5b3823190e9a0a912853",
    role: "user",
    userId: 1,
    timeExpires: new Date().toUTCString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secret);
  return `Bearer ${token},`;
};

const Campaign = () => {
  const { theme } = useTheme();
  const [weeklyProgress, setWeeklyProgress] = React.useState<AllTaskDay>();
  const [statusTasks, setStatusTasks] = React.useState<StatusTask[]>();
  const api = axios.create({
    baseURL: `http://210.245.74.41:3030/main/v1`,
    headers: {
      "Content-Type": "application/json",
      // Authorization: token,
    },
  });
  const fetchData = async () => {
    api.get("/ticket/leaderboard");
    api.get<AllTaskDay>("/history-task/weekly/all-tasks").then((res) => {
      setWeeklyProgress(res.data);
    });
    api.get<{ data: StatusTask[] }>("/history-task/status-task").then((res) => {
      setStatusTasks(res.data.data);
    });
    // api.get("/win-prize/weekly-reward");
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="w-full flex flex-col lg:flex-row  space-y-10 lg:space-y-0 lg:space-x-12 text-gray-900">
          <div
            className={`w-full lg:w-1/2 p-4 md:p-8  rounded-lg campaignboxshadow ${
              theme === "dark" ? "darkGradient" : "bg-white"
            }`}
          >
            <p className="text-[30px] font-medium">Daily Task</p>
            <p className="text-gray-500 dark:text-gray-300">
              Track your progress to get more tickets for weekly reward pool
            </p>
            <div className="mt-4">
              <p className="dark:text-gray-200">Weekly progression</p>
              <WeeklyProgress data={weeklyProgress} />
            </div>
            <div className="mt-5">
              <ListTodayTask data={statusTasks} />
              <p className="text-[30px] mt-8 font-medium">Get more tickets</p>
              <p className="text-gray-500 dark:text-gray-300">
                Chance to get more tickets weekly
              </p>
              <div className="mt-8 space-y-6">
                <MoreTicketItem
                  title="1 ticket (1000 - 2000 tGIL)"
                  description="One lucky chance for everyone"
                  status="available"
                  mission="1"
                />
                <MoreTicketItem
                  title="1 tickets (1000 tGIL)"
                  description="For complete at least 1 task"
                  status="bought"
                  mission="2"
                />
                <MoreTicketItem
                  title="3 tickets"
                  description="For complete all daily tasks the whole week"
                  status="unavailable"
                  mission="3"
                />
              </div>
            </div>
          </div>
          <div
            className={`w-full lg:w-1/2 mp-4 md:p-8   rounded-lg campaignboxshadow  ${
              theme === "dark" ? "darkGradient" : "bg-white"
            }`}
          >
            <div className={`bg-bgLeaderBoard  bg-no-repeat bg-right-top bg-[length:320px_320px]`}>
              <p className="text-[30px] font-medium">Leaderboard</p>
              <p className="mt-4 text-gray-700 mb-2 dark:text-gray-200">Weekly Giveaway end in</p>
              <CountDown startTime={1687948015000} />
              <p className="mt-4 text-gray-700 dark:text-gray-200">Current Prizepool</p>
              <p className="gradientColor !leading-[60px] !text-[48px] font-semibold">
                10,000 SUI
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                Learn more about prize table{" "}
                <span className="gradientColor">here.</span>
              </p>
              <ListRanking />
            </div>
          </div>
        </div>
        <div
          className={`mt-10 text-gray-900 p-8 h-[1056px] campaignboxshadow rounded-[18px] ${
            theme === "dark" ? "darkGradient" : "bg-white"
          }`}
        >
          <p className="text-[30px] font-medium">Weekly Reward (12/6 - 19/6)</p>
          <div className="bg-bgWeeklyReward bg-center lg:bg-right w-full h-full space-y-[55px]  bg-no-repeat mt-10 bg-[length:675px_675px]">
            <ListReward rank="gold" />
            <ListReward rank="silver" />
            <ListReward rank="bronze" />
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Campaign;
