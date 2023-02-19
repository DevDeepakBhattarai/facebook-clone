import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MutableRefObject, useRef } from "react";
import { pauseStory, resumeStory } from "../../../src/storySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store";
export default function PausePlay({ controls, time, timerRef }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { isStoryPaused, selectedStory } = useSelector(
    (store: RootState) => store.story
  );

  return (
    <>
      <div className="justify-self-end my-2 mx-3 text-white">
        {!isStoryPaused && (
          <FontAwesomeIcon
            onClick={() => {
              dispatch(pauseStory());
              controls.stop();
            }}
            icon={faPlay}
          ></FontAwesomeIcon>
        )}

        {isStoryPaused && (
          <FontAwesomeIcon
            onClick={() => {
              timerRef.current = setInterval(() => {
                console.log("Hello there mayte");

                if (time.current > 0) time.current -= 1;
              }, 1000);

              dispatch(resumeStory());

              controls.start((story: any) => {
                return story === selectedStory?.story || story === "default"
                  ? {
                      translate: 0,
                      transition: { duration: time.current - 0.5 },
                    }
                  : {};
              });
            }}
            icon={faPause}
          ></FontAwesomeIcon>
        )}
      </div>
    </>
  );
}
