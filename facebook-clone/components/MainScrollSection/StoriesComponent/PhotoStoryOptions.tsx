import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store";
import { addText } from "../../../src/storySlice";
import { getAuthData } from "../../../src/authSlice";
import SubmitButton from "./SubmitButton";

export default function PhotoStoryOptions() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((store: RootState) => store.auth);

  useEffect(() => {
    if (!userId) dispatch(getAuthData());
  }, []);
  return (
    <>
      <div className=" hover:bg-gray-300 rounded-md mx-2 my-2">
        <div
          className="addInputTextOption  flex items-center gap-4 p-3"
          onClick={() => {
            dispatch(addText());
          }}
        >
          <div className="bg-gray-200 rounded-full h-10 w-10 flex text-base items-center justify-center ">
            <FontAwesomeIcon icon={faFont}></FontAwesomeIcon>
          </div>
          <div className="font-bold text-base text-gray-700">Add text</div>
        </div>

        <SubmitButton submitHandler={submitHandler}></SubmitButton>
      </div>
    </>
  );

  function submitHandler() {
    const ImageDiv: HTMLDivElement | null =
      document.querySelector(".imageContainerDiv");

    if (ImageDiv) {
      const canvas = document.createElement("canvas");

      // set the canvas dimensions
      canvas.width = ImageDiv.offsetWidth;
      canvas.height = ImageDiv.offsetHeight;

      html2canvas(ImageDiv).then((canvas) => {
        const img = new Image();
        img.src = canvas.toDataURL();
        const imageData = img.src.split(",")[1];

        axios.post("http://192.168.1.75:3001/photoStory", {
          stories: imageData,
          user: userId,
        });
      });
    }
  }
}
