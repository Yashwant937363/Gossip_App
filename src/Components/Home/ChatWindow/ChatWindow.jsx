import React, { useEffect, useState } from "react";
import {
  CameraVideoFill,
  ChevronLeft,
  PersonFill,
  TelephoneFill,
} from "react-bootstrap-icons";
import "./ChatWindow.css";
import { useDispatch, useSelector } from "react-redux";
import {
  seenMessages,
  sendOutgoingAudioCall,
  sendOutgoingVideoCall,
} from "../../../store/socket";
import { changeOpenedChat } from "../../../store/slices/UISlice";
import { setSeenMessages } from "../../../store/slices/ChatSlice";
import { setCallStarted, setType } from "../../../store/slices/CallSlice";
import PeerService from "../../../service/PeerService";
import { useNavigate, useParams } from "react-router-dom";
import MessageBar from "./MessageBar";
import ChatContainer from "./ChatContainer";

export default function ChatWindow(props) {
  const dispatch = useDispatch();
  const fromuid = useSelector((state) => state.user.uid);
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const chats = useSelector((state) => state.chat.chats);

  const [animation, setAnimation] = useState({ animationName: "fadein" });
  const navigate = useNavigate();
  const { uid } = useParams();
  const friends = useSelector((state) => state.chat.friends);

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

  useEffect(() => {
    const index = friends.findIndex((friend) => friend.uid === uid);
    dispatch(changeOpenedChat(friends[index]));
    if (openedchat) {
      const touid = fromuid;
      seenMessages({ fromuid: uid, touid: touid });
    }
    return () => {
      dispatch(changeOpenedChat(false));
    };
  }, [uid]);
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
      <ChatContainer></ChatContainer>
      <MessageBar></MessageBar>
    </div>
  );
}
