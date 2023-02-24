/* eslint-disable react/no-unescaped-entities */
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const { theme } = useTheme();
  return (
    <div className="border-t rounded-t-[20px] lg:rounded-t-[40px] border-inputBg lg:pt-[28px] pt-4 bg-footerL dark:bg-footer  px-4 md:px-20  shadow-footer ">
      <div className="container mx-auto flex flex-col space-y-10 lg:space-y-0 lg:flex-row justify-between">
        <div>
          <Image src="/logo.svg" alt="logo" width={175} height={71} />
          <p className="text-2xl font-semibold text-gray-400 dark:text-white mt-4">
            Global Decentralized <br />
            Financial Connection Platform
          </p>
          {theme === "dark" ? (
            <div className="flex items-center space-x-5 mt-6">
              <Link href={"#"}>
                <Image
                  width={24}
                  height={24}
                  alt="ic-facebook"
                  src="/ic-facebook.svg"
                />
              </Link>
              <Link href={"#"}>
                <Image
                  width={24}
                  height={24}
                  alt="ic-linkledin"
                  src="/ic-linkledin.svg"
                />
              </Link>
              <Link href={"#"}>
                <Image
                  width={24}
                  height={24}
                  alt="ic-twitter-filled"
                  src="/ic-twitter-filled.svg"
                />
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-5 mt-6">
              <Link href={"#"}>
                <Image
                  width={24}
                  height={24}
                  alt="ic-facebook"
                  src="/ic-facebook-l.svg"
                />
              </Link>
              <Link href={"#"}>
                <Image
                  width={24}
                  height={24}
                  alt="ic-linkledin"
                  src="/ic-linkedin-l.svg"
                />
              </Link>
              <Link href={"#"}>
                <Image
                  width={24}
                  height={24}
                  alt="ic-twitter-filled"
                  src="/ic-twitter-l.svg"
                />
              </Link>
            </div>
          )}
        </div>
        <hr className="border-gray-700" />
        <div className="block md:hidden">
          <p className="font-bold text-gray-400 dark:text-white mb-5">
            Join Newsletter
          </p>
          <p className="text-gray-400 dark:text-gray-300 mb-6">
            Subscribe our newsletter to get more free
            <br /> design course and resource
          </p>
          <div className="flex items-center w-full md:w-[352px] mb-6 md:mb-0  bg-inputBg rounded-lg p-[2px]">
            <input
              type="text"
              className="bg-transparent rounded-none flex-1 px-3 outline-none dark:caret-white h-[38px]"
              placeholder="Enter your email"
            />
            <button>
              <Image
                width={38}
                height={38}
                alt="ic-button-footer"
                src="/ic-button-footer.svg"
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:space-x-[40px] xl:space-x-[120px]">
          <div className="mb-10 md:mb-0">
            <ul className="text-gray-400 dark:text-gray-200 font-normal">
              <li
                className={`font-bold mb-5 ${
                  theme === "light" ? "text-gradient-primary" : "text-white"
                }`}
              >
                Stacks
              </li>
              <li className="mb-6">
                <Link href={"#"}>Discover</Link>
              </li>
              <li className="mb-6">
                <Link href={"#"}>Connect wallet</Link>
              </li>
              <li className="mb-6">
                <Link href={"#"}>Create item</Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="text-gray-400 dark:text-gray-200 font-normal">
              <li
                className={`font-bold mb-5 ${
                  theme === "light" ? "text-gradient-primary" : "text-white"
                }`}
              >
                Info
              </li>
              <li className="mb-6">
                <Link href={"#"}>Download</Link>
              </li>
              <li className="mb-6">
                <Link href={"#"}>Demos</Link>
              </li>
              <li>
                <Link href={"#"}>Support</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden md:block">
          <p
            className={`font-bold mb-5 ${
              theme === "light" ? "text-gradient-primary" : "text-white"
            }`}
          >
            Join Newsletter
          </p>
          <p className="text-gray-400 dark:text-gray-200 mb-6 font-normal">
            Subscribe our newsletter to get more free
            <br /> design course and resource
          </p>
          <div className="flex items-center w-[352px] bg-inputBg rounded-lg p-[2px]">
            <input
              type="text"
              className="bg-gray-200 dark:bg-transparent rounded-none flex-1 px-3 outline-none dark:caret-white h-[38px]"
              placeholder="Enter your email"
            />
            <button>
              <Image
                width={38}
                height={38}
                alt="ic-button-footer"
                src="/ic-button-footer.svg"
                className="rounded-tr-md rounded-br-md"
              />
            </button>
          </div>
        </div>
      </div>
      <hr className="container mx-auto border-inputBg mt-8" />
      <div className="pt-[30px] pb-[15px]">
        <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
          Copyright © 2022 UI8 LLC. All rights reserved
        </p>
      </div>
    </div>
  );
};
export default Footer;
