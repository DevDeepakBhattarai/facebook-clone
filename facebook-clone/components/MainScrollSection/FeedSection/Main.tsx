import React from "react";
import AddFriendSuggestion from "./AddFriendSuggestion";
import AllThePost from "./AllThePost";
import NoMorePosts from "./NoMorePosts";
import PostLoadingTemplate from "./PostLoadingTemplate";
import UploadingSection from "./UploadingSection";

export default function FeedSection() {
  return (
    <>
      <UploadingSection></UploadingSection>
      <AddFriendSuggestion></AddFriendSuggestion>
      <AllThePost></AllThePost>
      <PostLoadingTemplate></PostLoadingTemplate>
      <PostLoadingTemplate></PostLoadingTemplate>
      <NoMorePosts></NoMorePosts>
    </>
  );
}
