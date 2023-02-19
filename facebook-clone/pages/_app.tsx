import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { Provider } from "react-redux";
import store from "../src/store";
import Navbar from "../components/Navbar";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <Script
          src="https://kit.fontawesome.com/ca88a3f137.js"
          defer
          crossOrigin="anonymous"
        ></Script>
        <title>Facebook</title>
        <link rel="icon" href="http://192.168.1.75:3001/images/logo.svg" />
      </Head>
      {
        <Provider store={store}>
          {!pageProps.shouldNavBarBeHidden && <Navbar />}
          <Component {...pageProps} />
        </Provider>
      }
    </>
  );
}
