import React, { useLayoutEffect } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import style from "../../styles/call.module.css";
import { usePeer } from "../../context/PeerContext";
import { useRouter } from "next/router";

export default function Call({ socket, userId }) {
  const router = useRouter();
  if (!router.query.user_to_ring || !router.query.room_name) {
    console.log("Hello");
    router.push("/");
  }
  const param = router.query;
  const roomName = useRef(param.room_name);
  const userToCall = useRef(param.user_to_ring);
  const [isMyVideoExpanded, setIsMyVideoExpanded] = useState(false);

  const position = useRef();
  useEffect(() => {
    position.current = {
      LOWER_LIMIT: 0,
      UPPER_HEIGHT_LIMIT: window.innerHeight - 50,
      UPPER_WIDTH_LIMIT: window.innerWidth - 50,
    };
  });

  const {
    peer,
    sendStream,
    createOffer,
    setRemoteAnswer,
    createAnswer,
    peerStream,
    senders,
  } = usePeer();

  console.log(peer);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [stream, setStream] = useState();
  const myVideoElement = useRef();
  const peerVideoElement = useRef();
  const myVideoContainer = useRef();
  const peerVideoContainer = useRef();
  const callData = useRef();

  const muteButton = useRef();
  const stopVideoButton = useRef();
  const seeAllParticipant = useRef();
  const endCallButton = useRef();
  const shareScreenButton = useRef();

  const timer = useRef();

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

    if (
      myVideoContainer.current &&
      !myVideoContainer.current.classList.contains(style.peerVideoContainer)
    ) {
      myVideoContainer.current.addEventListener("dragstart", dragStart);
      myVideoContainer.current.addEventListener("dragend", dragHandler);
      myVideoContainer.current.addEventListener("drag", dragHandler);
      myVideoContainer.current.addEventListener(
        "touchstart",
        touchStartHandler
      );
      myVideoContainer.current.addEventListener("touchend", touchEndHandler);
    }
  }, []);

  useEffect(() => {
    if (peerStream) peerVideoElement.current.srcObject = peerStream;
  }, [peerStream]);

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
      router.push("/");
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
      await peer.setLocalDescription(offer);

      socket.emit("negotiationNeeded", {
        roomName: roomName.current,
        offer: offer,
      });
    };

    const negotiationHandler = async (data) => {
      await peer.setRemoteDescription(data.offer);

      const answer = await peer.createAnswer(data.offer);
      await peer.setLocalDescription(answer);
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

  function dragHandler(e) {
    if (
      !(e.clientX - 50 < 0) &&
      !(e.clientX > position.current.UPPER_WIDTH_LIMIT)
    )
      e.target.style.left = `${e.clientX - 50}px`;
    if (
      !(e.clientY - 40 < 0) &&
      !(e.clientY > position.current.UPPER_HEIGHT_LIMIT)
    )
      e.target.style.top = `${e.clientY - 50}px`;
  }

  const clientToPeerVideoSwitcher = useCallback((e) => {
    setIsMyVideoExpanded(true);

    if (
      !myVideoContainer.current.classList.contains(style.peerVideoContainer)
    ) {
      myVideoContainer.current.classList.add(style.peerVideoContainer);
      myVideoContainer.current.draggable = "false";
      myVideoContainer.current.classList.remove(style.myVideoContainer);

      if (peerVideoContainer.current) {
        peerVideoContainer.current.classList.remove(style.peerVideoContainer);
        peerVideoContainer.current.draggable = "true";
        peerVideoContainer.current.classList.add(style.myVideoContainer);
      }
    }
  }, []);

  useEffect(() => {
    const peerVid = peerVideoContainer;
    const myVid = myVideoContainer;
    if (
      isMyVideoExpanded &&
      peerVideoContainer.current &&
      myVideoContainer.current
    ) {
      peerVideoContainer.current.draggable = true;
      peerVideoContainer.current.addEventListener("dragstart", dragStart);
      peerVideoContainer.current.addEventListener("dragend", dragHandler);
      peerVideoContainer.current.addEventListener("drag", dragHandler);
      peerVideoContainer.current.addEventListener(
        "touchstart",
        touchStartHandler
      );
      peerVideoContainer.current.addEventListener("touchend", touchEndHandler);
    } else if (
      !isMyVideoExpanded &&
      peerVideoContainer.current &&
      myVideoContainer.current
    ) {
      myVideoContainer.current.addEventListener("dragstart", dragStart);
      myVideoContainer.current.addEventListener("dragend", dragHandler);
      myVideoContainer.current.addEventListener("drag", dragHandler);
      myVideoContainer.current.addEventListener(
        "touchstart",
        touchStartHandler
      );
      myVideoContainer.current.addEventListener("touchend", touchEndHandler);
      myVideoContainer.current.draggable = true;
    }
    return () => {
      if (peerVid.current) {
        peerVid.current.removeEventListener("dragstart", dragStart);
        peerVid.current.removeEventListener("dragend", dragHandler);
        peerVid.current.removeEventListener("drag", dragHandler);
        peerVid.current.removeEventListener("touchstart", touchStartHandler);
        peerVid.current.removeEventListener("touchend", touchEndHandler);
        peerVid.current.draggable = false;
      }

      if (myVid.current) {
        myVid.current.removeEventListener("dragend", dragHandler);
        myVid.current.removeEventListener("drag", dragHandler);
        myVid.current.removeEventListener("touchstart", touchStartHandler);
        myVid.current.removeEventListener("touchend", touchEndHandler);
        myVid.current.removeEventListener("dragstart", dragStart);
        myVid.current.draggable = false;
      }
    };
  }, [isMyVideoExpanded]);

  const peerToClientVideoSwitcher = () => {
    setIsMyVideoExpanded(false);
    if (
      !peerVideoContainer.current.classList.contains(style.peerVideoContainer)
    ) {
      myVideoContainer.current.classList.remove(style.peerVideoContainer);
      myVideoContainer.current.draggable = "true";
      myVideoContainer.current.classList.add(style.myVideoContainer);

      if (peerVideoContainer.current) {
        peerVideoContainer.current.classList.add(style.peerVideoContainer);
        peerVideoContainer.current.draggable = "false";
        peerVideoContainer.current.classList.remove(style.myVideoContainer);
      }
    }
  };
  function dragStart(e) {
    e.dataTransfer.effectAllowed = "copyMove";
    var img = document.createElement("img");
    img.src = "";
    e.dataTransfer.setDragImage(img, 0, 0);
  }
  function touchMoveHandler(e) {
    // grab the location of touch
    const { pageX, pageY } = e.targetTouches[0];

    // assign box new coordinates based on the touch.
    if (!(pageX - 50 < 0) && !(pageX > position.current.UPPER_WIDTH_LIMIT))
      myVideoContainer.current.style.left = `${pageX - 50}px`;
    peerVideoContainer.current.style.left = `${pageX - 50}px`;
    if (!(pageY - 40 < 0) && !(pageY > position.current.UPPER_HEIGHT_LIMIT))
      myVideoContainer.current.style.top = `${pageY - 50}px`;
    peerVideoContainer.current.style.top = `${pageY - 50}px`;
  }

  function touchStartHandler(e) {
    timer.current = setTimeout(() => {
      e.target.style.border = "1px solid red";
      window.addEventListener("touchmove", touchMoveHandler);
    }, 500);
  }
  function touchEndHandler(e) {
    clearTimeout(timer.current);
    e.target.style.border = "none";

    window.removeEventListener("touchmove", touchMoveHandler);
  }

  return router.query.user_to_ring && router.query.room_name ? (
    <div>
      <div
        onClick={clientToPeerVideoSwitcher}
        draggable
        ref={myVideoContainer}
        className={style.myVideoContainer}
      >
        <video
          src=""
          playsInline
          muted
          autoPlay
          className={style.myVideo}
          ref={myVideoElement}
        ></video>
      </div>

      {isCallAccepted && (
        <div
          onClick={peerToClientVideoSwitcher}
          className={style.peerVideoContainer}
          ref={peerVideoContainer}
        >
          <video
            src=""
            playsInline
            autoPlay
            className={style.peerVideo}
            ref={peerVideoElement}
          ></video>
        </div>
      )}

      <div className={style.functionalButtonContainer}>
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
