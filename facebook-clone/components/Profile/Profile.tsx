"use client";
import Head from "next/head";
import Script from "next/script";
import React, { useRef } from "react";
import style from "../../styles/profile.module.css";
import Footer from "./PopupForFooterLink";
import Link from "next/link";
import Header from "./Header";
import { useSelector } from "react-redux";
import { RootState } from "../../src/store";
import { useRouter } from "next/router";
import UploadProfile from "./UploadProfile";

export default function Profile() {
  const commentInputContainer = useRef<HTMLDivElement>(null);
  const paperPlaneContainer = useRef<HTMLDivElement>(null);
  const Icons = useRef<HTMLDivElement>(null);
  const inputOfCommentSection = useRef<HTMLInputElement>(null);
  const {
    isFriendsLoading,
    userName,
    dateOfBirth,
    profilePicture,
    noOfFriends,
    loading,
    isUploadingProfile,
    friends,
  } = useSelector((store: RootState) => store.profile);
  const router = useRouter();
  const { userId } = router.query;

  return (
    <>
      <Head>
        <title>Facebook</title>
        <link rel="icon" href="http://192.168.1.75:3001/images/logo.svg" />
      </Head>
      <Script
        src="https://kit.fontawesome.com/ca88a3f137.js"
        defer
        crossOrigin="anonymous"
      ></Script>
      <div
        style={isUploadingProfile ? { overflow: "hidden" } : {}}
        className={style.profilePage}
      >
        <Header></Header>

        <UploadProfile></UploadProfile>
        <main className={style.profileBody}>
          <div className={style.firstSection}>
            <div className={style.intro}>
              <h3 className={style.profileBody__hero}>Intro</h3>
              <button className={style.introButtons}>Add bio</button>
              <button className={style.introButtons}>Edit Details</button>
              <button className={style.introButtons}>Add hobbies</button>
              <button className={style.introButtons}>Add Features</button>
            </div>
            <div className={style.photos}>
              <h3 className={style.profileBody__hero}>Photos</h3>
              <button>See all photos</button>
            </div>
            {!isFriendsLoading && friends.length < 1 && (
              <div className={style.friends}>
                <h3 className={style.profileBody__hero}>Friends</h3>
                <button>See all friends </button>
              </div>
            )}

            {isFriendsLoading && (
              <div className="h-auto bg-white p-4 rounded-lg">
                <div className="h-4 w-32 bg-gray-400 animate-pulse rounded mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                  <div className="bg-gray-400 h-32 w-32 animate-pulse rounded-lg"></div>
                </div>
              </div>
            )}
            {!isFriendsLoading && friends.length > 0 && (
              <div className="h-auto bg-white p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span>
                    <h1 className="text-lg font-semibold m-0"> Friends </h1>{" "}
                    <b> {noOfFriends}</b>{" "}
                    {noOfFriends === 1 ? "friend" : "friends"}{" "}
                  </span>
                  <Link
                    href={`/profile/${userId}/friend`}
                    className="text-blue-600 hover:underline"
                  >
                    See all photos
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-4 ">
                  {friends.slice(0, 9).map((friend) => {
                    return (
                      <div key={friend.user_id}>
                        <div className="bg-gray-400  rounded-lg mb-2 overflow-hidden">
                          <img
                            src={friend.profile_pic}
                            className="h-min aspect-square"
                            alt=""
                          />
                        </div>
                        <p className="text-gray-700 font-semibold text-sm">{`${friend.first_name} ${friend.last_name}`}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* //? Copy from leftsection */}
            <div className={style.differentLinks}>
              <p className="links">
                <a href="https://www.facebook.com/privacy/policy/?entry_point=comet_dropdown">
                  Privacy
                </a>{" "}
                .<a href="https://www.facebook.com/policies_center/">Terms</a> .{" "}
                <a href="https://www.facebook.com/business">Advertising</a> .{" "}
                <a href="https://www.facebook.com/help/568137493302217">
                  Ad choices
                </a>{" "}
                .{" "}
                <a href="https://www.facebook.com/policies/cookies">Cookies</a>{" "}
                .<Footer></Footer>
                .Meta &copy; 2022
              </p>
            </div>
          </div>

          <div className={style.secondSection}>
            <div className={style.uploadingSection}>
              <div className={style.inputSection}>
                <span
                  className={
                    loading
                      ? `${style.inputSectionImageContainer} animate-pulse bg-gary-500`
                      : style.inputSectionImageContainer
                  }
                >
                  <img src={profilePicture} alt="" />
                </span>
                <input type="text" placeholder="What's on your mind?" />
              </div>
              <hr className={style.hr} />

              <div className={style.buttonContainerOfInputSection}>
                <button>
                  <span className={style.logos}></span>
                  Live Video
                </button>
                <button>
                  <span className={style.logos}></span>
                  Photo/Video
                </button>
                <button>
                  <span className={style.logos}></span>
                  Life event
                </button>
              </div>
            </div>

            <div className={style.posts}>
              <div className={style.postSectionHeading}>
                <h3 className={style.profileBody__hero}>Posts</h3>
                <div className={style.postSectionButtonContainer}>
                  <button>
                    <span></span>
                    Filters
                  </button>

                  <button>
                    <span></span>
                    Manage Posts
                  </button>
                </div>
              </div>
              <hr className={style.hr} />

              <div className={style.viewSwitcher}>
                <button
                  className={`${style.listViewBtn} ${style.activeButton}`}
                >
                  <i className="fa fa-thin fa-bars"></i>
                  <p>List View</p>
                </button>
                <button className={style.gridViewBtn}>
                  <span></span>
                  <p>Grid View</p>
                </button>
              </div>
            </div>

            <div
              className={
                loading
                  ? `${style.birthDateOfUser} animate-pulse`
                  : style.birthDateOfUser
              }
            >
              <div className={style.birthDateOfUser__heading}>
                <div className={style.profilePicOfUser}>
                  <span
                    className={
                      loading
                        ? `${style.profilePicHolderOfBirthDateOfOUser} animate-pulse bg-gary-500`
                        : style.profilePicHolderOfBirthDateOfOUser
                    }
                  >
                    <img src={profilePicture} alt="" />
                  </span>
                  <div
                    className={
                      loading
                        ? `${style.userNameContainer} h-4 w-32 animate-pulse bg-gray-400`
                        : style.userNameContainer
                    }
                  >
                    <p>{userName}</p>
                    <span className={style.headingDateContainer}>
                      December 10 ,2005 .
                      <i className="fa fa-solid fa-clock"></i> .
                      <i className="fa fa-duotone fa-people-group"></i>
                    </span>
                  </div>
                </div>

                <div className={style.hamburgerOfPost}>
                  <i className="fas fa-ellipsis-h"></i>
                </div>
              </div>

              <div className={style.date}>
                <span className={style.logoOfTheDateThingContainer}>
                  <img src="/datething.png" alt="" />
                </span>
                <span className={style.usersBirthDate}>
                  Born on {dateOfBirth}
                </span>
              </div>
              <hr className={style.hr} style={{ marginBottom: "2px" }} />
              <div className={style.interactionButtonContainer}>
                <button>
                  <i className="far fa-light fa-thumbs-up"></i>
                  Like
                </button>
                <button>
                  <i className="far fa-light fa-comment"></i>
                  Comment
                </button>
                <button>
                  <i className="far fa-solid fa-share"></i>
                  Share
                </button>
              </div>
              <hr className={style.hr} style={{ marginTop: "2px" }} />

              <div className={style.commentingSection}>
                <div className={style.inputSection}>
                  <span
                    className={
                      loading
                        ? `animate-pulse bg-gray-500  ${style.inputSectionImageContainer}`
                        : style.inputSectionImageContainer
                    }
                  >
                    <img src={profilePicture} alt="" />
                    <div className={style.caretContainer}>
                      <i className="fa-solid fa-chevron-down fa-xs"></i>
                    </div>
                  </span>

                  <div
                    className={style.inputContainer}
                    ref={commentInputContainer}
                    onClick={commentSectionClickHandler}
                  >
                    <input
                      ref={inputOfCommentSection}
                      type="text"
                      placeholder="Write a comment..."
                    />

                    <div className={style.wrapperOfIcons} ref={Icons}>
                      <div className={style.differentIconsContainer}>
                        <div className={style.commentSectionIcons}>
                          <span></span>
                        </div>
                        <div className={style.commentSectionIcons}>
                          <span></span>
                        </div>
                        <div className={style.commentSectionIcons}>
                          <span></span>
                        </div>
                        <div className={style.commentSectionIcons}>
                          <span></span>
                        </div>
                        <div className={style.commentSectionIcons}>
                          <span></span>
                        </div>
                      </div>

                      <div
                        className={style.sendButton}
                        ref={paperPlaneContainer}
                      >
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
  function commentSectionClickHandler() {
    if (inputOfCommentSection.current) {
      inputOfCommentSection.current.focus();
      inputOfCommentSection.current.style.width = "100%";
    }
    if (commentInputContainer.current) {
      commentInputContainer.current.style.flexDirection = "column";
      commentInputContainer.current.style.alignItems = "flex-start";
      commentInputContainer.current.style.gap = ".8em";
      commentInputContainer.current.style.borderRadius = "10px";

      paperPlaneContainer.current
        ? (paperPlaneContainer.current.style.display = "flex")
        : null;
      Icons.current ? (Icons.current.style.width = "100%") : null;
    }
  }
}
