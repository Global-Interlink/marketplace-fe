import Image from "next/image";
import Link from "next/link";
import { Collection } from "../../../api/types";
import ImgIcon from "../../atoms/Icons/ImgIcon";
import { validURL } from "../ListNFTItem";
import ICBadgeCheck from "../../atoms/Icons/ICBadgeCheck";

interface Props {
  data: Collection;
}
const ListCollectionItem: React.FC<Props> = ({ data }) => {
  return (
    <Link href={`/collection/${data.id}`}>
      <div className="flex flex-col w-full shadow-collectionItem dark:shadow-none bg-transparent rounded-[20px] hover:-translate-y-1 transition duration-300 ease-in-out dark:bg-[#1F0844]">
        <Image
          src={
            validURL(data?.featuredImage || "/default.jpeg")
          }
          width={500}
          height={500}
          className="flex w-full aspect-[310/216] object-cover p-4 !rounded-[32px]"
          alt="mock"
        />
        <div className="flex p-5 w-full space-x-[14px] dark:bg-[#1F0844]  dark:border-none rounded-b-[20px] pt-0">
          <Image
            src={data.logo}
            width={500}
            height={500}
            alt="logo"
            className="rounded-full w-[52px] h-[52px] min-w-[52px] object-cover"
          />
          <div className="truncate text-primary dark:text-white">
            <div className="flex items-center space-x-1">
              <p className="truncate">{data.name}</p>
              <ICBadgeCheck />
            </div>
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
