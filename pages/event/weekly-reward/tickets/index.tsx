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
  const numberOfWeek = 1;
  const { address } = useWallet();
  const [tickets, setTicketData] = React.useState<Ticket[]>([]);
  const [meta, setMeta] = React.useState<Meta>();
  const [activeTab, setActiveTab] = React.useState("1");
  const [nextPage, setNextPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(false);
  const [week, setWeek] = React.useState<Week[]>();
  const [myTickets, setMyTickets] = React.useState<string>();
  const [allTickets, setAllTickets] = React.useState<string>();
  const [leaderBoard, setLeaderBoard] = React.useState<LeaderBoard[]>();
  const [filterWeek, setFilterWeek] = React.useState<{
    start: string;
    end: string;
  }>();

  const api = createAxios();

  const fetchData = async (keyword?: string) => {
    const params = {
      page: nextPage,
      walletAddress: keyword ? keyword : "",
      startDate: filterWeek?.start + " 00:00:00",
      endDate: filterWeek?.end + " 23:59:59",
    };
    console.log("params", params);

    setLoading(true);
    api
      .get<{ data: { data: Ticket[]; meta: Meta } }>("/ticket/all/ticket", {
        params: params,
      })
      .then((res) => {
        setTicketData(res.data.data.data);
        setMeta(res.data.data.meta);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setTicketData([]);
        setMeta(undefined);
        setLoading(false);
      });
  };

  const fetchDataLeaderBoard = async (keyword?: string) => {
    if (!address) {
      return;
    }
    const token = await getAccessToken(address);
    const api = createAxios(token);
    // console.log("filterWeek", filterWeek);

    const params = {
      page: nextPage,
      walletAddress: keyword ? keyword : address,
      startDate: filterWeek?.start + " 00:00:00",
      endDate: filterWeek?.end + " 23:59:59",
    };

    // const params = {
    //   page: nextPage,
    //   walletAddress: keyword,
    //   start: filterWeek?.start,
    //   end: filterWeek?.end,
    // };

    // .get<{ data: { data: Reward[] } }>(/win-prize/weekly-rewar?start=${params.start}&end=${params.end}&page=${params.page}&limit=10&orderPrize=${params.orderPrize})

    setLoading(true);
    api
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
        setMyTickets(res.data.data.numberTicketsMySelf);
        setAllTickets(res.data.data.totalTickets);
        setLeaderBoard(res.data.data.leaderboard);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    api
      .get<{ data: Week[] }>(`/ticket/weekly?numberWeeks=${numberOfWeek}`)
      .then((res) => {
        // console.log("res", res);

        setWeek(res.data.data);
        setFilterWeek({
          start: dayjs(res.data.data[0].start).format("YYYY-MM-DD"),
          end: dayjs(res.data.data[0].end).format("YYYY-MM-DD"),
        });
      });
  }, []);

  const debounceSearch = React.useCallback(
    debounce((nextValue) => {
      console.log("activeTab", activeTab);

      if (activeTab === "1") return;
      if (nextValue.length === 0) {
        fetchData();
        fetchDataLeaderBoard();
        return;
      }
      fetchData(nextValue);
      fetchDataLeaderBoard(nextValue);
    }, 1000),
    []
  );

  React.useEffect(() => {
    if (activeTab === "1") {
      if (!address) {
        setTicketData([]);
        setMeta(undefined);
      } else {
        fetchData(address);
      }
    } else {
      fetchData();
    }
    fetchDataLeaderBoard();
  }, [address, activeTab, nextPage, filterWeek]);

  // console.log("leaderBoard", leaderBoard);
  // console.log("week", week);

  console.log("filterWeek", filterWeek);

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
                  title: `You (${myTickets ? myTickets : 0})`,
                },
                {
                  key: "2",
                  title: `All (${allTickets ? allTickets : 0})`,
                },
                {
                  key: "3",
                  title: `Leaderboard`,
                },
              ]}
              onChangeKey={setActiveTab}
            />
            <SelectWeek
              week={week}
              numberOfWeek={numberOfWeek}
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
                  : tickets.map((i) => {
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
            {tickets.length === 0 && (
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
export default Tickets;
