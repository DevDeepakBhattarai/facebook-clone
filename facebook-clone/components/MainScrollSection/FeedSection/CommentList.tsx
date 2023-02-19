import React, { useState } from "react";
import IndividualComment from "./Comment";
import { Comment } from "./CommentSection";

type CommentListProps = {
  comments: Comment[];
};
export default function CommentList({ comments }: CommentListProps) {
  return (
    <>
      <div>
        {comments &&
          comments.map((comment: Comment) => (
            <IndividualComment
              key={comment.comment_id}
              comment={comment}
            ></IndividualComment>
          ))}
      </div>
    </>
  );
}
