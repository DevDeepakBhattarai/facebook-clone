import React from "react";
import { AppDispatch, RootState } from "../../../src/store";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../src/postSlice";
import CreatePost from "./CreatePost";

export default function Uploading() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, userName } = useSelector((store: RootState) => store.auth);
  return (
    <div className="p-4 bg-dark rounded-lg my-4">
      <CreatePost></CreatePost>
      <div className="flex items-center gap-4 mb-2">
        <div className="h-12 w-12 bg-gray-600 rounded-full group/profile overflow-hidden">
          <img
            className="group-hover/profile:opacity-70"
            src={profile!}
            alt=""
          />
        </div>
        <div
          onClick={() => {
            dispatch(createPost());
          }}
          className="flex-1 hover:bg-gray-500 px-2  rounded-full bg-fb-gray"
        >
          <span
            className={"flex items-center pl-2 py-2 text-white text-lg"}
          >{`What's on your mind,${userName?.split(" ")[0]}?`}</span>
        </div>
      </div>
      <hr className="bg-gray-500 bg-opacity-30" />
      <div className="flex items-center mt-2">
        <button className="hover:bg-gray-500 rounded-md flex-1 flex gap-2 items-center px-4 py-2 text-base text-gray-200">
          <i style={StyleOfTheLiveIcon}></i>
          Live video
        </button>

        <button className="hover:bg-gray-500 rounded-md flex-1 flex gap-2 items-center px-4 py-2 text-base text-gray-200">
          <i style={StyleOfPhotoIcon}></i>
          Photo/video
        </button>

        <button className="hover:bg-gray-500 rounded-md flex-1 flex gap-2 items-center px-4 py-2 text-base text-gray-200">
          <i style={StyleOfSmileIcon}></i>
          Feeling/activity
        </button>
      </div>
    </div>
  );
}
const StyleOfTheLiveIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/p4P9_d0wBji.png)",
  backgroundPosition: "0px -26px",
  backgroundSize: " 26px 328px",
  width: "24px",
  height: " 24px",
  backgroundRepeat: "no-repeat",
  display: "inline-block",
};
const StyleOfPhotoIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/p4P9_d0wBji.png)",
  backgroundPosition: "0px -208px",
  backgroundSize: " 26px 328px",
  width: "24px",
  height: " 24px",
  backgroundRepeat: "no-repeat",
  display: "inline-block",
};
const StyleOfSmileIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/p4P9_d0wBji.png)",
  backgroundPosition: "0px -156px",
  backgroundSize: " 26px 328px",
  width: "24px",
  height: " 24px",
  backgroundRepeat: "no-repeat",
  display: "inline-block",
};
