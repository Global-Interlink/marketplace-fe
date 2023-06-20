import Breadcrumbs from "../../../src/components/molecules/Breadcrumb";
import BaseComponent from "../../../src/components/organisms/BaseComponent";

const Prize = () => {
  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
      <Breadcrumbs
          breadcrumbs={[
            { title: "Event page", path: "/event" },
            { title: "Prize" },
          ]}
        />
        <div className="w-full lg:w-[686px] bg-white mx-auto campaignboxshadow rounded-lg py-8 px-6 md:px-[42px] text-[#101828]">
          <p className="text-[30px] font-medium">Prize Table</p>
          <p className="text-sm text-[#98A2B3]">Last modified: 13/6/2023</p>
          <div className="mt-10  rounded-lg border-t border-2">
            <table className="w-full whitespace-pre-wrap ">
              <thead className="bg-gray-50 text-[#667085]">
                <tr className="text-left">
                  <th className="px-6 py-2 font-normal text-xs rounded-tl-lg">
                    Pool
                  </th>
                  <th className="px-6 py-2 font-normal text-xs">
                    No. Of Winner
                  </th>
                  <th className="px-6 py-2 font-normal text-xs">
                    Detail Reward
                  </th>
                  <th className="px-6 py-2 font-normal text-xs rounded-tr-lg">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm border-b">
                  <td className="px-6 py-2">{"> 100 SUI"}</td>
                  <td className="px-6 py-2 text-[#667085]">16</td>
                  <td className="px-6 py-2">
                    {
                      "Tier 1: 2 x 14 SUI\nTier 2: 2 x 5 SUI\nTier 3: 12 x 2 SUI"
                    }
                  </td>
                  <td className="px-6 py-2 text-[#667085]">62 SUI</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-2">{"> 500 SUI"}</td>
                  <td className="px-6 py-2 text-[#667085]">60</td>
                  <td className="px-6 py-2">
                    {
                     "Tier 1: 5 x 20 SUI\nTier 2: 5 x 10 SUI\nTier 3: 50 x 2 SUI"
                    }
                  </td>
                  <td className="px-6 py-2 text-[#667085]">250 SUI</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-2">{"> 2000 SUI"}</td>
                  <td className="px-6 py-2 text-[#667085]">130</td>
                  <td className="px-6 py-2">
                    {
                      "Tier 1: 10 x 20 SUI\nTier 2: 20 x 10 SUI\nTier 3: 100 x 2 SUI"
                    }
                  </td>
                  <td className="px-6 py-2 text-[#667085]">650 SUI</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-2">{"> 5000 SUI"}</td>
                  <td className="px-6 py-2 text-[#667085]">300</td>
                  <td className="px-6 py-2">
                    {
                      "Tier 1: 20 x 30 SUI\nTier 2: 30 x 15 SUI\nTier 3: 250 x 2 SUI"
                    }
                  </td>
                  <td className="px-6 py-2 text-[#667085]">1,550 SUI</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-2">{"> 10,000 SUI"}</td>
                  <td className="px-6 py-2 text-[#667085]">500</td>
                  <td className="px-6 py-2">
                    {
                      "Tier 1: 40 x 30 SUI\nTier 2: 60 x 15 SUI\nTier 3: 400 x 3 SUI"
                    }
                  </td>
                  <td className="px-6 py-2 text-[#667085]">3,600 SUI</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-2">{"> 20,000 SUI"}</td>
                  <td className="px-6 py-2 text-[#667085]">640</td>
                  <td className="px-6 py-2">
                    {
                      "Tier 1: 60 x 40 SUI\nTier 2: 80 x 20 SUI\nTier 3: 500 x 4 SUI"
                    }
                  </td>
                  <td className="px-6 py-2 text-[#667085]">6,500 SUI</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-2">{"> 50,000 SUI"}</td>
                  <td className="px-6 py-2 text-[#667085]">1,700</td>
                  <td className="px-6 py-2">
                    {
                     "Tier 1: 120 x 40 SUI\nTier 2: 160 x 20 SUI\nTier 3: 1500 x 5 SUI"
                    }
                  </td>
                  <td className="px-6 py-2 text-[#667085]">15,500 SUI</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};
export default Prize;
