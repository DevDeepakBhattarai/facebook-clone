import React from "react";

export default function ImageGrid({ media }: { media: string[] }) {
  if (media.length === 1)
    return (
      <div className="flex items-center justify-center w-full">
        {media.map((image) => (
          <div key={image} className={"max-w-lg"}>
            <img
              className="object-contain max-h-[40rem]"
              src={image}
              alt=""
            ></img>
          </div>
        ))}
      </div>
    );

  if (media.length === 2)
    return (
      <div className="flex items-center justify-center w-max">
        {media.map((image) => (
          <div key={image}>
            <img className=" aspect-auto" src={image} alt=""></img>
          </div>
        ))}
      </div>
    );
  else if (media.length === 3)
    return (
      <div className="flex items-center justify-center w-max">
        <div className="h-full w-1/2">
          <img
            className="h-full w-full aspect-square object-cover"
            src={media[0]}
            alt=""
          ></img>
        </div>
        <div className="flex flex-col h-full w-1/2">
          <img
            className="h-full w-full aspect-square object-cover flex-1"
            src={media[1]}
            alt=""
          ></img>

          <img
            className="h-full w-full aspect-square object-cover flex-1"
            src={media[2]}
            alt=""
          ></img>
        </div>
      </div>
    );
  else if (media.length === 4)
    return (
      <>
        <div className="grid grid-cols-2 items-center justify-center w-max">
          {media.map((image, index) => (
            <div key={image} className="">
              <img className="" src={image} alt=""></img>
            </div>
          ))}
        </div>
      </>
    );
  else if (media.length === 5)
    return (
      <>
        <div>
          <div className="flex">
            {media
              .filter((im, index) => index === 0 || index === 1)
              .map((image, index) => (
                <div key={image} className="flex-1">
                  <img
                    className="h-full w-full aspect-square object-cover"
                    src={image}
                    alt=""
                  ></img>
                </div>
              ))}
          </div>
          <div className="flex">
            {media
              .filter((im, index) => index !== 0 && index !== 1)
              .map((image) => (
                <div key={image} className="flex-1">
                  <img
                    className="h-full w-full aspect-square object-cover"
                    src={image}
                    alt=""
                  ></img>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  else {
    return (
      <>
        <div>
          <div className="flex">
            {media
              .filter((im, index) => index === 0 || index === 1)
              .map((image, index) => (
                <div key={image} className="flex-1">
                  <img
                    className="h-full w-full aspect-square object-cover"
                    src={image}
                    alt=""
                  ></img>
                </div>
              ))}
          </div>

          <div className="flex">
            {media
              .filter((im, index) => index === 2 || index === 3 || index === 4)
              .map((image, Index) => {
                return (
                  <div
                    key={image}
                    className={`${Index === 2 ? "relative" : ""} flex-1`}
                  >
                    <img
                      className="h-full w-full aspect-square object-cover"
                      src={image}
                      alt=""
                    ></img>

                    {Index === 2 && (
                      <div className="bg-fb-gray absolute grid text-white font-bold place-items-center inset-0 hover:bg-opacity-40 bg-opacity-50 text-3xl text-center">{`+${
                        media.length - 5
                      }`}</div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}
