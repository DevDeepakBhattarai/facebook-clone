import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calcLength } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export default function CreatePostPhotoList({
  image,
  setTotalPhotos,
}: {
  image: File[];
  setTotalPhotos: React.Dispatch<React.SetStateAction<[] | File[]>>;
}) {
  const [photo, setPhotos] = useState<any>([]);
  const controllerRef = useRef<boolean>(true);

  useEffect(() => {
    if (controllerRef.current) {
      for (let i = 0; i < image.length; i++) {
        const fileReader = new FileReader();
        if (image) fileReader.readAsDataURL(image[i]);
        fileReader.onload = (e) => {
          setPhotos((prev: any) => [...prev, e.target?.result]);
        };
      }
    }
    return () => {
      controllerRef.current = false;
    };
  }, [image]);

  return (
    <>
      <div className="flex flex-col gap-4 h-max">
        {photo.map((data: any, Index: number) => {
          return (
            <div key={Index} className="relative">
              <img src={data} className=" aspect-auto" alt="" />;
              <div
                onClick={() => {
                  setTotalPhotos((prev) => {
                    return prev.filter((img, index) => index !== Index);
                  });
                }}
                className="absolute z-10 right-4 top-2 text-gray-400 bg-gray-500 bg-opacity-50 hover:bg-opacity-100 grid place-items-center text-lg h-8 w-8 rounded-full"
              >
                <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
