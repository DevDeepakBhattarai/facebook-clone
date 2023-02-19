import axios from "axios";
import { calcLength } from "framer-motion";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { PostsRoute } from "../../../Routes";
import { RootState } from "../../../src/store";

import { SortedCommentObject, Comment, PostContext } from "./CommentSection";

const firstIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/fGtvyi8R0J5.png)",
  backgroundPosition: "0px -306px",
  backgroundSize: "26px 884px",
  width: "16px",
  height: "16px",
  backgroundRepeat: " no-repeat",
  display: "inline-block",
};
const secondIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/fGtvyi8R0J5.png)",
  backgroundPosition: "0px -486px",
  backgroundSize: "26px 884px",
  width: "16px",
  height: "16px",
  backgroundRepeat: " no-repeat",
  display: "inline-block",
};
const thirdIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/fGtvyi8R0J5.png)",
  backgroundPosition: "0px -396px",
  backgroundSize: "26px 884px",
  width: "16px",
  height: "16px",
  backgroundRepeat: " no-repeat",
  display: "inline-block",
};
const fourthIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/fGtvyi8R0J5.png)",
  backgroundPosition: "0px -540px",
  backgroundSize: "26px 884px",
  width: "16px",
  height: "16px",
  backgroundRepeat: " no-repeat",
  display: "inline-block",
};
const fifthIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/fGtvyi8R0J5.png)",
  backgroundPosition: "0px -738px",
  backgroundSize: "26px 884px",
  width: "16px",
  height: "16px",
  backgroundRepeat: " no-repeat",
  display: "inline-block",
};
const sixthIcon = {
  backgroundImage:
    "url(	https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/fGtvyi8R0J5.png)",
  backgroundPosition: "0px -630px",
  backgroundSize: "26px 884px",
  width: "16px",
  height: "16px",
  backgroundRepeat: " no-repeat",
  display: "inline-block",
};

interface CommentInputProps {
  parent_id: string;
  placeholder: string;
  setIsReplying?: React.Dispatch<React.SetStateAction<boolean>>;
  setViewReply?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommentInput({
  parent_id,
  placeholder,
  setIsReplying,
  setViewReply,
}: CommentInputProps) {
  const { post_id, setComments } = useContext(PostContext);
  const [commentCaption, setCommentCaption] = useState<string>("");
  const [isSendingCommentDisabled, setIsSendingCommentDisabled] =
    useState(false);
  const { profile, userId, userName } = useSelector(
    (store: RootState) => store.auth
  );
  return (
    <div className="flex-1">
      <div
        className={`rounded-2xl group bg-fb-gray flex p-1 py-1 ${
          commentCaption !== "" && commentCaption !== " "
            ? "flex-col"
            : "focus-within:flex-col"
        }`}
      >
        <textarea
          name=""
          id=""
          value={commentCaption}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitComment();
              // console.log("HEllo");
            }
          }}
          autoFocus
          className="p-1 w-full h-8 bg-transparent resize-none placeholder:flex placeholder:items-center flex-1 outline-none text-gray-300 border-none placeholder:text-gray-300"
          placeholder={placeholder}
          onChange={(e) => {
            setCommentCaption(e.target.value);
          }}
        ></textarea>

        <div className="flex justify-between group-focus-within:flex-1">
          <ul className="flex">
            <li className="h-8 w-8 rounded-full grid place-items-center hover:bg-gray-400">
              <span className="invert-[70%]" style={firstIcon}></span>
            </li>
            <li className="h-8 w-8 rounded-full grid place-items-center hover:bg-gray-400">
              <span className="invert-[70%]" style={secondIcon}></span>
            </li>
            <li className="h-8 w-8 rounded-full grid place-items-center hover:bg-gray-400">
              <span className="invert-[70%]" style={thirdIcon}></span>
            </li>
            <li className="h-8 w-8 rounded-full grid place-items-center hover:bg-gray-400">
              <span className="invert-[70%]" style={fourthIcon}></span>
            </li>
            <li className="h-8 w-8 rounded-full grid place-items-center hover:bg-gray-400">
              <span className="invert-[70%]" style={fifthIcon}></span>
            </li>
          </ul>

          <span
            className={`${
              commentCaption !== "" && commentCaption !== " "
                ? ""
                : "hidden group-focus-within:grid"
            } h-8 w-8 rounded-full grid place-items-center hover:bg-gray-400 `}
            onClick={() => {
              submitComment();
            }}
          >
            <span
              className={
                commentCaption !== "" && commentCaption !== " "
                  ? "hue-rotate-[240deg] saturate-100 brightness-100"
                  : "invert-[70%]"
              }
              style={sixthIcon}
            ></span>
          </span>
        </div>
      </div>
      <div className="text-xs text-white">Press Enter to post</div>
    </div>
  );

  async function submitComment() {
    // console.log("Submit Comment");

    if (commentCaption !== "" && commentCaption !== " ") {
      setCommentCaption("");
      setIsSendingCommentDisabled(true);
      let comment_id = crypto.randomUUID();
      let date = new Date().toString();

      const newComment: Comment = {
        profile_pic: profile!,
        total_likes: "0",
        parent_id: parent_id,
        first_name: userName?.split(" ")[0]!,
        last_name: userName?.split(" ")[1]!,
        comment_id,
        comment: commentCaption,
        commented_on: date,
      };

      setComments((prev) => ({
        ...prev,
        [parent_id]: [newComment, ...(prev[parent_id] ?? [])],
      }));
      const DataToBeSent = {
        comment: commentCaption,
        post_id: post_id,
        comment_id: comment_id,
        user_id: userId,
        parent_id: parent_id === "null" ? null : parent_id,
        commented_on: date,
      };
      const res = await axios.post(`${PostsRoute}/comment`, DataToBeSent);

      console.log(res.data);

      if (setIsReplying) setIsReplying(false);
      if (setViewReply) setViewReply(true);
    }
  }
}
