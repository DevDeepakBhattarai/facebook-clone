import React, { useEffect, useRef } from "react";
import style from "../../styles/profile.module.css";
import Hamburger from "./PopupForTheHamburger";
import Popup from "./Popup";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/store";
import { uploadProfile } from "../../src/profileSlice";

export default function componentName() {
  const fixedHeader = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { userId } = router.query;
  const { pathname } = router;
  const { profilePicture, userName, loading, noOfFriends } = useSelector(
    (store: RootState) => store.profile
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) {
            if (fixedHeader.current)
              fixedHeader.current.style.display = "block";
          }
          if (entries[0].isIntersecting) {
            if (fixedHeader.current) fixedHeader.current.style.display = "none";
          }
        },
        { threshold: 0 }
      );
      observer.observe(header.current!);
    }
  }, []);
  return (
    <>
      <Script
        src="https://kit.fontawesome.com/ca88a3f137.js"
        defer
        crossOrigin="anonymous"
      ></Script>

      <header className={style.profilePageHeader}>
        <div className={style.fixedHeader} ref={fixedHeader}>
          <div className={style.fixedHeaderContent}>
            <div className={style.fixedHeaderUserData}>
              <div className={style.fixedHeaderImageContainer}>
                <img src={profilePicture} alt="" />
              </div>
              {userName}
            </div>

            <Hamburger></Hamburger>
          </div>
        </div>

        <div className={style.headerContent} ref={header}>
          <div
            className={
              loading
                ? `${style.coverImageHolder} bg-gray-600 animate-pulse`
                : style.coverImageHolder
            }
          >
            <img src={profilePicture} alt="" />
            <button className={style.addCoverPhotoBtn}>
              <i className="fa-solid fa-camera"></i>
              <span>Add cover photo</span>
            </button>
          </div>

          <div className={style.userData}>
            <span className={style.aboutUser}>
              <div
                className={
                  loading
                    ? `${style.profilePicHolder} animate-pulse`
                    : style.profilePicHolder
                }
              >
                <img src={profilePicture} alt="" />
                <span
                  onClick={() => {
                    dispatch(uploadProfile());
                  }}
                  className={style.cameraIconHolder}
                >
                  <i className="fa-solid fa-camera"></i>
                </span>
              </div>
              <div className="flex flex-col justify-center items-center md:items-start">
                <h1 className={`${style.userName} text-xl`}>
                  <div
                    className={
                      loading
                        ? "h-4 w-36 bg-gray-400 animate-pulse rounded"
                        : ""
                    }
                  >
                    {userName}
                  </div>
                </h1>
                <span className="text-gray-500 text-base hover:underline cursor-pointer font-bold">
                  {noOfFriends} Friends
                </span>
              </div>
            </span>

            <span className={style.buttonContainer}>
              <button className={style.addToStoryBtn}>
                <i className="fa-solid fa-circle-plus fa-l fa-inverse"></i>
                <p>Add Profile</p>
              </button>
              <button className={style.editProfileBtn}>
                <i className="fa fa-pencil fa-inverse"></i>
                <p>Edit Profile</p>
              </button>
            </span>
          </div>

          <hr className={style.hr} />

          <nav className={style.profilePageNavbar}>
            <ul className={style.navItems}>
              <Link href={`/profile/${userId}`}>
                <li
                  className={
                    pathname.split("/").length === 3
                      ? style.activeButton
                      : style.notActiveButton
                  }
                >
                  {" "}
                  Posts
                </li>
              </Link>
              <Link href={"/"}>
                <li
                  className={
                    pathname.includes("/about")
                      ? style.activeButton
                      : style.notActiveButton
                  }
                >
                  About
                </li>
              </Link>
              <Link href={`/profile/${userId}/friend`}>
                <li
                  className={
                    pathname.includes("/friend")
                      ? style.activeButton
                      : style.notActiveButton
                  }
                >
                  Friends
                </li>{" "}
              </Link>
              <Link href={"/"}>
                <li
                  className={
                    pathname.includes("/photos")
                      ? style.activeButton
                      : style.notActiveButton
                  }
                >
                  Photos
                </li>
              </Link>
              <Link href={"/"}>
                <li
                  className={
                    pathname.includes("/videos")
                      ? style.activeButton
                      : style.notActiveButton
                  }
                >
                  Videos
                </li>
              </Link>
              <Link href={"/"}>
                <li
                  className={
                    pathname.includes("/check-ins")
                      ? style.activeButton
                      : style.notActiveButton
                  }
                >
                  Check-ins
                </li>
              </Link>
              <Popup />
            </ul>
            <Hamburger />
          </nav>
        </div>
      </header>
    </>
  );
}
