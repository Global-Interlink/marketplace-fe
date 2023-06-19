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

interface Ticket {
  ticketId: number;
  walletAddress: string;
  ticketNumber: number;
  targetDate: string;
  createdAt: string;
  deletedAt?: string;
}
const Tickets = () => {
  const { address } = useWallet();
  const [tickets, setTicketData] = React.useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = React.useState("1");
  const [keyWord, setKeyword] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const myTickets = React.useMemo(() => {
    if (activeTab === "1") {
      return address
        ? tickets.filter(
            (t) => t.walletAddress.toLowerCase() === address.toLowerCase()
          )
        : [];
    }
    return tickets;
  }, [tickets, address, activeTab]);
  const filteredData = myTickets.filter((t) =>
    t.walletAddress.toLowerCase().includes(keyWord.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const api = createAxios();
  const fetchData = async () => {
    api.get<{ data: { data: Ticket[] } }>("/ticket/all/ticket").then((res) => {
      setTicketData(res.data.data.data);
    });
  };

  React.useEffect(() => {
    fetchData();
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
        <div className="w-full md:max-w-5xl bg-white mx-auto campaignboxshadow rounded-lg py-8 px-6 md:px-[42px] text-gray-900">
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
            <SelectWeek />
            <SearchTicket
              onChangeText={(keyword) => {
                setKeyword(keyword);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="mt-10  rounded-lg border-t border-2">
            <table className="w-full whitespace-pre-wrap break-all">
              <thead className="bg-gray-50 text-gray-500">
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
                {currentItems.map((i) => {
                  return (
                    <tr className="text-sm border-b" key={i.ticketId}>
                      <td className="px-6 py-4 text-gray-900">
                        {i.ticketNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatAddress(i.walletAddress)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {dayjs(i.createdAt).format("HH:mm:ss YYYY-MM-DD")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {activeTab === "1" && !address && (
              <p className="text-sm p-4 text-center text-gray-500">
                Please connect wallet
              </p>
            )}
            {currentItems.length === 0 && (
              <p className="text-sm p-4 text-center text-gray-500">No data</p>
            )}
          </div>
          {totalPages > 1 && (
            <div className="text-sm text-gray-700 flex items-center justify-between mt-[28px]">
              <p>
                Page {currentPage} of {totalPages}
              </p>
              <div className="space-x-3">
                <button
                  className={`rounded-full border py-2 px-[14px] ${
                    currentPage === 1
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                >
                  Previous
                </button>
                <button
                  className={`rounded-full border py-2 px-[14px] ${
                    currentPage === totalPages
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseComponent>
  );
};
export default Tickets;
