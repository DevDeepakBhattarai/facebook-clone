import React, { useRef, useState } from "react";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store";
import {
  faCaretDown,
  faEllipsisH,
  faFaceSmile,
  faLocationDot,
  faMultiply,
  faPencil,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { profile } from "console";
import {
  addPhotos,
  doneAddingPhotos,
  doneCreatingPost,
  getMyPost,
  getPosts,
  setCaption,
} from "../../../src/postSlice";
import CreatePostPhotoList from "./CreatePostPhotoList";
import axios from "axios";
import { PostsRoute } from "../../../Routes";
import { motion } from "framer-motion";

const loadingOverlayStyle = {
  backgroundColor: "rgba(0,0,0,0.6)",
  zIndex: 9999,
};

export default function CreatePost() {
  const dispatch = useDispatch<AppDispatch>();
  const { isPopupForCreatingPostOpen, isAddingPhotos, caption } = useSelector(
    (store: RootState) => store.post
  );
  const { userId, profile, userName } = useSelector(
    (store: RootState) => store.auth
  );
  const fileInput = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<File[] | []>([]);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  return (
    <Popup
      open={isPopupForCreatingPostOpen}
      overlayStyle={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      onClose={() => {
        dispatch(doneCreatingPost());
      }}
      closeOnDocumentClick={!isPosting}
    >
      <Popup
        open={isPosting}
        closeOnDocumentClick={false}
        overlayStyle={loadingOverlayStyle}
      >
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
          <div
            style={{ borderTopColor: "transparent" }}
            className="w-8 h-8 border-2 border-blue-200 rounded-full animate-spin"
          ></div>
          <p className="text-lg text-blue-200">Posting</p>
        </div>
      </Popup>
      <div className="w-[30rem] h-max bg-dark rounded-lg border-gray-200 border border-opacity-20">
        <div className="p-4 relative">
          <div className="text-center text-lg font-bold text-white">
            Create a post
          </div>

          <div
            onClick={() => {
              dispatch(doneCreatingPost());
            }}
            className="absolute right-4 top-2 text-gray-400 bg-fb-gray bg-opacity-50 hover:bg-opacity-100 grid place-items-center text-lg h-10 w-10 rounded-full"
          >
            <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
          </div>
        </div>

        <hr className="bg-gray-200 bg-opacity-30" />

        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700">
              <img className="hover:opacity-70" src={profile!} alt="" />
            </div>
            <div>
              <div className="text-white">{userName}</div>
              <div>
                <button className="border-none outline-none rounded-md bg-fb-gray text-xs p-1 text-white flex items-center gap-1">
                  <span>
                    <FontAwesomeIcon icon={faUserGroup}></FontAwesomeIcon>
                  </span>
                  <span className="font-bold">Friends</span>
                  <span>
                    <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="w-full h-32">
            <textarea
              onChange={(e) => {
                dispatch(setCaption(e.target.value));
              }}
              value={caption}
              autoFocus
              name="caption"
              id=""
              className="resize-none border-none outline-none text-lg h-full w-full bg-transparent text-white placeholder:text-2xl"
              placeholder={`What is on your mind, ${userName?.split(" ")[0]}?`}
            ></textarea>
          </div>

          {isAddingPhotos && (
            <div className="p-4">
              <div className="border-gray-400 relative border-opacity-30 p-2 border rounded-md">
                {photos.length < 1 && (
                  <div
                    onClick={() => {
                      dispatch(doneAddingPhotos());
                    }}
                    className="absolute z-10 right-4 top-2 text-gray-400 bg-gray-500 bg-opacity-50 hover:bg-opacity-100 grid place-items-center text-lg h-8 w-8 rounded-full"
                  >
                    <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
                  </div>
                )}

                {photos.length < 1 && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      console.log(e);
                      setPhotos(Array.from(e.dataTransfer.files));
                    }}
                    onClick={() => {
                      fileInput.current?.click();
                    }}
                    className="bg-fb-gray grid place-items-center hover:bg-opacity-100 h-32 rounded-md bg-opacity-60"
                  >
                    <div>
                      <div>
                        <div className="flex flex-col items-center text-sm text-white">
                          <div className="hover:bg-gray-500 h-10 w-10 grid place-items-center rounded-full ">
                            <i style={AddPhotoIcon}></i>
                          </div>
                          <div>Add Photos/Videos</div>
                          <div className="text-xs font-thin text-gray-300">
                            or drag and drop
                          </div>
                        </div>
                      </div>
                      <input
                        multiple
                        ref={fileInput}
                        onChange={(e) => {
                          if (e.target.files)
                            setPhotos(Array.from(e.target.files));
                        }}
                        type="file"
                        hidden
                      />
                    </div>
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="overflow-y-scroll relative grid h-48">
                    <div className="absolute z-20 top-3 left-1 bg-transparent self-center flex gap-2">
                      <button className="px-2 items-center flex text-sm gap-1 shadow-sm shadow-fb-gray bg-white rounded-md">
                        <span className="text-black">
                          <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
                        </span>
                        Edit
                      </button>
                      <input
                        hidden
                        type="file"
                        ref={fileInput}
                        onChange={(e) => {
                          setPhotos((prev: File[]) => {
                            const newFiles = e.target.files
                              ? Array.from(e.target.files)
                              : [];

                            return [...prev, ...newFiles];
                          });
                        }}
                      />
                      <button
                        onClick={() => {
                          fileInput.current?.click();
                        }}
                        className="py-2 px-4 flex text-sm items-center shadow-sm shadow-fb-gray  gap-1 bg-white rounded-md"
                      >
                        <span>
                          <i style={AddPhotoIcon}></i>
                        </span>
                        Add Photos/Videos
                      </button>
                      <button></button>
                    </div>
                    <CreatePostPhotoList
                      setTotalPhotos={setPhotos}
                      image={photos}
                    ></CreatePostPhotoList>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isAddingPhotos && (
            <div className="flex items-center justify-between">
              <div className="h-10 w-10">
                <img src="/BackgroundSelector.png" alt="" />
              </div>
              <div className="text-gray-300 text-lg">
                <FontAwesomeIcon icon={faFaceSmile}></FontAwesomeIcon>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="border-gray-400 border rounded-md border-opacity-40 p-2 flex items-center justify-between">
            <div className="text-white text-sm px-4 font-bold">
              Add your post
            </div>

            <div className="flex items-center justify-center">
              <div
                className={`h-8 w-8 grid place-items-center  rounded-full ${
                  !isAddingPhotos ? "hover:bg-fb-gray" : "bg-gray-700"
                }`}
                onClick={() => dispatch(addPhotos())}
              >
                <i style={StyleOfPhotoIcon}></i>
              </div>

              <div className="h-8 w-8 grid place-items-center rounded-full hover:bg-fb-gray">
                <img
                  className="h-6 w-6 aspect-square object-fill"
                  src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/MqTJr_DM3Jg.png"
                  alt=""
                />
              </div>
              <div className="h-8 w-8 grid place-items-center rounded-full hover:bg-fb-gray">
                <i style={StyleOfSmileIcon}></i>
              </div>

              <div className="h-8 w-8 grid place-items-center rounded-full hover:bg-fb-gray">
                <span className="text-red-500 text-2xl">
                  <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                </span>
              </div>

              <div className="h-8 w-8 grid place-items-center rounded-full hover:bg-fb-gray">
                <img
                  className="h-6 w-6 aspect-square object-fill"
                  src="	https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/_cAtN_ZFj9c.png"
                  alt=""
                />
              </div>

              <div className="h-8 w-8 grid place-items-center rounded-full hover:bg-fb-gray">
                <span className="text-gray-400 text-xl">
                  <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
                </span>
              </div>
            </div>
          </div>
          <div className="h-8 w-full px-4 mt-4">
            <button
              onClick={postHandler}
              disabled={caption === "" && photos.length < 1}
              className="h-full w-full rounded-md bg-fb-blue-200 disabled:bg-gray-500"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
  async function postHandler() {
    setIsPosting(true);
    const formData = new FormData();

    formData.append("user", String(userId));
    formData.append("caption", caption);
    photos.forEach((photo) => {
      formData.append("photo", photo);
    });

    for (const pair of formData.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }

    const res = await axios.post(PostsRoute, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = res.data;
    console.log(data);
    dispatch(doneCreatingPost());
    dispatch(getMyPost(userId!));
    setIsPosting(false);
  }
}
const StyleOfPhotoIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/p4P9_d0wBji.png)",
  backgroundPosition: "0px -208px",
  backgroundSize: " 26px 328px",
  width: "24px",
  height: " 24px",
  backgroundRepeat: "no-repeat",
  display: "inline-block",
};

const StyleOfSmileIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/p4P9_d0wBji.png)",
  backgroundPosition: "0px -156px",
  backgroundSize: " 26px 328px",
  width: "24px",
  height: " 24px",
  backgroundRepeat: "no-repeat",
  display: "inline-block",
};
const AddPhotoIcon = {
  backgroundImage:
    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/WmB6SnJDEt3.png)",
  backgroundPosition: "0px -60px",
  backgroundSize: "38px 136px",
  width: " 20px",
  height: " 20px",
  backgroundRepeat: "no-repeat",
  display: "inline-block",
};
