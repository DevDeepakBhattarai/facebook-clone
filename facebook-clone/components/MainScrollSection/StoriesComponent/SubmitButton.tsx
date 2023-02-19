import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { useRouter } from "next/router";
const DiscardPopup = ({
  isPopupOpen,
  setIsPopupOpen,
}: {
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const overlayStyle = { background: "rgba(255,255,255,0.7)" };
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
          <span className="text-center">Discard Story?</span>
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
          Are you sure you want to discard this story? Your story won't be
          saved.
        </div>
        <div className="flex px-4 gap-4 mt-10 items-center justify-end">
          <button
            onClick={() => {
              setIsPopupOpen(false);
            }}
            className="rounded-md px-5 py-1 text-blue-600 font-bold flex items-center justify-center hover:bg-gray-200"
          >
            Continue Editing
          </button>
          <button
            onClick={() => {
              router.push("/");
            }}
            className=" rounded-md px-5 py-1 flex text-white font-bold items-center  justify-center bg-fb-blue hover:bg-blue-600"
          >
            Discard
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default function SubmitButton({ submitHandler }: any) {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  return (
    <>
      <div
        className="absolute bottom-0 left-0
                        flex gap-4 
                        py-[1.05rem] px-4 
                        shadow-[0px_0px_5px_1px_gray]  
                        h-[4.5rem] rounded-md w-full bg-white"
      >
        <button
          onClick={() => {
            setIsPopupOpen(true);
          }}
          className="flex-grow text-center rounded-md font-bold text-black bg-gray-400 hover:bg-gray-500"
        >
          Discard
        </button>

        <DiscardPopup
          setIsPopupOpen={setIsPopupOpen}
          isPopupOpen={isPopupOpen}
        ></DiscardPopup>
        <button
          className="flex-grow text-center rounded-md font-bold text-white bg-blue-500 hover:bg-blue-400"
          onClick={submitHandler}
        >
          Share to the story
        </button>
      </div>
    </>
  );
}
