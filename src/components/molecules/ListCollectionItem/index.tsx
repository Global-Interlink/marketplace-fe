import Image from "next/image";
import Link from "next/link";
import ImgIcon from "../../atoms/Icons/ImgIcon";

const ListCollectionItem = () => {
  return (
    <Link href={"/collection/1"}>
      <div className="flex flex-col w-full bg-transparent rounded-[20px] bg-white shadow hover:scale-101">
        <Image
          src={"/img-mock-1.png"}
          width={200}
          height={200}
          className="flex w-full aspect-[310/216] rounded-t-[20px] object-contain"
          alt="mock"
        />
        <div className="flex p-5 space-x-[14px] bg-white rounded-b-[20px]">
          <Image
            src={"/img-mock-logo-1.png"}
            width={52}
            height={52}
            alt="logo"
            className="rounded-full w-[52px] min-w-[52px] object-contain"
          />
          <div>
            <span className="text-primary external">
              Sayaka CollectionNFT
            </span>
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
