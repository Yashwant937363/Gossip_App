import { useParams } from "react-router-dom";
import "./Received.css";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../../socket/main";
import { setSingleTranslatedMessage } from "../../../../store/slices/ChatSlice";
import { ArrowClockwise } from "react-bootstrap-icons";

export default function ReceivedChat(props) {
  const dispatch = useDispatch();
  const { layoutId } = useParams();
  const {
    chatid,
    message,
    translatedMessage,
    position,
    type,
    onImageClick,
    container,
    scrollToBottom,
  } = props;
  const { alwaysTranslate, language } = useSelector(
    (state) => state.user.settings.translation
  );
  const translationPending = translatedMessage === undefined;
  const timeRef = useRef(null);
  const [chatRef, chatAnimation] = useAnimate();
  const [showSecondary, setShowSecondary] = useState(false);
  const [longPress, setLongPress] = useState(false);

  const handleMouseDown = () => {
    timeRef.current = setTimeout(() => {
      showSecondaryText();
      setLongPress(true);
      console.log("Long press detected");
    }, 500);
  };

  const handleMouseUp = () => {
    clearTimeout(timeRef.current);
    if (longPress) {
      hideSecondaryText();
      setLongPress(false);
    }
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };

  const showSecondaryText = () => {
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
    if (distanceFromBottom <= 100) {
      setTimeout(() => scrollToBottom(), 200);
    }
  };
  const hideSecondaryText = () => {
    setShowSecondary(false);
    chatAnimation(chatRef.current, {
      height: 0,
      padding: 0,
      paddingLeft: 0,
      paddingRight: 0,
    });
  };
  const handleSwitchTranslation = (event) => {
    event.stopPropagation();
    if (type === "text") {
      if (!showSecondary) {
        showSecondaryText();
      } else {
        hideSecondaryText();
      }
    }
  };

  const translateSingleMessage = () => {
    socket.emit(
      "ai:translate:single-message",
      { id: chatid, text: message, to: language },
      (response) => {
        dispatch(
          setSingleTranslatedMessage({
            id: chatid,
            translatedText: response?.translatedText,
            language: response.language,
          })
        );
      }
    );
  };
  useEffect(() => {
    if (showSecondary && translationPending && !alwaysTranslate) {
      translateSingleMessage();
    }
  }, [showSecondary]);

  const time = formatTime(props.time);
  return (
    <div className="chat" style={{ perspective: 1000 }}>
      <motion.div
        initial={{ opacity: 0, transform: "translateX(-10px)" }}
        whileInView={{ opacity: 1, transform: "translateX(0px)" }}
        className={`receivedchat ${position}`}
        onClick={onImageClick}
        onDoubleClick={handleSwitchTranslation}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {type === "text" ? (
          <>
            {translatedMessage || translatedMessage === undefined ? (
              <>
                <motion.div
                  className="primary text-chat"
                  animate={
                    translationPending && alwaysTranslate
                      ? { opacity: [1, 0.8, 1] }
                      : {}
                  }
                  transition={
                    translationPending && alwaysTranslate
                      ? { duration: 1, repeat: Infinity, ease: "linear" }
                      : {}
                  }
                >
                  <div className="chattext">
                    {alwaysTranslate
                      ? translatedMessage?.translatedText
                      : message}
                  </div>
                  <AnimatePresence>
                    {!showSecondary ? (
                      <motion.div exit={{ opacity: 0 }} className="timecheck">
                        {time}
                      </motion.div>
                    ) : (
                      <motion.div
                        exit={{ opacity: 0 }}
                        onClick={translateSingleMessage}
                        className="timecheck"
                      >
                        <ArrowClockwise className="retranslate-icon" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div
                  ref={chatRef}
                  className="secondary text-chat"
                  animate={
                    translationPending && !alwaysTranslate
                      ? { opacity: [1, 0.8, 1] }
                      : {}
                  }
                  transition={
                    translationPending && !alwaysTranslate
                      ? { duration: 1, repeat: Infinity, ease: "linear" }
                      : {}
                  }
                >
                  <div className="chattext">
                    {!alwaysTranslate
                      ? translatedMessage?.translatedText
                      : message}
                  </div>
                  <div className="timecheck">{time}</div>
                </motion.div>
              </>
            ) : (
              <div className="primary text-chat">
                <div className="chattext">{message}</div>
                <div className="timecheck">{time}</div>
              </div>
            )}
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
