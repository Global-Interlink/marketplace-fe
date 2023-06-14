import CountDown from "../../src/components/molecules/Countdown";
import MoreTicketItem from "../../src/components/molecules/MoreTicketItem";
import TodayTaskItem from "../../src/components/molecules/TodayTaskItem";
import BaseComponent from "../../src/components/organisms/BaseComponent";
import ListRanking from "../../src/components/organisms/ListRanking";
import ListReward from "../../src/components/organisms/ListReward";
import WeeklyProgress from "../../src/components/molecules/WeeklyProgress";

const Campaign = () => {
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="w-full flex flex-col lg:flex-row  space-y-10 lg:space-y-0 lg:space-x-12 text-gray-900">
          <div className="w-full lg:w-1/2 p-4 md:p-8 bg-white rounded-lg campaignboxshadow">
            <p className="text-[30px] font-medium">Daily Task</p>
            <p className="text-gray-500">
              Track your progress to get more tickets for weekly reward pool
            </p>
            <div className="mt-4">
              <p>Weekly progression</p>
              <WeeklyProgress />
            </div>
            <div className="mt-5">
              <p>Today tasks</p>
              <div className="mt-6 space-y-6">
                <TodayTaskItem
                  title="LISTING A NFT"
                  description="100 tGIL + 1 ticket"
                  status="done"
                />
                <TodayTaskItem
                  title="Buy A NFT"
                  description="150 tGIL + 1 ticket"
                  status="fail"
                />
                <TodayTaskItem
                  title="Sell A NFT"
                  description="150 tGIL + 1 ticket"
                  status="new"
                />
              </div>
              <p className="text-[30px] mt-8 font-medium">Get more tickets</p>
              <p className="text-gray-500">Chance to get more tickets weekly</p>
              <div className="mt-8 space-y-6">
                <MoreTicketItem
                  title="3 tickets"
                  description="For complete all daily tasks the whole week"
                  status="unavailable"
                  mission="3"
                />
                <MoreTicketItem
                  title="1 tickets (1000 tGIL)"
                  description="For complete at least 1 task"
                  status="bought"
                  mission="2"
                />
                <MoreTicketItem
                  title="1 ticket (1000 - 2000 tGIL)"
                  description="One lucky chance for everyone"
                  status="available"
                  mission="1"
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 mp-4 md:p-8 bg-white rounded-lg campaignboxshadow bg-bgLeaderBoard bg-no-repeat bg-right-top bg-[length:320px_320px]">
            <p className="text-[30px] font-medium">Leaderboard</p>
            <p className="mt-4 text-gray-700 mb-2">Weekly Giveaway end in</p>
            <CountDown startTime={1687948015000} />
            <p className="mt-4 text-gray-700">Current Prizepool</p>
            <p className="gradientColor !leading-[60px] !text-[48px] font-semibold">
              10,000 SUI
            </p>
            <p className="text-gray-500">
              Learn more about prize table{" "}
              <span className="gradientColor">here.</span>
            </p>
            <ListRanking />
          </div>
        </div>
        <div className="mt-10 text-gray-900 p-8 h-[1056px] bg-white campaignboxshadow rounded-[18px]">
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
