import React, { useEffect, useMemo } from "react";
import withAuth from "../../src/withAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppDispatch, RootState } from "../../src/store";
import { useDispatch, useSelector } from "react-redux";
import { getStoryData, selectStory } from "../../src/storySlice";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import { getAuthData } from "../../src/authSlice";
import type { Story } from "../../src/storySlice";
import StoryOfAUser from "../../components/MainScrollSection/StoriesComponent/StoryOfAUser";

function StoriesPage() {
  const { profile, userName, userId } = useSelector(
    (store: RootState) => store.auth
  );

  const { isCreatingPhotoStory, isCreatingTextStory, story, selectedStory } =
    useSelector((store: RootState) => store.story);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userId === undefined) dispatch(getAuthData());

    if (story.length === 0 && userId) {
      dispatch(getStoryData(String(userId)));
    }
  }, [userId]);

  const onlyFriends = story.filter((it) =>
    Array.isArray(it)
      ? it[0].user_id != String(userId)
      : it.user_id != String(userId)
  );

  const onlyMe = story.filter((it) =>
    Array.isArray(it)
      ? it[0].user_id == String(userId)
      : it.user_id == String(userId)
  );

  return (
    <div className="align-self-start overflow-hidden flex gap-4 top-0 h-screen w-screen bg-slate-100">
      <div className="w-1/4 relative">
        <div className="pb-16 h-full overflow-auto overflow-x-hidden shadow-md shadow-gray bg-white">
          <div className="sticky top-0 bg-white z-10">
            <div className="flex py-2 px-4 items-center gap-2">
              <Link href={"/"}>
                <div className="text-3xl text-white grid place-items-center hover:bg-gray-600 h-10 aspect-square bg-gray-700 rounded-full">
                  <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </div>
              </Link>
              <Link href={"/"}>
                <div className="h-12 cursor-pointer border-none aspect-square rounded-full">
                  <img className="h-full w-full" src="/logo.svg" alt="" />
                </div>
              </Link>
            </div>
            <hr className="opacity-50  bg-black" />
          </div>

          <div className="p-4">
            <div className="text-2xl  font-bold">Stories</div>
            <div className="my-2 flex items-center text-base gap-1 text-blue-600 ">
              <Link className="cursor-pointer" href="/profile">
                Archive
              </Link>
              .
              <Link className="cursor-pointer" href="/">
                Setting
              </Link>
            </div>
            <div className="mb-4">
              <div className="text-lg font-semibold">Your Story</div>
            </div>

            <div className="flex gap-4 items-center my-4">
              {story.length >= 0 && onlyMe.length < 1 ? (
                <>
                  <Link href={"/stories/create"}>
                    <div className="h-14 w-14 bg-gray-200 hover:bg-gray-300 rounded-full text-blue-700 grid text-lg place-items-center">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                  </Link>

                  <div>
                    <div className=" font-bold">Create a story</div>
                    <div className="text-sm">
                      Share a photo or write something
                    </div>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => {
                    dispatch(
                      selectStory({
                        user: story[0].user_id,
                        story: story[0].stories[0].story_id,
                      })
                    );
                  }}
                  className={`${
                    selectedStory?.user === story[0].user_id
                      ? "bg-gray-300"
                      : ""
                  }  relative hover:bg-gray-300 flex items-center gap-4 rounded-lg w-full p-2`}
                >
                  <div
                    className={`h-12 w-12 outline-none outline-blue-500 outline-[3px] outline-offset-3 hover:bg-gray-300 rounded-full text-blue-700 grid text-lg place-items-center`}
                  >
                    <img className="rounded-full" src={profile!} alt="" />
                  </div>

                  <div>
                    <div className=" font-bold">{userName}</div>
                    <div className="text-sm"></div>
                  </div>
                  <Link href={"/stories/create"}>
                    <div className="absolute top-1/2 -translate-y-1/2 right-2 h-14 w-14 bg-gray-300 rounded-full text-blue-700 grid text-lg place-items-center">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                  </Link>
                </div>
              )}
            </div>
            {story.length > 0 && onlyFriends.length > 0 && (
              <div className="font-bold my-2">All Stories</div>
            )}

            {story.length === 1 && (
              <div className="text-gray-600 my-5">
                When friends, groups, and pages post stories their stories will
                show up here.
              </div>
            )}

            {onlyFriends.map((friend: Story) => {
              return (
                <div
                  key={friend.user_id}
                  onClick={() => {
                    dispatch(
                      selectStory({
                        user: friend.user_id,
                        story: friend.stories[0].story_id,
                      })
                    );
                  }}
                  className={`${
                    selectedStory?.user === friend.user_id ? "bg-gray-300" : ""
                  }  flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-300`}
                >
                  <div className="h-10 w-10 bg-gray-200 outline-none outline-blue-500 outline-[3px] outline-offset-3 rounded-full text-blue-700 grid text-lg place-items-center">
                    <img
                      className="rounded-full"
                      src={friend.profile_pic}
                      alt=""
                    />
                  </div>

                  <div>
                    <div className=" font-bold">
                      {`${friend.first_name} ${friend.last_name}`}
                    </div>
                    <div className="text-sm"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <StoryOfAUser></StoryOfAUser>
    </div>
  );
}

export default withAuth(StoriesPage);
export const getServerSideProps = () => {
  return {
    props: {
      shouldNavBarBeHidden: true,
    },
  };
};
