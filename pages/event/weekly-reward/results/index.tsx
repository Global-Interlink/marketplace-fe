import SearchTicket from "../../../../src/components/molecules/SearchTicket";
import SelectWeek from "../../../../src/components/molecules/SelectWeek";
import Tabs from "../../../../src/components/molecules/Tabs";
import BaseComponent from "../../../../src/components/organisms/BaseComponent";
import { useWallet } from "@suiet/wallet-kit";
import React from "react";
import { formatAddress } from "../../../../src/contract-abi/consts";
import dayjs from "dayjs";
import { createAxios } from "../../../../src/api/axiosWallet";
import Breadcrumbs from "../../../../src/components/molecules/Breadcrumb";
import { debounce } from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import { start } from "repl";
import * as jose from "jose";
import { Reward } from "../../../../src/components/organisms/ListReward";

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
interface Ticket {
  ticketId: number;
  walletAddress: string;
  ticketNumber: number;
  targetDate: string;
  createdAt: string;
  deletedAt?: string;
}

interface Meta {
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface Week {
  start: string;
  end: string;
  current?: boolean;
}

const Results = () => {
  const { address } = useWallet();
  const [meta, setMeta] = React.useState<Meta>();
  const [activeTab, setActiveTab] = React.useState("1");
  const [nextPage, setNextPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(false);
  const [week, setWeek] = React.useState<Week[]>();
  const [filterWeek, setFilterWeek] = React.useState<{
    start: string;
    end: string;
  }>();
  const [rewards, setRewards] = React.useState<Reward[]>([]); 
  const [rewardWeek, setRewardWeek] = React.useState<Week>();

  const api = createAxios();

  function formatDate (date: Date) {
    let d = new Date(date)  
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
  
    return `${year}-${month}-${day}`
  }

  const fetchData = async (keyword?: string) => {
    const params = {
      page: nextPage,
      ...(keyword ? { walletAddress: keyword } : {}),
      ...(rewardWeek
        ? { start: rewardWeek.start, end: rewardWeek.end }
        : {}),
    };

    setLoading(true);
    api
      .get<{ data: { data: Reward[] } }>("/win-prize/weekly-rewar", {
        params: params,
      })
      .then((res) => {
        setRewards(res.data.data.data);
        console.log(res.data.data.data);
        
        setLoading(false);
      });
    api
      .get<{ data: Week[] }>("/ticket/weekly?numberWeeks=5", {
        params: params,
      })
      .then((res) => {
        const { data } = res.data;
        const currentWeek = data.find((i) => formatDate(new Date(i?.start)) === formatDate(new Date(filterWeek?.start || '')));

        // const index = currentWeek ? data?.indexOf(currentWeek) : 0;
        // if (data[index]) {
        //   const week = data[index];
        //   setRewardWeek(week);
        // } else {
        //   setRewardWeek(currentWeek);
        // }
        // setRewardWeek(data[index]);
        setRewardWeek(currentWeek)
        setLoading(false);
      });
  };

  React.useEffect(() => {
    api.get<{ data: Week[] }>("/ticket/weekly?numberWeeks=4").then((res) => {
      setWeek(res.data.data);
    });
  }, []);

  const debounceSearch = React.useCallback(
    debounce((nextValue) => {
      if (nextValue.length === 0) {
        fetchData();
        return;
      }
      fetchData(nextValue);
    }, 1000),
    []
  );

  React.useEffect(() => {
    fetchData();
  }, [address, activeTab, nextPage, filterWeek]);

  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <Breadcrumbs
          breadcrumbs={[
            { title: "Event page", path: "/event" },
            { title: "Weekly Reward Results" },
          ]}
        />
        <div className="w-full md:max-w-5xl bg-white mx-auto campaignboxshadow rounded-lg py-8 px-6 md:px-[42px] text-[#101828] relative">
          <p className="text-[30px] font-medium">Weekly Reward Results</p>
          <div className="mt-4 flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0  lg:space-x-11">
            <Tabs
              activeKey={activeTab}
              items={[
                {
                  key: "1",
                  title: `Tier 1 (${
                    rewards
                      ? rewards.filter((i) => i.winPrizeOrder === 1).length
                      : 0
                  })`,
                },
                {
                  key: "2",
                  title: `Tier 2 (${
                    rewards
                      ? rewards.filter((i) => i.winPrizeOrder === 2).length
                      : 0
                  })`,
                },
                {
                  key: "3",
                  title: `Tier 3 (${
                    rewards
                      ? rewards.filter((i) => i.winPrizeOrder === 3).length
                      : 0
                  })`,
                },
              ]}
              onChangeKey={setActiveTab}
            />
            <SelectWeek
              week={week}
              onChangeWeek={(s, e) => {
                setFilterWeek({ start: s, end: e });
              }}
            />
            <SearchTicket
              onChangeText={(keyword) => {
                setNextPage(1);
                debounceSearch(keyword);
              }}
            />
          </div>
          <div className="mt-10  rounded-lg border-t border-2">
            <table className="w-full whitespace-pre-wrap block md:table overflow-x-auto">
              <thead className="bg-gray-50 text-[#667085]">
                <tr className="text-left">
                  <th
                    className={`px-6 py-2 font-normal text-xs rounded-tl-lg w-1/4
                    `}
                  >
                    Ticket No
                  </th>
                  <th
                    className={`px-6 py-2 font-normal text-xs w-2/4
                    `}
                  >
                    Wallet Address
                  </th>
                  <th
                    className={`px-6 py-2 font-normal text-xs w-1/4 text-center
                    `}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewards.filter((i) => i.winPrizeOrder === Number(activeTab)).map((i) => {
                  return (
                    <tr className="text-sm border-b" key={i.winPrizeId}>
                      <td className="px-6 py-4 text-[#101828]">
                        {i.ticketNumber}
                      </td>
                      <td className="px-6 py-4 text-[#667085]">
                        {formatAddress(i.walletAddress)}
                      </td>
                      <td className="px-6 py-4 text-[#667085] text-center">
                        {i.amount} SUI
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rewards.length === 0 && (
              <p className="text-sm p-4 text-center text-[#667085]">No data</p>
            )}
          </div>
          {meta?.pagination && meta?.pagination.totalPages > 1 && (
            <div className="text-sm text-[#344054] flex items-center justify-between mt-[28px]">
              <p>
                Page {meta?.pagination.currentPage} of{" "}
                {meta?.pagination.totalPages}
              </p>
              <div className="space-x-3">
                <button
                  className={`rounded-full border py-2 px-[14px] ${
                    meta?.pagination.currentPage === 1
                      ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (meta?.pagination.currentPage > 1) {
                      setNextPage(meta?.pagination.currentPage - 1);
                    }
                  }}
                >
                  Previous
                </button>
                <button
                  className={`rounded-full border py-2 px-[14px] ${
                    meta?.pagination.currentPage === meta?.pagination.totalPages
                      ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (
                      meta?.pagination.currentPage < meta?.pagination.totalPages
                    ) {
                      setNextPage(meta?.pagination.currentPage + 1);
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="absolute flex w-full h-full items-center justify-center bg-gray-100/50 top-0 left-0">
              <LoadingOutlined
                className="text-[#E23DCC]"
                style={{ fontSize: 40, fontWeight: 700 }}
                spin
              />
            </div>
          )}
        </div>
      </div>
    </BaseComponent>
  );
};
export default Results;
