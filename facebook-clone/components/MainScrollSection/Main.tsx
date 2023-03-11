import React from "react";
import FeedSection from "./FeedSection/Main";
import VideoSection from "./VideoSection";

export default function Main() {
  return (
    <div className="MainScrollAblePage px-32 max-w-[50rem]  overflow-y-scroll">
      <>
        <VideoSection></VideoSection>
        <FeedSection></FeedSection>
      </>
    </div>
  );
}
