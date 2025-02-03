import React, { useEffect, useState } from "react";
import { Check, CheckAll } from "react-bootstrap-icons";
import "./SendChat.css";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";

export default function SendChat(props) {
  const { position, message, type, onImageClick } = props;
  const navigate = useNavigate();
  const [isImageOpened, setImageOpened] = useState("");
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };
  const imageOnClickHandler = () => {
    if (type === "image") {
      navigate(`viewimage`, {
        state: { message },
      });
    }
  };
  const time = formatTime(props.time);
  const status = props.status;
  useEffect(() => {
    if (isImageOpened) {
      imageOnClickHandler();
    }
    return () => {
      console.log("Component removed");
    };
  }, [isImageOpened]);
  return (
    <div className="chat">
      <motion.div
        initial={{ opacity: 0, transform: "translateX(10px)" }}
        whileInView={{ opacity: 1, transform: "translateX(0px)" }}
        className={`sendchat ${position}`}
        onClick={() => setImageOpened("openedimage")}
      >
        {type === "text" ? (
          <div className="chattext">{message}</div>
        ) : (
          <motion.img
            layoutId={isImageOpened}
            className="image"
            src={message}
            alt=""
          />
        )}
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
      </motion.div>
    </div>
  );
}
