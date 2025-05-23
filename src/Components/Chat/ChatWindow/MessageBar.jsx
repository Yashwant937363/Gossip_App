import EmojiPicker from "@emoji-mart/react";
import { Data } from "emoji-mart";
import { useEffect, useRef, useState } from "react";
import { EmojiSmileFill, FileImage, SendFill, X } from "react-bootstrap-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";

export default function MessageBar(props) {
  const { uid } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { submitMessage } = props;
  const sendMessage = (e) => {
    e.preventDefault();
    inputRef.current.focus();
    submitMessage(message);
    setMessage("");
  };
  const [isEmojiOpened, setEmojiOpened] = useState(false);
  const [isEmojiClicked, setEmojiClicked] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef();
  const outsideClickedEmojiSection = () => {
    if (!isEmojiClicked) {
      closeEmojiSection();
    }
  };
  const emojiSeleted = (data) => {
    setMessage(message + data.native);
  };

  const closeEmojiSection = () => {
    setEmojiOpened(false);
  };
  const openEmojiSection = () => {
    setEmojiOpened(true);
    setEmojiClicked(true);
    setTimeout(() => {
      setEmojiClicked(false);
    }, 100);
  };
  return (
    <form className={`messagefield`} onSubmit={sendMessage}>
      {isEmojiOpened && (
        <div className="emojipicker">
          <EmojiPicker
            data={Data}
            onEmojiSelect={emojiSeleted}
            onClickOutside={outsideClickedEmojiSection}
            icons="solid"
            previewPosition="none"
            searchPosition="none"
            set="facebook"
          ></EmojiPicker>
        </div>
      )}
      <FileImage
        className={`icon fileimage ${
          message.trim() !== "" || pathname.includes("/chatbot") ? "hide" : ""
        }`}
        onClick={() => navigate("sendimage")}
      />
      <div className="input">
        {isEmojiOpened ? (
          <motion.span
            className="center"
            initial={{ rotate: 0 }}
            animate={{ rotate: 180, transition: { duration: 1 } }}
            exit={{ rotate: 0 }}
          >
            <X className="emoji icon" onClick={closeEmojiSection}></X>
          </motion.span>
        ) : (
          <EmojiSmileFill
            className="emoji icon"
            onClick={openEmojiSection}
          ></EmojiSmileFill>
        )}
        <input
          ref={inputRef}
          value={message}
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button type="submit">
        <SendFill></SendFill>
      </button>
    </form>
  );
}
