import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chat from "./Chat";
import { FriendsRoute, MessageRoute } from "../../Routes";
import Popup from "reactjs-popup";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMultiply } from "@fortawesome/free-solid-svg-icons";

export default function Friends({ socket }) {
  const [name, setName] = useState([]);
  const [isFriendAvailable, setIsFriendAvailable] = useState(true);

  const { userId } = useSelector((store) => store.auth);
  const [messages, setMessages] = useState([]);
  const [isChatLoaded, setIsChatLoaded] = useState(false);

  const otherUser = useRef();
  const userName = useRef();
  const roomId = useRef();
  const socketIdToPassAsProps = useRef();

  const [isBeingCalled, setIsBeingCalled] = useState(false);
  const callerData = useRef();

  const callAccepter = useCallback(() => {
    setIsBeingCalled(false);
    let URL = `http://192.168.1.75:3000/call?room_name=${
      callerData.current.roomName
    }&hasVideo=${
      callerData.current.hasVideo
    }&userId=${userId}&initiator=${false}`;
    window.open(
      URL,
      "popup",
      "top=100,left=200,height=700,width=1000,resizable=yes,scrollbars=no,status=no"
    );
    localStorage.setItem("from", "App");
    localStorage.setItem("callerData", JSON.stringify(callerData.current));
  }, [callerData.current?.from]);

  const callRejecter = () => {
    setIsBeingCalled(false);
  };
  useEffect(() => {
    const handler = (data) => {
      setIsBeingCalled(true);
      callerData.current = data;
    };
    socket?.on("beingCalled", handler);

    return () => {
      socket?.off("beingCalled", handler);
    };
  }, [socket]);

  const CallAlert = () => {
    return (
      <Popup
        open={isBeingCalled}
        position={"center center"}
        closeOnDocumentClick={false}
      >
        <audio className="invisible" src="/callalert.mp3" autoPlay loop></audio>
        <div className="bg-dark rounded-lg relative p-4 space-y-8 w-96 shadow-full border border-gray-300/40">
          <div
            onClick={() => {
              setIsBeingCalled(false);
            }}
            className="absolute grid place-items-center top-4 right-4 h-10 w-10 rounded-full bg-gray-400"
          >
            <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
          </div>

          <div className="flex mx-auto justify-center h-16 w-16 rounded-full overflow-hidden">
            <img
              src={callerData.current?.profile}
              className="object-cover"
              alt=""
            />
          </div>
          <div className="text-3xl w-full font-bold text-gray-200 text-center">
            {callerData.current?.userName} is calling you
          </div>
          <div className="text-sm text-gray-400 text-center ">
            The call will start as soon as you accept
          </div>
          <div className="flex items-center justify-center gap-16  text-white text-lg">
            <button onClick={callRejecter}>
              <div className="h-12 w-12 rounded-full bg-red-500 text-center grid place-items-center text-2xl">
                <FontAwesomeIcon icon={faMultiply}></FontAwesomeIcon>
              </div>
              Reject
            </button>

            <button
              autoFocus
              onClick={callAccepter}
              className="flex flex-col justify-center items-center  text-white"
            >
              <div className="h-12 w-12 rounded-full bg-green-400 text-center grid place-items-center text-2xl">
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
              </div>
              Accept
            </button>
          </div>
        </div>
      </Popup>
    );
  };

  useEffect(() => {
    const userConnectHandler = (data) => {
      document.querySelectorAll(".friends").forEach((friend) => {
        if (friend.id === data.facebookId) {
          friend.setAttribute("data-socket", data.socketId);
        }
      });
    };
    socket?.on("userConnected", userConnectHandler);

    axios
      .post(FriendsRoute, { userId })
      .then((Response) => {
        if (Response.data.status === 400) {
          setIsFriendAvailable(false);
        }
        setName(Response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      socket?.off("userConnected", userConnectHandler);
    };
  }, [socket, userId]);

  return !isFriendAvailable ? null : (
    <>
      <CallAlert></CallAlert>

      <div>
        <div className="contact-title">
          <h4>Contact </h4>
          <div className="contact-navigation">
            <span data-hover="New Room">
              <svg fill="#BEC3C9" viewBox="0 0 16 16" width="1em" height="1em">
                <g fillRule="evenodd" transform="translate(-448 -544)">
                  <path d="M457.25 552.5H455v2.25a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1 0-1.5h2.25v-2.25a.75.75 0 0 1 1.5 0V551h2.25a.75.75 0 0 1 0 1.5m6.38-4.435a.62.62 0 0 0-.64.047l-2.49 1.634v-1.394a1.854 1.854 0 0 0-1.852-1.852l-8.796.002a1.854 1.854 0 0 0-1.851 1.852v6.793c0 1.021.83 1.852 1.852 1.852l1.147-.002h7.648a1.854 1.854 0 0 0 1.852-1.851v-1.392l2.457 1.61a.641.641 0 0 0 .673.071.663.663 0 0 0 .37-.601v-6.167c0-.26-.142-.49-.37-.602"></path>
                </g>
              </svg>
            </span>
            <span data-hover="Search for a name or a group">
              <svg fill="#BEC3C9" viewBox="0 0 16 16" width="1em" height="1em">
                <g fillRule="evenodd" transform="translate(-448 -544)">
                  <g fillRule="nonzero">
                    <path
                      d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z"
                      transform="translate(448 544)"
                    ></path>
                    <path
                      d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z"
                      transform="translate(448 544)"
                    ></path>
                    <path
                      d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z"
                      transform="translate(448 544)"
                    ></path>
                    <path
                      d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z"
                      transform="translate(448 544)"
                    ></path>
                  </g>
                </g>
              </svg>
            </span>

            <span data-hover="Options">
              <svg fill="#BEC3C9" viewBox="0 0 20 20" width="1em" height="1em">
                <g fillRule="evenodd" transform="translate(-446 -350)">
                  <path d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path>
                </g>
              </svg>
            </span>
          </div>
        </div>

        {name.status === 400 ? (
          <div> Friend not found </div>
        ) : (
          name.map((element) => {
            return (
              <li
                onClick={handler}
                id={`${element.user_id}`}
                data-socket={element.socket_id}
                className="friends"
                key={element.user_id}
              >
                <span className="profile_pic_container">
                  <img
                    className="profile_pic"
                    src={element.profile_pic}
                    alt=""
                  />
                </span>
                <span className="user_name">{`${element.first_name} ${element.last_name}`}</span>
              </li>
            );
          })
        )}
        <hr />
      </div>
      {isChatLoaded && (
        <Chat
          socket={socket}
          socketId={socketIdToPassAsProps.current}
          otherUser={otherUser.current}
          userName={userName.current}
          roomName={roomId.current}
          setState={setMessages}
          state={messages}
          setCloser={setIsChatLoaded}
        ></Chat>
      )}
    </>
  );

  async function handler(e) {
    let friends = document.querySelectorAll(".friends");
    let container = Array.from(friends).filter((friend) =>
      friend.contains(e.target)
    );
    otherUser.current = container[0].id;
    socketIdToPassAsProps.current = container[0].getAttribute("data-socket");
    let roomName =
      userId > container[0].id
        ? `${container[0].id}${userId}`
        : `${userId}${container[0].id}`;
    userName.current = container[0].children[1].textContent;
    socket?.emit("join room", { roomName });
    roomId.current = roomName;
    let data = await axios.post(
      MessageRoute,
      { roomName },
      { withCredentials: true }
    );

    setMessages((prev) => [...prev, ...data.data]);
    setIsChatLoaded(true);
  }
}
