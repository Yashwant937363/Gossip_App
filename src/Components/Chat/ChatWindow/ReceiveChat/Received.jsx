import { useNavigate, useParams } from "react-router-dom";
import "./Received.css";
import { motion } from "motion/react";

export default function ReceivedChat(props) {
  const { layoutId } = useParams();
  const { message, position, type, onImageClick } = props;
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };
  const time = formatTime(props.time);
  return (
    <div className="chat">
      <motion.div
        initial={{ opacity: 0, transform: "translateX(-10px)" }}
        whileInView={{ opacity: 1, transform: "translateX(0px)" }}
        className={`receivedchat ${position}`}
        onClick={onImageClick}
      >
        {type === "text" ? (
          <div className="chattext">{message}</div>
        ) : (
          <motion.img
            layoutId={layoutId}
            className="image"
            src={message}
            alt=""
          />
        )}
        <div className="timecheck">{time}</div>
      </motion.div>
    </div>
  );
}
