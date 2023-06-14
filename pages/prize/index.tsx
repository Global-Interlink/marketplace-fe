import BaseComponent from "../../src/components/organisms/BaseComponent";

const Prize = () => {
  return (
    <BaseComponent>
      <div className="w-full lg:w-[686px] bg-white mx-auto campaignboxshadow rounded-lg py-8 px-6 md:px-[42px] text-gray-900">
        <p className="text-[30px] font-medium">Prize Table</p>
        <p className="text-sm text-gray-400">Last modified: 13/6/2023</p>
        <div className="mt-10  rounded-lg border-t border-2">
          <table className="w-full whitespace-pre-wrap ">
            <thead className="bg-gray-50 text-gray-500">
              <tr className="text-left">
                <th className="px-6 py-2 font-normal text-xs rounded-tl-lg">
                  Pool
                </th>
                <th className="px-6 py-2 font-normal text-xs">No. Of Winner</th>
                <th className="px-6 py-2 font-normal text-xs">Detail Reward</th>
                <th className="px-6 py-2 font-normal text-xs rounded-tr-lg">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm border-b">
                <td className="px-6 py-2">{"> 100 SUI"}</td>
                <td className="px-6 py-2 text-gray-500">16</td>
                <td className="px-6 py-2">
                  {"Tier 1: 2 x 14 SUI\nTier 2: 2 x 5 SUI\nTier 3: 12 x 2 SUI"}
                </td>
                <td className="px-6 py-2 text-gray-500">62 SUI</td>
              </tr>
              <tr className="text-sm">
                <td className="px-6 py-2">{"> 100 SUI"}</td>
                <td className="px-6 py-2 text-gray-500">16</td>
                <td className="px-6 py-2">
                  {"Tier 1: 2 x 14 SUI\nTier 2: 2 x 5 SUI\nTier 3: 12 x 2 SUI"}
                </td>
                <td className="px-6 py-2 text-gray-500">62 SUI</td>
              </tr>
              <tr className="text-sm">
                <td className="px-6 py-2">{"> 100 SUI"}</td>
                <td className="px-6 py-2 text-gray-500">16</td>
                <td className="px-6 py-2">
                  {"Tier 1: 2 x 14 SUI\nTier 2: 2 x 5 SUI\nTier 3: 12 x 2 SUI"}
                </td>
                <td className="px-6 py-2 text-gray-500">62 SUI</td>
              </tr>
              <tr className="text-sm">
                <td className="px-6 py-2">{"> 100 SUI"}</td>
                <td className="px-6 py-2 text-gray-500">16</td>
                <td className="px-6 py-2">
                  {"Tier 1: 2 x 14 SUI\nTier 2: 2 x 5 SUI\nTier 3: 12 x 2 SUI"}
                </td>
                <td className="px-6 py-2 text-gray-500">62 SUI</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Prize;
