import Navbar from "./Navbar";
import React from "react";
import Left from "./LeftFeatureSection/Main";
import Right from "./RightMessengerSection/Main";
import Body from "./MainScrollSection/Main";
import { useSelector } from "react-redux";

export default function App({ socket }) {
  const { isAuth } = useSelector((store) => store.auth);
  if (isAuth) {
    return (
      <>
        <main className="overflow-hidden h-[calc(100vh-3.5rem)]">
          <Left></Left>
          <Body></Body>
          <Right socket={socket}></Right>
        </main>
      </>
    );
  }
  if (isAuth === undefined) {
    return null;
  }
}
