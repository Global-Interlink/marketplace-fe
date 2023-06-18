import axios from "axios";
import SearchTicket from "../../../../src/components/molecules/SearchTicket";
import SelectWeek from "../../../../src/components/molecules/SelectWeek";
import Tabs from "../../../../src/components/molecules/Tabs";
import BaseComponent from "../../../../src/components/organisms/BaseComponent";
import { useWallet } from "@suiet/wallet-kit";
import React from "react";
import { formatAddress } from "../../../../src/contract-abi/consts";
import dayjs from "dayjs";

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
  const api = axios.create({
    baseURL: `http://210.245.74.41:3030/main/v1`,
    headers: {
      "Content-Type": "application/json",
      // Authorization: token,
    },
  });
  const fetchData = async () => {
    api.get<{ data: { data: Ticket[] } }>("/ticket/all/ticket").then((res) => {
      setTicketData(res.data.data.data);
    });
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  const myTickets = React.useMemo(() => {
    return address
      ? tickets.filter(
          (t) => t.walletAddress.toLowerCase() === address.toLowerCase()
        )
      : [];
  }, [tickets, address]);
  const renderMyTickets = () => {
    return myTickets?.map((i) => {
      return (
        <tr className="text-sm border-b" key={i.ticketId}>
          <td className="px-6 py-4 text-gray-900">{i.ticketNumber}</td>
          <td className="px-6 py-4 text-gray-500">
            {formatAddress(i.walletAddress)}
          </td>
          <td className="px-6 py-4 text-gray-500">{i.createdAt}</td>
        </tr>
      );
    });
  };
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="w-full md:max-w-5xl bg-white mx-auto campaignboxshadow rounded-lg py-8 px-6 md:px-[42px] text-gray-900">
          <p className="text-[30px] font-medium">Weekly Reward Tickets</p>
          <div className="mt-4 flex items-center space-x-11">
            <Tabs
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
            <SearchTicket />
          </div>
          <div className="mt-10  rounded-lg border-t border-2">
            <table className="w-full whitespace-pre-wrap break-all">
              <thead className="bg-gray-50 text-gray-500">
                <tr className="text-left">
                  <th className="px-6 py-2 font-normal text-xs rounded-tl-lg">
                    Ticket No.
                  </th>
                  <th className="px-6 py-2 font-normal text-xs">
                    Wallet Address
                  </th>
                  <th className="px-6 py-2 font-normal text-xs">Created</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "1" && renderMyTickets()}
                {activeTab === "2" &&
                  tickets.map((i) => {
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
            {activeTab === "1" && myTickets.length === 0 && (
              <p className="text-sm p-4 text-center text-gray-500">No data</p>
            )}
            {activeTab === "2" && tickets.length === 0 && (
              <p className="text-sm p-4 text-center text-gray-500">No data</p>
            )}
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Tickets;
