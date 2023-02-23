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
      <div className="flex flex-col w-full bg-transparent rounded-[20px] shadow hover:-translate-y-1 transition ease-in-out delay-150">
        <Image
          src={data.featuredImage}
          width={200}
          height={200}
          className="flex w-full aspect-[310/216] rounded-t-[20px] object-cover"
          alt="mock"
        />
        <div className="flex p-5 space-x-[14px] bg-white/60 border-[2px] border-white dark:bg-linearItem  backdrop-blur-[12.5px] dark:border-none rounded-b-[20px]">
          <Image
            src={data.logo}
            width={52}
            height={52}
            alt="logo"
            className="rounded-full w-[52px] min-w-[52px] object-cover"
          />
          <div>
            <span className="text-primary dark:text-white external">
              {data.name}
            </span>
            <div className="flex items-center text-description dark:text-white space-x-1">
              <p>{data.totalNfts} items</p>
              <ImgIcon />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListCollectionItem;
