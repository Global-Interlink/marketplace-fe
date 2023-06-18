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
  console.log("=data", data);
  return (
    <div className="mt-6 space-y-4">
      {data?.top.slice(0, 4).map((i, index) => {
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
      <div className="flex items-center justify-center">...</div>
      {data?.self && (
        <RankItem
          image="/rank-current.svg"
          address={data.self.walletAddress}
          percent={data.self.percent}
          tickets={data.self.numberTickets}
          no={data.self.no}
        />
      )}
    </div>
  );
};

export default ListRanking;
