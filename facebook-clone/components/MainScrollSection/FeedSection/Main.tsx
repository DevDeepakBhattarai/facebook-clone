import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { getMorePosts } from "../../../src/postSlice";
import { AppDispatch, RootState } from "../../../src/store";
import AddFriendSuggestion from "./AddFriendSuggestion";
import AllThePost from "./AllThePost";
import NoMorePosts from "./NoMorePosts";
import PostLoadingTemplate from "./PostLoadingTemplate";
import UploadingSection from "./UploadingSection";

export default function FeedSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { hasMore, posts, page } = useSelector(
    (store: RootState) => store.post
  );
  return (
    <>
      <UploadingSection></UploadingSection>
      <AddFriendSuggestion></AddFriendSuggestion>
      <AllThePost></AllThePost>
      <div className="space-y-4 mt-4">
        {hasMore && <PostLoadingTemplate></PostLoadingTemplate>}
        {!hasMore && <NoMorePosts></NoMorePosts>}{" "}
      </div>
    </>
  );
}
