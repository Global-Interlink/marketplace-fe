import Image from "next/image";
import Link from "next/link";
import { Collection } from "../../../api/types";
import ImgIcon from "../../atoms/Icons/ImgIcon";

interface Props {
  data: Collection;
}
const ListCollectionItem: React.FC<Props> = ({ data }) => {
  return (
    <Link href={`/collection/${data.id}`}>
      <div className="flex flex-col w-full bg-transparent rounded-[20px] bg-white shadow hover:scale-101">
        <Image
          src={data.featuredImage}
          width={200}
          height={200}
          className="flex w-full aspect-[310/216] rounded-t-[20px] object-cover bg-white"
          alt="mock"
        />
        <div className="flex p-5 space-x-[14px] bg-white/60 dark:bg-white border-[2px] border-white rounded-b-[20px]">
          <Image
            src={data.logo}
            width={52}
            height={52}
            alt="logo"
            className="rounded-full w-[52px] min-w-[52px] object-cover bg-white"
          />
          <div>
            <span className="text-primary external">{data.name}</span>
            <div className="flex items-center text-description space-x-1">
              <p>1000 items</p>
              <ImgIcon />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListCollectionItem;
