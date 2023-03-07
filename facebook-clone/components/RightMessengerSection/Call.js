import React, { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePeer } from "../../context/PeerContext";
import { useRouter } from "next/router";

export default function Call({ socket, userId }) {
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
  const myVideoElement = useRef();
  const peerVideo = useRef();
  const myVideoContainer = useRef();
  const peerVideoContainer = useRef();
  const callData = useRef();
  const screen = useRef();
  const muteButton = useRef();
  const stopVideoButton = useRef();
  const seeAllParticipant = useRef();
  const endCallButton = useRef();
  const shareScreenButton = useRef();

  const timer = useRef();

  document.querySelector(".nav-bar").style.display = "none";

  useLayoutEffect(() => {
    const handler = () => {
      peer.close();
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
      muteButton.current.innerHTML = "Unmute";
    } else {
      audio.enabled = true;
      muteButton.current.innerHTML = "Mute";
    }
  };

  const stopVideoStream = async () => {
    const video = stream.getTracks().find((track) => track.kind === "video");
    if (video.enabled) {
      video.enabled = false;
      stopVideoButton.current.innerHTML = "Start video";
    } else {
      video.enabled = true;
      stopVideoButton.current.innerHTML = "Stop video";
    }
  };

  const endCall = useCallback(async () => {
    await new Promise((resolve) => {
      socket.emit("callEnded", { roomName: roomName.current });
      resolve();
    });

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
      screenTracks.onended = () => {
        senders.current
          .find((sender) => sender.track.kind === "video")
          .replaceTrack(stream.getTracks()[1]);
        myVideoElement.current.srcObject = stream;
      };
    } catch (e) {
      console.log(e);
      console.log("Please allow permissions to access");
    }
  }, [isCallAccepted]);

  // const peerToClientVideoSwitcher = () => {
  //   setIsMyVideoExpanded(false);
  //   if (
  //     !peerVideoContainer.current.classList.contains(style.peerVideoContainer)
  //   ) {
  //     myVideoContainer.current.classList.remove(style.peerVideoContainer);
  //     myVideoContainer.current.draggable = "true";
  //     myVideoContainer.current.classList.add(style.myVideoContainer);

  //     if (peerVideoContainer.current) {
  //       peerVideoContainer.current.classList.add(style.peerVideoContainer);
  //       peerVideoContainer.current.draggable = "false";
  //       peerVideoContainer.current.classList.remove(style.myVideoContainer);
  //     }
  //   }
  // };

  // const clientToPeerVideoSwitcher = useCallback((e) => {
  //   setIsMyVideoExpanded(true);

  //   if (
  //     !myVideoContainer.current.classList.contains(style.peerVideoContainer)
  //   ) {
  //     myVideoContainer.current.classList.add(style.peerVideoContainer);
  //     myVideoContainer.current.draggable = "false";
  //     myVideoContainer.current.classList.remove(style.myVideoContainer);

  //     if (peerVideoContainer.current) {
  //       peerVideoContainer.current.classList.remove(style.peerVideoContainer);
  //       peerVideoContainer.current.draggable = "true";
  //       peerVideoContainer.current.classList.add(style.myVideoContainer);
  //     }
  //   }
  // }, []);

  return router.query.room_name ? (
    <div ref={screen} className="h-screen w-screen">
      <motion.div
        className="h-full w-full"
        dragConstraints={screen}
        onClick={clientToPeerVideoSwitcher}
        drag
        ref={myVideoContainer}
      >
        <video
          src=""
          className="h-full w-full"
          playsInline
          muted
          autoPlay
          ref={myVideoElement}
        ></video>
      </motion.div>
      {isCallAccepted && (
        <motion.div
          drag
          className="w-max absolute z-50 "
          dragConstraints={screen}
          ref={peerVideoContainer}
        >
          <video
            src=""
            playsInline
            autoPlay
            className="h-16 aspect-video"
            ref={peerVideo}
          ></video>
        </motion.div>
      )}
      <div>
        <button onClick={muteStream} ref={muteButton}>
          Mute
        </button>
        <button onClick={stopVideoStream} ref={stopVideoButton}>
          Stop Video
        </button>
        <button onClick={shareScreen} ref={shareScreenButton}>
          Share Screen
        </button>
        <button onClick={endCall} ref={endCallButton}>
          End Call
        </button>
        <button ref={seeAllParticipant}>See All Participant</button>
      </div>
    </div>
  ) : (
    <></>
  );
}
