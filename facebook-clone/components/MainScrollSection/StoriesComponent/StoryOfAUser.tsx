import React, { MutableRefObject, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store";
import { selectStory, storySlice } from "../../../src/storySlice";
import { AnimatePresence, motion, useAnimation, useCycle } from "framer-motion";
import type { Story } from "../../../src/storySlice";
import Link from "next/link";
import { useRouter } from "next/router";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PausePlay from "./PausePlay";

export default function StoryOfAUser() {
  const router = useRouter();
  const {
    selectedStory,
    story: Stories,
    isStoryPaused,
  } = useSelector((store: RootState) => store.story);
  const controls = useAnimation();
  const time: MutableRefObject<number> = useRef(6);
  const timerRef = useRef<any>(null);
  const { profile } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    clearInterval(timerRef.current);
  }, [isStoryPaused]);

  useEffect(() => {
    const userData = Stories.filter(
      (user) => user.user_id === selectedStory?.user
    )[0];

    const IndividualStoryIndex = userData?.stories.findIndex(
      (story) => story.story_id === selectedStory?.story
    );

    let allThePrevStoryOfTheCurrentUser = userData?.stories.slice(
      0,
      IndividualStoryIndex
    );

    controls.set((story) => {
      if (allThePrevStoryOfTheCurrentUser?.some((st) => st.story_id === story))
        return { translate: 0 };
      else
        return {
          translate: "-100%",
        };
    });

    controls.start((story) => {
      return story === selectedStory?.story || story === "default"
        ? {
            translate: 0,
            transition: { duration: "6" },
          }
        : {};
    });

    if (selectedStory)
      timerRef.current = setInterval(() => {
        if (time.current > 0) time.current -= 1;
      }, 1000);

    return () => {
      time.current = 6;
      clearInterval(timerRef.current);
    };
  }, [selectedStory?.story]);

  return (
    <>
      <div className="flex justify-center h-full w-3/4 ">
        {!selectedStory?.story && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center">
              <img
                className="h-32 w-32"
                src="/storyPageDefaultPreviewImage.svg"
                alt=""
              />
              <div className="text-xl font-bold">Select a story to open</div>
            </div>
          </div>
        )}

        {selectedStory?.story === "default" && (
          <div className="flex justify-center h-full text-white group w-full bg-black">
            <motion.div
              initial={{ skewY: 2, scale: 0.5 }}
              animate={{ skewY: 0, scale: 1 }}
              className="flex flex-col items-center text-white bg-dark  justify-center h-[90%] w-[22rem] rounded-lg bg-cover m-4 relative origin-[30%_70%]"
              transition={{
                scale: { duration: 0.3 },
                skew: { duration: 0.2 },
                default: { ease: "linear" },
              }}
            >
              <Link href="/stories/create" className="group/card">
                <div className="w-28 text-center bg-white rounded-lg text-sm relative text-white pb-1">
                  <div className="h-36 grid bg-gray-500 rounded-t-md shadow">
                    <img
                      className="rounded-t-md h-full group-hover/card:opacity-70 object-cover "
                      src={profile!}
                      alt=""
                    />
                  </div>
                  <div className="flex items-center relative bottom-5 mb-[-1.25rem] justify-center">
                    <div className="rounded-full  justify-start bg-blue-500  border-[#1c1e21] border-4 h-max w-max p-2">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        width="1em"
                        height="1em"
                      >
                        <g fillRule="evenodd" transform="translate(-446 -350)">
                          <g fillRule="nonzero">
                            <path
                              d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z"
                              transform="translate(354.5 159.5)"
                            ></path>
                            <path
                              d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z"
                              transform="translate(354.5 159.5)"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="text-black">Create Story</div>
                </div>
              </Link>

              <div className="font-bold text-xl text-white my-2 ">
                Continue the Story
              </div>
              <span className="text-base text-white px-16">
                Your friends want to hear from you. Share a recent moment to
                take them behind the scenes.
              </span>
              <div className="w-full my-4 px-4">
                <Link href={"/stories/create"}>
                  <button className="bg-blue-500 rounded-md h-10 w-full">
                    Create a story
                  </button>
                </Link>
              </div>
              <div className="absolute grid top-0 w-full m-2">
                <div className="h-1 rounded-full mx-2 bg-gray-400 overflow-hidden">
                  <AnimatePresence>
                    <motion.div
                      initial={{ translate: "-100%" }}
                      animate={controls}
                      custom={"default"}
                      className="h-full w-full bg-white"
                      onAnimationComplete={() => {
                        clearInterval(timerRef.current);
                        router.push("/");
                      }}
                      exit={{ translate: 0 }}
                    ></motion.div>
                  </AnimatePresence>
                </div>
                <PausePlay
                  controls={controls}
                  time={time}
                  timerRef={timerRef}
                ></PausePlay>
              </div>
            </motion.div>
          </div>
        )}

        {selectedStory && selectedStory.story !== "default" && (
          <div className="grid grid-cols-3 justify-center  h-full group w-full bg-black">
            {hasPrevStory() && (
              <div
                onClick={() => {
                  goToPreviousStory();
                }}
                className="bg-gray-400 text-2xl hover:scale-105 hover:bg-gray-300 transition-all duration-100 flex items-center justify-center rounded-full h-14 w-14 justify-self-end self-center"
              >
                <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
              </div>
            )}

            {Stories.filter(
              (users) => users.user_id === selectedStory.user
            ).map((user) => {
              return (
                <motion.div
                  initial={{ skewY: 2, scale: 0.5 }}
                  animate={{ skewY: 0, scale: 1 }}
                  className="m-4 col-[2/2] justify-self-center relative origin-[30%_70%]"
                  transition={{
                    scale: { duration: 0.3 },
                    skew: { duration: 0.2 },
                    default: { ease: "linear" },
                  }}
                  key={user.user_id}
                >
                  {user.stories.filter(
                    (story) => story.story_id === selectedStory.story
                  )[0].story_type === "text" ? (
                    <div
                      className={`flex items-center text-white  justify-center h-[90%] w-[22rem] rounded-lg bg-cover ${fontComputer(
                        user.stories.filter(
                          (story) => story.story_id === selectedStory.story
                        )[0]?.options.font
                      )} 
                    bg-${
                      user.stories.filter(
                        (story) => story.story_id === selectedStory.story
                      )[0]?.options.background
                    }`}
                    >
                      {
                        user.stories.filter(
                          (story) => story.story_id === selectedStory.story
                        )[0]?.options.caption
                      }
                    </div>
                  ) : (
                    <div
                      className={`flex items-center text-white  justify-center h-[90%] w-[22rem] rounded-lg`}
                    >
                      <img
                        className="w-full h-full"
                        src={
                          user.stories.filter(
                            (story) => story.story_id === selectedStory.story
                          )[0]?.photo
                        }
                        alt=""
                      />
                    </div>
                  )}

                  <div className="absolute h-max top-2 w-full flex items-center justify-around ">
                    {user.stories.map((story, index) => {
                      return (
                        <div
                          key={index}
                          className="h-1 flex-1 mx-1 rounded-lg bg-gray-400 overflow-hidden"
                        >
                          <motion.div
                            initial={{ translate: "-100%" }}
                            custom={story.story_id}
                            animate={controls}
                            className="h-full w-full bg-white"
                            onAnimationComplete={() => {
                              if (selectedStory.story === story.story_id)
                                goToNextStory();

                              // if (manual.current) manual.current = false;
                            }}
                          ></motion.div>
                        </div>
                      );
                    })}
                    <div className="absolute h-4 top-[10%] right-0">
                      <PausePlay
                        controls={controls}
                        time={time}
                        timerRef={timerRef}
                      ></PausePlay>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {hasNextStory() && (
              <div
                onClick={() => {
                  goToNextStory();
                }}
                className="bg-gray-400 text-2xl hover:scale-105 hover:bg-gray-300 transition-all duration-100 flex items-center justify-center rounded-full h-14 w-14 justify-self-start self-center"
              >
                <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
  function hasNextStory() {
    const userData = Stories.filter(
      (user) => user.user_id === selectedStory?.user
    )[0];

    const IndividualStoryIndex = userData.stories.findIndex(
      (story) => story.story_id === selectedStory?.story
    );

    let nextStoryOfTheCurrentUser = userData.stories[IndividualStoryIndex + 1];

    if (!nextStoryOfTheCurrentUser) {
      const IndexOfCurrentUser = Stories.indexOf(userData as never);
      let nextStory = Stories[IndexOfCurrentUser + 1]?.stories[0];
      let nextUser = Stories[IndexOfCurrentUser + 1]?.user_id;

      if (nextUser) {
        return true;
      }
      if (!nextStory) {
        return false;
      }
    }

    return true;
  }
  function hasPrevStory() {
    const userData = Stories.filter(
      (user) => user.user_id === selectedStory?.user
    )[0];
    const IndividualStoryIndex = userData.stories.findIndex(
      (story) => story.story_id === selectedStory?.story
    );

    let prevStoryOfTheCurrentUser = userData.stories[IndividualStoryIndex - 1];

    if (!prevStoryOfTheCurrentUser) {
      const IndexOfCurrentUser = Stories.indexOf(userData as never);
      let prevStory = Stories[IndexOfCurrentUser - 1]?.stories[0];

      if (prevStory) return true;
      else return false;
    }
    return true;
  }

  function goToNextStory() {
    controls.stop();
    const userData = Stories.filter(
      (user) => user.user_id === selectedStory?.user
    )[0];

    const IndividualStoryIndex = userData.stories.findIndex(
      (story) => story.story_id === selectedStory?.story
    );

    let nextStoryOfTheCurrentUser = userData.stories[IndividualStoryIndex + 1];

    if (nextStoryOfTheCurrentUser)
      dispatch(
        selectStory({
          user: userData.user_id,
          story: nextStoryOfTheCurrentUser.story_id,
        })
      );

    if (!nextStoryOfTheCurrentUser) {
      const IndexOfCurrentUser = Stories.indexOf(userData as never);
      let nextStory = Stories[IndexOfCurrentUser + 1]?.stories[0];
      let nextUser = Stories[IndexOfCurrentUser + 1]?.user_id;

      if (nextUser)
        dispatch(selectStory({ user: nextUser, story: nextStory.story_id }));

      if (!nextUser)
        dispatch(selectStory({ user: "default", story: "default" }));
    }
  }

  function goToPreviousStory() {
    controls.stop();
    const userData = Stories.filter(
      (user) => user.user_id === selectedStory?.user
    )[0];
    const IndividualStoryIndex = userData.stories.findIndex(
      (story) => story.story_id === selectedStory?.story
    );

    let prevStoryOfTheCurrentUser = userData.stories[IndividualStoryIndex - 1];

    if (prevStoryOfTheCurrentUser)
      dispatch(
        selectStory({
          user: userData.user_id,
          story: prevStoryOfTheCurrentUser.story_id,
        })
      );

    if (!prevStoryOfTheCurrentUser) {
      const IndexOfCurrentUser = Stories.indexOf(userData as never);
      let prevStory = Stories[IndexOfCurrentUser - 1]?.stories[0];

      let prevUser = Stories[IndexOfCurrentUser - 1]?.user_id;

      if (prevUser)
        dispatch(selectStory({ user: prevUser, story: prevStory.story_id }));
    }
  }

  function fontComputer(font: string) {
    switch (font) {
      case "sans serif":
        return "font-[comic-sans-mc]";
      case "arial":
        return "font-mono";

      case "Comic Sans MS":
        return "font-[cursive]";
      case "Georgia":
        return "font-[Georgia]";
      case "helvetica":
        return "font-sherif";
    }
  }
}
