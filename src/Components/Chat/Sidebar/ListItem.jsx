import React, { useEffect, useState } from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function ListItem(props) {
  const { lastMessage } = props;
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const { profile, username, online, uid } = props;
  function formatDate(dateString) {
    if (dateString == undefined) {
      return "";
    }
    const date = new Date(dateString);
    const now = new Date();

    const isSameDay = date.toDateString() === now.toDateString();
    const isYesterday =
      date.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString();
    const isSameYear = date.getFullYear() === new Date().getFullYear();

    if (isSameDay) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (isYesterday) {
      return "yesterday";
    } else if (isSameYear) {
      return date.toLocaleDateString([], { day: "numeric", month: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", year: "numeric" });
    }
  }
  return (
    <Link
      to={uid == "chatbot" ? `/chat/chatbot` : `/chat/${uid}`}
      className={
        openedchat?.uid === uid ||
        (path === "/chat/chatbot" && uid === "chatbot")
          ? "openeditem listItem"
          : "listItem"
      }
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
        <div className="usernamewithdate">
          <h3>{username}</h3>
          <div>{formatDate(lastMessage?.createdAt)}</div>
        </div>
        <div className="lastmessage">
          {lastMessage?.text && lastMessage.text}
        </div>
      </div>
    </Link>
  );
}
