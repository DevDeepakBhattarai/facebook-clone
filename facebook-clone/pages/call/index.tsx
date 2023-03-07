import React, { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { io, Socket } from "socket.io-client";
import { LoginRoute, Main } from "../../Routes";
import Head from "next/head";
import axios from "axios";
export default function call({ data }: any) {
  const PeerProvider = useRef<any>();
  const Call = useRef<any>();
  const [forcer, setForcer] = useState(false);
  const socket = useRef<Socket>();

  const { userId } = data;

  useEffect(() => {
    PeerProvider.current = dynamic(() => import("../../context/PeerContext"));
    Call.current = dynamic(
      () => import("../../components/RightMessengerSection/Call")
    );
    setForcer(true);
    // @ts-ignore
    socket.current = io.connect(Main, {
      extraHeaders: {
        id: userId,
      },
    });
  }, []);

  if (PeerProvider.current && Call.current) {
    return (
      <>
        <Title></Title>
        <PeerProvider.current>
          <Call.current userId={userId} socket={socket.current}></Call.current>
        </PeerProvider.current>
      </>
    );
  } else
    return (
      <>
        <Title></Title>
      </>
    );
}
const Title = () => {
  return (
    <Head>
      <title>Messenger Call</title>
      <link rel="icon" href="http://192.168.1.75:3001/images/logo.svg" />
    </Head>
  );
};
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
  return {
    props: { data },
  };
}
