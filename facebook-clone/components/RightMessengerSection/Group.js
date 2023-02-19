import axios from "axios";
import React, { useEffect, useState } from "react";
import { GroupRoute } from "../../Routes";

export default function Group() {
  const [name, setName] = useState([]);
  useEffect(() => {
    axios.get(GroupRoute).then((Response) => {
      setName(Response.data);
    });
  }, []);
  return (
    <div className="group">
      <h4 className="group_title">Group conversation</h4>
      {name.status === 400
        ? null
        : name.map((element) => {
            return (
              <li className="messenger_group" key={element.group_id}>
                <span className="profile_pic_container">
                  <img
                    className="profile_pic"
                    src={element.group_profile_pic}
                    alt=""
                  />
                </span>
                <span className="group_name">{element.group_name}</span>
              </li>
            );
          })}
      <li className="create_account">
        <span className="plus_icon_container">
          <i className="fa-solid fa-plus"></i>
        </span>
        <span>Create new group</span>
      </li>
    </div>
  );
}
