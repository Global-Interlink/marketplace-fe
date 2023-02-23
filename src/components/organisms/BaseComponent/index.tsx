import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { toggleMenu } from "../../../redux/app/appSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import LocalStorage, { LocalStorageKey } from "../../../utils/localStorage";
import Footer from "../Footer";
import Header from "../Header";
import jwt_decode from "jwt-decode";
import SearchForm from "../../molecules/Search";

interface Props {
  children: React.ReactNode;
  showBgTop?: boolean;
  showBg404?: boolean;
}
const BaseComponent: React.FC<Props> = ({ children, showBgTop, showBg404 }) => {
  const { isOpenMenu } = useAppSelector((store) => store.app);
  const { disconnect } = useWallet();
  const dispatch = useAppDispatch();

  const accessToken = LocalStorage.get(LocalStorageKey.ACCESS_TOKEN);
  React.useEffect(() => {
    if (accessToken) {
      const decoded = jwt_decode(accessToken) as {
        sub: string;
        iat: number;
        exp: number;
      };
      if (dayjs().valueOf() > decoded.exp * 1000) {
        LocalStorage.remove(LocalStorageKey.ACCESS_TOKEN);
        disconnect();
      }
    }
  }, [accessToken]);

  return (
    <div
      className={`
    bg-gray-50 min-h-[100vh] relative dark:bg-bgLinear
    `}
    >
      <Header />
      <div
        className={`flex flex-1 w-full px-4 md:px-20  ${
          showBgTop ? "dark:md:bg-bgDetail md:bg-right-top md:bg-no-repeat" : ""
        }  `}
      >
        <div
          className={`flex  flex-col container min-h-[100vh] pb-[1100px] lg:pb-[491px] mx-auto h-full
           ${
             showBg404
               ? "lg:bg-bg404 lg:bg-left120 2xl:bg-left60 lg:bg-no-repeat bg-contain"
               : ""
           } 
           text-white`}
        >
          {children}
        </div>
      </div>
      {isOpenMenu && (
        <div
          id="menu-sp"
          className="absolute bg-white dark:bg-gray-800 top-0 z-10 h-full w-full space-y-4 p-4"
        >
          <div className="flex justify-end">
            <button
              onClick={() => {
                dispatch(toggleMenu());
              }}
            >
              <Image
                width={24}
                height={24}
                src="/ic-close.svg"
                alt="ic-close"
              />
            </button>
          </div>
          <SearchForm />
          <div className="flex w-full justify-center">
            <ConnectButton
              label="Connect Wallet"
              className="primaryButton !rounded-md"
            />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default BaseComponent;
