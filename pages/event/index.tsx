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
import { getNextSunday, getThisWeek } from "../../src/utils/common";
import usePizePoolBalance from "../../src/hooks/usePizePoolBalance";
import { SUI_DECIMAL } from "../../src/api/constants";

const getAccessToken = async (walletAddress: string) => {
  const secret = new TextEncoder().encode("ABCCD");
  const alg = "HS256";
  const token = await new jose.SignJWT({
    walletAddress: walletAddress,
    role: "user",
    userId: 1,
    timeExpires: new Date().toUTCString(),
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secret);
  return token;
};

const Campaign = () => {
  const { address, connected } = useWallet();
  const { theme } = useTheme();
  const [weeklyProgress, setWeeklyProgress] = React.useState<AllTaskDay>();
  const [statusTasks, setStatusTasks] = React.useState<StatusTask[]>([]);
  const [leaderBoard, setLeaderBoard] = React.useState<LeaderBoard>();
  const [moreTicket, setMoreTicket] = React.useState<MoreTicket>();
  const [rewards, setRewards] = React.useState<Reward[]>([]);
  const [isFetched, setFetched] = React.useState(false);
  const api = createAxios();
  const { totalBalance } = usePizePoolBalance();
  const fetchData = async () => {
    api
      .get<{ data: { data: Reward[] } }>("/win-prize/weekly-rewar")
      .then((res) => {
        setRewards(res.data.data.data);
      });
  };

  const fetchAllTask = async (address: string) => {
    const token = await getAccessToken(address);
    const api = createAxios(token);
    api.get<{ data: StatusTask[] }>("/history-task/status-task").then((res) => {
      setStatusTasks(res.data.data);
    });
    api
      .get<{ data: AllTaskDay }>("/history-task/weekly/all-tasks")
      .then((res) => {
        setWeeklyProgress(res.data.data);
      });
  };

  const fetchLeaderBoard = async (address: string) => {
    const token = await getAccessToken(address);
    const api = createAxios(token);
    api
      .get<LeaderBoard>(`/ticket/leaderboard?walletAddress=${address}`)
      .then((res) => {
        setLeaderBoard(res.data);
      });
    return;
  };

  const handleBuy = (type: string) => {
    api
      .post("/more-tickets/buy-more-ticket", {
        buyType: type,
        walletAddress: address,
      })
      .then((res) => {
        toast.success("Buy ticket success!");
        if (address) {
          fetchMoreTicketData(address);
          fetchLeaderBoard(address);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.cause);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (!connected && isFetched) {
      setStatusTasks([]);
      setWeeklyProgress(undefined);
      setMoreTicket(undefined);
      setLeaderBoard(undefined);
      setFetched(false);
    }
  }, [connected]);

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
      fetchAllTask(address);
      setFetched(true);
    }
  }, [address]);

  const timeCountdown = React.useMemo(() => {
    return getNextSunday().valueOf();
  }, []);
  console.log("=timeCountdown", timeCountdown);
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="w-full flex flex-col lg:flex-row  space-y-10 lg:space-y-0 lg:space-x-12 text-[#101828]">
          <div
            className={`w-full lg:w-1/2 p-4 md:p-8  rounded-lg campaignboxshadow ${
              theme === "dark" ? "darkGradient" : "bg-white"
            }`}
          >
            <p className="text-[30px] font-medium">Daily Task</p>
            <p className="text-[#667085] dark:text-[#D0D5DD]">
              Track your progress to get more tickets for weekly reward pool
            </p>
            <div className="mt-4">
              <p className="dark:text-[#EAECF0]">Weekly progression</p>
              <WeeklyProgress data={weeklyProgress} />
            </div>
            <div className="mt-5">
              <ListTodayTask data={statusTasks} />
              <p className="text-[30px] mt-8 font-medium">Get more tickets</p>
              <p className="text-[#667085] dark:text-[#D0D5DD]">
                Chance to get more tickets weekly
              </p>
              <MoreTicketList
                data={moreTicket}
                onHandleBuy={handleBuy}
                statusTask={statusTasks}
                weeklyProgress={weeklyProgress}
              />
            </div>
          </div>
          <div
            className={`w-full lg:w-1/2 mp-4 p-4 md:p-8   rounded-lg campaignboxshadow  ${
              theme === "dark" ? "darkGradient" : "bg-white"
            }`}
          >
            <div
              className={`flex  flex-col h-full bg-bgLeaderBoard bg-no-repeat bg-right-top bg-[length:320px_320px]`}
            >
              <p className="text-[30px] font-medium">Leaderboard</p>
              <p className="mt-4 text-[#344054] mb-2 dark:text-[#EAECF0]">
                Weekly Giveaway end in
              </p>
              <CountDown startTime={timeCountdown} />
              <p className="mt-4 text-[#344054] dark:text-[#EAECF0]">
                Current Prizepool
              </p>
              <p className="gradientColor !leading-[60px] !text-[48px] font-semibold">
                {Number(
                  Math.ceil(Number(totalBalance) / SUI_DECIMAL)
                ).toLocaleString()}{" "}
                SUI
              </p>
              <p className="text-[#667085] dark:text-[#D0D5DD]">
                Learn more about prize table{" "}
                <Link className="text-[#E23DCC]" href="/event/prize">
                  here.
                </Link>
              </p>
              <ListRanking data={leaderBoard} />
              {leaderBoard && leaderBoard.top && leaderBoard.top.length > 0 && (
                <div className="flex items-center justify-center mt-4">
                  <Link
                    href={"/event/weekly-reward/tickets"}
                    className="text-sm rounded-full border py-2 px-[14px]"
                  >
                    View All
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`mt-10 text-[#101828] p-8 campaignboxshadow rounded-[18px] ${
            theme === "dark" ? "darkGradient" : "bg-white"
          }`}
        >
          <p className="text-[30px] font-medium whitespace-pre-wrap md:whitespace-normal">
            {`Weekly Reward \n${getThisWeek()}`}
          </p>
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
