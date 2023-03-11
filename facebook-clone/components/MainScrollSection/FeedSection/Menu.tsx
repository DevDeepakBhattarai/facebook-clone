import { faEllipsisH, faMultiply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/router";

import React, { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import Popup from "reactjs-popup";
import { PostsRoute } from "../../../Routes";
import { removePost } from "../../../src/postSlice";
import { AppDispatch } from "../../../src/store";
interface Props {
  post_id: string;
}

const DiscardPopup = ({
  isPopupOpen,
  setIsPopupOpen,
  setIsMenuOpen,
  post_id,
}: {
  isPopupOpen: boolean;
  post_id: string;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const overlayStyle = { background: "rgba(0,0,0,0.7)", zIndex: 9999 };
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Popup
      onClose={() => {
        setIsPopupOpen(false);
      }}
      open={isPopupOpen}
      overlayStyle={overlayStyle}
    >
      <div className="w-[35rem] h-44 rounded-lg bg-white">
        <div className="text-xl text-center relative font-bold p-4 ">
          <span className="text-center">Delete Post?</span>
          <div
            onClick={() => {
              setIsPopupOpen(false);
            }}
            className="text-black absolute grid place-items-center right-4 top-4 bg-gray-400 rounded-full h-8 w-8 text-base"
          >
            <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
          </div>
        </div>

        <hr className="bg-gray-600 bg-opacity-30" />
        <div className="px-4  text-gray-700">
          Are you sure you want to discard this post? Your post won't be saved.
        </div>
        <div className="flex px-4 gap-4 mt-10 items-center justify-end">
          <button
            onClick={() => {
              setIsPopupOpen(false);
              setIsMenuOpen(false);
            }}
            className="rounded-md px-5 py-1 text-blue-600 font-bold flex items-center justify-center hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={deleteHandler}
            className=" rounded-md px-5 py-1 flex text-white font-bold items-center  justify-center bg-red-500 hover:bg-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </Popup>
  );

  async function deleteHandler() {
    await axios.delete(`${PostsRoute}/${post_id}`, { withCredentials: true });
    setIsMenuOpen(false);
    setIsPopupOpen(false);
    dispatch(removePost(post_id));
  }
};

export default function Menu({ post_id }: Props): ReactElement {
  const [isDiscardPopupOpen, setIsDiscardPopupOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div>
      <Popup
        onClose={() => {
          setIsMenuOpen(false);
        }}
        open={isMenuOpen}
        nested
        trigger={
          <div className="flex items-center justify-center h-10 w-10 rounded-full text-gray-400 hover:bg-fb-gray">
            <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
          </div>
        }
        on="click"
        arrow={false}
        position="left top"
        keepTooltipInside=".relative"
      >
        <div className="p-2 space-y-2 w-40 bg-dark border border-gray-600/50 rounded-md">
          <div
            onClick={() => {
              setIsDiscardPopupOpen(true);
            }}
            className="text-red-500 rounded-md text-center hover:bg-fb-gray/30 py-1  w-full"
          >
            Delete
          </div>
        </div>
      </Popup>
      <DiscardPopup
        isPopupOpen={isDiscardPopupOpen}
        setIsPopupOpen={setIsDiscardPopupOpen}
        setIsMenuOpen={setIsMenuOpen}
        post_id={post_id}
      ></DiscardPopup>
    </div>
  );
}
