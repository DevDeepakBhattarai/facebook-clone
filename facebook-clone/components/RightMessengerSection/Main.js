import React from "react";
import Friends from "./Friends";
import Sponsored from "./Sponsored";
import Request from "./Request";
import Group from "./Group";
import Birthday from "./Birthday";

export default function Main({ socket }) {
  return (
    <div className="right-section">
      <Sponsored></Sponsored>
      <Birthday></Birthday>
      <Request></Request>
      <Friends socket={socket}></Friends>
      <Group></Group>
    </div>
  );
}
