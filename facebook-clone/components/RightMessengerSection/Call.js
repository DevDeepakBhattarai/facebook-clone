import React, { useLayoutEffect } from "react";
import { motion, useAnimation, useDragControls } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePeer } from "../../context/PeerContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faPhoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import translatePropertyToXAndY from "../../utils/translatePropertyToXandY";

export default function Call({ socket, userId }) {
  const myVideoDragControls = useDragControls();
  const peerVideoDragControls = useDragControls();
  const animationControls = useAnimation();
  const router = useRouter();
  if (!router.query.user_to_ring || !router.query.room_name) {
    // router.push("/");
  }
  const param = router.query;
  const roomName = useRef(param.room_name);
  const userToCall = useRef(param.user_to_ring);
  const [isMyVideoExpanded, setIsMyVideoExpanded] = useState(false);

  const {
    peer,
    sendStream,
    createOffer,
    setRemoteAnswer,
    createAnswer,
    peerStream,
    senders,
  } = usePeer();

  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [stream, setStream] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [transformOfMyVideo, setTransformOfMyVideo] = useState({});
  const [transformOfPeerVideo, setTransformOfPeerVideo] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const myVideoElement = useRef();
  const peerVideo = useRef();
  const myVideoContainer = useRef();
  const peerVideoContainer = useRef();
  const callData = useRef();
  const screen = useRef();
  const muteButton = useRef();
  const stopVideoButton = useRef();
  const endCallButton = useRef();
  const shareScreenButton = useRef();

  document.querySelector(".nav-bar").style.display = "none";

  useLayoutEffect(() => {
    const handler = () => {
      peer.close();
      endCall();
    };

    callData.current = localStorage.getItem("from");
    localStorage.removeItem("from");

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        if (myVideoElement.current) myVideoElement.current.srcObject = stream;
        setStream(stream);
      });

    window.addEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    if (peerVideo && peerStream) {
      peerVideo.current.srcObject = peerStream;
    }
  }, [peerStream, peerVideo.current]);

  //*Handle Initial Enter
  useEffect(() => {
    socket.emit("joinCallRoom", { roomName: param.room_name });
    if (callData.current === "Chat") {
      startCall();
    } else if (callData.current === "App") {
      let data = JSON.parse(localStorage.getItem("callerData"));
      acceptCall(data.offer);
      localStorage.removeItem("callerData");
    } else {
      // router.push("/");
    }
  }, []);

  useEffect(() => {
    const handler = async (data) => {
      await setRemoteAnswer(data.answer);
      setIsCallAccepted(true);
    };

    const iceCandidateHandler = async (data) => {
      await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
    };

    socket.on("callAccepted", handler);
    socket.on("iceCandidate", iceCandidateHandler);

    peer.onicecandidate = (event) => {
      if (event.candidate)
        socket.emit("iceCandidate", {
          candidate: event.candidate.toJSON(),
          roomName: roomName.current,
        });
    };

    return () => {
      socket.off("iceCandidate", iceCandidateHandler);
      socket.off("callAccepted", handler);
    };
  }, [isCallAccepted, peer]);

  useEffect(() => {
    if (isCallAccepted && stream) sendStream(stream);
  }, [isCallAccepted, stream]);

  const acceptCall = useCallback(async (offer) => {
    let answer = await createAnswer(offer);
    socket.emit("callAccepted", { roomName: roomName.current, answer });
    setIsCallAccepted(true);
  }, []);

  //*Handler Negotiationneeded
  useEffect(() => {
    const handler = async () => {
      const offer = await peer.createOffer();
      try {
        await peer.setLocalDescription(offer);
      } catch (error) {
        console.log(error);
      }

      socket.emit("negotiationNeeded", {
        roomName: roomName.current,
        offer: offer,
      });
    };

    const negotiationHandler = async (data) => {
      await peer.setRemoteDescription(data.offer);
      console.log("I did");
      console.log(peer.iceConnectionState);
      const answer = await peer.createAnswer(data.offer);
      try {
        await peer.setLocalDescription(answer);
      } catch (error) {
        console.log(error);
      }
      socket.emit("callAccepted", {
        roomName: roomName.current,
        answer: peer.localDescription,
      });
    };

    const callEndHandler = () => {
      peer.close();
      window.close();
    };

    socket.on("callEnded", callEndHandler);
    socket.on("negotiationNeeded", negotiationHandler);
    peer.addEventListener("negotiationneeded", handler);

    return () => {
      peer.removeEventListener("negotiationneeded", handler);
      socket.off("callEnded", callEndHandler);
      socket.off("negotiationNeeded", negotiationHandler);
    };
  }, []);

  const startCall = useCallback(async () => {
    const offer = await createOffer();
    socket.emit("callUser", {
      userToCall: userToCall.current,
      offer,
      from: userId,
      roomName: roomName.current,
    });
  }, [createOffer, socket, userId]);

  const muteStream = async () => {
    const audio = stream.getTracks().find((track) => track.kind === "audio");
    if (audio.enabled) {
      audio.enabled = false;
      setIsMuted(true);
    } else {
      audio.enabled = true;
      setIsMuted(false);
    }
  };

  const stopVideoStream = async () => {
    const video = stream.getTracks().find((track) => track.kind === "video");
    if (video.enabled) {
      video.enabled = false;
      setIsVideoStopped(true);
    } else {
      video.enabled = true;
      setIsVideoStopped(false);
    }
  };

  const endCall = useCallback(() => {
    socket.emit("callEnded", { roomName: roomName.current });

    peer.close();
    window.close();
  }, []);

  const shareScreen = useCallback(async () => {
    try {
      const videoStream = await navigator.mediaDevices.getDisplayMedia();
      const screenTracks = videoStream.getTracks()[0];
      senders.current
        .find((sender) => sender.track.kind === "video")
        .replaceTrack(screenTracks);
      myVideoElement.current.srcObject = videoStream;
      setIsSharingScreen(true);

      screenTracks.onended = () => {
        senders.current
          .find((sender) => sender.track.kind === "video")
          .replaceTrack(stream.getTracks()[1]);
        myVideoElement.current.srcObject = stream;
        setIsSharingScreen(false);
      };
    } catch (e) {
      console.log(e);
      console.log("Please allow permissions to access");
    }
  }, [isCallAccepted, senders]);

  const maxMinVideo = () => {
    if (isCallAccepted) {
      if (!isMyVideoExpanded) {
        animationControls.start((video) => {
          if (video === "me") {
            return {
              position: "relative",
              zIndex: 0,
              x: 0,
              y: 0,
              top: 0,
              left: 0,
              height: "100vh",
              width: "100vw",
            };
          }
          if (video === "peer") {
            return {
              position: "absolute",
              x: transformOfPeerVideo.x,
              y: transformOfPeerVideo.y,
              zIndex: 40,
              top: "1rem",
              left: "1rem",
              height: "8rem",
              width: "14rem",
            };
          }
        });
        setIsMyVideoExpanded(true);
      }

      if (isMyVideoExpanded) {
        animationControls.start((video) => {
          if (video === "me") {
            return {
              position: "absolute",
              zIndex: 40,
              x: transformOfMyVideo.x,
              y: transformOfMyVideo.y,
              top: "1rem",
              left: "1rem",
              height: "8rem",
              width: "14rem",
            };
          }
          if (video === "peer") {
            return {
              position: "relative",
              top: 0,
              x: 0,
              y: 0,
              left: 0,
              zIndex: 0,
              height: "100dvh",
              width: "100dvw",
            };
          }
        });
        setIsMyVideoExpanded(false);
      }
    }
  };

  useEffect(() => {
    if (isCallAccepted)
      animationControls.start((video) => {
        if (video === "me")
          return {
            position: "absolute",
            zIndex: 40,
            top: "1rem",
            left: "1rem",
            height: "8rem",
            width: "14rem",
          };
        else return {};
      });
  }, [isCallAccepted, animationControls]);

  return router.query.room_name ? (
    <div ref={screen} className="h-screen relative overflow-hidden">
      <motion.div
        dragConstraints={screen}
        onDragStart={() => {
          setIsDragging(true);
        }}
        onDragEnd={(e) => {
          const transform = translatePropertyToXAndY(
            myVideoContainer.current.style.transform
          );

          animationControls.start((video) => {
            if (video === "me") {
              if (transform.x < window.innerWidth / 3) {
                transform.x = 0;
                return {
                  x: 0,
                };
              } else {
                {
                  transform.x = window.innerWidth - 280;

                  return {
                    x: window.outerWidth - 280,
                  };
                }
              }
            }
            return {};
          });
          setTransformOfMyVideo(transform);
          setTimeout(() => {
            setIsDragging(false);
          }, 100);
        }}
        className={"grid place-items-center h-full w-full rounded-lg"}
        animate={animationControls}
        drag={!isMyVideoExpanded}
        custom={"me"}
        onClick={() => {
          if (!isMyVideoExpanded && !isDragging) maxMinVideo();
        }}
        ref={myVideoContainer}
      >
        <video
          src=""
          className="h-full aspect-auto rounded-lg"
          playsInline
          muted
          autoPlay
          ref={myVideoElement}
        ></video>
      </motion.div>

      {isCallAccepted && (
        <motion.div
          dragConstraints={screen}
          onDragStart={() => {
            setIsDragging(true);
          }}
          onDragEnd={(e) => {
            const transform = translatePropertyToXAndY(
              peerVideoContainer.current.style.transform
            );
            animationControls.start((video) => {
              if (video === "peer") {
                if (transform.x < window.innerWidth / 3) {
                  transform.x = 0;
                  return {
                    x: 0,
                  };
                } else {
                  {
                    transform.x = window.outerWidth - 280;
                    return {
                      x: window.outerWidth - 280,
                    };
                  }
                }
              }
              return {};
            });

            setTransformOfPeerVideo(transform);

            setTimeout(() => {
              setIsDragging(false);
            }, 100);
          }}
          className={"grid place-items-center h-full w-full "}
          animate={animationControls}
          drag={isMyVideoExpanded}
          custom={"peer"}
          onClick={() => {
            if (isMyVideoExpanded && !isDragging) maxMinVideo();
          }}
          ref={peerVideoContainer}
        >
          <video
            src=""
            playsInline
            autoPlay
            className="h-full aspect-auto rounded-lg"
            ref={peerVideo}
          ></video>
        </motion.div>
      )}

      <div className="w-full absolute z-50 bottom-4 flex items-center justify-center gap-4">
        <button
          disabled={!isCallAccepted}
          className="disabled:text-gray-400 h-12 w-12 rounded-full bg-black/60 text-white"
          onClick={muteStream}
          ref={muteButton}
        >
          {isMuted ? (
            <span>
              <FontAwesomeIcon icon={faMicrophoneSlash}></FontAwesomeIcon>
            </span>
          ) : (
            <span>
              <FontAwesomeIcon icon={faMicrophone}></FontAwesomeIcon>
            </span>
          )}
        </button>
        <button
          disabled={!isCallAccepted}
          className="disabled:text-gray-400 h-12 w-12 rounded-full bg-black/60 text-white"
          onClick={stopVideoStream}
          ref={stopVideoButton}
        >
          {!isVideoStopped ? (
            <span>
              <FontAwesomeIcon icon={faVideo}></FontAwesomeIcon>
            </span>
          ) : (
            <span>
              <FontAwesomeIcon icon={faVideoSlash} />
            </span>
          )}
        </button>
        <button
          disabled={!isCallAccepted}
          className="disabled:text-gray-400 h-12 w-12 rounded-full grid place-items-center bg-black/60 text-white"
          onClick={shareScreen}
          ref={shareScreenButton}
        >
          {isCallAccepted ? (
            <svg
              fill="currentColor"
              viewBox="0 0 36 36"
              width="2rem"
              height="2rem"
            >
              <path d="M30 9a2 2 0 0 0-2-2H14a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h9a4 4 0 0 1 4 4v3a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2V9z"></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 17c0-1.105.948-2 2.118-2h13.764c1.17 0 2.118.895 2.118 2v10c0 1.105-.948 2-2.118 2H8.118C6.948 29 6 28.105 6 27V17zm3 1a1 1 0 0 1 1-1 9 9 0 0 1 9 9 1 1 0 1 1-2 0 7 7 0 0 0-7-7 1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1 5 5 0 0 1 5 5 1 1 0 1 1-2 0 3 3 0 0 0-3-3 1 1 0 0 1-1-1zm.667 3a.667.667 0 0 0-.667.667V26a1 1 0 0 0 1 1h.333a.667.667 0 0 0 .667-.667C11 25.597 10.403 25 9.667 25z"
              ></path>
            </svg>
          ) : (
            <svg
              fill="currentColor"
              viewBox="0 0 36 36"
              width="2rem"
              height="2rem"
            >
              <path d="M30 9a2 2 0 0 0-2-2H14a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h9a4 4 0 0 1 4 4v3a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2V9z"></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 17c0-1.105.948-2 2.118-2h13.764c1.17 0 2.118.895 2.118 2v10c0 1.105-.948 2-2.118 2H8.118C6.948 29 6 28.105 6 27V17zm12.283.295a1.013 1.013 0 0 1 1.426-.004c.39.391.38 1.028-.01 1.42l-3.114 3.112a.25.25 0 0 0 0 .354l3.113 3.113c.391.39.402 1.028.01 1.419-.39.39-1.034.387-1.425-.004l-3.113-3.113a.25.25 0 0 0-.353 0l-3.107 3.106c-.39.391-1.028.402-1.419.01a1.013 1.013 0 0 1 .004-1.425l3.107-3.106a.25.25 0 0 0 0-.354l-3.107-3.106a1.013 1.013 0 0 1-.004-1.426c.391-.39 1.028-.38 1.42.01l3.106 3.107a.25.25 0 0 0 .353 0l3.113-3.113z"
              ></path>
            </svg>
          )}
        </button>
        <button
          className="h-12 w-12 rounded-full text-white bg-red-600"
          onClick={endCall}
          ref={endCallButton}
        >
          <FontAwesomeIcon
            className="rotate-[135deg]"
            icon={faPhone}
          ></FontAwesomeIcon>
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
