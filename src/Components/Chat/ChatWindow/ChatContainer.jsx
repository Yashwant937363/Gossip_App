import { useEffect, useRef, useState } from "react";
import { EnvelopeSlashFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import SendChat from "./SendChat/SendChat";
import ReceivedChat from "./ReceiveChat/Received";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChatContainer() {
  const navigate = useNavigate();
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const fromuid = useSelector((state) => state.user.uid);
  const containerRef = useRef(null);
  const chats = useSelector((state) => state.chat.chats);
  const [userchat, setUserChats] = useState(new Array());
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
  let date;
  return (
    <div className="chatcontainer" ref={containerRef}>
      {userchat.length !== 0 ? (
        userchat.map((item, index) => {
          const currentDate = new Date(item.createdAt);
          const compareDates = (previousDate, currentDate) => {
            return (
              !previousDate ||
              previousDate.getDate() !== currentDate.getDate() ||
              previousDate.getMonth() !== currentDate.getMonth() ||
              previousDate.getFullYear() !== currentDate.getFullYear()
            );
          };
          const shouldRenderDate = compareDates(date, currentDate);
          if (shouldRenderDate) {
            date = currentDate;
          }
          const myPosition = () => {
            if (index === 0 || shouldRenderDate) {
              //first chat
              return "first";
            } else if (index === userchat.length - 1) {
              //last chat
              return userchat[index - 1].Sender_ID === item.Sender_ID
                ? "last"
                : "first";
            }
            //between chat
            const nextChatDate = new Date(userchat[index + 1].createdAt);
            const isNextChatDataDifferent = compareDates(
              currentDate,
              nextChatDate
            );
            return userchat[index - 1].Sender_ID === item.Sender_ID
              ? userchat[index + 1].Sender_ID === item.Sender_ID &&
                !isNextChatDataDifferent
                ? "between"
                : "last"
              : "first";
          };
          const imageOnClickHandler = () => {
            if (item.type === "image") {
              navigate(`viewimage/${index}`, {
                state: { message: item.text },
              });
            }
          };
          const position = myPosition();
          return (
            <React.Fragment key={index}>
              {shouldRenderDate && (
                <div className="date">
                  {`${date.getDate()} ${date.toLocaleString("default", {
                    month: "short",
                  })}, ${date.getFullYear()}`}
                </div>
              )}
              {item.Sender_ID === fromuid ? (
                <SendChat
                  key={index}
                  message={item.text}
                  status={item.seen}
                  time={item.createdAt}
                  type={item.type}
                  position={position}
                  onImageClick={imageOnClickHandler}
                />
              ) : (
                <ReceivedChat
                  key={index}
                  message={item.text}
                  time={item.createdAt}
                  type={item.type}
                  position={position}
                  onImageClick={imageOnClickHandler}
                />
              )}
            </React.Fragment>
          );
        })
      ) : (
        <div className="nochats">
          <EnvelopeSlashFill></EnvelopeSlashFill>
          <div>No Messages</div>
        </div>
      )}
    </div>
  );
}
