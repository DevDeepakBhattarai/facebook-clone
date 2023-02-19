import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store";
import {
  getStoryData,
  goToNextPage,
  goToPreviousPage,
  selectStory,
} from "../../../src/storySlice";
import { fontComputer } from "../../../utils/fontComputer";

export default function Stories() {
  const storiesContainer = useRef<HTMLDivElement>(null);
  const { profile, userId } = useSelector((store: RootState) => store.auth);
  const { story, isStoryLoading, currentPage, translateForPage } = useSelector(
    (store: RootState) => store.story
  );
  const dispatch = useDispatch<AppDispatch>();
  const totalPages = Math.ceil(story.length / 3);
  useEffect(() => {
    if (userId) dispatch(getStoryData(String(userId)));
  }, [userId]);

  return (
    <div className="relative overflow-hidden w-[35rem]">
      {!(currentPage === 1) && !isStoryLoading && (
        <div
          key={"Hello"}
          onClick={() => {
            dispatch(goToPreviousPage());
          }}
          className="absolute z-50 top-1/2 -translate-y-1/2 left-4 text-lg text-white bg-gray-500  flex items-center justify-center hover:bg-gray-400 h-10 w-10 rounded-full"
        >
          <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
        </div>
      )}

      {currentPage !== totalPages && !isStoryLoading && (
        <div
          key={"yo"}
          onClick={() => {
            dispatch(goToNextPage());
          }}
          className="absolute top-1/2 z-50 -translate-y-1/2 right-5 text-lg text-white bg-gray-500 flex items-center justify-center hover:bg-gray-400  h-10 w-10 rounded-full"
        >
          <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
        </div>
      )}

      <div
        style={{ translate: `${translateForPage}%` }}
        className="p-4 flex gap-4 transition-all duration-150"
        ref={storiesContainer}
      >
        <div className="relative group shadow-black rounded-lg shadow-sm ">
          <Link href="/stories/create">
            <div className="w-28 text-center text-sm relative text-white pb-1">
              <div className="h-36 grid bg-gray-400 rounded-lg overflow-hidden">
                <img
                  className="rounded-t-md h-full object-cover group-hover:opacity-40"
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
              Create Story
            </div>
          </Link>
        </div>

        {isStoryLoading && (
          <>
            <div>
              <div
                className={`w-28 h-full flex  group-hover:opacity-90 items-center justify-center rounded-lg text-center text-sm relative text-white pb-1 bg-cover bg-gray-500 animate-pulse`}
              ></div>
            </div>
            <div>
              <div
                className={`w-28 h-full flex  group-hover:opacity-90 items-center justify-center rounded-lg text-center text-sm relative text-white pb-1 bg-cover bg-gray-500 animate-pulse`}
              ></div>
            </div>
            <div>
              <div
                className={`w-28 h-full flex  group-hover:opacity-90 items-center justify-center rounded-lg text-center text-sm relative text-white pb-1 bg-cover bg-gray-500 animate-pulse`}
              ></div>
            </div>
          </>
        )}

        {!isStoryLoading && story.length === 0 && (
          <div className="text-center text-ellipsis text-xs my-auto text-white">
            <div className="text-start  flex items-center justify-start gap-2 my-2">
              <i
                className={`w-6 h-6 bg-no-repeat inline-block invert`}
                style={{
                  backgroundImage:
                    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/cyMuB14nIVm.png)",
                  backgroundPosition: "0 -216px",
                  backgroundSize: "34px 580px",
                }}
              ></i>
              Stories disappear after 24 hours
            </div>
            <div className="text-start flex items-center justify-start gap-2 my-2">
              <i
                className={`w-6 h-6 bg-no-repeat inline-block invert`}
                style={{
                  backgroundImage:
                    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/cyMuB14nIVm.png)",
                  backgroundPosition: "0 -320px",
                  backgroundSize: "34px 580px",
                }}
              ></i>
              Share everyday moments with friends and family
            </div>
            <div className="text-start flex items-center justify-start gap-2 my-2">
              <i
                className={`w-6 h-6 bg-no-repeat inline-block invert`}
                style={{
                  backgroundImage:
                    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/cyMuB14nIVm.png)",
                  backgroundPosition: "0 -112px",
                  backgroundSize: "34px 580px",
                }}
              ></i>
              Replies and reactions are private
            </div>
          </div>
        )}

        {story.length !== 0 &&
          story.map((user) => {
            const firstStory = user.stories[0];

            if (
              firstStory.story_type === "text" &&
              user.user_id == String(userId)
            )
              return (
                <div
                  key={user.user_id}
                  className="relative group shadow-black rounded-lg shadow-sm "
                  onClick={() => {
                    dispatch(
                      selectStory({
                        story: firstStory.story_id,
                        user: user.user_id,
                      })
                    );
                  }}
                >
                  <Link href="/stories">
                    <div
                      className={`w-28 h-full flex  group-hover:opacity-90 items-center justify-center rounded-lg text-center text-sm relative text-white pb-1 bg-cover bg-${firstStory.options.background}`}
                    >
                      <span
                        className={`${fontComputer(
                          firstStory.options.font
                        )} text-xs`}
                      >
                        {firstStory.options.caption}
                      </span>

                      <div className="absolute h-[2.5rem] w-[2.5rem] rounded-full top-4 left-4 overflow-hidden border-4 border-blue-500">
                        <img className="object-cover" src={profile!} alt="" />
                      </div>
                      <span className="absolute bottom-1 left-2 text-[0.8rem] font-bold">
                        Your Story
                      </span>
                    </div>
                  </Link>
                </div>
              );

            if (
              firstStory.story_type === "photo" &&
              user.user_id == String(userId)
            )
              return (
                <div
                  key={user.user_id}
                  className="relative group shadow-black rounded-lg shadow-sm "
                  onClick={() => {
                    dispatch(
                      selectStory({
                        story: firstStory.story_id,
                        user: user.user_id,
                      })
                    );
                  }}
                >
                  <Link href="/stories">
                    <div
                      className={`w-28 h-full flex group-hover:opacity-90 items-center justify-center rounded-lg text-center text-sm relative text-white pb-1 bg-cover`}
                    >
                      <img
                        className="h-full w-full"
                        src={firstStory.photo}
                        alt=""
                      />
                      <div className="absolute h-[2.5rem] w-[2.5rem] rounded-full top-4 left-4 overflow-hidden border-4 border-blue-500">
                        <img className="object-cover" src={profile!} alt="" />
                      </div>
                      <span className="absolute bottom-1 left-2 text-[0.8rem] font-bold">
                        Your Story
                      </span>
                    </div>
                  </Link>
                </div>
              );

            if (firstStory.story_type === "text")
              return (
                <div
                  onClick={() => {
                    dispatch(
                      selectStory({
                        user: user.user_id,
                        story: firstStory.story_id,
                      })
                    );
                  }}
                  key={user.user_id}
                  className="relative group shadow-black rounded-lg shadow-sm "
                >
                  <Link href="/stories">
                    <div
                      className={`w-28 h-full flex  group-hover:opacity-90 items-center justify-center rounded-lg text-center text-sm relative text-white pb-1 bg-cover bg-${firstStory.options.background}`}
                    >
                      <span
                        className={`${fontComputer(
                          firstStory.options.font
                        )} text-xs`}
                      >
                        {firstStory.options.caption}
                      </span>
                    </div>
                    <div className="absolute h-[2.5rem] w-[2.5rem] rounded-full top-4 left-4 overflow-hidden border-4 border-blue-500">
                      <img
                        className="object-cover"
                        src={user.profile_pic}
                        alt=""
                      />
                    </div>
                    <span className="absolute bottom-1 left-2 text-white text-[0.8rem] font-bold">
                      {`${user.first_name} ${user.last_name}`}
                    </span>
                  </Link>
                </div>
              );

            if (firstStory.story_type === "photo")
              return (
                <div
                  onClick={() => {
                    dispatch(
                      selectStory({
                        user: user.user_id,
                        story: firstStory.story_id,
                      })
                    );
                  }}
                  key={user.user_id}
                  className="relative group shadow-black rounded-lg shadow-sm "
                >
                  <Link href="/stories">
                    <div
                      className={`w-28 h-full flex  group-hover:opacity-90 items-center justify-center rounded-lg text-center text-sm relative text-white pb-1 bg-cover bg-${firstStory.options.background}`}
                    >
                      <img
                        className="h-full w-full"
                        src={firstStory.photo}
                        alt=""
                      />
                    </div>
                    <div className="absolute h-[2.5rem] w-[2.5rem] rounded-full top-4 left-4 overflow-hidden border-4 border-blue-500">
                      <img
                        className="object-cover"
                        src={user.profile_pic}
                        alt=""
                      />
                    </div>
                    <span className="absolute bottom-1 left-2 text-white text-[0.8rem] font-bold">
                      {`${user.first_name} ${user.last_name}`}
                    </span>
                  </Link>
                </div>
              );
          })}
      </div>
    </div>
  );
}
