import React, { useState } from "react";
import { Check, CheckAll } from "react-bootstrap-icons";

export default function SendChat(props) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };
  const time = formatTime(props.time);
  const status = props.status;
  return (
    <div className="chat">
      <div className="sendchat">
        <div className="chattext">{props.message}</div>
        <div className="timecheck">
          <div>{time}</div>
          <div>
            {status === "chatbot" ? (
              <></>
            ) : status === true ? (
              <CheckAll className="readcheck check" />
            ) : status === false ? (
              <CheckAll className="receivedcheck check" />
            ) : (
              <Check className="sendcheck check" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
