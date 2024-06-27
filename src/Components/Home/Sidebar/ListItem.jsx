import React, { useEffect, useState } from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ListItem(props) {
  const dispatch = useDispatch();
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const [lastMessage, setLastMessage] = useState("");
  const { profile, username, online, uid } = props;
  useEffect(() => {}, []);
  return (
    <Link
      to={`/chat/${uid}`}
      className={openedchat.uid === uid ? "openeditem listItem" : "listItem"}
    >
      <div className="profileimgbox">
        <div className={online ? "dot online" : "dot offline"}></div>
        {profile !== "" ? (
          <img src={profile} className="profileimg" />
        ) : (
          <div className="personfillicon">
            <PersonFill></PersonFill>
          </div>
        )}
      </div>
      <div className="listItemtext">
        <h3>{username}</h3>
        <div>{lastMessage}</div>
      </div>
    </Link>
  );
}
