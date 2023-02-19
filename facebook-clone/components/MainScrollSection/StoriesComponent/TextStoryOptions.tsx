import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store";
import { useRouter } from "next/router";
import {
  setCaption,
  setFont,
  setBackgroundColor,
  resetState,
} from "../../../src/storySlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { TextStoryRoute } from "../../../Routes";
import SubmitButton from "./SubmitButton";
export default function TextStoryOptions() {
  const router = useRouter();
  //! Refs
  const tooltipRef = useRef<HTMLDivElement>(null);
  const inputArea = useRef<HTMLDivElement>(null);
  const exclamationSymbol = useRef<HTMLDivElement>(null);
  const shareToStoryBtn = useRef<HTMLButtonElement>(null);
  const animatedTextRef = useRef<HTMLDivElement>(null);

  //! Dispatch
  const dispatch = useDispatch<AppDispatch>();

  //! States
  const { background, caption, font } = useSelector(
    (store: RootState) => store.story
  );
  const { userId } = useSelector((store: RootState) => store.auth);
  const needsToBeFormatted = useRef<boolean>(false);

  useEffect(() => {
    if (caption === "") {
    }

    if (needsToBeFormatted.current) {
      shareToStoryBtn.current!.disabled = false;
      inputArea.current?.classList.add("hover:border-opacity-75");
      inputArea.current?.classList.add("outline-none");
      inputArea.current?.classList.remove("text-red-600");
      animatedTextRef.current?.classList.add("text-blue-500");
      inputArea.current?.classList.replace("border-red-500", "border-black");
      exclamationSymbol.current?.classList.add("hidden");
      needsToBeFormatted.current = false;
    }
  }, [caption]);

  return (
    <>
      <div className="my-4 px-4 w-full overflow-hidden">
        <div
          ref={inputArea}
          className="rounded h-44 group relative
                     hover:border-opacity-75
                     outline-none
                     p-2
                   focus-within:outline-blue-500 outline-[3px] outline-offset-2
                   border-black border-opacity-50 border my-4"
        >
          <div
            ref={animatedTextRef}
            className={
              caption === ""
                ? `h-0 w-0
                       transition-transform duration-200
                       scale-125 origin-bottom opacity-0
                       group-focus-within:block
                       group-focus-within:scale-100
                       group-focus-within:opacity-100
                       pl-4
                       text-sm 
                       text-blue-500`
                : `  
                       pl-4
                       text-sm 
                       text-blue-500
                       `
            }
          >
            Text
          </div>
          <div
            ref={exclamationSymbol}
            className="hidden absolute top-4 right-4 text-red-600"
          >
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              height={"1.3rem"}
              width={"1.3rem"}
              viewBox="0 0 512 512"
            >
              <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32z" />
            </svg>
          </div>

          <div
            className={
              caption === ""
                ? `group-focus-within:hidden  origin-[0%_-50%]`
                : "hidden"
            }
            ref={tooltipRef}
          >
            Start Typing
          </div>

          <textarea
            name=""
            id=""
            onBlur={() => {
              tooltipRef.current?.classList.add(
                "animate-[fadeIn_250ms_forwards]"
              );
            }}
            placeholder="Start typing"
            onChange={(e) => {
              dispatch(setCaption(e.target.value));
            }}
            className={
              caption === ""
                ? `p-4 resize-none 
                            focus:placeholder:text-black  h-5/6
                             placeholder-transparent border-none outline-none w-full`
                : `px-4 resize-none 
                             focus:placeholder:text-black  h-5/6
                              placeholder-transparent border-none outline-none w-full`
            }
          ></textarea>
        </div>

        <div
          tabIndex={0}
          className="h-12 rounded-lg p-4 form-select flex items-center w-full border border-black border-opacity-50"
        >
          <label htmlFor="hello" className="font-bold form-select">
            Aa
          </label>
          <select
            onChange={(e) => {
              dispatch(setFont(e.target.value));
            }}
            id="hello"
            name="fontSelect"
            className=" w-full p-2  focus:outline-none focus:border-none"
          >
            <option value="sans serif">Simple</option>
            <option value="arial">Clean</option>
            <option value="Comic Sans MS">Casual</option>
            <option value="Georgia">Fancy</option>
            <option value="helvetica">Headline</option>
          </select>
        </div>

        <div className="p-4 h-max w-full mt-4 rounded-lg border border-black border-opacity-50">
          <span className="text-sm font-thin text-gray-500">Backgrounds</span>

          <div className="flex gap-4 flex-wrap my-4 w-full">
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-blue-gradient"
              onClick={() => {
                dispatch(setBackgroundColor("blue-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className=" focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125 rounded-full aspect-square h-5 bg-pink-gradient"
              onClick={() => {
                dispatch(setBackgroundColor("pink-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-yellow-gradient"
              onClick={() => {
                dispatch(setBackgroundColor("yellow-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-orange-600"
              onClick={() => {
                dispatch(setBackgroundColor("orange-600"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-blue-900"
              onClick={() => {
                dispatch(setBackgroundColor("blue-900"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-black"
              onClick={() => {
                dispatch(setBackgroundColor("black"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-wavy-gradient bg-cover"
              onClick={() => {
                dispatch(setBackgroundColor("wavy-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-brown-gradient"
              onClick={() => {
                dispatch(setBackgroundColor("brown-gradient"));
              }}
            ></div>

            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-repeating-sunset"
              onClick={() => {
                dispatch(setBackgroundColor("repeating-sunset"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-circle-gradient bg-cover"
              onClick={() => {
                dispatch(setBackgroundColor("circle-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-mint-gradient"
              onClick={() => {
                dispatch(setBackgroundColor("mint-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-blood-gradient bg-cover"
              onClick={() => {
                dispatch(setBackgroundColor("blood-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className=" focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125 rounded-full aspect-square h-5 bg-hole-gradient bg-cover"
              onClick={() => {
                dispatch(setBackgroundColor("hole-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-5 bg-purple-brick-gradient bg-cover"
              onClick={() => {
                dispatch(setBackgroundColor("purple-brick-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className=" focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125 rounded-full aspect-square h-5 bg-leaf-gradient bg-cover"
              onClick={() => {
                dispatch(setBackgroundColor("leaf-gradient"));
              }}
            ></div>
            <div
              tabIndex={0}
              className=" focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125 rounded-full aspect-square h-5 bg-arrow-gradient bg-cover"
              onClick={() => {
                dispatch(setBackgroundColor("arrow-gradient"));
              }}
            ></div>
          </div>
        </div>

        <SubmitButton submitHandler={submitHandler}></SubmitButton>
      </div>
    </>
  );

  async function submitHandler() {
    if (caption === "" || caption === " ") {
      shareToStoryBtn.current!.disabled = true;
      inputArea.current?.classList.remove("hover:border-opacity-75");
      inputArea.current?.classList.remove("outline-none");
      inputArea.current?.classList.add("text-red-600");
      animatedTextRef.current?.classList.remove("text-blue-500");
      inputArea.current?.classList.replace("border-black", "border-red-500");
      exclamationSymbol.current?.classList.remove("hidden");
      needsToBeFormatted.current = true;
      return;
    } else {
      const res = await axios.post(TextStoryRoute, {
        user: userId,
        background,
        font,
        caption,
      });
      if (res.status === 200) {
        router.push("/");
        dispatch(resetState());
      }
    }
  }
}
