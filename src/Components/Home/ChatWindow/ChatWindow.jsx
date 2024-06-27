import React, { useEffect, useRef, useState } from "react";
import {
  CameraVideoFill,
  ChevronLeft,
  EmojiSmileFill,
  EnvelopeSlashFill,
  PersonFill,
  SendFill,
  TelephoneFill,
  X,
} from "react-bootstrap-icons";
import "./ChatWindow.css";
import SendChat from "./SendChat";
import ReceivedChat from "./Received";
import { useDispatch, useSelector } from "react-redux";
import {
  seenMessages,
  sendMessage,
  sendOutgoingAudioCall,
  sendOutgoingVideoCall,
} from "../../../store/socket";
import { changeOpenedChat } from "../../../store/slices/UISlice";
import { setSeenMessages } from "../../../store/slices/ChatSlice";
import { setCallStarted, setType } from "../../../store/slices/CallSlice";
import PeerService from "../../../service/PeerService";
import { setErrorMsgUser } from "../../../store/slices/UserSlice";
import EmojiPicker from "@emoji-mart/react";
import { Data } from "emoji-mart";
import { useNavigate, useParams } from "react-router-dom";

export default function ChatWindow(props) {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const fromuid = useSelector((state) => state.user.uid);
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const chats = useSelector((state) => state.chat.chats);
  const [userchat, setUserChats] = useState(new Array());
  const containerRef = useRef(null);
  const [animation, setAnimation] = useState({ animationName: "fadein" });
  const [isEmojiOpened, setEmojiOpened] = useState(false);
  const [isEmojiClicked, setEmojiClicked] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();
  const { uid } = useParams();
  const friends = useSelector((state) => state.chat.friends);
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

  const clearOpenedChat = () => {
    dispatch(changeOpenedChat(false));
    navigate("/");
  };

  const handleVideoCall = async () => {
    dispatch(setType("video"));
    dispatch(setCallStarted(true));
    PeerService.create();
    const offer = await PeerService.getOffer();
    sendOutgoingVideoCall({
      fromuid: fromuid,
      touid: openedchat.uid,
      offer: offer,
    });
  };

  const handleAudioCall = async () => {
    dispatch(setType("audio"));
    dispatch(setCallStarted(true));
    PeerService.create();
    const offer = await PeerService.getOffer();
    sendOutgoingAudioCall({
      fromuid: fromuid,
      touid: openedchat.uid,
      offer: offer,
    });
  };

  useEffect(() => {
    let newUserChats = new Array();
    if (chats.length !== 0) {
      chats.map((item) => {
        if (
          item.Sender_ID === openedchat.uid ||
          item.Receiver_ID === openedchat.uid
        ) {
          newUserChats.push(item);
        }
      });
    }
    setUserChats(newUserChats);
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };
    setTimeout(() => {
      scrollToBottom();
    }, [0]);
  }, [chats, openedchat]);

  useEffect(() => {
    setAnimation({});
    if (window.innerWidth <= 600) {
      setTimeout(() => setAnimation({ animationName: "scalein" }), 0);
    } else {
      setTimeout(() => setAnimation({ animationName: "fadein" }), 0);
    }
  }, [openedchat]);

  useEffect(() => {
    const touid = openedchat.uid;
    const messages = new Array(...chats);
    const lastIndex = messages
      .reverse()
      .findIndex((message) => message.Receiver_ID === fromuid);

    if (lastIndex !== -1) {
      const lastMessage = messages[lastIndex];
      if (lastMessage.seen === false) {
        seenMessages({ fromuid: touid, touid: fromuid });
        dispatch(setSeenMessages(fromuid));
      }
    }
  }, [chats]);

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
  const outsideClickedEmojiSection = () => {
    if (!isEmojiClicked) {
      closeEmojiSection();
    }
  };
  const emojiSeleted = (data) => {
    setMessage(message + data.native);
  };
  useEffect(() => {
    const index = friends.findIndex((friend) => friend.uid === uid);
    dispatch(changeOpenedChat(friends[index]));
    if (openedchat) {
      const touid = fromuid;
      seenMessages({ fromuid: uid, touid: touid });
    }
  }, []);
  return (
    <div className="chatwindow" style={animation}>
      <div className="profilebar">
        <ChevronLeft
          className="arrowlefticon"
          onClick={clearOpenedChat}
        ></ChevronLeft>
        <div className="outerimg">
          {openedchat.profile !== "" ? (
            <img className="chatprofileimg" src={openedchat.profile} alt="" />
          ) : (
            <div className="personfillicon">
              <PersonFill></PersonFill>
            </div>
          )}
        </div>
        <div className="profilebarusername">
          <div>{openedchat.username}</div>
        </div>
        <div className="callicons">
          <CameraVideoFill className="icon" onClick={handleVideoCall} />
          <TelephoneFill className="icon" onClick={handleAudioCall} />
        </div>
      </div>
      <div className="chatcontainer" ref={containerRef}>
        {userchat.length !== 0 ? (
          userchat.map((item, index) =>
            item.Sender_ID === fromuid ? (
              <SendChat
                key={index}
                message={item.text}
                status={item.seen}
                time={item.createdAt}
              />
            ) : (
              <ReceivedChat
                key={index}
                message={item.text}
                time={item.createdAt}
              />
            )
          )
        ) : (
          <div className="nochats">
            <EnvelopeSlashFill></EnvelopeSlashFill>
            <div>No Messages</div>
          </div>
        )}
      </div>

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
          <EmojiSmileFill
            className="emoji"
            onClick={openEmojiSection}
          ></EmojiSmileFill>
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
    </div>
  );
}
