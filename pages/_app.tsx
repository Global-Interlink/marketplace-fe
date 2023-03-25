import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import LocalStorage, { LocalStorageKey } from "../src/utils/localStorage";
export default function App({ Component, pageProps }: AppProps) {
  const accessToken = LocalStorage.get(LocalStorageKey.ACCESS_TOKEN);
  const [isNetworkMaintaining, setIsNetworkMaintaining] = useState(false);
  useEffect(() => {
    setIsNetworkMaintaining(process.env.NEXT_PUBLIC_IS_MAINTAINING === "true");
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {isNetworkMaintaining && (
        <div className="w-full bg-[#ffda17] text-center sm:font-bold text-[#150502] sm:p-0 px-2 sm:text-inherit text-sm">
          Notice: SUI is currently down for maintenance. <br />
          We expect to be back in a couple hours. Thanks for your patience.
        </div>
      )}
      <Provider store={store}>
        <WalletProvider
          autoConnect={(accessToken && accessToken.length > 0) || false}
        >
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#BD28E0",
              },
            }}
          >
            <Component {...pageProps} />
          </ConfigProvider>
        </WalletProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          theme="dark"
        />
      </Provider>
    </ThemeProvider>
  );
}
