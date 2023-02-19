import React, { useEffect, useRef, useState } from "react";
import { useOutClick } from "../hooks/useOutClick";
import MenuPopup from "./Profile/MenuPopupToAccessProfile";

export const animationEnder = (isActive) => {
  if (isActive) {
    document.querySelector(".search-result").classList.remove("active");
    document.querySelector(".logo").classList.remove("active");
    document.querySelector(".nav-bar-arrow").classList.toggle("display");
    document.querySelector(".search-icon").classList.remove("animation");
    document.querySelector(".search-icon").addEventListener(
      "animationend",
      () => {
        document.querySelector(".search-icon").style.display = "none";
        document.querySelector(".nav-bar-input").classList.remove("animation");
      },
      { once: true }
    );
    document.querySelector(".search-icon").style.display = "block";

    document.querySelector(".nav-bar-search-bar").classList.remove("active");
  }
};

export default function Navbar() {
  const { isActive, setIsActive, ref } = useOutClick();
  const [controller, setController] = useState(false);

  useEffect(() => {
    setController(true);
  }, []);

  const searchAnimationStarter = (e) => {
    if (!isActive) {
      setIsActive(true);

      document.querySelector(".search-result").classList.toggle("active");
      document.querySelector(".logo").classList.toggle("active");
      document.querySelector(".nav-bar-arrow").classList.toggle("display");
      document.querySelector(".search-icon").classList.toggle("animation");
      document.querySelector(".search-icon").addEventListener(
        "animationend",
        () => {
          document.querySelector(".search-icon").style.display = "none";
          document
            .querySelector(".nav-bar-input")
            .classList.toggle("animation");
        },
        { once: true }
      );
      document.querySelector(".search-icon").style.display = "block";
      document.querySelector(".nav-bar-search-bar").classList.toggle("active");
    } else return;
  };

  const activeToggler = (index) => {
    const pages = document.getElementsByClassName("nav-bar-mid-icons");
    for (let i = 0; i < pages.length; i++) {
      if (i !== index) {
        pages[i].classList.remove("active");
      } else {
        pages[index].classList.add("active");
      }
    }
  };

  return (
    <nav className="nav-bar">
      <div className="nav-bar-elements">
        <svg
          className="logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="48px"
          height="48px"
        >
          <linearGradient
            id="Ld6sqrtcxMyckEl6xeDdMa"
            x1="9.993"
            x2="40.615"
            y1="9.993"
            y2="40.615"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#2aa4f4" />
            <stop offset="1" stopColor="#007ad9" />
          </linearGradient>
          <path
            fill="url(#Ld6sqrtcxMyckEl6xeDdMa)"
            d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
          />
          <path
            fill="#fff"
            d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
          />
        </svg>

        <div
          className="nav-bar-search-bar"
          onClick={(e) => {
            searchAnimationStarter(e);
          }}
        >
          <label className="search-icon" htmlFor="search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 50 50"
              width="50px"
              height="50px"
            >
              <path
                d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"
                stroke="white"
                strokeWidth="2px"
              />
            </svg>
          </label>
          <input
            className="nav-bar-input p-2"
            type="search"
            name="search"
            id=""
            placeholder="Search Facebook"
          />
        </div>
      </div>
      <div className="search-result" ref={ref}>
        <li
          className="nav-bar-arrow display"
          onClick={() => {
            animationEnder(isActive);
            setIsActive(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="gray"
            viewBox="0 0 493.578 493.578"
          >
            <path d="M487.267,225.981c0-17.365-13.999-31.518-31.518-31.518H194.501L305.35,83.615c12.24-12.24,12.24-32.207,0-44.676   L275.592,9.18c-12.24-12.24-32.207-12.24-44.676,0L15.568,224.527c-6.12,6.12-9.256,14.153-9.256,22.262   c0,8.032,3.136,16.142,9.256,22.262l215.348,215.348c12.24,12.239,32.207,12.239,44.676,0l29.758-29.759   c12.24-12.24,12.24-32.207,0-44.676L194.501,299.498h261.094c17.366,0,31.519-14.153,31.519-31.519L487.267,225.981z" />
          </svg>
        </li>
        {isActive && <p className="result-of-search">No recent search</p>}
      </div>
      <div className="nav-bar-elements-mid">
        <li
          className="nav-bar-mid-icons active"
          onClick={() => activeToggler(0)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            viewBox="0 0 24 24"
          >
            {" "}
            <path d="M 12 2 A 1 1 0 0 0 11.289062 2.296875 L 1.203125 11.097656 A 0.5 0.5 0 0 0 1 11.5 A 0.5 0.5 0 0 0 1.5 12 L 4 12 L 4 20 C 4 20.552 4.448 21 5 21 L 9 21 C 9.552 21 10 20.552 10 20 L 10 14 L 14 14 L 14 20 C 14 20.552 14.448 21 15 21 L 19 21 C 19.552 21 20 20.552 20 20 L 20 12 L 22.5 12 A 0.5 0.5 0 0 0 23 11.5 A 0.5 0.5 0 0 0 22.796875 11.097656 L 12.716797 2.3027344 A 1 1 0 0 0 12.710938 2.296875 A 1 1 0 0 0 12 2 z" />
          </svg>
        </li>

        <li className="nav-bar-mid-icons" onClick={() => activeToggler(1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            fill="currentColor"
          >
            <path d="M8.75 25.25C8.336 25.25 8 24.914 8 24.5 8 24.086 8.336 23.75 8.75 23.75L19.25 23.75C19.664 23.75 20 24.086 20 24.5 20 24.914 19.664 25.25 19.25 25.25L8.75 25.25ZM17.163 12.846 12.055 15.923C11.591 16.202 11 15.869 11 15.327L11 9.172C11 8.631 11.591 8.297 12.055 8.576L17.163 11.654C17.612 11.924 17.612 12.575 17.163 12.846ZM21.75 20.25C22.992 20.25 24 19.242 24 18L24 6.5C24 5.258 22.992 4.25 21.75 4.25L6.25 4.25C5.008 4.25 4 5.258 4 6.5L4 18C4 19.242 5.008 20.25 6.25 20.25L21.75 20.25ZM21.75 21.75 6.25 21.75C4.179 21.75 2.5 20.071 2.5 18L2.5 6.5C2.5 4.429 4.179 2.75 6.25 2.75L21.75 2.75C23.821 2.75 25.5 4.429 25.5 6.5L25.5 18C25.5 20.071 23.821 21.75 21.75 21.75Z"></path>
          </svg>
        </li>

        <li className="nav-bar-mid-icons" onClick={() => activeToggler(2)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <title />
            <path d="M28.908,12.571a.952.952,0,0,0-.1-.166,3.146,3.146,0,0,0-.118-.423c-.006-.016-.012-.032-.02-.048L25.917,5.6A1,1,0,0,0,25,5H7a1,1,0,0,0-.917.6l-2.77,6.381a2.841,2.841,0,0,0,0,2.083A4.75,4.75,0,0,0,6,16.609V27a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V16.609a4.749,4.749,0,0,0,2.687-2.543,2.614,2.614,0,0,0,.163-.655A1.057,1.057,0,0,0,28.908,12.571ZM13,26V20h2v6Zm4,0V20h2v6Zm7,0H21V19a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1v7H8V17a5.2,5.2,0,0,0,4-1.8,5.339,5.339,0,0,0,8,0A5.2,5.2,0,0,0,24,17Zm2.837-12.7A3.015,3.015,0,0,1,24,15a2.788,2.788,0,0,1-3-2.5,1,1,0,0,0-2,0A2.788,2.788,0,0,1,16,15a2.788,2.788,0,0,1-3-2.5,1,1,0,0,0-2,0A2.788,2.788,0,0,1,8,15a3.016,3.016,0,0,1-2.838-1.7.836.836,0,0,1,0-.571L7.656,7H24.344l2.477,5.7A.858.858,0,0,1,26.837,13.3Z" />
          </svg>
        </li>

        <li className="nav-bar-mid-icons" onClick={() => activeToggler(3)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            fill="currentColor"
          >
            <path d="M10.25 18.5h6.25a.5.5 0 01.5.5v5.5a.5.5 0 01-.5.5H4.25C3.56 25 3 24.44 3 23.75V4.25C3 3.56 3.56 3 4.25 3h19.5c.69 0 1.25.56 1.25 1.25V9a.5.5 0 01-.5.5H10.25a.75.75 0 00-.75.75v7.5c0 .414.336.75.75.75zM11.5 17a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5h13a.5.5 0 01.5.5v12.25c0 .69-.56 1.25-1.25 1.25H19a.5.5 0 01-.5-.5v-6.75a.75.75 0 00-.75-.75H11.5z"></path>
          </svg>
        </li>
      </div>
      <div className="nav-bar-elements-right">
        <li className="nav-bar-right-icons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 44 44"
          >
            <circle cx="7" cy="7" r="6"></circle>
            <circle cx="22" cy="7" r="6"></circle>
            <circle cx="37" cy="7" r="6"></circle>
            <circle cx="7" cy="22" r="6"></circle>
            <circle cx="22" cy="22" r="6"></circle>
            <circle cx="37" cy="22" r="6"></circle>
            <circle cx="7" cy="37" r="6"></circle>
            <circle cx="22" cy="37" r="6"></circle>
            <circle cx="37" cy="37" r="6"></circle>
          </svg>
        </li>
        <li className="nav-bar-right-icons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            alt=""
            fill="currentColor"
          >
            <path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path>
          </svg>
        </li>
        <li className="nav-bar-right-icons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            alt=""
            fill="currentColor"
          >
            <path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path>
          </svg>
        </li>

        {controller && <MenuPopup></MenuPopup>}
      </div>
    </nav>
  );
}
