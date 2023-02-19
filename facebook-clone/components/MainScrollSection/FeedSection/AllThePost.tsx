import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../../src/postSlice";
import { AppDispatch, RootState } from "../../../src/store";
import MediaPosts from "./MediaPost";
import TextPost from "./TextPost";
export default function AllThePosts() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts } = useSelector((store: RootState) => store.post);
  const { userId } = useSelector((store: RootState) => store.auth);

  useEffect(() => {
    if (userId) dispatch(getPosts(userId));
  }, [userId]);
  return (
    <>
      <div>
        {posts.map((post) =>
          post.type == "media" || post.type == "profile" ? (
            <MediaPosts key={post.post_id} {...post} />
          ) : (
            <TextPost></TextPost>
          )
        )}
      </div>
    </>
  );
}
