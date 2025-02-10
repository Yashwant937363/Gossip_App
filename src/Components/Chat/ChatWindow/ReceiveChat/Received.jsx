import { useParams } from "react-router-dom";
import "./Received.css";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function ReceivedChat(props) {
  const { layoutId } = useParams();
  const {
    message,
    translatedMessage,
    position,
    type,
    onImageClick,
    container,
    scrollToBottom,
  } = props;
  const alwaysTranslate = useSelector(
    (state) => state.user.settings.translation.alwaysTranslate
  );
  const [chatRef, chatAnimation] = useAnimate();
  const [showSecondary, setShowSecondary] = useState(false);
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };
  const handleSwitchTranslation = () => {
    if (type === "text") {
      if (!showSecondary) {
        setShowSecondary(true);
        let distanceFromBottom;
        if (container) {
          const scrollTop = container.scrollTop; // Current scroll position from the top
          const scrollHeight = container.scrollHeight; // Total scrollable height
          const clientHeight = container.clientHeight; // Visible height of the container
          distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
        }

        // Distance from the bottom
        chatAnimation(chatRef.current, {
          height: "auto",
          padding: 7,
          paddingLeft: 10,
          paddingRight: 10,
        });
        if (distanceFromBottom <= window.innerHeight - 100) {
          setTimeout(() => scrollToBottom(), 200);
        }
      } else {
        setShowSecondary(false);
        chatAnimation(chatRef.current, {
          height: 0,
          padding: 0,
          paddingLeft: 0,
          paddingRight: 0,
        });
      }
    }
  };

  const time = formatTime(props.time);
  return (
    <div className="chat" style={{ perspective: 1000 }}>
      <motion.div
        initial={{ opacity: 0, transform: "translateX(-10px)" }}
        whileInView={{ opacity: 1, transform: "translateX(0px)" }}
        className={`receivedchat ${position}`}
        onClick={onImageClick}
        onDoubleClick={handleSwitchTranslation}
      >
        {type === "text" ? (
          <>
            <div className="primary text-chat">
              <div className="chattext">
                {alwaysTranslate ? translatedMessage.translatedText : message}
              </div>
              <AnimatePresence>
                {!showSecondary && (
                  <motion.div exit={{ opacity: 0 }} className="timecheck">
                    {time}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div ref={chatRef} className="secondary text-chat ">
              <div className="chattext">
                {!alwaysTranslate ? translatedMessage.translatedText : message}
              </div>
              <div className="timecheck">{time}</div>
            </div>
          </>
        ) : (
          <>
            <motion.img
              layoutId={layoutId}
              className="image"
              src={message}
              alt=""
            />
            <div className="timecheck">{time}</div>
          </>
        )}
      </motion.div>
    </div>
  );
}
