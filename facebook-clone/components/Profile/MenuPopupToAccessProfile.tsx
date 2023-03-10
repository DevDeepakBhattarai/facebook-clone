import React from "react";
import Popup from "reactjs-popup";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import { LogoutRoute } from "../../Routes";

const arrowStyle = {
  color: "gray",
};
const logoutButtonIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/l-nNtMFQ8CA.png)",
  backgroundPosition: "0px -872px",
  backgroundSize: "34px 1794px",
  width: "20px",
  height: "20px",
  backgroundRepeat: "no-repeat",
  display: "inline-block",
};
const MenuPopup = () => {
  const router = useRouter();
  const { profile, userName } = useSelector((store: any) => store.auth);
  return (
    <Popup
      arrowStyle={arrowStyle}
      trigger={
        <li className="nav-bar-right-icons">
          <img src={profile} className="profile_pic_of_user" alt="" />
        </li>
      }
      position={"bottom right"}
      closeOnDocumentClick
    >
      <div className="bg-dark rounded-lg shadow-lg space-y-4 text-white w-96 h-full p-4">
        <Link href={`/profile`}>
          <li className="list-none border-none p-2 rounded-lg flex items-center gap-2 bg-dark border shadow-md shadow-white/[0.05] border-gray-600/50 hover:bg-fb-gray/75">
            <img className="h-12 w-12 rounded-full" src={profile} alt="" />{" "}
            <span className="font-bold ">{userName}</span>
          </li>
        </Link>
        <button
          onClick={() => {
            logoutHandler(router);
          }}
          className="list-none w-full border-none flex items-center font-bold gap-4 p-2 rounded-lg hover:bg-fb-gray/75"
        >
          <div className="h-12 w-12 grid place-items-center rounded-full bg-fb-gray">
            <i className="filter invert" style={logoutButtonIcon}></i>
          </div>
          Log out
        </button>
      </div>
    </Popup>
  );
};

async function logoutHandler(router: NextRouter) {
  await axios.post(LogoutRoute, {}, { withCredentials: true });
  router.push("/login");
}

export default MenuPopup;
