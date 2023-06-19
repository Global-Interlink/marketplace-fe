import React from "react";
import CountDown from "../../src/components/molecules/Countdown";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import ListRanking, {
  LeaderBoard,
} from "../../src/components/organisms/ListRanking";
import ListReward, { Reward } from "../../src/components/organisms/ListReward";
import WeeklyProgress, {
  AllTaskDay,
} from "../../src/components/molecules/WeeklyProgress";
import * as jose from "jose";
import ListTodayTask, {
  StatusTask,
} from "../../src/components/organisms/ListTodayTask";
import { useTheme } from "next-themes";
import MoreTicketList, {
  MoreTicket,
} from "../../src/components/organisms/MoreTicketList";
import { toast } from "react-toastify";
import { useWallet } from "@suiet/wallet-kit";
import { createAxios } from "../../src/api/axiosWallet";
import Link from "next/link";

const getAccessToken = async (walletAddress: string) => {
  const secret = new TextEncoder().encode("ABBCD");
  const token = await new jose.SignJWT({
    walletAddress: walletAddress,
    role: "user",
    userId: 1,
    timeExpires: new Date().toUTCString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secret);
  return token;
};

const Campaign = () => {
  const { address } = useWallet();
  const { theme } = useTheme();
  const [weeklyProgress, setWeeklyProgress] = React.useState<AllTaskDay>();
  const [statusTasks, setStatusTasks] = React.useState<StatusTask[]>([]);
  const [leaderBoard, setLeaderBoard] = React.useState<LeaderBoard>();
  const [moreTicket, setMoreTicket] = React.useState<MoreTicket>();
  const [rewards, setRewards] = React.useState<Reward[]>([]);
  const api = createAxios();
  const fetchData = async () => {
    api.get<AllTaskDay>("/history-task/weekly/all-tasks").then((res) => {
      setWeeklyProgress(res.data);
    });
    api.get<{ data: StatusTask[] }>("/history-task/status-task").then((res) => {
      setStatusTasks(res.data.data);
    });
    api
      .get<{ data: { data: Reward[] } }>("/win-prize/weekly-rewar")
      .then((res) => {
        setRewards(res.data.data.data);
      });
    fetchLeaderBoard();
  };

  const fetchLeaderBoard = async (address?: string) => {
    // const token = await getAccessToken(address);
    const api = createAxios();
    api
      .get<LeaderBoard>(`/ticket/leaderboard?walletAddress=${address}`)
      .then((res) => {
        setLeaderBoard(res.data);
      });
  };

  console.log("=", rewards);
  const handleBuy = (type: string) => {
    api
      .post("/more-tickets/buy-more-ticket", {
        buyType: type,
        walletAddress: address,
      })
      .then((res) => {
        console.log(res);
        toast.success("Buy ticket success!");
        if (address) {
          fetchMoreTicketData(address);
          fetchLeaderBoard();
        }
      })
      .catch((e) => {
        toast.error(e.response.data.cause);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchMoreTicketData = (address: string) => {
    api
      .get<MoreTicket>(`/more-tickets/current?walletAddress=${address}`)
      .then((res) => {
        setMoreTicket(res.data);
      });
  };

  React.useEffect(() => {
    if (address) {
      fetchMoreTicketData(address);
      fetchLeaderBoard(address);
    }
  }, [address]);

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
              <MoreTicketList
                data={moreTicket}
                onHandleBuy={handleBuy}
                statusTask={statusTasks}
              />
            </div>
          </div>
          <div
            className={`w-full lg:w-1/2 mp-4 p-4 md:p-8   rounded-lg campaignboxshadow  ${
              theme === "dark" ? "darkGradient" : "bg-white"
            }`}
          >
            <div
              className={`bg-bgLeaderBoard bg-no-repeat bg-right-top bg-[length:320px_320px]`}
            >
              <p className="text-[30px] font-medium">Leaderboard</p>
              <p className="mt-4 text-gray-700 mb-2 dark:text-gray-200">
                Weekly Giveaway end in
              </p>
              <CountDown startTime={1687948015000} />
              <p className="mt-4 text-gray-700 dark:text-gray-200">
                Current Prizepool
              </p>
              <p className="gradientColor !leading-[60px] !text-[48px] font-semibold">
                10,000 SUI
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                Learn more about prize table{" "}
                <Link className="gradientColor" href="/event/prize">
                  here.
                </Link>
              </p>
              <ListRanking data={leaderBoard} />
            </div>
            <div className="flex items-center justify-center mt-4">
              <Link
                href={"/event/weekly-reward/tickets"}
                className="text-sm rounded-full border py-2 px-[14px]"
              >
                View All
              </Link>
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
            <ListReward
              data={rewards.filter((i) => i.winPrizeOrder === 1)}
              rank="gold"
            />
            <ListReward
              data={rewards.filter((i) => i.winPrizeOrder === 2)}
              rank="silver"
            />
            <ListReward
              data={rewards.filter((i) => i.winPrizeOrder === 3)}
              rank="bronze"
            />
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Campaign;
