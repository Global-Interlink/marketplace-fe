import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-t-[40px] sm:rounded-t-[20px] lg:rounded-t-[40px] lg:pt-[28px] pt-4 px-4 md:px-20 footer">
      <div className="container mx-auto flex flex-col space-y-4 lg:space-y-0 lg:flex-row justify-between">
        <div className="flex sm:block justify-center flex-col items-center">
          <div className="hidden md:block">
            <Image src="/logo.svg" alt="logo" width={175} height={72} />
          </div>
          <div className="block md:hidden">
            <Image src="/logo.svg" alt="logo" width={120} height={48} />
          </div>
          <p className="text-2xl leading-[30px] sm:block hidden font-semibold dark:text-white text-gray-400 mt-4">
            Global Decentralized Financial
            <br />
            Connection Platform
          </p>

          <div className="flex items-center sm:justify-start justify-center dark:text-white text-primary space-x-5 mt-6">
            <a
              href={"https://gil.eco/"}
              target="_blank"
              rel="noreferrer"
              className="h-[24px] !w-[24px] bg-gray-500 dark:bg-[#A0A0A0]/50 hover:bg-[#F626D1] rounded !flex justify-center items-center transition-all duration-500"
            >
              <Image src={"/ic-website.svg"} width={14} height={14} alt={""} />
            </a>

            <a
              href={"https://twitter.com/Sakayamarket"}
              target="_blank"
              rel="noreferrer"
              className="h-[24px] !w-[24px] bg-gray-500 dark:bg-[#A0A0A0]/50 hover:bg-[#F626D1] rounded !flex justify-center items-center transition-all duration-500"
            >
              <Image src={"/ic-twitter.svg"} width={15} height={15} alt={""} />
            </a>

            <a
              href="https://twitter.com/MokuFinance"
              target="_blank"
              rel="noreferrer"
              className="h-[24px] !w-[24px] bg-gray-500 dark:bg-[#A0A0A0]/50 hover:bg-[#F626D1] rounded !flex justify-center items-center transition-all duration-500"
            >
              <Image src={"/ic-telegram.svg"} width={14} height={11} alt={""} />
            </a>
          </div>
        </div>
        <div>
          <p className="font-bold dark:bg-none dark:bg-white text-primary-footer mb-4">
            Join Newsletter
          </p>
          <p className="dark:text-gray-300 text-gray-500 mb-6 font-normal">
            Subscribe our newsletter to get more free
            <br /> design course and resource
          </p>
          <div className="flex items-center text-xs w-full md:w-[352px] dark:bg-inputBg bg-gray-200 rounded-[100px] p-[2px]">
            <input
              type="text"
              className="bg-transparent rounded-l flex-1 px-3 outline-none dark:caret-white h-[38px]"
              placeholder="Enter your email"
            />
            <button>
              <Image
                width={38}
                height={38}
                alt="ic-button-footer"
                src="/ic-button-footer.svg"
                className="rounded-full p-[1px]"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="pt-[55px] pb-[14px]">
        <p className="text-sm dark:text-gray-300 text-[#6B7280] text-center font-normal">
          Copyright © 2023 Global Interlink. All rights reserved
        </p>
      </div>
    </div>
  );
};
export default Footer;
