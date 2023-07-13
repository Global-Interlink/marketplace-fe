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
import { useRouter } from "next/router";
import { NUMBER_OF_WEEK } from "../../../../src/api/constants";

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
interface LeaderBoard {
  no: number;
  numberTickets: string;
  percent: string;
  walletAddress: string;
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

const Tickets = () => {
  const { address } = useWallet();
  const router = useRouter();
  const [allTickets, setAllTicketData] = React.useState<Ticket[]>([]);
  const [userTickets, setUserTicketData] = React.useState<Ticket[]>([]);
  const [userMeta, setUserMeta] = React.useState<Meta>();
  const [allMeta, setAllMeta] = React.useState<Meta>();
  const [leaderBoardMeta, setLeaderBoardMeta] = React.useState<Meta>();
  const [activeTab, setActiveTab] = React.useState("1");
  const [nextPage, setNextPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(false);
  const [week, setWeek] = React.useState<Week[]>();
  const [leaderBoard, setLeaderBoard] = React.useState<LeaderBoard[]>();
  const [filterWeek, setFilterWeek] = React.useState<{
    start: string;
    end: string;
  }>();
  const [keyword, setKeyword] = React.useState("");

  const onChangeTab = (tabId: string) => {
    setActiveTab(tabId);
    setNextPage(1);
    if (keyword) {
      fetchAllData(keyword);
      fetchDataLeaderBoard(keyword);
    } else {
      fetchAllData();
      fetchDataLeaderBoard();
    }
  };

  const onChangeWeek = (s: string, e: string) => {
    setFilterWeek({ start: s, end: e });
    setNextPage(1);
  };

  const api = createAxios();

  const fetchWeekData = async () => {
    await api
      .get<{ data: Week[] }>(`/ticket/weekly?numberWeeks=${NUMBER_OF_WEEK}`)
      .then((res) => {
        const { data } = res.data;
        setWeek(data);
        setFilterWeek({
          start: data[0].start,
          end: data[0].end,
        });
      });
  };

  const fetchUserData = async () => {
    const params = {
      page: nextPage,
      walletAddress: address,
      startDate: filterWeek?.start,
      endDate: filterWeek?.end,
    };

    setLoading(true);
    await api
      .get<{ data: { data: Ticket[]; meta: Meta } }>("/ticket/all/ticket", {
        params: params,
      })
      .then((res) => {
        const { data } = res.data;
        setUserTicketData(data.data);
        setUserMeta(data.meta);
      })
      .catch(() => {
        setUserTicketData([]);
        setUserMeta(undefined);
        setLoading(false);
      });
  };

  const fetchAllData = async (keyword?: string) => {
    const params = {
      page: nextPage,
      walletAddress: keyword || "",
      startDate: filterWeek?.start || "",
      endDate: filterWeek?.end || "",
    };

    setLoading(true);
    await api
      .get<{ data: { data: Ticket[]; meta: Meta } }>("/ticket/all/ticket", {
        params: params,
      })
      .then((res) => {
        const { data } = res.data;
        setAllTicketData(data.data);
        setAllMeta(data.meta);
        setLoading(false);
      })
      .catch((e) => {
        setAllTicketData([]);
        setAllMeta(undefined);
        setLoading(false);
      });
  };

  const fetchDataLeaderBoard = async (keyword?: string) => {
    const api = createAxios();

    const params = {
      page: nextPage,
      walletAddress: keyword,
      startDate: filterWeek?.start,
      endDate: filterWeek?.end,
    };

    setLoading(true);
    await api
      .get<{
        data: {
          leaderboard: LeaderBoard[];
          meta: Meta;
          numberTicketsMySelf: string;
          totalTickets: string;
        };
      }>("/ticket/leaderboard/all", {
        params: params,
      })
      .then((res) => {
        const { data } = res.data;
        setLeaderBoard(data.leaderboard);
        setLeaderBoardMeta(data.meta);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLeaderBoard([]);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchWeekData();
  }, []);

  const debounceSearch = React.useCallback(
    debounce((nextValue) => {
      if (activeTab === "1") {
        return;
      }
      if (nextValue.length === 0) {
        fetchAllData();
        fetchDataLeaderBoard();
        return;
      }
      fetchAllData(nextValue);
      fetchDataLeaderBoard(nextValue);
    }, 1000),
    [activeTab, filterWeek]
  );

  React.useEffect(() => {
    if (!address && !keyword) {
      setUserTicketData([]);
      setUserMeta(undefined);
    } else {
      fetchUserData();
    }

    if (keyword) {
      fetchAllData(keyword);
      fetchDataLeaderBoard(keyword);
    } else {
      fetchAllData();
      fetchDataLeaderBoard();
    }
  }, [address, nextPage, filterWeek]);

  React.useEffect(() => {
    if (router.query.tab === "3") {
      setActiveTab("3");
    }
  }, []);

  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <Breadcrumbs
          breadcrumbs={[
            { title: "Event page", path: "/event" },
            { title: "Weekly Reward Tickets" },
          ]}
        />
        <div className="w-full md:max-w-5xl bg-white mx-auto campaignboxshadow rounded-lg py-8 px-6 md:px-[42px] text-[#101828] relative">
          <p className="text-[30px] font-medium">Weekly Reward Tickets</p>
          <div className="mt-4 flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0  lg:space-x-11">
            <Tabs
              activeKey={activeTab}
              items={[
                {
                  key: "1",
                  title: `You (${userMeta?.pagination.total || 0})`,
                },
                {
                  key: "2",
                  title: `All (${allMeta?.pagination.total || 0})`,
                },
                {
                  key: "3",
                  title: `Leaderboard`,
                },
              ]}
              onChangeKey={onChangeTab}
            />
            <SelectWeek
              week={week}
              onChangeWeek={(s, e) => onChangeWeek(s, e)}
            />
            <SearchTicket
              onChangeText={(keyword) => {
                setKeyword(keyword);
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
                    className={`px-6 py-2 font-normal text-xs rounded-tl-lg ${
                      activeTab === "3" ? "w-1/5" : "w-1/4"
                    }`}
                  >
                    {activeTab === "3" ? "Rank" : "Ticket No."}
                  </th>
                  <th
                    className={`px-6 py-2 font-normal text-xs ${
                      activeTab === "3" ? "w-2/5" : "w-2/4"
                    }`}
                  >
                    Wallet Address
                  </th>
                  {activeTab === "3" ? (
                    <>
                      <th className="px-6 py-2 font-normal text-xs w-1/5">
                        Total Ticket
                      </th>
                      <th className="px-6 py-2 font-normal text-xs w-1/5">
                        Ratio
                      </th>
                    </>
                  ) : (
                    <th className="px-6 py-2 font-normal text-xs w-1/4">
                      Created
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === "3"
                  ? leaderBoard?.map((i) => {
                      return (
                        <tr className="text-sm border-b" key={i.no}>
                          <td className="px-6 py-4 text-[#101828]">{i.no}</td>
                          <td className="px-6 py-4 text-[#667085]">
                            {formatAddress(i.walletAddress)}
                          </td>
                          <td className="px-6 py-4 text-[#667085]">
                            {i.numberTickets}
                          </td>
                          <td className="px-6 py-4 text-[#667085]">
                            {i.percent}
                          </td>
                        </tr>
                      );
                    })
                  : activeTab === "1"
                  ? userTickets.map((i) => {
                      return (
                        <tr className="text-sm border-b" key={i.ticketId}>
                          <td className="px-6 py-4 text-[#101828]">
                            {i.ticketNumber}
                          </td>
                          <td className="px-6 py-4 text-[#667085]">
                            {formatAddress(i.walletAddress)}
                          </td>
                          <td className="px-6 py-4 text-[#667085]">
                            {dayjs(i.createdAt).format("HH:mm:ss YYYY-MM-DD")}
                          </td>
                        </tr>
                      );
                    })
                  : allTickets.map((i) => {
                      return (
                        <tr className="text-sm border-b" key={i.ticketId}>
                          <td className="px-6 py-4 text-[#101828]">
                            {i.ticketNumber}
                          </td>
                          <td className="px-6 py-4 text-[#667085]">
                            {formatAddress(i.walletAddress)}
                          </td>
                          <td className="px-6 py-4 text-[#667085]">
                            {dayjs(i.createdAt).format("HH:mm:ss YYYY-MM-DD")}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
            {activeTab === "1" && !address && (
              <p className="text-sm p-4 text-center text-[#667085]">
                Please connect wallet
              </p>
            )}
            {(activeTab === "1" && userTickets?.length === 0) ||
            (activeTab === "2" && allTickets?.length === 0) ||
            (activeTab === "3" && leaderBoard?.length === 0) ? (
              <p className="text-sm p-4 text-center text-[#667085]">No data</p>
            ) : null}
          </div>
          {Number(activeTab) === 1 &&
            userMeta?.pagination &&
            userMeta?.pagination.totalPages > 1 && (
              <div className="text-sm text-[#344054] flex items-center justify-between mt-[28px]">
                <p>
                  Page {userMeta?.pagination.currentPage} of{" "}
                  {userMeta?.pagination.totalPages}
                </p>
                <div className="space-x-3">
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      userMeta?.pagination.currentPage === 1
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (userMeta?.pagination.currentPage > 1) {
                        setNextPage(userMeta?.pagination.currentPage - 1);
                      }
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      userMeta?.pagination.currentPage ===
                      userMeta?.pagination.totalPages
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        userMeta?.pagination.currentPage <
                        userMeta?.pagination.totalPages
                      ) {
                        setNextPage(userMeta?.pagination.currentPage + 1);
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          {Number(activeTab) === 2 &&
            allMeta?.pagination &&
            allMeta?.pagination.totalPages > 1 && (
              <div className="text-sm text-[#344054] flex items-center justify-between mt-[28px]">
                <p>
                  Page {allMeta?.pagination.currentPage} of{" "}
                  {allMeta?.pagination.totalPages}
                </p>
                <div className="space-x-3">
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      allMeta?.pagination.currentPage === 1
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (allMeta?.pagination.currentPage > 1) {
                        setNextPage(allMeta?.pagination.currentPage - 1);
                      }
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      allMeta?.pagination.currentPage ===
                      allMeta?.pagination.totalPages
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        allMeta?.pagination.currentPage <
                        allMeta?.pagination.totalPages
                      ) {
                        setNextPage(allMeta?.pagination.currentPage + 1);
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          {Number(activeTab) === 3 &&
            leaderBoardMeta?.pagination &&
            leaderBoardMeta?.pagination.totalPages > 1 && (
              <div className="text-sm text-[#344054] flex items-center justify-between mt-[28px]">
                <p>
                  Page {leaderBoardMeta?.pagination.currentPage} of{" "}
                  {leaderBoardMeta?.pagination.totalPages}
                </p>
                <div className="space-x-3">
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      leaderBoardMeta?.pagination.currentPage === 1
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (leaderBoardMeta?.pagination.currentPage > 1) {
                        setNextPage(
                          leaderBoardMeta?.pagination.currentPage - 1
                        );
                      }
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      leaderBoardMeta?.pagination.currentPage ===
                      leaderBoardMeta?.pagination.totalPages
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        leaderBoardMeta?.pagination.currentPage <
                        leaderBoardMeta?.pagination.totalPages
                      ) {
                        setNextPage(
                          leaderBoardMeta?.pagination.currentPage + 1
                        );
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
export default Tickets;
