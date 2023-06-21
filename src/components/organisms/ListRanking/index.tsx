import RankItem from "../../molecules/RankItem";

interface Rank {
  walletAddress: string;
  numberTickets: string;
  no?: string;
  percent: number;
}
export interface LeaderBoard {
  self: Rank;
  top: Rank[];
}
interface Props {
  data?: LeaderBoard;
}
const ListRanking: React.FC<Props> = ({ data }) => {
  const showCurrentRank =
    data?.self &&
    !data.top.find(
      (i) =>
        i.walletAddress.toLowerCase() === data.self.walletAddress.toLowerCase()
    );
  return (
    <div className="mt-6 space-y-4">
      {!data || data?.top.length === 0 ? (
        <p className="text-center mt-10 dark:text-white">No Data</p>
      ) : null}
      {data?.top.slice(0, showCurrentRank ? 4 : 5).map((i, index) => {
        return (
          <RankItem
            key={i.walletAddress}
            image={`/rank${index + 1}.svg`}
            address={i.walletAddress}
            percent={i.percent}
            tickets={i.numberTickets}
          />
        );
      })}
      {showCurrentRank && (
        <>
          <div className="flex items-center justify-center">...</div>
          <RankItem
            image="/rank-current.svg"
            address={data.self.walletAddress}
            percent={data.self.percent}
            tickets={data.self.numberTickets}
            no={data.self.no}
          />
        </>
      )}
    </div>
  );
};

export default ListRanking;
