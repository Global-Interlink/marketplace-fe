import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import BaseComponent from "../src/components/organisms/BaseComponent";

const NotFound = () => {
  const router = useRouter();
  return (
    <BaseComponent showBg404>
      <div className="flex items-center flex-col justify-center pt-[120px]">
        <Image src="/404.svg" alt="404" width={240} height={145} />
        <p className="text-[28px] font-semibold mt-2">Page Not Found</p>
        <p className="text-center text-lg text-gray-500 mt-3">
          The page you requested could no be found
          <br /> Please go back to the home page
        </p>
        <button
          onClick={() => {
            router.push("/");
          }}
          className="mt-[36px] primaryButton w-[270px] h-12 rounded justify-center flex items-center"
        >
          Back to home
        </button>
      </div>
    </BaseComponent>
  );
};

export default NotFound;
