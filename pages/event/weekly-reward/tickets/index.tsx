import SearchTicket from "../../../../src/components/molecules/SearchTicket";
import SelectWeek from "../../../../src/components/molecules/SelectWeek";
import Tabs from "../../../../src/components/molecules/Tabs";
import BaseComponent from "../../../../src/components/organisms/BaseComponent";

const Tickets = () => {
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
            />
            <SelectWeek />
            <SearchTicket />
          </div>
          <div className="mt-10  rounded-lg border-t border-2">
            <table className="w-full whitespace-pre-wrap ">
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
                <tr className="text-sm border-b">
                  <td className="px-6 py-4 text-gray-900">1</td>
                  <td className="px-6 py-4 text-gray-500">
                    0x6899c0803998f7d5b06...e1dcec4de16333be6a6cab86
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    00:00:00 26/06/2023
                  </td>
                </tr>
                <tr className="text-sm border-b">
                  <td className="px-6 py-4 text-gray-900">2</td>
                  <td className="px-6 py-4 text-gray-500">
                    0x6899c0803998f7d5b06...e1dcec4de16333be6a6cab86
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    00:00:00 26/06/2023
                  </td>
                </tr>
                <tr className="text-sm border-b">
                  <td className="px-6 py-4 text-gray-900">3</td>
                  <td className="px-6 py-4 text-gray-500">
                    0x6899c0803998f7d5b06...e1dcec4de16333be6a6cab86
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    00:00:00 26/06/2023
                  </td>
                </tr>
                <tr className="text-sm border-b">
                  <td className="px-6 py-4 text-gray-900">4</td>
                  <td className="px-6 py-4 text-gray-500">
                    0x6899c0803998f7d5b06...e1dcec4de16333be6a6cab86
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    00:00:00 26/06/2023
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Tickets;
