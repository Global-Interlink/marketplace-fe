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
import { useWallet } from "@suiet/wallet-kit";
import { createAxios } from "../../src/api/axiosWallet";
import Link from "next/link";
import { getNextSunday, getThisWeek } from "../../src/utils/common";
import usePizePoolBalance from "../../src/hooks/usePizePoolBalance";
import { SUI_DECIMAL } from "../../src/api/constants";
import NotEligible from "../../src/components/molecules/EligibleModal";
import BuyTicketResponseModal from "../../src/components/molecules/BuyTicketResponseModal";
import ConfirmBuyTicketModal from "../../src/components/molecules/ConfirmBuyTicketModal";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import { Week } from "./weekly-reward/tickets";
import dayjs from "dayjs";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [weeklyProgress, setWeeklyProgress] = React.useState<AllTaskDay>();
  const [statusTasks, setStatusTasks] = React.useState<StatusTask[]>([]);
  const [leaderBoard, setLeaderBoard] = React.useState<LeaderBoard>();
  const [moreTicket, setMoreTicket] = React.useState<MoreTicket>();
  const [isFetched, setFetched] = React.useState(false);
  const api = createAxios();
  const [numberDynamicNft, setNumberDynamicNft] = React.useState<number>();
  const [isOpenModal, setOpenModal] = React.useState(false);
  const [currentTGIL, setCurrentTGIL] = React.useState(0);
  const [isFetching, setFetching] = React.useState(false);
  const [rewards1, setRewards1] = React.useState<Reward[]>([]);
  const [rewards2, setRewards2] = React.useState<Reward[]>([]);
  const [rewards3, setRewards3] = React.useState<Reward[]>([]);
  const [rewardWeek, setRewardWeek] = React.useState<Week>();
  const [buy, setBuy] = React.useState<{
    isOpen: boolean;
    errorMessage?: string;
  }>({
    isOpen: false,
  });
  const [confirmBuy, setConfirmBuy] = React.useState<{
    isOpen: boolean;
    type: "forEvery" | "completedAnyTask" | "completedAllTask";
  }>();
  const { totalBalance } = usePizePoolBalance();
  const fetchData = async () => {
    let weekData: any;
    await api
      .get<{ data: Week[] }>("/ticket/weekly?numberWeeks=5")
      .then((res) => {
        const { data } = res.data;
        weekData = data[1];
        // const currentWeek = data.find((i) => i.current);
        // const index = currentWeek ? data?.indexOf(currentWeek) : 0;
        // if (data[index - 1]) {
        //   const week = data[index - 1];
        //   setRewardWeek(week);
        // } else {
        //   setRewardWeek(currentWeek);
        // }
        setRewardWeek(data[1]);
      })
      .catch((e) => console.log(e));

    api
      .get<{ data: { data: Reward[] } }>(
        `/win-prize/weekly-rewar?start=${weekData?.start}&end=${
          weekData?.end
        }&orderPrize=${1}`
      )
      .then((res) => {
        setRewards1(res.data.data.data);
      })
      .catch((e) => console.log(e));
    api
      .get<{ data: { data: Reward[] } }>(
        `/win-prize/weekly-rewar?start=${weekData?.start}&end=${
          weekData?.end
        }&orderPrize=${2}`
      )
      .then((res) => {
        setRewards2(res.data.data.data);
      });
    api
      .get<{ data: { data: Reward[] } }>(
        `/win-prize/weekly-rewar?start=${weekData?.start}&end=${
          weekData?.end
        }&orderPrize=${3}`
      )
      .then((res) => {
        setRewards3(res.data.data.data);
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
    api.get(`/v2/wallet/${address}`).then((res) => {
      setCurrentTGIL(res.data.tokenNumber);
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
      .then(() => {
        setBuy({ isOpen: true });
        if (address) {
          fetchMoreTicketData(address);
          fetchLeaderBoard(address);
        }
      })
      .catch((e) => {
        if (
          e?.response?.data?.cause &&
          typeof e?.response?.data?.cause === "string"
        ) {
          setBuy({ isOpen: true, errorMessage: e.response.data.cause });
        } else {
          setBuy({ isOpen: true, errorMessage: "Something went wrong" });
        }
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
    setFetching(true);
    api
      .get<MoreTicket>(`/more-tickets/current?walletAddress=${address}`)
      .then((res) => {
        setMoreTicket(res.data);
        setNumberDynamicNft(res.data.numberDynamicNft);
        setFetching(false);
      })
      .catch(() => {
        setFetching(false);
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

  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="w-full flex flex-col lg:flex-row  space-y-10 lg:space-y-0 lg:space-x-8 xl:space-x-12 text-[#101828]">
          <div
            className={`w-full lg:w-1/2 p-4 md:p-8  rounded-lg campaignboxshadow ${
              theme === "dark" ? "darkGradient" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[30px] font-medium">Daily Task</p>
              <p
                className={`${
                  numberDynamicNft && numberDynamicNft > 0
                    ? "text-[#039855] bg-[#D1FADF]"
                    : "text-[#D92D20] bg-[#FECDCA]"
                } cursor-pointer px-3  text-center text-sm rounded-full font-normal leading-5 py-[2px]`}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                {!isFetching ? (
                  <>
                    {numberDynamicNft && numberDynamicNft > 0
                      ? "Eligible"
                      : "Not-Eligible"}
                  </>
                ) : (
                  <LoadingOutlined className="text-[#E23DCC]" size={20} />
                )}
              </p>
            </div>
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
                onHandleBuy={(type) => {
                  setConfirmBuy({
                    isOpen: true,
                    type,
                  });
                  // handleBuy
                }}
                weeklyProgress={weeklyProgress}
                isFetching={isFetching}
              />
            </div>
          </div>
          <div
            className={`w-full lg:w-1/2 mp-4 p-4 md:p-8   rounded-lg campaignboxshadow  ${
              theme === "dark" ? "darkGradient" : "bg-white"
            }`}
          >
            <div
              className={`flex flex-col h-full xl:bg-bgLeaderBoard bg-no-repeat bg-right-top 2xl:bg-[length:320px_320px] xl2:bg-[length:280px_280px] xl:bg-[length:240px_240px]`}
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
              <p className="text-[#667085]  dark:text-[#D0D5DD]">
                Learn more about prize table{" "}
                <Link className="text-[#E23DCC]" href="/event/prize">
                  here.
                </Link>
              </p>
              <div className="flex items-center justify-center xl:hidden">
                <Image
                  width={320}
                  height={320}
                  src={"/leader-board.png"}
                  alt="cup"
                  className="object-contain"
                />
              </div>
              <ListRanking data={leaderBoard} />
              {leaderBoard && leaderBoard.top && leaderBoard.top.length > 0 && (
                <div className="flex items-center justify-center mt-4">
                  <div
                    className="text-sm rounded-full border py-2 px-[14px] cursor-pointer hover:text-blue-500"
                    onClick={() =>
                      router.push({
                        pathname: "/event/weekly-reward/tickets",
                        query: {
                          tab: "3",
                        },
                      })
                    }
                  >
                    View All
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`mt-10 text-[#101828] p-4 md:p-8 campaignboxshadow rounded-[18px] ${
            theme === "dark" ? "darkGradient" : "bg-white"
          }`}
        >
          <p className="text-[30px] font-medium whitespace-pre-wrap md:whitespace-normal">
            {`Weekly Reward \n${
              rewardWeek
                ? `(${dayjs(rewardWeek.start).format("DD/MM")} - ${dayjs(
                    rewardWeek.end
                  ).format("DD/MM")})`
                : ""
            }`}
          </p>
          <div className="xl:bg-bgWeeklyReward bg-center lg:bg-right w-full h-full space-y-[55px] md:bg-[length:375px_375px] lg:bg-[length:435px_435px]  bg-no-repeat mt-10 xl:bg-[length:575px_575px] 2xl:bg-[length:675px_675px]">
            <ListReward data={rewards1} rank="gold" />
            <ListReward data={rewards2} rank="silver" />
            <ListReward data={rewards3} rank="bronze" />
            <Image
              width={657}
              height={817}
              src="/weekly-reward.png"
              className="w-full aspect-square block xl:hidden"
              alt="reward"
            />
          </div>
        </div>
        {isOpenModal && (
          <NotEligible
            isEligible={
              numberDynamicNft !== undefined ? numberDynamicNft > 0 : false
            }
            close={() => {
              setOpenModal(false);
            }}
          />
        )}
      </div>
      {buy.isOpen && (
        <BuyTicketResponseModal
          errorMessage={buy.errorMessage}
          type={confirmBuy?.type}
          close={() => {
            setBuy({
              isOpen: false,
              errorMessage: undefined,
            });
          }}
        />
      )}
      {confirmBuy?.isOpen && (
        <ConfirmBuyTicketModal
          type={confirmBuy.type}
          currentTGIL={currentTGIL}
          numberOfNFTs={numberDynamicNft}
          handleBuy={handleBuy}
          close={() => {
            setConfirmBuy({ isOpen: false, type: "forEvery" });
          }}
        />
      )}
    </BaseComponent>
  );
};
export default Campaign;
