import React from "react";
import { useState } from "react";
import Stories from "./StoriesComponent/Stories";
export default function VideoSection() {
  const [active, setActive] = useState("stories");
  return (
    <>
      <div className="h-max  rounded-lg bg-[#1c1e21]">
        <div className="flex justify-around py-1 h-max px-4">
          <div
            className="flex-1 justify-center flex flex-col relative"
            onClick={storiesHandler}
          >
            <button
              className={
                active === "stories"
                  ? `flex items-center text-blue-500 justify-center gap-2 text-base  
                        rounded-lg py-2 px-4`
                  : `flex items-center justify-center gap-2 text-base text-gray-400 
                        rounded-lg py-2 px-4 hover:bg-gray-500 `
              }
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                width="1em"
                height="1em"
              >
                <g fillRule="evenodd" transform="translate(-446 -350)">
                  <path d="M457 368.832a.5.5 0 0 0 .883.323l1.12-1.332a.876.876 0 0 1 .679-.323h3.522a2.793 2.793 0 0 0 2.796-2.784v-10.931a2.793 2.793 0 0 0-2.796-2.785h-3.454a2.75 2.75 0 0 0-2.75 2.75v15.082zm-1.5 0a.5.5 0 0 1-.883.323l-1.12-1.332a.876.876 0 0 0-.679-.323h-3.522a2.793 2.793 0 0 1-2.796-2.784v-10.931a2.793 2.793 0 0 1 2.796-2.785h3.454a2.75 2.75 0 0 1 2.75 2.75v15.082z"></path>
                </g>
              </svg>
              Stories
            </button>
            <div
              className={
                active === "stories"
                  ? "bg-blue-500 h-[3px] w-full absolute top-[105%]"
                  : ""
              }
            ></div>
          </div>
          <div
            className="flex-1 justify-center flex flex-col relative"
            onClick={reelsHandler}
          >
            <button
              className={
                active === "reels"
                  ? ` flex items-center justify-center gap-2 text-base text-blue-500  
                            rounded-lg py-2 px-4`
                  : `flex items-center justify-center gap-2 text-base text-gray-400  
                    rounded-lg py-2 px-4 hover:bg-gray-500 
                    `
              }
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                width="1em"
                height="1em"
              >
                <g fillRule="evenodd" transform="translate(-446 -350)">
                  <path d="M454.59 355h4.18l-2.4-4h-3.28c-.22 0-.423.008-.624.017L454.59 355zm6.514 0h3.695c-.226-1.031-.65-1.79-1.326-2.489-1.061-1.025-2.248-1.488-4.392-1.511h-.379l2.401 4zm-8.78 0-1.942-3.64c-.73.247-1.315.63-1.868 1.165-.668.69-1.09 1.445-1.315 2.475h5.125zm7.043 7.989a.711.711 0 0 1-.22.202l-4.573 2.671-.05.027a.713.713 0 0 1-1.024-.643v-5.343l.002-.056a.714.714 0 0 1 1.072-.56l4.572 2.67.054.036a.714.714 0 0 1 .167.996zm-12.366-5.99V363.083l.001.03v.112l.005.048h.001c.05 2.02.513 3.176 1.506 4.203 1.102 1.066 2.324 1.525 4.577 1.525h5.99c2.144-.023 3.331-.486 4.392-1.511 1.005-1.04 1.467-2.198 1.517-4.217h.003c.003-.1.005-.1.006-.204l.001-.156V357h-18z"></path>
                </g>
              </svg>
              Reels
            </button>
            <div
              className={
                active === "reels"
                  ? "bg-blue-500 h-[3px] w-full absolute top-[105%]"
                  : ""
              }
            ></div>
          </div>
          <div
            className="flex-1 justify-center flex flex-col relative"
            onClick={roomsHandler}
          >
            <button
              className={
                active === "rooms"
                  ? `text-blue-500 flex items-center gap-2 text-base justify-center
                    rounded-lg py-2 px-4`
                  : `text-gray-400 flex items-center gap-2 text-base justify-center hover:bg-gray-500 
                    rounded-lg py-2 px-4`
              }
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                width="1em"
                height="1em"
              >
                <g fillRule="evenodd" transform="translate(-446 -350)">
                  <path d="M457.25 361H455v2.25a1 1 0 0 1-2 0V361h-2.25a1 1 0 0 1 0-2H453v-2.25a1 1 0 0 1 2 0V359h2.25a1 1 0 0 1 0 2m8.241-5.889a.962.962 0 0 0-.998.063L462 356.938v-1.188a2.754 2.754 0 0 0-2.75-2.75h-10.5a2.754 2.754 0 0 0-2.75 2.75v8.5a2.754 2.754 0 0 0 2.75 2.75h10.5a2.754 2.754 0 0 0 2.75-2.75v-1.188l2.503 1.77a.953.953 0 0 0 .988.057.95.95 0 0 0 .509-.841v-8.096a.95.95 0 0 0-.509-.841"></path>
                </g>
              </svg>
              Rooms
            </button>
            <div
              className={
                active === "rooms"
                  ? "bg-blue-500 h-[3px] w-full absolute top-[105%]"
                  : ""
              }
            ></div>
          </div>
        </div>
        <hr className="opacity-20 bg-gray-200  h-[0.01em]" />

        <Stories></Stories>
      </div>
    </>
  );
  function storiesHandler() {
    setActive("stories");
  }
  function reelsHandler() {
    setActive("reels");
  }
  function roomsHandler() {
    setActive("rooms");
  }
}
