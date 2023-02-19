import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/chat.module.css";
import { v4 as uuid } from "uuid";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import { MessageRoute } from "../../Routes";
import { useCloser } from "../../hooks/useCloser";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
export default function Chat({
  socket,
  roomName,
  userName,
  state,
  setCloser,
  setState,
  otherUser,
  socketId,
}) {
  const functionForUseCloser = (ref, setState) => {
    setState(false);
    setTimeout(() => {
      setShouldDisable(true);
    }, 1);
  };
  const Picker = dynamic(() => import("emoji-picker-react"));
  //! Main variables

  const [message, setMessage] = useState(state);
  const [sendingMessage, setSendingMessage] = useState("");

  const { userId } = useSelector((store) => store.auth);
  const [isEmojiOpen, setIsEmojiOpen, emojiContainer] =
    useCloser(functionForUseCloser);
  const [shouldDisable, setShouldDisable] = useState(true);
  const [chatImages, setChatImages] = useState([]);
  const [pathOfImages, setPathOfImages] = useState([]);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  let formData = new FormData();

  //! Refs
  const messageInput = useRef();
  const chatModal = useRef();
  const emojiOpener = useRef();
  const fileInput = useRef();
  const photoInput = useRef();
  const gifInput = useRef();
  const stickerInput = useRef();
  const thumbsUpInput = useRef();
  const messageSender = useRef();
  const imagePreview = useRef();
  const loadingProgressBar = useRef();
  const functionalButtonContainer = useRef();
  const timerRef = useRef();

  //! Regex
  const httpLinkRegex =
    /(http(s)?:\/\/(www\.)?)[a-zA-Z0-9!_\-$]+(\.[a-zA-Z]{2,5})/;
  const wwwLinkRegex = /^(www\.)[a-zA-Z0-9!_\-$]+(\.[a-zA-Z]{3,4})/;

  //! Getting Id

  useEffect(() => {
    const handler = (e) => {
      if (
        !chatModal.current.contains(e.target) &&
        document.querySelector(".emoji-search") !== document.activeElement &&
        shouldDisable
      ) {
        focusOutHandlerForUiColorChange();
      }
      if (!shouldDisable) messageInput.current.focus();
    };
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [shouldDisable]);

  useEffect(() => {
    if (chatImages.length < 1) {
      setPathOfImages([]);
    }
    if (pathOfImages.length !== chatImages.length) {
      chatImages.forEach((element, Index) => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(element.file);
        fileReader.onloadstart = (e) => {
          if (
            pathOfImages.map((object) => object.id).indexOf(element.id) === -1
          ) {
            setPathOfImages((prev) => [
              ...prev,
              { file: fileReader.result, id: element.id },
            ]);
          }
        };
        fileReader.onprogress = (e) => {
          let progressBar = document.querySelector(`p[data-index="${Index}"]`);
          progressBar.style.right = `${100 - (e.loaded / e.total) * 100}%`;
        };
        fileReader.onload = (e) => {
          let progressBar = document.querySelector(`p[data-index="${Index}"]`);
          setTimeout(() => {
            progressBar.style.opacity = 0;
          }, 2000);
          setPathOfImages((prev) =>
            prev.map((Element) => {
              if (element.id === Element.id)
                return { file: e.target.result, id: Element.id };
              else return Element;
            })
          );
        };
      });
    }
    //eslint-disable-next-line
  }, [chatImages]);

  useEffect(() => {
    if (
      (sendingMessage !== "" &&
        sendingMessage !== " " &&
        sendingMessage !== null &&
        sendingMessage !== undefined) ||
      (chatImages !== null &&
        chatImages !== undefined &&
        !chatImages.length < 1)
    ) {
      for (let i = 4; i <= 6; i++) {
        document.querySelector(
          `.${styles.inputOption}:nth-child(${i})`
        ).style.display = "none";
      }
      if (messageSender.current?.style)
        messageSender.current.style.display = "none";
      if (thumbsUpInput.current?.style)
        thumbsUpInput.current.style.display = "inline-flex";
      messageInput.current.style.width = "15.75rem";
    } else {
      messageInput.current.parentElement.style.borderRadius = "2000px";
      messageInput.current.parentElement.style.paddingTop = "0";
      document.querySelector(`.${styles.inputContainer}`).style.alignItems =
        "center";

      imagePreview.current.style.display = "none";

      for (let i = 4; i <= 6; i++) {
        document.querySelector(
          `.${styles.inputOption}:nth-child(${i})`
        ).style.display = "inline-flex";
      }
      if (messageSender.current?.style)
        messageSender.current.style.display = "inline-flex";
      if (thumbsUpInput.current?.style)
        thumbsUpInput.current.style.display = "none";
      messageInput.current.style.width = "8rem";
    }
  }, [sendingMessage, chatImages]);

  useEffect(() => {
    socket.on("receive message", async (data) => {
      setMessage((prev) => {
        return [...prev, ...data];
      });

      return;
    });

    socket.on("ChatUpdate", async () => {
      let data = await axios.post(
        MessageRoute,
        { roomName },
        { withCredentials: true }
      );
      setMessage(data.data);
    });
  }, [socket, roomName]);

  function emojiHandler(e, emojiObject) {
    setSendingMessage((prev) => {
      if (prev === undefined || prev === null) {
        messageInput.current.value = `${emojiObject.emoji}`;
        return `${emojiObject.emoji}`;
      } else {
        messageInput.current.value = `${prev}${emojiObject.emoji}`;
        return `${prev}${emojiObject.emoji}`;
      }
    });
  }

  function callHandler(hasVideo) {
    let URL = `http://192.168.1.75:3000/call?user_to_ring=${socketId}&room_name=${roomName}&hasVideo=${hasVideo}&userId=${userId}&initiator=${true}`;
    window.open(
      URL,
      "popup",
      "top=100,left=200,height=700,width=1000,resizable=yes,scrollbars=no,status=no"
    );
    localStorage.setItem("from", "Chat");
  }

  function seenRequestSender() {
    if (message.length > 0) socket.emit("seenChat", { userId, roomName });
    else return;
  }
  function functionalButtonMouseEnterHandler() {
    timerRef.current = setTimeout(() => {
      functionalButtonContainer.current?.style.setProperty("--timer", "0s");
    }, 1500);
  }
  function functionalButtonMouseExitHandler() {
    clearTimeout(timerRef.current);
    functionalButtonContainer.current?.style.setProperty("--timer", "800ms");
  }
  return (
    <>
      <div ref={chatModal} className={styles.modal}>
        <div
          onClick={() => {
            messageInput.current.focus();
          }}
          onFocusCapture={() => {
            seenRequestSender();
            focusInHandlerForUiColorChange();
          }}
          className={styles.chatBody}
        >
          <div className={styles.heading}>
            <h4 className={styles.title}>{userName}</h4>{" "}
            <span
              ref={functionalButtonContainer}
              onMouseEnter={functionalButtonMouseEnterHandler}
              onMouseLeave={functionalButtonMouseExitHandler}
              className={styles.functionalButtonContainer}
            >
              <span className={styles.callSection}>
                <span
                  onClick={() => {
                    return callHandler(false);
                  }}
                  className={`${styles.audioCall} ${styles.functionalButtons}`}
                >
                  <svg
                    fill="blue"
                    height="28px"
                    role="presentation"
                    viewBox="-5 -5 30 30"
                    width="28px"
                  >
                    <path d="M10.952 14.044c.074.044.147.086.22.125a.842.842 0 001.161-.367c.096-.195.167-.185.337-.42.204-.283.552-.689.91-.772.341-.078.686-.105.92-.11.435-.01 1.118.174 1.926.648a15.9 15.9 0 011.713 1.147c.224.175.37.43.393.711.042.494-.034 1.318-.754 2.137-1.135 1.291-2.859 1.772-4.942 1.088a17.47 17.47 0 01-6.855-4.212 17.485 17.485 0 01-4.213-6.855c-.683-2.083-.202-3.808 1.09-4.942.818-.72 1.642-.796 2.136-.754.282.023.536.17.711.392.25.32.663.89 1.146 1.714.475.808.681 1.491.65 1.926-.024.31-.026.647-.112.921-.11.35-.488.705-.77.91-.236.17-.226.24-.42.336a.841.841 0 00-.368 1.161c.04.072.081.146.125.22a14.012 14.012 0 004.996 4.996z"></path>
                    <path d="M10.952 14.044c.074.044.147.086.22.125a.842.842 0 001.161-.367c.096-.195.167-.185.337-.42.204-.283.552-.689.91-.772.341-.078.686-.105.92-.11.435-.01 1.118.174 1.926.648.824.484 1.394.898 1.713 1.147.224.175.37.43.393.711.042.494-.034 1.318-.754 2.137-1.135 1.291-2.859 1.772-4.942 1.088a17.47 17.47 0 01-6.855-4.212 17.485 17.485 0 01-4.213-6.855c-.683-2.083-.202-3.808 1.09-4.942.818-.72 1.642-.796 2.136-.754.282.023.536.17.711.392.25.32.663.89 1.146 1.714.475.808.681 1.491.65 1.926-.024.31-.026.647-.112.921-.11.35-.488.705-.77.91-.236.17-.226.24-.42.336a.841.841 0 00-.368 1.161c.04.072.081.146.125.22a14.012 14.012 0 004.996 4.996z"></path>
                  </svg>
                </span>

                <span
                  onClick={() => {
                    return callHandler(true);
                  }}
                  className={`${styles.videoCall} ${styles.functionalButtons}`}
                >
                  <svg
                    fill="blue"
                    height="28px"
                    role="presentation"
                    viewBox="-5 -5 30 30"
                    width="29px"
                  >
                    <path d="M19.492 4.112a.972.972 0 00-1.01.063l-3.052 2.12a.998.998 0 00-.43.822v5.766a1 1 0 00.43.823l3.051 2.12a.978.978 0 001.011.063.936.936 0 00.508-.829V4.94a.936.936 0 00-.508-.828zM10.996 18A3.008 3.008 0 0014 14.996V5.004A3.008 3.008 0 0010.996 2H3.004A3.008 3.008 0 000 5.004v9.992A3.008 3.008 0 003.004 18h7.992z"></path>
                  </svg>
                </span>
              </span>

              <span
                className={`${styles.minimizer} ${styles.functionalButtons}`}
              >
                <svg
                  stroke="blue"
                  height="26px"
                  viewBox="-4 -4 24 24"
                  width="26px"
                >
                  <line
                    strokeLinecap="round"
                    strokeWidth="2"
                    x1="2"
                    x2="14"
                    y1="8"
                    y2="8"
                  ></line>
                </svg>
              </span>

              <span
                onClick={() => {
                  setCloser(false);
                  setMessage([]);
                  setState([]);
                }}
                className={`${styles.closer} ${styles.functionalButtons}`}
              >
                <svg
                  stroke="blue"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <g strokeLinecap="round" strokeWidth="2">
                    <line x1="6" x2="18" y1="6" y2="18"></line>
                    <line x1="6" x2="18" y1="18" y2="6"></line>
                  </g>
                </svg>
              </span>
            </span>
          </div>
          <div
            onClickCapture={() => {
              focusInHandlerForUiColorChange();
              messageInput.current.focus();
            }}
            onClick={seenRequestSender}
            className={styles.messageBodyContainer}
          >
            <ScrollToBottom
              initialScrollBehavior="auto"
              followButtonClassName={styles.scrollButton}
              className={styles.messageBody}
            >
              {message.length > 0
                ? //eslint-disable-next-line
                  message.map((Element, Index) => {
                    console.log();

                    if (Element.type === "images") {
                      return (
                        <div key={Element.id} className={styles.messageArea}>
                          <div
                            className={styles.messageContainer}
                            id={
                              Element.sender === userId
                                ? `${styles.sender}`
                                : `${styles.receiver}`
                            }
                          >
                            <li
                              id={
                                Element.sender === userId
                                  ? `${styles.sendersImage}`
                                  : `${styles.receiversImage}`
                              }
                              className={
                                Element.sender === userId
                                  ? `${styles.message}  ${styles.sender} `
                                  : ` ${styles.message} ${styles.receiver} `
                              }
                            >
                              <span className={styles.images}>
                                {Element.message.map((element, index) => {
                                  return (
                                    <p
                                      key={index}
                                      className={styles.chatImagesHolder}
                                    >
                                      <img
                                        src={
                                          element?.file ? element.file : element
                                        }
                                        alt=""
                                      />
                                    </p>
                                  );
                                })}
                              </span>
                            </li>
                            {
                              //eslint-disable-next-line
                              !isImageUploaded && Element.seen == undefined && (
                                <div className={styles.loadingProgressBar}>
                                  <span ref={loadingProgressBar}></span>
                                  <p></p>
                                </div>
                              )
                            }

                            {isImageUploaded || Element.seen !== undefined ? (
                              <i
                                className={`fa fa-check-circle-o fa-xs ${styles.check}`}
                              ></i>
                            ) : null}

                            {(isImageUploaded || Element.seen) &&
                            ((Element.seen &&
                              !message[Index + 1] &&
                              Element.sender === userId) ||
                              (Index + 1 === message.length &&
                                Element.sender !== userId) ||
                              (Element.sender !== userId &&
                                !message[Index + 1]?.seen &&
                                message[Index + 1]?.sender === userId) ||
                              (Element.sender === userId &&
                                Element.seen &&
                                message[Index + 1]?.sender === userId &&
                                !message[Index + 1]?.seen)) ? (
                              <i
                                className={`fa fa-circle fa-xs ${styles.check}`}
                              ></i>
                            ) : null}
                          </div>
                        </div>
                      );
                    }

                    if (typeof Element.message === "string") {
                      return (
                        <div key={Element.id} className={styles.messageArea}>
                          <div
                            className={styles.messageContainer}
                            id={
                              Element.sender === userId
                                ? `${styles.sender}`
                                : `${styles.receiver}`
                            }
                          >
                            <li
                              className={
                                Element.sender === userId
                                  ? `${styles.message}  ${styles.sender}`
                                  : ` ${styles.message} ${styles.receiver}`
                              }
                            >
                              {Element.message}
                            </li>

                            {!Element.seen ? (
                              <i
                                className={`fa fa-check-circle-o fa-xs ${styles.check}`}
                              ></i>
                            ) : null}

                            {(Element.seen &&
                              !message[Index + 1] &&
                              Element.sender === userId) ||
                            (Index + 1 === message.length &&
                              Element.sender !== userId) ||
                            (Element.sender !== userId &&
                              !message[Index + 1]?.seen &&
                              message[Index + 1]?.sender === userId) ||
                            (Element.sender === userId &&
                              Element.seen &&
                              message[Index + 1]?.sender === userId &&
                              !message[Index + 1]?.seen) ? (
                              <i
                                className={`fa fa-circle fa-xs ${styles.check}`}
                              ></i>
                            ) : null}
                          </div>
                        </div>
                      );
                    }

                    if (Element.type === "link") {
                      return (
                        <div key={Element.id} className={styles.messageArea}>
                          <div
                            className={styles.messageContainer}
                            id={
                              Element.sender === userId
                                ? `${styles.sender}`
                                : `${styles.receiver}`
                            }
                          >
                            <li
                              id={
                                Element.sender === userId
                                  ? `${styles.sendersImage}`
                                  : `${styles.receiversImage}`
                              }
                              className={
                                Element.sender === userId
                                  ? `${styles.message}  ${styles.sender} `
                                  : ` ${styles.message} ${styles.receiver} `
                              }
                            >
                              <span className={styles.linkMessage}>
                                <p className={styles.extraText}>
                                  {httpLinkRegex.test(Element.message.message)
                                    ? Element.message.message
                                        .split(
                                          httpLinkRegex.exec(
                                            Element.message.message
                                          )[0]
                                        )
                                        .reduce((total, element) => (
                                          <>
                                            {total}
                                            <a
                                              target="_new"
                                              className={styles.messageLink}
                                              href={
                                                httpLinkRegex.exec(
                                                  Element.message.message
                                                )[0]
                                              }
                                            >
                                              {
                                                httpLinkRegex.exec(
                                                  Element.message.message
                                                )[0]
                                              }
                                            </a>{" "}
                                            {element}
                                          </>
                                        ))
                                    : Element.message.message
                                        .split(
                                          wwwLinkRegex.exec(
                                            Element.message.message
                                          )[0]
                                        )
                                        .reduce((total, element) => (
                                          <>
                                            {total}
                                            <a
                                              target="_new"
                                              className={styles.messageLink}
                                              href={`https://${
                                                wwwLinkRegex.exec(
                                                  Element.message.message
                                                )[0]
                                              }`}
                                            >
                                              {
                                                wwwLinkRegex.exec(
                                                  Element.message.message
                                                )[0]
                                              }
                                            </a>{" "}
                                            {element}
                                          </>
                                        ))}
                                </p>

                                <a
                                  href={
                                    httpLinkRegex.test(Element.message.message)
                                      ? httpLinkRegex.exec(
                                          Element.message.message
                                        )[0]
                                      : `http://${
                                          wwwLinkRegex.exec(
                                            Element.message.message
                                          )[0]
                                        }`
                                  }
                                  target="_new"
                                >
                                  {Element?.message?.img ? (
                                    <img
                                      className={styles.preview}
                                      src={Element.message.img}
                                      alt=""
                                    />
                                  ) : null}
                                </a>
                              </span>
                            </li>
                            {!Element.seen ? (
                              <i
                                className={`fa fa-check-circle-o fa-xs ${styles.check}`}
                              ></i>
                            ) : null}

                            {(Element.seen &&
                              !message[Index + 1] &&
                              Element.sender === userId) ||
                            (Index + 1 === message.length &&
                              Element.sender !== userId) ||
                            (Element.sender !== userId &&
                              !message[Index + 1]?.seen &&
                              message[Index + 1]?.sender === userId) ||
                            (Element.sender === userId &&
                              Element.seen &&
                              message[Index + 1]?.sender === userId &&
                              !message[Index + 1]?.seen) ? (
                              <i
                                className={`fa fa-circle fa-xs ${styles.check}`}
                              ></i>
                            ) : null}
                          </div>
                        </div>
                      );
                    }
                  })
                : null}
            </ScrollToBottom>
          </div>
          <div
            onClickCapture={() => {
              messageInput.current.focus();
            }}
            className={styles.inputContainer}
          >
            <div
              id="ThumbsUp 6"
              ref={thumbsUpInput}
              style={{ gridColumn: "1/2" }}
              className={styles.inputOption}
              onClick={chatSender}
            >
              <svg
                className={styles.variousSvgInput}
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
              >
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"></path>
              </svg>
            </div>

            <div
              id="Sender 6"
              style={{ gridColumn: "1/2" }}
              ref={messageSender}
              className={styles.inputOption}
            >
              <svg
                className={styles.variousSvgInput}
                viewBox="0 0 16 16"
                height="20"
                width="20"
              >
                <path d="M16,9.1c0-0.8-0.3-1.1-0.6-1.3c0.2-0.3,0.3-0.7,0.3-1.2c0-1-0.8-1.7-2.1-1.7h-3.1c0.1-0.5,0.2-1.3,0.2-1.8 c0-1.1-0.3-2.4-1.2-3C9.3,0.1,9,0,8.7,0C8.1,0,7.7,0.2,7.6,0.4C7.5,0.5,7.5,0.6,7.5,0.7L7.6,3c0,0.2,0,0.4-0.1,0.5L5.7,6.6 c0,0-0.1,0.1-0.1,0.1l0,0l0,0L5.3,6.8C5.1,7,5,7.2,5,7.4v6.1c0,0.2,0.1,0.4,0.2,0.5c0.1,0.1,1,1,2,1h5.2c0.9,0,1.4-0.3,1.8-0.9 c0.3-0.5,0.2-1,0.1-1.4c0.5-0.2,0.9-0.5,1.1-1.2c0.1-0.4,0-0.8-0.2-1C15.6,10.3,16,9.9,16,9.1z"></path>
                <path d="M3.3,6H0.7C0.3,6,0,6.3,0,6.7v8.5C0,15.7,0.3,16,0.7,16h2.5C3.7,16,4,15.7,4,15.3V6.7C4,6.3,3.7,6,3.3,6z"></path>
              </svg>
            </div>

            <div id="INPUT 5" className={`${styles.messageInput}`}>
              <input
                placeholder="Aa"
                value={sendingMessage}
                className={styles.message_input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") chatSender();
                }}
                ref={messageInput}
                onInput={(e) => {
                  setSendingMessage(e.target.value);
                }}
                type="text"
              />

              <div
                ref={emojiContainer}
                onFocusCapture={focusInHandlerForUiColorChange}
                className={styles.emojiPicker}
              >
                <div ref={imagePreview} className={styles.selectedImagePreview}>
                  <div className={styles.logoContainer}>
                    <i className={styles.selectFileLogo}></i>
                    <input
                      type="file"
                      className={styles.photoInput}
                      name="chatImages"
                      multiple
                      onChange={selectFile}
                    />
                  </div>

                  {chatImages.length > 0 &&
                    pathOfImages.map((element, Index) => {
                      return (
                        <span
                          key={element.id}
                          className={styles.imageContainerForCrossButton}
                        >
                          <span
                            key={element.id}
                            className={styles.imageContainer}
                          >
                            <img
                              src={element.file}
                              className={styles.image}
                              alt=""
                              loading="lazy"
                            />
                            <p
                              data-index={Index}
                              className={styles.progressBar}
                            ></p>
                          </span>
                          <p
                            onClick={imageRemoveHandler}
                            className={styles.crossButtonContainer}
                            data-id={element.id}
                          >
                            <img
                              className={styles.crossButton}
                              data-id={element.id}
                              src="http://192.168.1.75:3001/images/multiply.svg"
                              alt=""
                            />
                          </p>
                        </span>
                      );
                    })}
                </div>
                {isEmojiOpen && (
                  <Picker onEmojiClick={emojiHandler} preload={false}></Picker>
                )}
              </div>

              {isEmojiOpen && (
                <div
                  ref={emojiOpener}
                  className={`${styles.emojiContainer} ${styles.inputOption}`}
                  onClick={() => {
                    setIsEmojiOpen(false);
                    messageInput.current.focus();
                  }}
                >
                  <svg height="20px" viewBox="0 0 38 38" width="20px">
                    <g className={styles.variousSvgInput} fillRule="evenodd">
                      <g transform="translate(-893.000000, -701.000000)">
                        <g transform="translate(709.000000, 314.000000)">
                          <g>
                            <path d="M210.5,405 C209.121,405 208,403.879 208,402.5 C208,401.121 209.121,400 210.5,400 C211.879,400 213,401.121 213,402.5 C213,403.879 211.879,405 210.5,405 M212.572,411.549 C210.428,413.742 206.938,415 203,415 C199.062,415 195.572,413.742 193.428,411.549 C192.849,410.956 192.859,410.007 193.451,409.428 C194.045,408.85 194.993,408.859 195.572,409.451 C197.133,411.047 199.909,412 203,412 C206.091,412 208.867,411.047 210.428,409.451 C211.007,408.859 211.956,408.85 212.549,409.428 C213.141,410.007 213.151,410.956 212.572,411.549 M195.5,400 C196.879,400 198,401.121 198,402.5 C198,403.879 196.879,405 195.5,405 C194.121,405 193,403.879 193,402.5 C193,401.121 194.121,400 195.5,400 M203,387 C192.523,387 184,395.523 184,406 C184,416.477 192.523,425 203,425 C213.477,425 222,416.477 222,406 C222,395.523 213.477,387 203,387"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              )}
              {!isEmojiOpen && (
                <div
                  ref={emojiOpener}
                  className={`${styles.emojiContainer} ${styles.inputOption}`}
                  onClick={() => {
                    setIsEmojiOpen(true);
                    setShouldDisable(false);

                    messageInput.current.focus();
                  }}
                >
                  <svg height="20px" viewBox="0 0 38 38" width="20px">
                    <g className={styles.variousSvgInput} fillRule="evenodd">
                      <g transform="translate(-893.000000, -701.000000)">
                        <g transform="translate(709.000000, 314.000000)">
                          <g>
                            <path d="M210.5,405 C209.121,405 208,403.879 208,402.5 C208,401.121 209.121,400 210.5,400 C211.879,400 213,401.121 213,402.5 C213,403.879 211.879,405 210.5,405 M212.572,411.549 C210.428,413.742 206.938,415 203,415 C199.062,415 195.572,413.742 193.428,411.549 C192.849,410.956 192.859,410.007 193.451,409.428 C194.045,408.85 194.993,408.859 195.572,409.451 C197.133,411.047 199.909,412 203,412 C206.091,412 208.867,411.047 210.428,409.451 C211.007,408.859 211.956,408.85 212.549,409.428 C213.141,410.007 213.151,410.956 212.572,411.549 M195.5,400 C196.879,400 198,401.121 198,402.5 C198,403.879 196.879,405 195.5,405 C194.121,405 193,403.879 193,402.5 C193,401.121 194.121,400 195.5,400 M203,387 C192.523,387 184,395.523 184,406 C184,416.477 192.523,425 203,425 C213.477,425 222,416.477 222,406 C222,395.523 213.477,387 203,387"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              )}
            </div>

            <div id="GIF 4" ref={gifInput} className={styles.inputOption}>
              <svg
                className={styles.variousSvgInput}
                x="0px"
                y="0px"
                viewBox="0 0 16 16"
                height="20px"
                width="20px"
              >
                <path
                  d="M.783 12.705c.4.8 1.017 1.206 1.817 1.606 0 0 1.3.594 2.5.694 1 .1 1.9.1 2.9.1s1.9 0 2.9-.1 1.679-.294 2.479-.694c.8-.4 1.157-.906 1.557-1.706.018 0 .4-1.405.5-2.505.1-1.2.1-3 0-4.3-.1-1.1-.073-1.976-.473-2.676-.4-.8-.863-1.408-1.763-1.808-.6-.3-1.2-.3-2.4-.4-1.8-.1-3.8-.1-5.7 0-1 .1-1.7.1-2.5.5s-1.417 1.1-1.817 1.9c0 0-.4 1.484-.5 2.584-.1 1.2-.1 3 0 4.3.1 1 .2 1.705.5 2.505zm10.498-8.274h2.3c.4 0 .769.196.769.696 0 .5-.247.68-.747.68l-1.793.02.022 1.412 1.252-.02c.4 0 .835.204.835.704s-.442.696-.842.696H11.82l-.045 2.139c0 .4-.194.8-.694.8-.5 0-.7-.3-.7-.8l-.031-5.631c0-.4.43-.696.93-.696zm-3.285.771c0-.5.3-.8.8-.8s.8.3.8.8l-.037 5.579c0 .4-.3.8-.8.8s-.8-.4-.8-.8l.037-5.579zm-3.192-.825c.7 0 1.307.183 1.807.683.3.3.4.7.1 1-.2.4-.7.4-1 .1-.2-.1-.5-.3-.9-.3-1 0-2.011.84-2.011 2.14 0 1.3.795 2.227 1.695 2.227.4 0 .805.073 1.105-.127V8.6c0-.4.3-.8.8-.8s.8.3.8.8v1.8c0 .2.037.071-.063.271-.7.7-1.57.991-2.47.991C2.868 11.662 1.3 10.2 1.3 8s1.704-3.623 3.504-3.623z"
                  fillRule="nonzero"
                ></path>
              </svg>
            </div>

            <div
              id="Sticker 3"
              ref={stickerInput}
              className={styles.inputOption}
            >
              <svg
                className={styles.variousSvgInput}
                x="0px"
                y="0px"
                viewBox="0 0 17 16"
                height="20px"
                width="20px"
              >
                <g fillRule="evenodd">
                  <circle fill="none" cx="5.5" cy="5.5" r="1"></circle>
                  <circle fill="none" cx="11.5" cy="4.5" r="1"></circle>
                  <path
                    d="M5.3 9c-.2.1-.4.4-.3.7.4 1.1 1.2 1.9 2.3 2.3h.2c.2 0 .4-.1.5-.3.1-.3 0-.5-.3-.6-.8-.4-1.4-1-1.7-1.8-.1-.2-.4-.4-.7-.3z"
                    fill="none"
                  ></path>
                  <path d="M10.4 13.1c0 .9-.4 1.6-.9 2.2 4.1-1.1 6.8-5.1 6.5-9.3-.4.6-1 1.1-1.8 1.5-2 1-3.7 3.6-3.8 5.6z"></path>
                  <path
                    d="M2.5 13.4c.1.8.6 1.6 1.3 2 .5.4 1.2.6 1.8.6h.6l.4-.1c1.6-.4 2.6-1.5 2.7-2.9.1-2.4 2.1-5.4 4.5-6.6 1.3-.7 1.9-1.6 1.9-2.8l-.2-.9c-.1-.8-.6-1.6-1.3-2-.7-.5-1.5-.7-2.4-.5L3.6 1.5C1.9 1.8.7 3.4 1 5.2l1.5 8.2zm9-8.9c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-3.57 6.662c.3.1.4.4.3.6-.1.3-.3.4-.5.4h-.2c-1-.4-1.9-1.3-2.3-2.3-.1-.3.1-.6.3-.7.3-.1.5 0 .6.3.4.8 1 1.4 1.8 1.7zM5.5 5.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
                    fillRule="nonzero"
                  ></path>
                </g>
              </svg>
            </div>

            <div id="UploadPhoto 2" className={styles.inputOption}>
              <svg
                className={styles.variousSvgInput}
                viewBox="0 -1 17 17"
                height="20px"
                width="20px"
              >
                <g fill="none" fillRule="evenodd">
                  <path
                    className={styles.variousSvgInput}
                    d="M2.882 13.13C3.476 4.743 3.773.48 3.773.348L2.195.516c-.7.1-1.478.647-1.478 1.647l1.092 11.419c0 .5.2.9.4 1.3.4.2.7.4.9.4h.4c-.6-.6-.727-.951-.627-2.151z"
                  ></path>
                  <circle
                    className={styles.variousSvgInput}
                    cx="8.5"
                    cy="4.5"
                    r="1.5"
                  ></circle>
                  <path
                    className={styles.variousSvgInput}
                    d="M14 6.2c-.2-.2-.6-.3-.8-.1l-2.8 2.4c-.2.1-.2.4 0 .6l.6.7c.2.2.2.6-.1.8-.1.1-.2.1-.4.1s-.3-.1-.4-.2L8.3 8.3c-.2-.2-.6-.3-.8-.1l-2.6 2-.4 3.1c0 .5.2 1.6.7 1.7l8.8.6c.2 0 .5 0 .7-.2.2-.2.5-.7.6-.9l.6-5.9L14 6.2z"
                  ></path>
                  <path
                    d="M13.9 15.5l-8.2-.7c-.7-.1-1.3-.8-1.3-1.6l1-11.4C5.5 1 6.2.5 7 .5l8.2.7c.8.1 1.3.8 1.3 1.6l-1 11.4c-.1.8-.8 1.4-1.6 1.3z"
                    className={styles.photoSvg}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
              <input
                type="file"
                ref={photoInput}
                name="chatImages"
                onChange={selectFile}
                multiple
              />
            </div>

            <div
              id="AttachFile 1"
              ref={fileInput}
              style={{ gridColumn: "6/7" }}
              className={styles.inputOption}
            >
              <svg
                className={styles.variousSvgInput}
                viewBox="0 0 24 24"
                height="20px"
                width="20px"
              >
                <g fillRule="evenodd">
                  <polygon
                    fill="none"
                    points="-6,30 30,30 30,-6 -6,-6 "
                  ></polygon>
                  <path d="m18,11l-5,0l0,-5c0,-0.552 -0.448,-1 -1,-1c-0.5525,0 -1,0.448 -1,1l0,5l-5,0c-0.5525,0 -1,0.448 -1,1c0,0.552 0.4475,1 1,1l5,0l0,5c0,0.552 0.4475,1 1,1c0.552,0 1,-0.448 1,-1l0,-5l5,0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1m-6,13c-6.6275,0 -12,-5.3725 -12,-12c0,-6.6275 5.3725,-12 12,-12c6.627,0 12,5.3725 12,12c0,6.6275 -5.373,12 -12,12"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  function focusOutHandlerForUiColorChange() {
    if (messageInput.current !== document.activeElement) {
      let container = document.querySelector(`.${styles.inputContainer}`);
      container.style.setProperty("--ui-Color", "gray");
    }
  }

  function focusInHandlerForUiColorChange() {
    let container = document.querySelector(`.${styles.inputContainer}`);
    container.style.setProperty("--ui-Color", "blue");
  }

  async function chatSender() {
    if (chatImages.length > 0) {
      const config = {
        onUploadProgress: (e) => {
          console.log(e.loaded, e.total);
          let completedPercent = (e.loaded / e.total) * 100;

          if (completedPercent <= 25) {
            loadingProgressBar.current.style.clipPath = `polygon(0% 0%, 0% 50%, 50% 50%,${
              completedPercent * 2
            }% 0%)`;
          } else if (completedPercent <= 50) {
            loadingProgressBar.current.style.clipPath = `polygon(0% 0%, 0% 50%,${
              completedPercent * 2
            }% 50%,${completedPercent * 2}% 0%)`;
          } else if (completedPercent <= 75) {
            loadingProgressBar.current.style.clipPath = `polygon(0% 0%,100% 0%,100% ${
              completedPercent + 25
            }% ,50% ${completedPercent + 25}%,50% 50%, 0% 50%)`;
          } else {
            loadingProgressBar.current.style.clipPath = `polygon(0% 0%,100% 0%,100% 100%,  ${
              100 - completedPercent
            }% 100% , ${100 - completedPercent}% 50%, 0% 50%)`;
          }

          if (e.loaded / e.total === 1) {
            setIsImageUploaded(true);
          }
        },
      };

      chatImages.forEach((element, Index) => {
        formData.append("chatImages", chatImages[Index].file);
      });
      setMessage((prev) => {
        return [
          ...prev,
          {
            message: pathOfImages,
            roomName,
            sender: userId,
            type: "images",
            id: uuid(),
          },
        ];
      });

      formData.append("sender", `${userId}`);
      formData.append("roomName", `${roomName}`);
      formData.append("id", uuid());
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
      }
      setChatImages([]);
      let messages = await axios.post(
        "http://192.168.1.75:3001/chatImages",
        formData,
        config,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(messages.status);
    }

    if (sendingMessage === "" || sendingMessage === " ") {
      return;
    } else {
      socket.emit("message", { sendingMessage, roomName, sender: userId });
      setMessage((prev) => [
        ...prev,
        { message: sendingMessage, roomName, sender: userId, id: uuid() },
      ]);
      setSendingMessage("");
    }
    messageInput.current.value = "";
    messageInput.current.focus();
  }

  function selectFile(e) {
    setIsImageUploaded(false);
    console.log(e.target.files[0].height);
    setChatImages((prev) => [
      ...prev,
      ...Array.from(e.target.files).map((element) => {
        return { file: element, id: uuid() };
      }),
    ]);
    // imagePlaceholder?.current?.style.display='inline';
    messageInput.current.parentElement.style.paddingTop = "5.8rem";
    messageInput.current.parentElement.style.borderRadius = "20px";
    document.querySelector(`.${styles.inputContainer}`).style.alignItems =
      "flex-end";
    imagePreview.current.style.display = "flex";
  }
  function imageRemoveHandler(e) {
    setPathOfImages(
      pathOfImages.filter((element) => {
        //eslint-disable-next-line
        return element.id != e.target.getAttribute("data-id");
      })
    );
    setChatImages(
      chatImages.filter((element) => {
        //eslint-disable-next-line
        return element.id != e.target.getAttribute("data-id");
      })
    );
  }
}
