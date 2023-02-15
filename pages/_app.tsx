import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { ThemeProvider } from "next-themes";
import React from "react";
import { ConfigProvider } from "antd";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Provider store={store}>
        <WalletProvider autoConnect={true}>
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
