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
import AccountBalance from "../../molecules/AccountBalance";
import ArrowRight from "../../atoms/Icons/ArrowRight";
import Sparkle from "react-sparkle";

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
        LocalStorage.set(LocalStorageKey.CURRENT_ADDRESS, address || "");
      }
    } catch (e: any) {
      toast.error(e.message);
      disconnect();
    }
  };

  React.useEffect(() => {
    const prevAddress = LocalStorage.get(LocalStorageKey.CURRENT_ADDRESS);
    if (prevAddress && address && prevAddress !== address) {
      LocalStorage.remove(LocalStorageKey.CURRENT_ADDRESS);
      LocalStorage.remove(LocalStorageKey.ACCESS_TOKEN);
    }
  }, [address]);
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
    <div className="bg-transparent md:h-[84px] w-full flex px-4 md:px-20 backdrop-blur-[10px] fixed z-20">
      <div className="w-full mx-auto flex pt-4 md:pt-0 items-center justify-between">
        <div className="flex items-center lg:space-x-5 xl:space-x-10 2xl:space-x-14">
          <Link href="/">
            <div className="hidden md:block">
              <Image src="/logo.svg" alt="logo" width={127} height={52} />
            </div>
            <div className="block md:hidden w-[127px] h-[52px] object-cover">
              <Image src="/logo.png" alt="logo" width={103} height={23} />
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
        <Link href={"/event"}>
          <div className="flex items-center space-x-2 relative">
            <svg className="sparkle1" width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.7792 11.4543C17.7524 11.4448 17.7249 11.4376 17.6969 11.4329L17.6899 11.4276L17.6259 11.384C17.5721 11.3515 17.5162 11.3226 17.4586 11.2975C17.3027 11.2308 17.1416 11.1774 16.9769 11.1376C15.8069 10.8717 14.7151 10.3366 13.7882 9.57475C11.708 7.71877 10.3759 5.16797 10.0416 2.40029C9.97122 2.002 9.92131 1.60037 9.89206 1.19698L9.86506 0.892046L9.85145 0.739276L9.84459 0.662796L9.84279 0.643746C9.83935 0.588749 9.82986 0.534298 9.81447 0.481387C9.77814 0.353866 9.70442 0.240165 9.60282 0.15497C9.50122 0.0697756 9.37641 0.0170013 9.24451 0.0034647C9.11261 -0.0100719 8.97968 0.016251 8.8629 0.0790329C8.74611 0.141815 8.65083 0.238172 8.58937 0.355657C8.54212 0.447867 8.51471 0.548957 8.50893 0.652407L8.50221 0.722597C8.43886 0.726077 8.4457 0.726267 8.50221 0.722597L8.5016 0.728947L8.48702 0.882146L8.4579 1.18897C8.38561 2.00844 8.24859 2.8209 8.04811 3.61875C7.67537 5.16452 7.00557 6.62305 6.07601 7.91312C5.25088 9.03623 4.16229 9.93926 2.90608 10.5427L2.27028 10.7929C1.96193 10.9028 1.53584 10.9865 1.30568 11.0854L0.507515 11.3658L0.119396 11.5022C0.0537857 11.537 0.0883256 11.5552 0.0680656 11.5822L0.0251555 11.7282L0.00446557 11.7987C0.00131788 11.8278 -4.78306e-05 11.8571 0.000375739 11.8864C-0.00104171 11.9047 0.00156195 11.9232 0.00800561 11.9405L0.0847855 12.1991C0.257793 12.333 0.439466 12.4554 0.628616 12.5655C1.28508 12.644 1.9293 12.8035 2.54653 13.0405L2.8271 13.1495C2.90548 13.1788 2.98135 13.2144 3.05397 13.2559L3.53497 13.5043C4.28676 13.9474 4.96812 14.5003 5.55647 15.1447C6.9397 16.7682 7.876 18.724 8.27309 20.8195C8.39058 21.3994 8.47711 21.9851 8.5323 22.5742L8.5763 23.0148L8.58179 23.0697C8.58483 23.118 8.59256 23.1659 8.60486 23.2127C8.63598 23.3323 8.70387 23.4391 8.79895 23.518C8.89402 23.5969 9.01149 23.644 9.13475 23.6526C9.25802 23.6611 9.38087 23.6308 9.48596 23.5658C9.59105 23.5008 9.67308 23.4044 9.72047 23.2903C9.74845 23.2225 9.76497 23.1505 9.76935 23.0773L9.77167 23.0498L9.79029 22.8305L9.86475 21.9596C9.99842 20.8681 10.2457 19.7935 10.6026 18.7534C11.1045 17.2501 11.9412 15.8804 13.0495 14.7475C13.9576 13.8292 15.0734 13.1431 16.3027 12.7471C17.132 12.4732 17.614 12.4473 17.6979 12.3595C17.7482 12.3238 17.6545 12.1745 17.7554 12.1764C17.8465 12.1585 17.9271 12.1056 17.9798 12.0291C18.0326 11.9527 18.0534 11.8586 18.0378 11.767C18.0258 11.6835 17.9865 11.6062 17.9261 11.5472C17.8843 11.5062 17.8342 11.4745 17.7792 11.4543Z" fill="#FC5FFF"/>
            </svg>
            <svg className="sparkle2" width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.7792 11.4543C17.7524 11.4448 17.7249 11.4376 17.6969 11.4329L17.6899 11.4276L17.6259 11.384C17.5721 11.3515 17.5162 11.3226 17.4586 11.2975C17.3027 11.2308 17.1416 11.1774 16.9769 11.1376C15.8069 10.8717 14.7151 10.3366 13.7882 9.57475C11.708 7.71877 10.3759 5.16797 10.0416 2.40029C9.97122 2.002 9.92131 1.60037 9.89206 1.19698L9.86506 0.892046L9.85145 0.739276L9.84459 0.662796L9.84279 0.643746C9.83935 0.588749 9.82986 0.534298 9.81447 0.481387C9.77814 0.353866 9.70442 0.240165 9.60282 0.15497C9.50122 0.0697756 9.37641 0.0170013 9.24451 0.0034647C9.11261 -0.0100719 8.97968 0.016251 8.8629 0.0790329C8.74611 0.141815 8.65083 0.238172 8.58937 0.355657C8.54212 0.447867 8.51471 0.548957 8.50893 0.652407L8.50221 0.722597C8.43886 0.726077 8.4457 0.726267 8.50221 0.722597L8.5016 0.728947L8.48702 0.882146L8.4579 1.18897C8.38561 2.00844 8.24859 2.8209 8.04811 3.61875C7.67537 5.16452 7.00557 6.62305 6.07601 7.91312C5.25088 9.03623 4.16229 9.93926 2.90608 10.5427L2.27028 10.7929C1.96193 10.9028 1.53584 10.9865 1.30568 11.0854L0.507515 11.3658L0.119396 11.5022C0.0537857 11.537 0.0883256 11.5552 0.0680656 11.5822L0.0251555 11.7282L0.00446557 11.7987C0.00131788 11.8278 -4.78306e-05 11.8571 0.000375739 11.8864C-0.00104171 11.9047 0.00156195 11.9232 0.00800561 11.9405L0.0847855 12.1991C0.257793 12.333 0.439466 12.4554 0.628616 12.5655C1.28508 12.644 1.9293 12.8035 2.54653 13.0405L2.8271 13.1495C2.90548 13.1788 2.98135 13.2144 3.05397 13.2559L3.53497 13.5043C4.28676 13.9474 4.96812 14.5003 5.55647 15.1447C6.9397 16.7682 7.876 18.724 8.27309 20.8195C8.39058 21.3994 8.47711 21.9851 8.5323 22.5742L8.5763 23.0148L8.58179 23.0697C8.58483 23.118 8.59256 23.1659 8.60486 23.2127C8.63598 23.3323 8.70387 23.4391 8.79895 23.518C8.89402 23.5969 9.01149 23.644 9.13475 23.6526C9.25802 23.6611 9.38087 23.6308 9.48596 23.5658C9.59105 23.5008 9.67308 23.4044 9.72047 23.2903C9.74845 23.2225 9.76497 23.1505 9.76935 23.0773L9.77167 23.0498L9.79029 22.8305L9.86475 21.9596C9.99842 20.8681 10.2457 19.7935 10.6026 18.7534C11.1045 17.2501 11.9412 15.8804 13.0495 14.7475C13.9576 13.8292 15.0734 13.1431 16.3027 12.7471C17.132 12.4732 17.614 12.4473 17.6979 12.3595C17.7482 12.3238 17.6545 12.1745 17.7554 12.1764C17.8465 12.1585 17.9271 12.1056 17.9798 12.0291C18.0326 11.9527 18.0534 11.8586 18.0378 11.767C18.0258 11.6835 17.9865 11.6062 17.9261 11.5472C17.8843 11.5062 17.8342 11.4745 17.7792 11.4543Z" fill="#FC5FFF"/>
            </svg>
            <p className="gradientColor textShadow text-sm">Go to Event</p>
            <ArrowRight />
            <svg className="sparkle3" width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.7792 11.4543C17.7524 11.4448 17.7249 11.4376 17.6969 11.4329L17.6899 11.4276L17.6259 11.384C17.5721 11.3515 17.5162 11.3226 17.4586 11.2975C17.3027 11.2308 17.1416 11.1774 16.9769 11.1376C15.8069 10.8717 14.7151 10.3366 13.7882 9.57475C11.708 7.71877 10.3759 5.16797 10.0416 2.40029C9.97122 2.002 9.92131 1.60037 9.89206 1.19698L9.86506 0.892046L9.85145 0.739276L9.84459 0.662796L9.84279 0.643746C9.83935 0.588749 9.82986 0.534298 9.81447 0.481387C9.77814 0.353866 9.70442 0.240165 9.60282 0.15497C9.50122 0.0697756 9.37641 0.0170013 9.24451 0.0034647C9.11261 -0.0100719 8.97968 0.016251 8.8629 0.0790329C8.74611 0.141815 8.65083 0.238172 8.58937 0.355657C8.54212 0.447867 8.51471 0.548957 8.50893 0.652407L8.50221 0.722597C8.43886 0.726077 8.4457 0.726267 8.50221 0.722597L8.5016 0.728947L8.48702 0.882146L8.4579 1.18897C8.38561 2.00844 8.24859 2.8209 8.04811 3.61875C7.67537 5.16452 7.00557 6.62305 6.07601 7.91312C5.25088 9.03623 4.16229 9.93926 2.90608 10.5427L2.27028 10.7929C1.96193 10.9028 1.53584 10.9865 1.30568 11.0854L0.507515 11.3658L0.119396 11.5022C0.0537857 11.537 0.0883256 11.5552 0.0680656 11.5822L0.0251555 11.7282L0.00446557 11.7987C0.00131788 11.8278 -4.78306e-05 11.8571 0.000375739 11.8864C-0.00104171 11.9047 0.00156195 11.9232 0.00800561 11.9405L0.0847855 12.1991C0.257793 12.333 0.439466 12.4554 0.628616 12.5655C1.28508 12.644 1.9293 12.8035 2.54653 13.0405L2.8271 13.1495C2.90548 13.1788 2.98135 13.2144 3.05397 13.2559L3.53497 13.5043C4.28676 13.9474 4.96812 14.5003 5.55647 15.1447C6.9397 16.7682 7.876 18.724 8.27309 20.8195C8.39058 21.3994 8.47711 21.9851 8.5323 22.5742L8.5763 23.0148L8.58179 23.0697C8.58483 23.118 8.59256 23.1659 8.60486 23.2127C8.63598 23.3323 8.70387 23.4391 8.79895 23.518C8.89402 23.5969 9.01149 23.644 9.13475 23.6526C9.25802 23.6611 9.38087 23.6308 9.48596 23.5658C9.59105 23.5008 9.67308 23.4044 9.72047 23.2903C9.74845 23.2225 9.76497 23.1505 9.76935 23.0773L9.77167 23.0498L9.79029 22.8305L9.86475 21.9596C9.99842 20.8681 10.2457 19.7935 10.6026 18.7534C11.1045 17.2501 11.9412 15.8804 13.0495 14.7475C13.9576 13.8292 15.0734 13.1431 16.3027 12.7471C17.132 12.4732 17.614 12.4473 17.6979 12.3595C17.7482 12.3238 17.6545 12.1745 17.7554 12.1764C17.8465 12.1585 17.9271 12.1056 17.9798 12.0291C18.0326 11.9527 18.0534 11.8586 18.0378 11.767C18.0258 11.6835 17.9865 11.6062 17.9261 11.5472C17.8843 11.5062 17.8342 11.4745 17.7792 11.4543Z" fill="#FC5FFF"/>
            </svg>
          </div>
        </Link>
        <div className="flex items-center">
          <div className="text-black dark:text-white items-center hidden lg:flex">
            {connected && (
              <>
                <div className="mr-6 flex items-center space-x-2">
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
                    <AccountBalance />
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
