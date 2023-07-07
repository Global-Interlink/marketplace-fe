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
      <div className="flex flex-col w-full shadow-collectionItem dark:shadow-none bg-transparent rounded-[20px] hover:scale-105 transition duration-300 ease-in-out dark:bg-bgLinearCollectionItem">
        <div className="relative">
          <div className="rounded-t-[20px] ">
            <Image
              src={validURL(data?.featuredImage || "/default.jpeg")}
              width={500}
              height={500}
              className="flex w-full aspect-[310/216] rounded-[40px] p-[20px] object-cover"
              alt="mock"
            />
          </div>
          <Image
            src={data.logo}
            width={500}
            height={500}
            alt="logo"
            className="rounded-full w-[80px] h-[80px] min-w-[52px] object-cover absolute -bottom-4 right-10 border-4 border-white"
          />
        </div>
        <div className="group flex p-5 w-full space-x-[14px] dark:border-none rounded-b-[20px] ">
          <div className="truncate text-primary dark:text-white">
            <div className=" relative flex items-center space-x-1">
              <p className="truncate">
                {data.name.length > 36
                  ? `${data.name.substring(0, 36)} ...`
                  : data.name}
              </p>
              <ICBadgeCheck />
            </div>
            <div className="flex items-center text-description dark:text-white space-x-1">
              <p>{data.totalNfts} NFTs</p>
              <ImgIcon />
            </div>
            <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-2 text-sm text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 -translate-y-full opacity-0 m-4 mx-auto ">
              {data.name}
            </span>
            {/* <span className="absolute top-5 scale-0 rounded bg-gray-800 p-1 text-xs text-white group-hover:scale-100 ">
              {data.name}
              </span> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListCollectionItem;
