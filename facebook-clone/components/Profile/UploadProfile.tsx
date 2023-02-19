import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";
import { AppDispatch, RootState } from "../../src/store";
import {
  doneUploadingProfile,
  profilePicSelected,
  decrementZoomLevel,
  setZoomLevel,
  incrementZoomLevel,
  Crop,
  setDescription,
  resetUploadingState,
  hasAccidentallyClickedClose,
  accidentallyClickedClose,
} from "../../src/profileSlice";
import {
  faCropSimple,
  faMinus,
  faMultiply,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileUploadingSectionImage from "./ProfileUploadingSectionImage";
import { PostsRoute, ProfileRoute } from "../../Routes";
import axios from "axios";
import html2canvas from "html2canvas";
import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";
import { dataURLtoBlob } from "../../utils/dataURLToBlob";

export default function UploadProfile() {
  const {
    isUploadingProfile,
    hasSelectedPicture,
    zoomLevel,
    isDoneCropping,
    description,
    accidentallyClicked,
  } = useSelector((store: RootState) => store.profile);
  const { userId } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch<AppDispatch>();
  const descriptionInput = useRef<HTMLTextAreaElement>(null);
  const pictureInput = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<
    string | ArrayBuffer | null | undefined
  >();
  return (
    <Popup
      overlayStyle={{
        backgroundColor: "rgba(0,0,0,0.6)",
        overflowY: "scroll",
        zIndex: 999,
        padding: "4rem",
      }}
      closeOnDocumentClick={false}
      open={isUploadingProfile}
    >
      <Popup
        open={accidentallyClicked}
        overlayStyle={{
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 9999,
        }}
      >
        <div className="w-[35rem] h-44 rounded-lg bg-dark text-white">
          <div className="text-xl text-center relative font-bold p-4 ">
            <span className="text-center">Discard ?</span>
            <div
              onClick={() => {
                dispatch(accidentallyClickedClose());
              }}
              className="text-black absolute grid place-items-center right-4 top-4 bg-gray-400 rounded-full h-8 w-8 text-base"
            >
              <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
            </div>
          </div>

          <hr className="bg-gray-600 bg-opacity-30" />
          <div className="px-4  text-gray-300">
            Are you sure you want to discard uploading?
          </div>
          <div className="flex px-4 gap-4 mt-10 items-center justify-end">
            <button
              onClick={() => {
                dispatch(accidentallyClickedClose());
              }}
              className="rounded-md px-5 py-1 text-blue-600 font-bold flex items-center justify-center hover:bg-fb-gray"
            >
              Continue Editing
            </button>

            <button
              onClick={() => {
                dispatch(resetUploadingState());
              }}
              className=" rounded-md px-5 py-1 flex text-white font-bold items-center  justify-center bg-fb-blue-200 hover:bg-blue-500"
            >
              Discard
            </button>
          </div>
        </div>
      </Popup>

      <div className="bg-dark rounded-lg py-4 w-[40rem] ">
        <div className="flex items-center pb-4 justify-center relative">
          <span className="text-2xl text-gray-300">Uploading Profile</span>

          <div
            onClick={() => {
              dispatch(hasAccidentallyClickedClose());
            }}
            className="absolute grid place-items-center h-8 w-8 bg-fb-gray rounded-full hover:bg-gray-500 top-1/2 -translate-y-2/3 right-4"
          >
            <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
          </div>
        </div>
        <hr className="bg-gray-400 bg-opacity-20" />

        {!hasSelectedPicture && (
          <div>
            <div
              onClick={() => {
                pictureInput.current?.click();
              }}
              className="flex items-center justify-center gap-2 bg-fb-blue-200 bg-opacity-20 hover:bg-fb-blue-100 hover:bg-opacity-20 text-fb-blue-100 p-2 m-4 rounded-lg"
            >
              <div>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              </div>
              Upload Photo
            </div>
            <input
              onChange={(e) => {
                const fileReader = new FileReader();
                if (e.target.files?.[0]) {
                  fileReader.readAsDataURL(e.target.files[0]);
                  fileReader.onloadend = (e) => {
                    setProfile(e.target?.result);
                    dispatch(profilePicSelected());
                  };
                }
              }}
              type="file"
              ref={pictureInput}
              hidden
            />
          </div>
        )}

        {hasSelectedPicture && (
          <div
            onClick={() => {
              descriptionInput.current?.focus();
            }}
            className="p-4 m-4 box-border border-gray-300 border-opacity-20 border-2 focus-within:border-white focus-within:border-2 outline-none focus-within:outline-[3px] outline-offset-0 focus-within:outline-fb-blue-100 rounded-lg group"
          >
            <div className="text-sm text-gray-500 group-focus-within:text-fb-blue-200 font-thin ">
              Description
            </div>
            <textarea
              onChange={(e) => {
                dispatch(setDescription(e.target.value));
              }}
              ref={descriptionInput}
              name=""
              id=""
              className="resize-none w-full outline-none text-whtie border-none bg-transparent rounded-lg"
            ></textarea>
          </div>
        )}

        {hasSelectedPicture && (
          <div className="grid">
            <ProfileUploadingSectionImage
              profile={profile as string}
            ></ProfileUploadingSectionImage>

            {!isDoneCropping && (
              <div className="text-white h-16 gap-2  text-lg relative z-100 mt-1 w-full p-4 flex items-center justify-center">
                <div
                  onClick={() => {
                    dispatch(decrementZoomLevel());
                  }}
                >
                  <FontAwesomeIcon className="cursor-pointer" icon={faMinus} />
                </div>
                <input
                  className="bg-blue-500 w-2/5 h-1"
                  min={"1"}
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
                <div
                  onClick={() => {
                    dispatch(incrementZoomLevel());
                  }}
                >
                  <FontAwesomeIcon className="cursor-pointer" icon={faPlus} />
                </div>
              </div>
            )}

            <button
              onClick={() => {
                dispatch(Crop());
              }}
              className="justify-self-center w-max flex items-center bg-fb-gray rounded-md px-4 py-2"
            >
              <span>
                <FontAwesomeIcon icon={faCropSimple}></FontAwesomeIcon>
              </span>
              Crop photo
            </button>
          </div>
        )}

        {hasSelectedPicture && (
          <>
            <hr className="bg-gray-400 bg-opacity-20 my-4" />
            <div className="px-4 flex items-center justify-end">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    dispatch(hasAccidentallyClickedClose());
                  }}
                  className="rounded-md py-1 px-6 hover:bg-fb-gray text-fb-blue-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    submitHandler();
                    postHandler();
                  }}
                  disabled={!hasSelectedPicture}
                  className="disabled:bg-gray-400 text-white rounded-md py-1 px-10 hover:bg-fb-blue-100 bg-fb-blue-200"
                >
                  Post
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Popup>
  );
  function submitHandler() {
    const formData = new FormData();
    formData.append("caption", description);
    formData.append("user", `${userId}`);

    const ImageDiv: HTMLDivElement | null =
      document.querySelector(".croppedImage");

    if (ImageDiv) {
      const canvas = document.createElement("canvas");
      //set the canvas dimensions
      canvas.width = ImageDiv.offsetWidth;
      canvas.height = ImageDiv.offsetHeight;

      html2canvas(ImageDiv).then((canvas) => {
        const img = new Image();
        img.src = canvas.toDataURL();
        canvas.toBlob((blob) => {
          formData.append("profile", blob as Blob);
          axios.post(`${ProfileRoute}/upload-profile`, formData, {
            headers: {
              "Content-type": "multipart/form-data",
            },
          });
        });
      });
    }
  }

  async function postHandler() {
    const formData = new FormData();
    formData.append("user", String(userId));
    formData.append("caption", description);
    formData.append("photo", dataURLtoBlob(profile as string));
    formData.append("type", "profile");

    for (const pair of formData.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }

    await axios.post(PostsRoute, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(resetUploadingState());
  }
}
