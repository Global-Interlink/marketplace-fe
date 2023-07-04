import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { clearSuccess, toggleMenu } from "../../../redux/app/appSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import LocalStorage, { LocalStorageKey } from "../../../utils/localStorage";
import Footer from "../Footer";
import Header from "../Header";
import jwt_decode from "jwt-decode";
import SearchForm from "../../molecules/Search";
import SuccessModal from "../../molecules/SuccessModal";
import AccountBalance from "../../molecules/AccountBalance";

interface Props {
  children: React.ReactNode;
  showBgTop?: boolean;
  showBg404?: boolean;
}
const BaseComponent: React.FC<Props> = ({ children, showBgTop, showBg404 }) => {
  const { isOpenMenu, success } = useAppSelector((store) => store.app);
  const { disconnect, connected, chain } = useWallet();
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
    <div className="relative">
      <Header />
      <div className="dark:bg-bgCommonD overflow-x-hidden pt-20 overflow-auto min-h-[100vh]  backdrop-blur-xl bg-bgCommonL bg-cover  bg-center bg-no-repeat">
        <div
          className={`flex flex-1 w-full px-4 md:px-20 ${
            showBgTop
              ? "dark:md:bg-bgDetail md:bg-right-top md:bg-no-repeat"
              : ""
          }  `}
        >
          <div
            className={`flex flex-col container min-h-[100vh] pb-[450px] md:pb-[490px] lg:pb-[491px] mx-auto h-full
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
        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
        {success.isOpen && (
          <SuccessModal
            close={() => {
              dispatch(clearSuccess());
            }}
            title={success.title}
            message={success.message}
          />
        )}
      </div>
      {isOpenMenu && (
        <div
          id="menu-sp"
          className="fixed bg-white dark:bg-gray-800 top-0 w-full space-y-4 p-4 z-20 h-screen"
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
          <div className="flex items-center justify-center">
            <SearchForm />
          </div>
          <div className="flex w-full justify-center items-center bg-transparent">
            {!connected ? (
              <ConnectButton
                label="Connect Wallet"
                className="primaryButton !rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <AccountBalance />
                <p>{chain?.name}</p>
              </div>
            )}
          </div>
          {connected && (
            <button
              className="py-2 px-4 rounded-full primaryButton mx-auto flex"
              onClick={disconnect}
            >
              Disconnect
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BaseComponent;
