import React from "react";

export default function CommentsLoading() {
  return (
    <>
      <div>
        <div className="flex gap-2 items-center my-4">
          <div className="rounded-full h-10 w-10 animate-pulse bg-fb-gray"></div>
          <div className="h-8 w-2/3 rounded-full bg-fb-gray animate-pulse"></div>
        </div>

        <div className="flex gap-2 items-center mb-4">
          <div className="rounded-full h-10 w-10 animate-pulse bg-fb-gray"></div>
          <div className="h-8 w-2/3 rounded-full bg-fb-gray animate-pulse"></div>
        </div>

        <div className="flex gap-2 items-center mb-4">
          <div className="rounded-full h-10 w-10 animate-pulse bg-fb-gray"></div>
          <div className="h-8 w-2/3 rounded-full bg-fb-gray animate-pulse"></div>
        </div>
      </div>
    </>
  );
}
