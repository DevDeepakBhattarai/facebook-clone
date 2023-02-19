import { motion } from "framer-motion";
import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store";
import { Resizable } from "re-resizable";
import { fontComputer } from "../../../utils/fontComputer";
import {
  editPhoto,
  setHeight,
  notEditPhoto,
  setZoomLevel,
  decrementZoomLevel,
  incrementZoomLevel,
  setRotate,
  doneEditingText,
  setPhotoCaption,
  setPhotoCaptionFont,
  setPhotoCaptionTextColor,
  setSelectedText,
  doneEditingSpecificText,
  editSpecificText,
  setDraggable,
  removeDraggable,
  setPhotoFontSize,
  removeText,
} from "../../../src/storySlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faMinus,
  faMultiply,
  faPlus,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

export default function PhotoStoryPreview() {
  const imageContainerDiv = useRef<HTMLDivElement>(null);
  const editOptionContainer = useRef<HTMLDivElement>(null);
  const textEditOption = useRef<HTMLDivElement>(null);
  const actualTextContainer = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const {
    photo,
    isEditingPhoto,
    heightOfTheImageContainer,
    zoomLevel,
    rotate,
    isAddingText,
    textOptionsForPhoto,
    selectedText,
  } = useSelector((store: RootState) => store.story);

  useLayoutEffect(() => {
    if (imageContainerDiv.current) {
      dispatch(setHeight(imageContainerDiv.current?.offsetHeight));
    }
  }, [imageContainerDiv.current?.offsetHeight]);

  useEffect(() => {
    const clickHandler = (e: any) => {
      if (
        !imageContainerDiv.current?.contains(e.target) &&
        !editOptionContainer.current?.contains(e.target)
      ) {
        dispatch(notEditPhoto());
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  useEffect(() => {
    const clickHandler = (e: any) => {
      if (
        !imageContainerDiv.current?.contains(e.target) &&
        !document.querySelector(".addInputTextOption")?.contains(e.target) &&
        !textEditOption.current?.contains(e.target) &&
        !actualTextContainer.current?.contains(e.target)
      ) {
        dispatch(doneEditingText());
        dispatch(doneEditingSpecificText());
      }
    };
    if (isAddingText) document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [isAddingText]);

  return (
    <>
      <div className="h-full w-3/4 px-16 py-6">
        <div className="rounded-lg p-4 h-full w-full bg-white ">
          <span>Preview</span>
          <div className="flex flex-col items-center isolate  relative justify-center pt-4 overflow-hidden bg-gray-900 w-full h-full rounded-lg">
            {isAddingText && (
              <div
                ref={textEditOption}
                className=" absolute z-50 left-1/2  p-4 translate-x-40 mx-1 top-1/4  w-64 bg-white rounded-lg"
              >
                <div
                  tabIndex={0}
                  className="h-12 rounded-lg p-4 form-select flex items-center w-full border border-black border-opacity-50"
                >
                  <label htmlFor="hello" className="font-bold form-select">
                    Aa
                  </label>
                  <select
                    onChange={(e) => {
                      dispatch(
                        setPhotoCaptionFont({
                          id: selectedText?.id,
                          font: e.target.value,
                        })
                      );
                    }}
                    id="hello"
                    name="fontSelect"
                    className=" w-full p-2  focus:outline-none focus:border-none"
                  >
                    <option value="sans serif">Simple</option>
                    <option value="arial">Clean</option>
                    <option value="Comic Sans MS">Casual</option>
                    <option value="Georgia">Fancy</option>
                    <option value="helvetica">Headline</option>
                  </select>
                </div>

                <div className="p-4 h-max w-full mt-4 rounded-lg border border-black border-opacity-50">
                  <span className="text-sm font-thin text-gray-500">
                    Backgrounds
                  </span>

                  <div className="flex gap-4 flex-wrap my-4 w-full">
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-blue-500 "
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-blue-500",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className=" focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125 rounded-full aspect-square h-4 bg-pink-600 "
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-pink-600",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-yellow-400 "
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-yellow-400",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-orange-600"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-orange-600",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-blue-900"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-blue-900",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-black"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-black",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-green-500 bg-cover"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-green-500 ",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-stone-700 "
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-stone-700 ",
                          })
                        );
                      }}
                    ></div>

                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-lime-500"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-lime-500",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-blue-300  bg-cover"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-blue-300 ",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-slate-400 "
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-slate-400 ",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-red-900 bg-cover"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-red-900",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className=" focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125 rounded-full aspect-square h-4 bg-purple-900  bg-cover"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-purple-900",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className="focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125  rounded-full aspect-square h-4 bg-yellow-200  bg-cover"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-yellow-200 ",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className=" focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125 rounded-full aspect-square h-4 bg-white border-blue-500 border-2 bg-cover"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-white",
                          })
                        );
                      }}
                    ></div>
                    <div
                      tabIndex={0}
                      className=" focus:outline-2 focus:outline-blue-500 focus:outline-none focus:outline-offset-1 focus:scale-125 rounded-full aspect-square h-4 bg-pink-200  bg-cover"
                      onClick={() => {
                        dispatch(
                          setPhotoCaptionTextColor({
                            id: selectedText?.id,
                            textColor: "text-pink-200 ",
                          })
                        );
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div
              ref={imageContainerDiv}
              className={`imageContainerDiv h-full flex-1 ${
                !isEditingPhoto ? "w-80" : "w-full"
              } overflow-hidden text-xl flex bg-gray-900 items-center justify-center relative text-white font-bold`}
            >
              {textOptionsForPhoto.map((text, index) => (
                <motion.div
                  key={text.id}
                  style={{
                    scrollbarWidth: "none",
                  }}
                  className={`aspect-video overflow-visible flex h-max w-max items-center justify-center absolute whitespace-pre-wrap z-50 text-center group/text ${
                    text.textColor
                  } ${fontComputer(text.font)}`}
                  drag={text.draggable}
                  dragConstraints={imageContainerDiv}
                  dragElastic={0}
                  onDoubleClick={() => {
                    dispatch(editSpecificText(text.id));
                    dispatch(setSelectedText(text.id));
                  }}
                  onDragEnd={() => {
                    dispatch(removeDraggable(text.id));
                  }}
                >
                  <div
                    className={`${
                      text.editing
                        ? "hover:border-0"
                        : "hover:border-2 hover:border-white"
                    } motionDiv${index} z-50 relative `}
                  >
                    <Resizable
                      className={`relative ${
                        text.editing ? "pointer-events-none" : ""
                      } aspect-video flex items-center justify-center`}
                      onResizeStop={(e) => {
                        const rotatable = document.querySelector(
                          `.motionDiv${index}`
                        );
                        const rect = rotatable?.getBoundingClientRect();

                        dispatch(
                          setPhotoFontSize({
                            id: text.id,
                            height: rect?.height,
                            width: rect?.width,
                          })
                        );
                      }}
                    >
                      {!text.editing && (
                        <span
                          style={{
                            fontSize:
                              text.fontSize === "0rem" ? "3rem" : text.fontSize,
                          }}
                          onClick={() => {
                            dispatch(setDraggable(text.id));
                          }}
                        >
                          {text.caption}
                        </span>
                      )}
                    </Resizable>
                    {!text.editing && (
                      <>
                        <div
                          onMouseDown={(e) => {
                            const rotatable = document.querySelector(
                              `.motionDiv${index}`
                            );
                            dispatch(removeDraggable(text.id));
                            rotatable?.classList.add("border-2");
                            const rect = rotatable!.getBoundingClientRect();
                            const centerX = rect.left + rect.width / 2;
                            const centerY = rect.top + rect.height / 2;

                            function handleMouseMove(e: any) {
                              const dragX = e.clientX - centerX;
                              const dragY = e.clientY - centerY;
                              const dragAngle = Math.atan2(dragY, dragX);
                              const angle = (dragAngle * 180) / Math.PI;
                              //@ts-ignore
                              rotatable.style.rotate = `${Math.floor(
                                angle
                              )}deg`;
                            }

                            document.addEventListener(
                              "mousemove",
                              handleMouseMove
                            );

                            document.addEventListener("mouseup", function () {
                              rotatable?.classList.remove("border-2");

                              document.removeEventListener(
                                "mousemove",
                                handleMouseMove
                              );
                            });
                          }}
                          className="absolute bottom-[-15%] right-[-15%] h-4 w-4 text-white text-lg opacity-0 hover:opacity-100"
                        >
                          <FontAwesomeIcon
                            icon={faAngleUp}
                            className={"rotate-[135deg]"}
                          ></FontAwesomeIcon>
                        </div>

                        <div
                          onClick={() => {
                            dispatch(removeText(text.id));
                          }}
                          className="absolute top-[-10%] left-[-10%] text-black text-sm group-hover/text:opacity-100 opacity-0 bg-white h-4 w-4 rounded-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.img
                drag={isEditingPhoto}
                dragConstraints={{
                  top: -250,
                  right: 250,
                  bottom: 250,
                  left: -250,
                }}
                style={{ scale: zoomLevel, rotate: rotate }}
                dragTransition={{ bounceStiffness: 700, bounceDamping: 40 }}
                dragElastic={0.1}
                className="w-80  rounded-lg cursor-pointer"
                src={photo as string}
                onClick={() => {
                  dispatch(editPhoto());
                }}
                alt=""
              />
            </div>

            <div
              style={{ height: heightOfTheImageContainer }}
              ref={actualTextContainer}
              className={`absolute pointer-events-none w-80  ${
                !isEditingPhoto ? "rounded-md" : ""
              } shadow-[0_0_0_100vh_rgba(0,0,0,0.5)] top-4 left-1/2 -translate-x-1/2 border-white border-2`}
            >
              {isAddingText && (
                <div className=" h-full flex py-32 justify-center bg-gray-500 bg-opacity-30 w-full">
                  <div
                    className={`pointer-events-auto text-2xl relative font-bold font-mono `}
                  >
                    <textarea
                      autoFocus
                      name=""
                      id=""
                      value={selectedText?.caption}
                      className={`bg-transparent border-none resize-none  outline-none ${fontComputer(
                        selectedText?.font
                      )} ${selectedText?.textColor} text-center`}
                      placeholder="Start typing"
                      onChange={(e) => {
                        dispatch(
                          setPhotoCaption({
                            id: selectedText?.id,
                            caption: e.target.value,
                          })
                        );
                      }}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="h-16 w-full" ref={editOptionContainer}>
              {!isEditingPhoto && !isAddingText && (
                <div className="text-white  h-16 text-lg relative z-100 mt-1 w-full p-4 flex items-center justify-center">
                  Select photo to crop and rotate
                </div>
              )}

              {isEditingPhoto && !isAddingText && (
                <div className="text-white h-16 gap-2  text-lg relative z-100 mt-1 w-full p-4 flex items-center justify-center">
                  <FontAwesomeIcon
                    onClick={() => {
                      dispatch(decrementZoomLevel());
                    }}
                    className="cursor-pointer"
                    icon={faMinus}
                  />
                  <input
                    className="bg-blue-500 w-2/5 h-1"
                    min={"0.5"}
                    max={"5"}
                    value={zoomLevel}
                    step="0.1"
                    type="range"
                    onChange={(e) => {
                      dispatch(setZoomLevel(e.target.value));
                    }}
                    name=""
                    id=""
                  />
                  <FontAwesomeIcon
                    onClick={() => {
                      dispatch(incrementZoomLevel());
                    }}
                    className="cursor-pointer"
                    icon={faPlus}
                  />
                  <button
                    onClick={() => {
                      dispatch(setRotate());
                    }}
                    className="outline-none flex gap-1 items-center   hover:bg-gray-50 bg-white rounded-md text-black text-sm p-2"
                  >
                    <FontAwesomeIcon icon={faRotateRight} />
                    Rotate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
