import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../src/store";
import { fontComputer } from "../../../utils/fontComputer";
export default function TextStoryPreview() {
  const { caption, font, background } = useSelector(
    (store: RootState) => store.story
  );
  return (
    <>
      <div className="h-full w-3/4 px-16 py-6">
        <div className="rounded-lg p-4 h-full w-full bg-white">
          <span>Preview</span>
          <div className="flex  justify-center p-4 bg-gray-900 w-full h-full rounded-lg">
            <div
              className={`h-full flex  items-center justify-center text-xl text-white font-bold bg-cover rounded-lg w-80 bg-${background}`}
            >
              <span className={`p-4 whitespace-pre-line ${fontComputer(font)}`}>
                {caption !== "" && caption}
                {caption === "" && "Start typing"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
