import React from "react";

export default function NoMorePosts() {
  return (
    <>
      <div className="p-4 bg-dark rounded-lg mb-8">
        <div className="grid place-items-center">
          <div className="text-2xl font-bold text-gray-200">No more posts</div>
          <div className="text-gray-300 mb-8">
            Add more friends to see more posts in your Feed.
          </div>

          <div className="grid items-center"></div>
          <button className="bg-fb-blue-200 hover:bg-fb-blue-100 text-white font-bold rounded-md py-2 px-4">
            Find Friends
          </button>
        </div>
      </div>
    </>
  );
}
