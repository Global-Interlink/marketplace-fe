import Image from "next/image";
import Link from "next/link";
import { NFT } from "../../../api/types";
interface Props {
  title?: string;
  data?: NFT;
}
const ListNFTItem: React.FC<Props> = ({ title, data }) => {
  return (
    <Link href={`/nft/${data?.id || data?.objectId}`}>
      <div className="flex flex-col w-full bg-transparent rounded-[20px] bg-white hover:scale-101 shadow">
        <Image
          src={data?.image || "/img-mock-1.png"}
          width={200}
          height={200}
          className="flex w-full aspect-[310/216] rounded-t-[20px] object-cover"
          alt="mock"
        />
        <div className="flex p-5 space-x-[14px] bg-white rounded-b-[20px]">
          <div className="w-full">
            {title && (
              <p className="text-[24px] text-primary font-medium">
                {data?.name}
              </p>
            )}
            <span className="text-primary">Sayaka CollectionNFT</span>
            <div className="flex items-center mt-[18px] space-x-[30px]">
              <div className="h-[36px] flex-1 text-center text-[12px] py-2 text-[#4B5563] border rounded-[5px] border-black">
                Price 2.5 ETH
              </div>
              <div className="flex-1">
                <Link href={`/nft/${data?.id}`}>
                  <button className=" primaryButton h-[36px] w-full text-center text-[12px] py-2 text-white border rounded-[5px] ">
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListNFTItem;
