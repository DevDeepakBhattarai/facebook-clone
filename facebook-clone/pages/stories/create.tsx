import React from "react";
import withAuth from "../../src/withAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppDispatch, RootState } from "../../src/store";
import { useDispatch, useSelector } from "react-redux";
import TextStoryOptions from "../../components/MainScrollSection/StoriesComponent/TextStoryOptions";
import TextStoryPreview from "../../components/MainScrollSection/StoriesComponent/TextStoryPreview";
import {
  createPhotoStory,
  createTextStory,
  setPhoto,
} from "../../src/storySlice";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import PhotoStoryOptions from "../../components/MainScrollSection/StoriesComponent/PhotoStoryOptions";
import PhotoStoryPreview from "../../components/MainScrollSection/StoriesComponent/PhotoStoryPreview";

function Create() {
  const { profile, userName } = useSelector((store: RootState) => store.auth);
  const { isCreatingPhotoStory, isCreatingTextStory } = useSelector(
    (store: RootState) => store.story
  );
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="align-self-start absolute overflow-hidden flex gap-4 top-0 h-screen w-screen pt-14 bg-slate-100">
      <div className="w-1/4 relative">
        <div className="pb-16 h-full overflow-auto overflow-x-hidden shadow-md shadow-gray bg-white">
          <div className="px-2 pt-4 pb-0 grid gap-8 sticky top-0 bg-white z-10 ">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Your Story</span>
              <div className="h-8 w-8 grid place-items-center aspect-square m-0 hover:bg-gray-400 bg-gray-300 rounded-full text-black">
                <FontAwesomeIcon icon={faGear} />
              </div>
            </div>

            {!isCreatingTextStory && (
              <div className="flex items-center gap-2 mb-2">
                <div className="h-14 rounded-full border-black border overflow-hidden aspect-square">
                  <img src={profile!} alt="" />
                </div>
                <span className="text-lg ">{userName}</span>
              </div>
            )}

            {isCreatingPhotoStory ||
              (isCreatingTextStory && <hr className=" bg-gray-400" />)}
          </div>

          {isCreatingTextStory && (
            <div className="flex items-center gap-2 my-4 px-2">
              <div className="h-14 rounded-full border-black border overflow-hidden aspect-square">
                <img src={profile!} alt="" />
              </div>
              <span className="text-lg ">{userName}</span>
            </div>
          )}
          <hr className="opacity-50 bg-black h-[0.01rem]" />

          {isCreatingTextStory && <TextStoryOptions />}
          {isCreatingPhotoStory && <PhotoStoryOptions />}
        </div>
      </div>

      {isCreatingTextStory && <TextStoryPreview />}
      {isCreatingPhotoStory && <PhotoStoryPreview />}

      {!isCreatingPhotoStory && !isCreatingTextStory && (
        <div className="h-full p-4 w-3/4 flex items-center justify-center">
          <div className="flex gap-8">
            <div className="bg-gray-700 relative group/create rounded-lg">
              <input
                type="file"
                className="absolute inset-0 opacity-0 bg-transparent z-10"
                onChange={(e) => {
                  const fileReader = new FileReader();
                  fileReader.readAsDataURL(e.target.files?.[0] as Blob);
                  fileReader.onload = (e) => {
                    dispatch(setPhoto(e.target?.result));
                    dispatch(createPhotoStory());
                  };
                }}
              />

              <div className="rounded-lg h-72 w-48 flex group-hover/create:opacity-90 items-center justify-center bg-gradient-to-br from-purple-700 to-blue-400 ">
                <div className="grid place-items-center text-white text-sm font-semibold gap-2">
                  <div className="h-12 shadow-sm shadow-gray-100 w-12 bg-white flex justify-center items-center rounded-full">
                    <i
                      className="inverse"
                      style={{
                        backgroundImage:
                          "url(https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/r4unMBb2UwX.png)",
                        backgroundPosition: "0px -1022px",
                        backgroundSize: "34px 1604px",
                        width: "20px",
                        height: "20px",
                        backgroundRepeat: "no-repeat",
                        display: "inline-block",
                      }}
                    ></i>
                  </div>
                  Create a photo story
                </div>
              </div>
            </div>

            <div className="bg-gray-700 group/create rounded-lg">
              <div
                onClick={() => {
                  dispatch(createTextStory());
                }}
                className="rounded-lg group-hover/create:opacity-90 h-72 w-48 flex items-center justify-center bg-gradient-to-b from-purple-600 to-pink-700 "
              >
                <div className="grid place-items-center text-white text-sm font-semibold gap-2">
                  <div className="h-12 shadow-sm shadow-gray-100 w-12 bg-white flex justify-center items-center rounded-full">
                    <i
                      className="inverse"
                      style={{
                        backgroundImage:
                          "url(https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/GZtkuxJI_jb.png)",
                        backgroundPosition: "0px -52px",
                        backgroundSize: "26px 74px",
                        width: "20px",
                        height: "20px",
                        backgroundRepeat: "no-repeat",
                        display: "inline-block",
                      }}
                    ></i>
                  </div>
                  Create a text story
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(Create);
