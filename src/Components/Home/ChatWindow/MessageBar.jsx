import { setErrorMsgUser } from "../../../store/slices/UserSlice";
import EmojiPicker from "@emoji-mart/react";
import { Data } from "emoji-mart";
import { sendMessage } from "../../../store/socket";
import { useRef, useState } from "react";
import { EmojiSmile, EmojiSmileFill, SendFill, X } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

export default function MessageBar() {
  const dispatch = useDispatch();
  const [isEmojiOpened, setEmojiOpened] = useState(false);
  const fromuid = useSelector((state) => state.user.uid);
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const [isEmojiClicked, setEmojiClicked] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef();
  const submitMessage = async (e) => {
    e.preventDefault();
    inputRef.current.focus();
    if (message.trim !== "") {
      const touid = openedchat.uid;
      await sendMessage({ fromuid, touid, message, dispatch });
      setMessage("");
    } else {
      dispatch(setErrorMsgUser("Cannot Send Empty Message"));
    }
  };
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
    <form className="messagefield" onSubmit={submitMessage}>
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
      {isEmojiOpened ? (
        <X className="emoji" onClick={closeEmojiSection}></X>
      ) : (
        <EmojiSmile className="emoji" onClick={openEmojiSection}></EmojiSmile>
      )}
      <input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">
        <SendFill></SendFill>
      </button>
    </form>
  );
}
