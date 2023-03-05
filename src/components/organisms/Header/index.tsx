import Image from "next/image";
import Link from "next/link";
import { toggleMenu } from "../../../redux/app/appSlice";
import { useAppDispatch } from "../../../redux/hook";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import React from "react";
import axios from "axios";
import LocalStorage, { LocalStorageKey } from "../../../utils/localStorage";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import SearchForm from "../../molecules/Search";
import DarkIcon from "../../atoms/Icons/DarkIcon";
import LightIcon from "../../atoms/Icons/LightIcon";
import WalletInfo from "../../molecules/WalletInfo";
const Header = () => {
  const { connected, address, signMessage, disconnect } = useWallet();
  const [oldAddress, setOldAddress] = React.useState("");
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const handleLogin = async () => {
    try {
      const resultGetNonce = await axios
        .post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/get-nonce`, {
          walletAddress: address,
          chain: "SUI",
        })
        .catch((error) => {
          throw error;
        });
      if (resultGetNonce.data.nonce) {
        const nonce = resultGetNonce.data.nonce;
        const signature = await signMessage({
          message: new TextEncoder().encode(nonce),
        }).catch((error) => {
          throw error;
        });
        const resultLogin = await axios
          .post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
            walletAddress: address,
            chain: "SUI",
            signature: signature,
          })
          .catch((error) => {
            throw error;
          });
        if (!resultLogin.data.accessToken) {
          throw "Cannot login";
        }
        LocalStorage.set(
          LocalStorageKey.ACCESS_TOKEN,
          resultLogin.data.accessToken
        );
      }
    } catch (e: any) {
      toast.error(e.message);
      disconnect();
    }
  };

  React.useEffect(() => {
    const accessToken = LocalStorage.get(LocalStorageKey.ACCESS_TOKEN);
    if (connected && !accessToken) {
      handleLogin();
    }
  }, [connected]);

  React.useEffect(() => {
    if (address) {
      setOldAddress(address);
    } else if (!address && oldAddress) {
      LocalStorage.remove(LocalStorageKey.ACCESS_TOKEN);
    }
  }, [address]);

  return (
    <div className="md:h-[84px] w-full flex md:border-b-[0.5px] md:border-[#cfcece] px-4 md:px-20 2xl:px-0">
      <div className="container mx-auto flex pt-4 md:pt-0 items-center">
        <div className="flex flex-1 items-center space-x-14 lg:space-x-24">
          <Link href="/">
            <div className="hidden md:block">
              <Image
                src="/logo.svg"
                alt="logo"
                width={127}
                height={52}
                className="min-w-[127px]"
              />
            </div>
            <div className="block md:hidden">
              <Image src="/logo.svg" alt="logo" width={103} height={23} />
            </div>
          </Link>
          <div className="hidden lg:block">
            <SearchForm />
          </div>
        </div>
        <div className="text-white items-center space-x-4 xl:space-x-5 2xl:space-x-[30px] hidden md:flex">
          {connected ? (
            <WalletInfo />
          ) : (
            <ConnectButton
              label="Connect Wallet"
              className="primaryButton !rounded-md"
            />
          )}
          {connected && (
            <Link href="/profile">
              <Image
                width={32}
                height={32}
                alt="ic-profile"
                src="/ic-profile.svg"
                className="min-w-[32px] w-8 h-8"
              />
            </Link>
          )}
          {theme && (
            <div className="flex text-white ml-4 bg-white rounded">
              <button
                className={`p-4 rounded min-w-[52px] ${
                  theme === "light" ? "primaryButton" : "white"
                }`}
                onClick={() => {
                  // TODO
                  setTheme("light");
                }}
              >
                <LightIcon />
              </button>
              <button
                className={`p-4 rounded min-w-[52px] ${
                  theme === "dark" ? "primaryButton" : "bg-white"
                }`}
                onClick={() => {
                  setTheme("dark");
                }}
              >
                <DarkIcon />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-6 md:hidden">
          {theme && (
            <div className="flex text-white ml-4 bg-white rounded">
              <button
                className={`p-2 rounded ${
                  theme === "light" ? "primaryButton" : "bg-white"
                }`}
                onClick={() => {
                  // TODO
                  setTheme("light");
                }}
              >
                {/* <Image src="/ic-light.svg" alt="light" width={20} height={20} /> */}
                <LightIcon />
              </button>
              <button
                className={`p-2 rounded ${
                  theme === "dark" ? "primaryButton" : "bg-white"
                }`}
                onClick={() => {
                  setTheme("dark");
                }}
              >
                {/* <Image src="/ic-dark.svg" alt="light" width={20} height={20} /> */}
                <DarkIcon />
              </button>
            </div>
          )}
          {connected && (
            <Link href="/profile">
              <Image
                width={24}
                height={24}
                alt="ic-profile"
                src="/ic-profile.svg"
              />
            </Link>
          )}
          <button
            onClick={() => {
              dispatch(toggleMenu());
            }}
            className="text-white block lg:hidden"
          >
            <Image
              src={theme === "dark" ? "/ic-menu.svg" : "/ic-menu-l.svg"}
              width={24}
              height={24}
              alt="ic-menu"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
