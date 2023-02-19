import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calcLength, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../src/store";

export default function ProfileUploadingSectionImage({
  profile,
}: {
  profile: string | undefined;
}) {
  const { zoomLevel, isDoneCropping, draggable } = useSelector(
    (store: RootState) => store.profile
  );
  const [imageURL, setImageURL] = useState<string>();
  const image = useRef<HTMLImageElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const croppedImage = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({
    top: -0,
    bottom: 0,
    left: -140,
    right: 140,
  });

  useLayoutEffect(() => {
    // Assume you have a dataURL stored in a variable called imageDataURL
    var img = new Image();
    if (profile) img.src = profile;

    img.onload = function () {
      // set the new height and width for the image
      const isVertical = img.height > img.width;
      const ratio = img.width / img.height;
      const newWidth = isVertical ? Math.floor(ratio * 1080) : 1080;
      const newHeight = isVertical ? 1080 : Math.floor(ratio * 1080);

      if (isVertical) {
        setDragConstraints({
          top: (-1 * newHeight) / 2,
          bottom: 0,
          left: -120,
          right: 120,
        });
        // create a canvas element to draw the resized image on
        var canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        // get the drawing context for the canvas
        var ctx = canvas.getContext("2d");

        // draw the image onto the canvas with the new height and width
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        // get the resized dataURL from the canvas
        var resizedDataURL = canvas.toDataURL();

        // use the resized dataURL as needed
        setImageURL(resizedDataURL);
      } else {
        setImageURL(profile);
      }
    };

    // set the source of the image to the dataURL
  }, [profile]);

  useEffect(() => {
    console.log(image.current?.height);
    if (image.current) {
      setDragConstraints((prev) => ({
        top: prev.top * zoomLevel,
        bottom: prev.bottom * zoomLevel,
        left: Math.min(1.1, zoomLevel) * prev.left,
        right: Math.min(1.1, zoomLevel) * prev.right,
      }));
    }
  }, [image.current, zoomLevel]);
  return (
    <div
      ref={container}
      className="m-4 h-80 overflow-hidden items-center  justify-center flex relative rounded-md"
    >
      <div
        ref={croppedImage}
        className={`croppedImage pointer-events-none bg-transparent h-full aspect-square rounded-full z-10`}
      >
        <div
          className={`bg-transparent pointer-events-none h-full aspect-square rounded-full ${
            isDoneCropping ? "shadow-full-dark" : "shadow-full"
          } z-10`}
        ></div>

        <motion.div
          drag={true}
          className="absolute inset-0 -z-10 pointer-events-auto"
          dragConstraints={dragConstraints}
        >
          <img
            src={imageURL}
            ref={image}
            style={{ scale: zoomLevel }}
            className="pointer-events-none -z-10"
            alt=""
          />
        </motion.div>
      </div>
      <div className="absolute pointer-events-none flex items-center justify-center inset-0 overflow-hidden"></div>
    </div>
  );
}
