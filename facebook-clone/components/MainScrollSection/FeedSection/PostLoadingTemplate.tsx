import React from "react";

export default function LoadingTemplate() {
  return (
    <div className="space-y-4">
      <div className="bg-dark h-60 p-4 grid rounded-lg my-4">
        <div className="grid">
          <div className="flex gap-1 items-center self-start">
            <div className="bg-fb-gray h-10 w-10 rounded-full animate-[pulse_1s_infinite]"></div>

            <div className="mt-2">
              <div className="bg-fb-gray h-2 w-20 rounded-full mb-2  animate-pulse"></div>
              <div className="bg-fb-gray h-2 w-24 rounded-full mb-2 animate-pulse"></div>
            </div>
          </div>
          <div className="self-end flex items-center justify-around">
            <div className="h-2 w-20 rounded-full bg-fb-gray animate-[pulse_1.5s_infinite]"></div>
            <div className="h-2 w-20 rounded-full bg-fb-gray animate-[pulse_2s_infinite]"></div>
            <div className="h-2 w-20 rounded-full bg-fb-gray animate-[pulse_2.5s_infinite]"></div>
          </div>
        </div>
      </div>
      <div className="bg-dark h-60 p-4 grid rounded-lg my-4">
        <div className="grid">
          <div className="flex gap-1 items-center self-start">
            <div className="bg-fb-gray h-10 w-10 rounded-full animate-[pulse_1s_infinite]"></div>

            <div className="mt-2">
              <div className="bg-fb-gray h-2 w-20 rounded-full mb-2  animate-pulse"></div>
              <div className="bg-fb-gray h-2 w-24 rounded-full mb-2 animate-pulse"></div>
            </div>
          </div>
          <div className="self-end flex items-center justify-around">
            <div className="h-2 w-20 rounded-full bg-fb-gray animate-[pulse_1.5s_infinite]"></div>
            <div className="h-2 w-20 rounded-full bg-fb-gray animate-[pulse_2s_infinite]"></div>
            <div className="h-2 w-20 rounded-full bg-fb-gray animate-[pulse_2.5s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
