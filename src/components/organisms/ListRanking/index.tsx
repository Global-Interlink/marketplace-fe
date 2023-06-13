import { Image } from "antd";
import RankItem from "../../molecules/RankItem";

const ListRanking = () => {
  return (
    <div className="mt-6 space-y-4">
      <RankItem
        image="/rank1.svg"
        address="0x12abc2ab2ab...123a123a"
        percent="11.024%"
        tickets={100}
      />
      <RankItem
        image="/rank2.svg"
        address="0x12abc2ab2ab...123a123a"
        percent="7.024%"
        tickets={60}
      />
      <RankItem
        image="/rank3.svg"
        address="0x12abc2ab2ab...123a123a"
        percent="3.024%"
        tickets={40}
      />
      <RankItem
        image="/rank4.svg"
        address="0x12abc2ab2ab...123a123a"
        percent="2.024%"
        tickets={20}
      />
      <div className="flex items-center justify-center">...</div>
      <RankItem
        image="/rank-current.svg"
        address="0x12abc2ab2ab...123a123a"
        percent="1.024%"
        tickets={10}
      />
    </div>
  );
};

export default ListRanking;
