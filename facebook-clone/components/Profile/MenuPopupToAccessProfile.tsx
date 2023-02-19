import React from "react";
import Popup from "reactjs-popup";
import Link from "next/link";
import { useSelector } from "react-redux";
const contentStyle = {
  padding: "1rem",
  backgroundColor: "gray",
  borderRadius: ".5rem",
  width: "10rem",
};
const arrowStyle = {
  color: "gray",
};
const MenuPopup = () => {
  const { profile } = useSelector((store: any) => store.auth);
  return (
    <Popup
      contentStyle={contentStyle}
      arrowStyle={arrowStyle}
      trigger={
        <li className="nav-bar-right-icons">
          <img src={profile} className="profile_pic_of_user" alt="" />
        </li>
      }
      position="bottom center"
      keepTooltipInside="body"
      closeOnDocumentClick
    >
      <Link href={`/profile`}>
        <li className="list-none border-none p-2 rounded-lg bg-gray-500 hover:bg-slate-100">
          Profile
        </li>
      </Link>
    </Popup>
  );
};

export default MenuPopup;
