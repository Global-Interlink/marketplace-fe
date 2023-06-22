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
const Tickets = () => {
  const { address } = useWallet();
  const [tickets, setTicketData] = React.useState<Ticket[]>([]);
  const [meta, setMeta] = React.useState<Meta>();
  const [activeTab, setActiveTab] = React.useState("1");
  const [nextPage, setNextPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(false);
  const [week, setWeek] = React.useState<Week[]>();
  const [filterWeek, setFilterWeek] = React.useState<{
    start: string;
    end: string;
  }>();

  const api = createAxios();

  const fetchData = async (keyword?: string) => {
    const params = {
      page: nextPage,
      ...(keyword ? { walletAddress: keyword } : {}),
      ...(filterWeek
        ? { startDate: filterWeek.start, endDate: filterWeek.end }
        : {}),
    };
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

  React.useEffect(() => {
    api.get<{ data: Week[] }>("/ticket/weekly").then((res) => {
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
  }, [address, activeTab, nextPage, filterWeek]);

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
                  title: "My tickets",
                },
                {
                  key: "2",
                  title: "All tickets",
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
            <table className="w-full whitespace-pre-wrap break-all">
              <thead className="bg-gray-50 text-[#667085]">
                <tr className="text-left">
                  <th className="px-6 py-2 font-normal text-xs rounded-tl-lg w-1/4">
                    Ticket No.
                  </th>
                  <th className="px-6 py-2 font-normal text-xs w-2/4">
                    Wallet Address
                  </th>
                  <th className="px-6 py-2 font-normal text-xs w-1/4">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((i) => {
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
