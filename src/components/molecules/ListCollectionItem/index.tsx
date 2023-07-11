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
      <div className="flex flex-col w-full shadow-collectionItem dark:shadow-none bg-transparent rounded-[20px] sm:hover:scale-105 transition duration-300 ease-in-out dark:bg-bgLinearCollectionItem">
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
        <div className="group flex px-5 pb-5 w-full space-x-[14px] dark:border-none rounded-b-[20px] ">
          <div className="text-primary dark:text-white w-full">
            <div className={`relative flex items-center space-x-1 mr-[90px]`}>
              <p className="truncate">{data.name}</p>
              <ICBadgeCheck />
            </div>
            <div className="flex items-center text-description dark:text-white space-x-1">
              <p>{data.totalNfts} NFTs</p>
              <ImgIcon />
            </div>
            {/* <span className="group-hover:opacity-100 transition-opacity bg-white dark:bg-[#19012F] px-3 py-2 text-xs font-semibold text-black dark:text-white rounded-md absolute left-5 right-5 bottom-[5%] md:bottom-[10%] -translate-y-full opacity-0 m-4 mx-auto drop-shadow-xl shadow-xl">
              {data.name}
              <svg className="absolute text-white dark:text-[#19012F] h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" ><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </span> */}
            <span className="absolute top-[65%] mr-5 scale-0 rounded-md bg-white dark:bg-[#19012F] px-3 py-2 text-xs font-semibold text-black dark:text-white sm:group-hover:scale-100 drop-shadow-xl shadow-xl">
              {data.name}
              <svg
                className="absolute text-white dark:text-[#19012F] h-2 w-full left-0 top-full"
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
              >
                <polygon
                  className="fill-current"
                  points="0,0 127.5,127.5 255,0"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListCollectionItem;
