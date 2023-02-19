import {
  faEllipsisH,
  faUserFriends,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { AppDispatch, RootState } from "../../../src/store";
import { getFriendsForSuggestion } from "../../../src/friendSuggestionSlice";

export default function AddFriendSuggestion() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((store: RootState) => store.auth);
  const { friends, isDataLoading } = useSelector(
    (store: RootState) => store.friendsForSuggestion
  );
  useEffect(() => {
    if (userId) dispatch(getFriendsForSuggestion(String(userId)));
  }, [userId]);
  return (
    <>
      <div className="bg-dark p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-400">
            People you may know
          </h1>
          <div className="hover:bg-fb-gray rounded-full h-8 w-8 text-white grid place-items-center">
            <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {friends.length > 0 &&
            friends.map((friend) => (
              <div
                key={friend.user_id}
                className="h-max w-40 rounded-md overflow-hidden bg-dark border border-white border-opacity-20"
              >
                <div>
                  <img
                    src={friend.profile_pic}
                    className="h-full w-full aspect-square"
                    alt=""
                  />
                </div>
                <div className="p-2">
                  <div className="px-2 whitespace-nowrap text-white">{`${friend.first_name} ${friend.last_name}`}</div>
                  <div className="m-0 text-base px-2 text-white">
                    {0} mutual friends
                  </div>
                  <div className="flex w-full justify-center mt-1">
                    <button className="rounded-md text-blue-500 whitespace-nowrap w-full py-1 bg-fb-blue-200 hover:bg-fb-blue-100 hover:bg-opacity-40 bg-opacity-40">
                      <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon> Add
                      Friend
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
