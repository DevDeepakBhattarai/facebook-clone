import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Main() {
  const ref = useRef(null);
  const featureContainer = useRef();
  const [isActive, setIsActive] = useState(false);

  const { userName, profile } = useSelector((store) => store.auth);

  const listDisplayer = () => {
    const features = featureContainer.current
      ? featureContainer.current.children
      : null;
    for (let index = 0; index < features.length; index++) {
      console.log();
      if (index > 10) {
        features[index].classList.toggle("display");
      }
      if (features[index].classList.contains("displayMore")) {
        features[index].classList.add("display");
      }
    }
  };
  const listHider = () => {
    const features = featureContainer.current
      ? featureContainer.current.children
      : null;
    for (let index = 0; index < features.length; index++) {
      if (index > 10 && !features[index].classList.contains("displayMore")) {
        features[index].classList.toggle("display");
      }
      if (features[index].classList.contains("displayMore")) {
        features[index].classList.remove("display");
      }
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        isActive &&
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.classList.contains("more-info")
      ) {
        ref.current.classList.toggle("display");
        setIsActive(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler, true);
    };
  });

  const moreLinks = () => {
    document.querySelector(".more-links").classList.toggle("display");
  };
  return (
    <div className="feature-container">
      <div className="features" ref={featureContainer}>
        <li className="features-pages">
          {" "}
          <div className="profile-pic">
            <img className="profile_pic_of_user" src={profile} alt="" />{" "}
          </div>
          {userName}
        </li>
        <li className="features-pages">
          {" "}
          <img src={"/friend.png"} alt="" /> Friends
        </li>
        <li className="features-pages">
          {" "}
          <img src={"/group.png"} alt="" /> Groups
        </li>
        <li className="features-pages">
          {" "}
          <img src={"/climate.png"} alt="" /> Climate Science Centre
        </li>
        <li className="features-pages">
          <img src={"/marketplace.png"} alt="" /> MarketPlace
        </li>
        <li className="features-pages">
          {" "}
          <img src={"/memories.png"} alt="" /> Memories
        </li>
        <li className="features-pages">
          {" "}
          <img src={"/saved.png"} alt="" />
          Saved
        </li>
        <li className="features-pages">
          <img src={"/most_recent.png"} alt="" />
          Most recent
        </li>
        <li className="features-pages">
          <img src={"/ad_manager.png"} alt="" />
          Ad Manager
        </li>
        <li className="features-pages">
          <img src={"/messenger.png"} alt="" />
          Messenger
        </li>
        <li className="features-pages">
          <img src={"/ad_centre.png"} alt="" />
          Ad Centre
        </li>

        <li className="features-pages display">
          <img src={"/pages.png"} alt="" />
          Pages
        </li>
        <li className="features-pages display">
          <img src={"/events.png"} alt="" />
          Events
        </li>
        <li className="features-pages display">
          <img src={"/community.png"} alt="" />
          Community Help
        </li>
        <li className="features-pages display">
          <img src={"/covid.png"} alt="" />
          COVID-19 Information Centre
        </li>
        <li className="features-pages display">
          <img src={"/facebook_pay.png"} alt="" />
          Facebook Pay
        </li>
        <li className="features-pages display">
          <img src={"/favourites.png"} alt="" />
          Favourites
        </li>
        <li className="features-pages display">
          <img src={"/gaming.png"} alt="" />
          Gaming video
        </li>
        <li className="features-pages display">
          <img src={"/live_videos.png"} alt="" />
          Live videos
        </li>
        <li className="features-pages display">
          <img src={"/messenger_kids.png"} alt="" />
          Messenger Kids
        </li>
        <li className="features-pages display">
          <img src={"/play_games.png"} alt="" />
          Play games
        </li>
        <li className="features-pages display">
          <img src={"/recent_ad_activity.png"} alt="" />
          Recent ad activity
        </li>
        <li className="features-pages display">
          <img src={"/watch.png"} alt="" /> Watch
        </li>

        <li className="features-pages displayMore" onClick={listDisplayer}>
          <span className="uparrow">
            <svg
              fill="currentColor"
              viewBox="0 0 16 16"
              width="1em"
              height="1em"
            >
              <g fillRule="evenodd" transform="translate(-448 -544)">
                <path
                  fillRule="nonzero"
                  d="M452.707 549.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L456 552.586l-3.293-3.293z"
                ></path>
              </g>
            </svg>
          </span>
          See More
        </li>

        <li className="features-pages display displayLess" onClick={listHider}>
          <span className="downarrow ">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              width="1em"
              height="1em"
            >
              <path d="M15.47 12.2 10 6.727 4.53 12.2a.75.75 0 0 1-1.06-1.061l6-6a.751.751 0 0 1 1.06 0l6 6a.75.75 0 0 1-1.06 1.061z"></path>
            </svg>
          </span>
          See Less
        </li>
      </div>
      <hr />

      <div className="shortcut">
        <h4 className="shortcut-heading">Your shortcut</h4>
        <span>
          <img className="game-image" src={"/game.png"} alt="" /> Cooking City-
          Restaurant Game
        </span>
      </div>
      <footer>
        <p className="links">
          <a href="https://www.facebook.com/privacy/policy/?entry_point=comet_dropdown">
            Privacy
          </a>{" "}
          .<a href="https://www.facebook.com/policies_center/">Terms</a> .{" "}
          <a href="https://www.facebook.com/business">Advertising</a> .{" "}
          <a href="https://www.facebook.com/help/568137493302217">Ad choices</a>{" "}
          . <a href="https://www.facebook.com/policies/cookies">Cookies</a> .{" "}
          <br />{" "}
          <span
            className="more-info"
            onClick={() => {
              setIsActive(true);
              moreLinks();
            }}
          >
            More
            <span className="more-links display" ref={ref}>
              <a href="https://about.facebook.com/">About</a>
              <a href="https://www.metacareers.com/">Career</a>
              <a href="https://developers.facebook.com/?ref=pf">Developers</a>
              <a href="https://www.facebook.com/help/?ref=pf">Help</a>
            </span>
          </span>
          .Meta &copy; 2022
        </p>
      </footer>
    </div>
  );
}
