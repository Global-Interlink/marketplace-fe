import SearchTicket from "../../../../src/components/molecules/SearchTicket";
import SelectWeek from "../../../../src/components/molecules/SelectWeek";
import Tabs from "../../../../src/components/molecules/Tabs";
import BaseComponent from "../../../../src/components/organisms/BaseComponent";
import { useWallet } from "@suiet/wallet-kit";
import React, { useEffect } from "react";
import { formatAddress } from "../../../../src/contract-abi/consts";
import dayjs from "dayjs";
import { createAxios } from "../../../../src/api/axiosWallet";
import Breadcrumbs from "../../../../src/components/molecules/Breadcrumb";
import { debounce } from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import { start } from "repl";
import * as jose from "jose";
import { useRouter } from "next/router";

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

interface Meta {
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface Rewards {
  winPrizeId: number;
  walletAddress: string;
  currency: string;
  amount: number;
  winPrizeOrder: number;
  ticketNumber: number;
  targetDate: string;
  meta?: Meta;
}

export interface Week {
  start: string;
  end: string;
  current?: boolean;
}

const Results = () => {
  const { address } = useWallet();
  const router = useRouter();
  const metaData = {
    pagination: {
      currentPage: 1,
      total: 0,
      limit: 10,
      totalPages: 1,
    },
  };
  const [meta1, setMeta1] = React.useState<Meta>();
  const [meta2, setMeta2] = React.useState<Meta>();
  const [meta3, setMeta3] = React.useState<Meta>();
  const [activeTab, setActiveTab] = React.useState("1");
  const [nextPage, setNextPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(false);
  const [week, setWeek] = React.useState<Week[]>();
  const [filterWeek, setFilterWeek] = React.useState<{
    start: string;
    end: string;
  }>();
  const [rewards1, setRewards1] = React.useState<Rewards[]>([]);
  const [rewards2, setRewards2] = React.useState<Rewards[]>([]);
  const [rewards3, setRewards3] = React.useState<Rewards[]>([]);
  const [rewardWeek, setRewardWeek] = React.useState<Week>();
  const [seeMore, setSeeMore] = React.useState(false);

  const api = createAxios();

  function formatDate(date: Date) {
    let d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const onChangeTab = (tabId: string) => {
    setActiveTab(tabId);
    setNextPage(1);
  };

  const handleChangeWeek = (s: string, e: string) => {
    setNextPage(1);
    setFilterWeek({ start: s, end: e });
  };

  const fetchData = async (keyword?: string) => {
    let seeMoreWeek: any;

    await api
      .get<{ data: Week[] }>("/ticket/weekly?numberWeeks=1")
      .then((res) => {
        const { data } = res.data;
        const currentWeek = data.find(
          (i) =>
            formatDate(new Date(i?.start)) ===
            formatDate(new Date(filterWeek?.start || ""))
        );
        seeMoreWeek = seeMore
          ? data.length > 1
            ? data[1]
            : data[0]
          : currentWeek;
        if (seeMore) {
          handleChangeWeek(seeMoreWeek?.start, seeMoreWeek?.end);
        }
      });

    const params = {
      page: nextPage,
      walletAddress: keyword,
      start: filterWeek?.start,
      end: filterWeek?.end,
    };

    api
      .get<{ data: any }>(
        `/win-prize/weekly-rewar?start=${params.start}&end=${params.end}&page=${
          params.page
        }&orderPrize=${1}`
      )
      .then((res) => {
        setMeta1(res.data.data?.meta);
        setRewards1(res.data.data.data);
        setLoading(false);
        setSeeMore(false);
      })
      .catch((e) => {
        setRewards1([]);
        setMeta1(metaData);
        setSeeMore(false);
      });

    api
      .get<{ data: any }>(
        `/win-prize/weekly-rewar?start=${params.start}&end=${params.end}&page=${
          params.page
        }&orderPrize=${2}`
      )
      .then((res) => {
        setMeta2(res.data.data?.meta);
        setRewards2(res.data.data.data);
        setLoading(false);
        setSeeMore(false);
      })
      .catch(() => {
        setRewards2([]);
        setMeta2(metaData);
        setSeeMore(false);
      });

    api
      .get<{ data: any }>(
        `/win-prize/weekly-rewar?start=${params.start}&end=${params.end}&page=${
          params.page
        }&orderPrize=${3}`
      )
      .then((res) => {
        setMeta3(res.data.data?.meta);
        setRewards3(res.data.data.data);
        setLoading(false);
        setSeeMore(false);
      })
      .catch(() => {
        setRewards3([]);
        setMeta3(metaData);
        setSeeMore(false);
      });
    // api
    //   .get<{ data: { data: Rewards[] } }>(
    //     `/win-prize/weekly-rewar?start=${
    //       "2023-06-26 00:00:00" || params.start
    //     }&end=${"2023-07-02 23:59:59" || params.end}&page=${
    //       params.page
    //     }&limit=10&orderPrize=${1}`
    //   )
    //   .then((res) => {
    //     setRewards1(res.data.data.data);
    //     setLoading(false);
    //   });
    // api
    //   .get<{ data: { data: Rewards[] } }>(
    //     `/win-prize/weekly-rewar?start=${
    //       "2023-06-26 00:00:00" || params.start
    //     }&end=${"2023-07-02 23:59:59" || params.end}&page=${
    //       params.page
    //     }&limit=10&orderPrize=${2}`
    //   )
    //   .then((res) => {
    //     setRewards2(res.data.data.data);
    //     setLoading(false);
    //   });
    // api
    //   .get<{ data: { data: Rewards[] } }>(
    //     `/win-prize/weekly-rewar?start=${
    //       "2023-06-26 00:00:00" || params.start
    //     }&end=${"2023-07-02 23:59:59" || params.end}&page=${
    //       params.page
    //     }&limit=10&orderPrize=${3}`
    //   )
    //   .then((res) => {
    //     setRewards3(res.data.data.data);
    //     setLoading(false);
    //   });
    setLoading(false);
  };

  React.useEffect(() => {
    api.get<{ data: Week[] }>(`/ticket/weekly?numberWeeks=${1}`).then((res) => {
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
  }, [address, nextPage, filterWeek]);

  React.useEffect(() => {
    if (router.query.rank === "") return;
    setSeeMore(true);
    switch (router.query.rank) {
      case "gold":
        return setActiveTab("1");
      case "silver":
        return setActiveTab("2");
      case "bronze":
        return setActiveTab("3");
      default:
        return setActiveTab("1");
    }
  }, [router.query]);

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
                  title: `Tier 1 (${meta1 ? meta1.pagination.total : 0})`,
                },
                {
                  key: "2",
                  title: `Tier 2 (${meta2 ? meta2.pagination.total : 0})`,
                },
                {
                  key: "3",
                  title: `Tier 3 (${meta3 ? meta3.pagination.total : 0})`,
                },
              ]}
              onChangeKey={onChangeTab}
            />
            <SelectWeek
              week={week}
              onChangeWeek={(s, e) => handleChangeWeek(s, e)}
              numberOfWeek={0}
              seeMore={seeMore}
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
                {Number(activeTab) === 1 &&
                  rewards1 &&
                  rewards1.map((i) => {
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
                {Number(activeTab) === 2 &&
                  rewards2 &&
                  rewards2.map((i) => {
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
                {Number(activeTab) === 3 &&
                  rewards3 &&
                  rewards3.map((i) => {
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
            {Number(activeTab) === 1 && rewards1.length === 0 && (
              <p className="text-sm p-4 text-center text-[#667085]">No data</p>
            )}
            {Number(activeTab) === 2 && rewards2.length === 0 && (
              <p className="text-sm p-4 text-center text-[#667085]">No data</p>
            )}
            {Number(activeTab) === 3 && rewards3.length === 0 && (
              <p className="text-sm p-4 text-center text-[#667085]">No data</p>
            )}
          </div>
          {Number(activeTab) === 1 &&
            meta1?.pagination &&
            meta1?.pagination.totalPages > 1 && (
              <div className="text-sm text-[#344054] flex items-center justify-between mt-[28px]">
                <p>
                  Page {meta1?.pagination.currentPage} of{" "}
                  {meta1?.pagination.totalPages}
                </p>
                <div className="space-x-3">
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      meta1?.pagination.currentPage === 1
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (meta1?.pagination.currentPage > 1) {
                        setNextPage(meta1?.pagination.currentPage - 1);
                      }
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      meta1?.pagination.currentPage ===
                      meta1?.pagination.totalPages
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        meta1?.pagination.currentPage <
                        meta1?.pagination.totalPages
                      ) {
                        setNextPage(meta1?.pagination.currentPage + 1);
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          {Number(activeTab) === 2 &&
            meta2?.pagination &&
            meta2?.pagination.totalPages > 1 && (
              <div className="text-sm text-[#344054] flex items-center justify-between mt-[28px]">
                <p>
                  Page {meta2?.pagination.currentPage} of{" "}
                  {meta2?.pagination.totalPages}
                </p>
                <div className="space-x-3">
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      meta2?.pagination.currentPage === 1
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (meta2?.pagination.currentPage > 1) {
                        setNextPage(meta2?.pagination.currentPage - 1);
                      }
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      meta2?.pagination.currentPage ===
                      meta2?.pagination.totalPages
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        meta2?.pagination.currentPage <
                        meta2?.pagination.totalPages
                      ) {
                        setNextPage(meta2?.pagination.currentPage + 1);
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          {Number(activeTab) === 3 &&
            meta3?.pagination &&
            meta3?.pagination.totalPages > 1 && (
              <div className="text-sm text-[#344054] flex items-center justify-between mt-[28px]">
                <p>
                  Page {meta3?.pagination.currentPage} of{" "}
                  {meta3?.pagination.totalPages}
                </p>
                <div className="space-x-3">
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      meta3?.pagination.currentPage === 1
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (meta3?.pagination.currentPage > 1) {
                        setNextPage(meta3?.pagination.currentPage - 1);
                      }
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className={`rounded-full border py-2 px-[14px] ${
                      meta3?.pagination.currentPage ===
                      meta3?.pagination.totalPages
                        ? "bg-gray-50 text-[#98A2B3] cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        meta3?.pagination.currentPage <
                        meta3?.pagination.totalPages
                      ) {
                        setNextPage(meta3?.pagination.currentPage + 1);
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
