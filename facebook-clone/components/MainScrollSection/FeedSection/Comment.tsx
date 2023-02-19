import React, { useState } from "react";
import { useContext } from "react";
import { PostContext } from "./CommentSection";
import { getTimeDifference } from "../../../utils/getTimeDifference";
import type { Comment } from "./CommentSection";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTurnRight,
  faArrowTurnUp,
} from "@fortawesome/free-solid-svg-icons";
export default function IndividualComment({ comment }: { comment: Comment }) {
  const [isReplying, setIsReplying] = useState(false);
  const { setComments, comments, post_id } = useContext(PostContext);
  const [viewReply, setViewReply] = useState(false);
  return (
    <>
      <div key={comment.comment_id} className="grid gap-0 my-4 ">
        <div className={`flex gap-2 items-center relative `}>
          {comment.parent_id && comment.parent_id !== "null" && (
            <>
              <div className="absolute  h-24 w-8 left-[3px] bottom-1/2 rounded-b-xl border-fb-gray border-l-2 border-b-2"></div>
            </>
          )}
          <div
            className={` rounded-full relative z-10 h-10  w-10 bg-fb-gray overflow-hidden
          ${comment.parent_id && comment.parent_id !== "null" ? "ml-4" : ""}
          `}
          >
            <img src={comment.profile_pic} alt="" />
          </div>

          <div>
            <div className="text-gray-300 rounded-xl p-1 bg-fb-gray">
              <div className="font-bold">{`${comment.first_name} ${comment.last_name}`}</div>
              <div>{comment.comment}</div>
            </div>
            <div className="text-xs justify-self-center text-gray-400 flex gap-4">
              <span className="font-bold hover:underline">Like</span>
              <span
                onClick={() => {
                  setIsReplying(true);
                }}
                className="font-bold hover:underline"
              >
                Reply
              </span>
              <span>{getTimeDifference(comment.commented_on)}</span>
            </div>
          </div>
        </div>

        {isReplying && (
          <div className="justify-self-center group w-full pl-10 relative">
            <div
              className={`absolute  group-focus-within:h-20 h-16 w-8 left-5 bottom-1/2 rounded-b-xl border-fb-gray border-l-2 border-b-2`}
            ></div>

            <CommentInput
              parent_id={`${comment.comment_id}`}
              setIsReplying={setIsReplying}
              setViewReply={setViewReply}
              placeholder={`Replying to ${comment.first_name}`}
            ></CommentInput>
          </div>
        )}

        <div className="ml-4">
          {!viewReply && comments[comment.comment_id] && (
            <>
              <div
                onClick={() => {
                  setViewReply(true);
                }}
                className="ml-4 flex gap-2 text-gray-400 hover:underline text-sm mt-2"
              >
                <span>
                  <FontAwesomeIcon
                    className="rotate-90"
                    icon={faArrowTurnUp}
                  ></FontAwesomeIcon>
                </span>
                {comments[comment.comment_id].length} Replies
              </div>
            </>
          )}
          {comments[comment.comment_id] && viewReply && (
            <>
              <CommentList
                comments={comments[comment.comment_id]}
              ></CommentList>
            </>
          )}
        </div>
      </div>
    </>
  );
}
