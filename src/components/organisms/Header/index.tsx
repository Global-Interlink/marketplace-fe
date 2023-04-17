import Image from "next/image";
import Link from "next/link";
import { toggleMenu } from "../../../redux/app/appSlice";
import { useAppDispatch } from "../../../redux/hook";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import React from "react";
import LocalStorage, { LocalStorageKey } from "../../../utils/localStorage";
import { useTheme } from "next-themes";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineMenu } from "react-icons/ai";
import { Dropdown, Popover } from "antd";
import SearchForm from "../../molecules/Search";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const { connected, address, chain, disconnect, signMessage } = useWallet();
  const { theme, setTheme } = useTheme();
  const [oldAddress, setOldAddress] = React.useState("");
  const dispatch = useAppDispatch();
  const items = [
    {
      label: "IDO",
      key: "IDO",
    },
    {
      label: "INO",
      key: "INO",
    },
  ];

  const handleMenuClick = (e: any) => {
    if (e.key === "IDO") {
      window.open("https://token-launchpad.gil.eco/", "_blank");
    } else if (e.key === "INO") {
      window.open("https://launchpad.gil.eco/", "_blank");
    }
  };

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
    <div className="bg-transparent fixed md:h-[84px] w-full flex px-4 md:px-20 backdrop-blur-[10px] z-20 shadow">
      <div className="w-full mx-auto flex pt-4 md:pt-0 items-center justify-between">
        <div className="flex items-center lg:space-x-5 xl:space-x-10 2xl:space-x-14">
          <Link href="/">
            <div className="hidden md:block">
              <Image src="/logo.svg" alt="logo" width={127} height={52} />
            </div>
            <div className="block md:hidden w-[127px] h-[52px] object-cover">
              <Image src="/logo.svg" alt="logo" width={103} height={23} />
            </div>
          </Link>
        </div>
        <div className="flex">
          <div className="relative mr-16 hidden md:block">
            <SearchForm />
          </div>
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            className="hidden md:flex"
          >
            <div className="text-gray-400 flex items-center gap-1 cursor-pointer text-sm">
              <span className="block">Launchpad</span>
              <BiChevronDown />
            </div>
          </Dropdown>
        </div>
        <div className="flex items-center">
          <div className="text-black dark:text-white items-center hidden lg:flex">
            {connected && (
              <>
                <div className="mr-12 flex items-center space-x-2">
                  <Image
                    src="/ic-sui.svg"
                    alt="sui"
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px]"
                  />
                  <p className="text-gray-400 text-sm">{chain?.name}</p>
                </div>
                <Popover
                  placement="bottom"
                  className="bg-transparent"
                  content={
                    <div className="">
                      <button
                        className="w-full font-bold"
                        onClick={() => {
                          disconnect();
                        }}
                      >
                        Disconnect
                      </button>
                    </div>
                  }
                  showArrow={false}
                >
                  <div>
                    <ConnectButton
                      label="Connect wallet"
                      className="primaryButton connect-wallet-btn"
                    />
                  </div>
                </Popover>
              </>
            )}
            {!connected && (
              <ConnectButton
                label="Connect wallet"
                className="primaryButton connect-wallet-btn"
              />
            )}
          </div>
          {connected && (
            <Link href="/profile">
              {theme === "dark" ? (
                <Image
                  width={40}
                  height={40}
                  alt="ic-profile"
                  src="/ic-profile-dark.svg"
                  className="w-[40px] h-[40px] mx-5"
                />
              ) : (
                <Image
                  width={40}
                  height={40}
                  alt="ic-profile"
                  src="/ic-profile.svg"
                  className="w-[40px] h-[40px] mx-5"
                />
              )}
            </Link>
          )}
          <div className="flex items-center">
            <button
              onClick={() => {
                dispatch(toggleMenu());
              }}
              className="block md:hidden"
            >
              <AiOutlineMenu size={24} />
            </button>
          </div>
          {theme && (
            <div className="hidden md:flex items-center h-[40px] gap-1 px-1 text-white bg-white dark:bg-[#4F2A8A]/25 rounded-[52px]">
              <button
                className={`flex justify-center items-center w-[32px] h-[32px] rounded-full ${
                  theme === "light" ? "primaryButton" : "bg-transparent"
                }`}
                onClick={() => {
                  // TODO
                  setTheme("light");
                }}
              >
                {theme === "dark" ? (
                  <Image
                    className="change-theme-img"
                    src="/ic-light-dark.svg"
                    alt="light"
                    width={18}
                    height={18}
                  />
                ) : (
                  <Image
                    className="change-theme-img"
                    src="/ic-light.svg"
                    alt="light"
                    width={18}
                    height={18}
                  />
                )}
              </button>
              <button
                className={`flex justify-center items-center w-[32px] h-[32px] rounded-full ${
                  theme === "dark" ? "primaryButton" : "bg-white"
                }`}
                onClick={() => {
                  setTheme("dark");
                }}
              >
                {theme === "dark" ? (
                  <Image
                    className="change-theme-img"
                    src="/ic-dark.svg"
                    alt="light"
                    width={18}
                    height={18}
                  />
                ) : (
                  <Image
                    className="change-theme-img"
                    src="/ic-dark-light.svg"
                    alt="light"
                    width={18}
                    height={18}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
