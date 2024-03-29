import Head from "next/head";
import App from "../components/App";
import Script from "next/script";
import { LoginRoute } from "../Routes";
import io from "socket.io-client";
import axios from "axios";
import { Main } from "../Routes";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../src/authSlice";
import { AppDispatch, RootState } from "../src/store";
import { resetState } from "../src/storySlice";

function connectWithSocket(isAuth: any, userId: any) {
  try {
    if (isAuth) {
      // @ts-ignore
      let socket = io.connect(Main, {
        extraHeaders: {
          id: userId,
        },
      });
      return socket;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
}
export default function Home({ data }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const controller = useRef<boolean>(true);
  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    dispatch(resetState());
    if (controller.current) {
      dispatch(setData(data));

      if (data.isAuth) setSocket(connectWithSocket(data.isAuth, data.userId));
    }
    return () => {
      controller.current = false;
      socket?.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Facebook</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        src="https://kit.fontawesome.com/ca88a3f137.js"
        defer
        crossOrigin="anonymous"
      ></Script>
      {/* @ts-ignore */}
      <App socket={socket} />
    </>
  );
}
export async function getServerSideProps(context: any) {
  let { req } = context;
  let cookie = req.headers.cookie;
  const headers = {
    Cookie: cookie || {},
    "Content-Type": "application/json",
  };
  const res = await axios.post(
    LoginRoute,
    {},
    { headers, withCredentials: true }
  );
  const data = res.data;
  if (!data.isAuth) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: { data },
  };
}
