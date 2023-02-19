import React from "react";
import style from "../../styles/request.module.css";
import { useEffect, useState, useRef } from "react";
import { RequestRoute } from "../../Routes";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Request() {
  const [request, setRequest] = useState(null);
  const requestBox = useRef();
  const [sender, setSender] = useState();
  const date = useRef();

  const { userId } = useSelector((store) => store.auth);
  useEffect(() => {
    async function friendReqFetcher() {
      const data = await axios.post(`${RequestRoute}/getRequest`, {
        user: userId,
      });
      if (data.data?.length > 0) {
        const filteredData = data.data.reduce((filteredData, current) => {
          return current.date > filteredData.date ? current : filteredData;
        });
        return filteredData;
      } else return null;
    }

    friendReqFetcher().then((data) => {
      setRequest(data);
      setSender(data?.sender);

      let dateWhenSent = data?.date;
      let today = Date.now();
      let differenceBtwSentDateAndToday = today - dateWhenSent;
      let hours = Math.floor(differenceBtwSentDateAndToday / (1000 * 60 * 60));
      let days = Math.floor(hours / 24);
      let months = Math.floor(days / 31);
      let years = Math.floor(months / 12);
      date.current =
        hours < 24
          ? `${hours} h`
          : days < 31
          ? `${days} d`
          : months < 12
          ? `${months} m`
          : `${years} y`;
    });
  }, []);
  const acceptHandler = async () => {
    let data = await axios.post(`${RequestRoute}/accept`, {
      user: userId,
      sender,
    });
    if (
      data.data.message === "Friend Added" ||
      data.data.message === "Successfully updated friend list"
    ) {
      requestBox.current.style.display = "none";
    }
  };
  const rejectHandler = () => {
    let data = axios.post(`${RequestRoute}/reject`, { user: userId, sender });
    if (data.data.message === "Request rejected") {
      requestBox.current.style.display = "none";
    }
  };

  return request ? (
    <div ref={requestBox} className={style.requestBox}>
      <div className={style.headingSection}>
        <h4 className={style.topic}>Friend Request</h4>
        <span className={style.seeAllButton}>See All</span>
      </div>

      <div className={style.friendRequestSection}>
        <span className={style.profilePicOfSender}>
          <img src={request.profile_pic} alt="" />
        </span>

        <div className={style.mainSection}>
          <div className={style.nameContainer}>
            <div className={style.nameOfSender}>{request.userName}</div>
            <div className={style.mutualFriendWrap}>
              <div className={style.profileOfMutualFriend}>
                {request.mutualFriendProfilePic?.length > 0 &&
                  request.mutualFriendProfilePic.map((profile, index) => (
                    <img src={profile} alt="" key={index} />
                  ))}
              </div>
              {request.mutualFriend !== 0 && (
                <span className={style.mutualFriendCounter}>
                  {request.mutualFriend} mutual Friends
                </span>
              )}
            </div>
          </div>

          <div className={style.timer}>{date.current}</div>
          <div className={style.buttonsContainer}>
            <button onClick={acceptHandler} className={style.confirmButton}>
              Confirm
            </button>
            <button onClick={rejectHandler} className={style.deleteButton}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
