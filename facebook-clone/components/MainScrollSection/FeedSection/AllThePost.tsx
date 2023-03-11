import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../../src/postSlice";
import { AppDispatch, RootState } from "../../../src/store";
import MediaPosts from "./MediaPost";
import InfiniteScroll from "react-infinite-scroller";
import { getMorePosts } from "../../../src/postSlice";
import PostLoadingTemplate from "./PostLoadingTemplate";
import { AnimatePresence, motion } from "framer-motion";

export default function AllThePosts() {
  const { userId } = useSelector((store: RootState) => store.auth);
  const { page, loading, posts } = useSelector(
    (store: RootState) => store.post
  );
  const dispatch = useDispatch<AppDispatch>();
  const observer = useRef<IntersectionObserver>();

  const loader = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(getMorePosts({ userId: userId!, page: page }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [page, loading]
  );
  useEffect(() => {
    if (userId) dispatch(getPosts(userId));
  }, [userId]);

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          layout
          transition={{
            duration: 0.1,
          }}
        >
          {posts.map((post, index) =>
            posts.length === index + 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                ref={loader}
                key={post.post_id}
              >
                <MediaPosts {...post} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={post.post_id}
              >
                <MediaPosts {...post} />
              </motion.div>
            )
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
