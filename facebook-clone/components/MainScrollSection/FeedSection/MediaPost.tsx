import { faThumbsUp, faComment } from "@fortawesome/free-regular-svg-icons";
import {
  faEllipsisH,
  faHeart,
  faShare,
  faMultiply,
  faThumbsUp as FilledLike,
  faPeopleGroup,
  faThumbTack,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Post } from "../../../src/postSlice";
import { getTimeDifference } from "../../../utils/getTimeDifference";
import PostImageGrid from "./PostImageGrid";
import { useAnimation } from "framer-motion";
import axios from "axios";
import { PostsRoute } from "../../../Routes";
import { useSelector } from "react-redux";
import { RootState } from "../../../src/store";
import CommentSection from "./CommentSection";

export default function Posts({
  post_id,
  first_name,
  last_name,
  profile_pic,
  caption,
  media,
  total_likes,
  uploaded_at,
  total_comments,
  hasLiked,
  additional_comment,
}: Post) {
  const controls = useAnimation();
  const { userId } = useSelector((store: RootState) => store.auth);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(hasLiked);
  return (
    <div className="bg-dark mt-4 rounded-lg">
      <div className="p-4">
        <div className="flex items-center justify-between ">
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-500 hover:opacity-50">
              <img src={profile_pic} alt="" />
            </div>

            <div className="flex flex-col text-white">
              <div className="text-base font-semibold">
                {`${first_name} ${last_name}`}
                {additional_comment && (
                  <span className="text-gray-400 ml-2 font-thin">
                    {additional_comment}
                  </span>
                )}
              </div>

              <div className="text-xs font-light">
                {getTimeDifference(uploaded_at)}{" "}
                <strong className="font-semibold">. </strong>
                <FontAwesomeIcon icon={faPeopleGroup}></FontAwesomeIcon>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full text-gray-400 hover:bg-fb-gray">
              <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
            </div>
            <div className="flex items-center justify-center h-10 w-10 rounded-full text-gray-400 hover:bg-fb-gray">
              <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <span
            className={`text-white ${media.length < 1 ? "text-lg py-2" : ""}`}
          >
            {caption}
          </span>
        </div>
      </div>

      {media.length > 0 && (
        <div className="h-max bg-fb-gray w-full flex justify-end">
          <PostImageGrid media={media}></PostImageGrid>
        </div>
      )}

      <div className={`px-4 pb-4 ${media.length > 0 ? "mt-4" : ""}`}>
        <div className="flex items-center justify-between ">
          <div>
            <div></div>
            {total_likes !== 0 && (
              <span className="text-gray-400 hover:underline flex gap-2">
                <div className="flex text-white">
                  <span className="bg-red-500 grid place-items-center text-sm rounded-full h-5 w-5 -mx-1 z-10">
                    <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                  </span>
                  <span className="bg-fb-blue-200 rounded-full h-5 w-5 grid place-items-center relative text-xs ">
                    <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                  </span>
                </div>
                {total_likes}
              </span>
            )}
          </div>

          <div className="flex gap-4">
            {total_comments !== 0 && (
              <span
                onClick={() => {
                  setIsCommenting((prev) => !prev);
                }}
                className="text-gray-300 text-sm hover:underline"
              >
                {total_comments} comments
              </span>
            )}
          </div>
        </div>

        <hr className="bg-gray-200 bg-opacity-20 mt-2 mb-1" />
        <div className=" flex items-center justify-between">
          <div
            onClick={likeHandler}
            className={`flex-1 hover:bg-fb-gray
           ${isLiked ? "text-fb-blue-200" : ""}
            hover:bg-opacity-70 text-white py-2 px-4 flex items-center gap-2 justify-center rounded-md`}
          >
            <motion.div animate={controls} className={`grid items-center `}>
              <FontAwesomeIcon
                icon={isLiked ? FilledLike : faThumbsUp}
              ></FontAwesomeIcon>
            </motion.div>
            Like
          </div>
          <div
            onClick={commentHandler}
            className="flex-1 hover:bg-fb-gray hover:bg-opacity-70 text-white py-2 px-4 flex items-center gap-2 justify-center rounded-md "
          >
            <motion.div className="grid items-center">
              <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
            </motion.div>
            Comment
          </div>
          <div className="flex-1 hover:bg-fb-gray hover:bg-opacity-70 text-white py-2 px-4 flex items-center gap-2 justify-center rounded-md ">
            <motion.div className="grid items-center">
              <FontAwesomeIcon icon={faShare}></FontAwesomeIcon>
            </motion.div>
            Share
          </div>
        </div>
        <hr className="bg-gray-200 bg-opacity-20 my-1" />
      </div>
      {isCommenting && <CommentSection post_id={post_id}></CommentSection>}
    </div>
  );
  async function likeHandler() {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      await controls.start({
        scale: 1.2,
        rotate: -25,
      });

      controls.start({
        scale: 1,
        rotate: 0,
      });
      if (!isLiked) axios.post(`${PostsRoute}/like`, { user: userId, post_id });
    } else axios.post(`${PostsRoute}/unlike`, { user: userId, post_id });
  }
  function commentHandler() {
    setIsCommenting(true);
  }
}
