import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PostsRoute } from "../../../Routes";
import { RootState } from "../../../src/store";
import { getTimeDifference } from "../../../utils/getTimeDifference";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import CommentsLoading from "./CommentsLoadingTemplate";
import { createContext } from "react";

export type PostContextType = {
  setComments: React.Dispatch<React.SetStateAction<SortedCommentObject>>;
  comments: SortedCommentObject;
  post_id: string;
};
//@ts-ignore
export const PostContext = createContext<PostContextType>(null);

export type Comment = {
  profile_pic: string;
  total_likes: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  comment_id: string;
  comment: string;
  commented_on: string;
};
export type SortedCommentObject = {
  [key: string]: Comment[];
};

export default function CommentSection({ post_id }: { post_id: string }) {
  const { userId, profile, userName } = useSelector(
    (store: RootState) => store.auth
  );
  const [comments, setComments] = useState<SortedCommentObject>({});
  const [isCommentLoading, setIsCommentLoading] = useState(true);
  useEffect(() => {
    async function getComments() {
      try {
        if (post_id) {
          const res = await axios.get(`${PostsRoute}/comments/${post_id}`);
          const data = res.data;
          const group: { [key: string]: Comment[] } = {};
          data.forEach((comment: Comment) => {
            group[comment.parent_id] ||= [];
            group[comment.parent_id].push(comment);
          });
          // console.log(group);
          setComments(group);
          setIsCommentLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getComments();
  }, [post_id]);

  return (
    <PostContext.Provider value={{ comments, setComments, post_id }}>
      <div className="p-4">
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-full mt-2 bg-white relative ">
            <span className="overflow-hidden">
              <img
                className="rounded-full group-hover:opacity-80"
                src={profile ?? ""}
                alt=""
              />
            </span>
            <span className="absolute bottom-0 -right-1 rounded-full h-3 w-3 aspect-square bg-gray-600  text-white flex items-center justify-center text-xs">
              <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
            </span>
          </div>

          <CommentInput
            parent_id="null"
            placeholder={"Write a comment..."}
          ></CommentInput>
        </div>
        {!isCommentLoading && (
          <CommentList comments={comments["null"]}></CommentList>
        )}

        {isCommentLoading && <CommentsLoading />}
      </div>
    </PostContext.Provider>
  );
}
