import { useEffect, useRef, useState } from "react";
import {
  ChevronBarDown,
  ChevronDown,
  EnvelopeSlashFill,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import SendChat from "./SendChat/SendChat";
import ReceivedChat from "./ReceiveChat/Received";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { div } from "motion/react-client";
import { socket } from "../../../socket/main";

export default function ChatContainer() {
  const navigate = useNavigate();
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const fromuid = useSelector((state) => state.user.uid);
  const containerRef = useRef(null);
  const chats = useSelector((state) => state.chat.chats);
  const userTranslateLanguage = useSelector(
    (state) => state.user.settings.translation.language
  );
  const alwaysTranslate = useSelector(
    (state) => state.user.settings.translation.alwaysTranslate
  );

  const [userchat, setUserChats] = useState(new Array());
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
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
    if (alwaysTranslate) {
      const filterChatsForTranslation = newUserChats.filter(
        (chat) =>
          chat.Receiver_ID === fromuid &&
          chat.type === "text" &&
          !chat.translatedText.some((t) => t.language === userTranslateLanguage)
      );
      const inputTranslateText = filterChatsForTranslation.map((chat) => {
        return {
          id: chat._id.toString(),
          text: chat.text,
        };
      });
      if (inputTranslateText.length >= 1) {
        socket.emit(
          "ai:translate:multiple-messages",
          {
            messages: inputTranslateText,
            to: userTranslateLanguage,
          },
          fromuid
        );
      }
      console.log("for translation:", filterChatsForTranslation.length);
      console.log("all messages", newUserChats.length);
    }
    setTimeout(() => {
      scrollToBottom();
    }, [0]);
  }, [chats, openedchat]);
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop; // Current scroll position from the top
      const scrollHeight = container.scrollHeight; // Total scrollable height
      const clientHeight = container.clientHeight; // Visible height of the container

      // Distance from the bottom
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      // If user scrolls up 600px or more from the bottom, set the variable to true
      if (distanceFromBottom >= 600) {
        setIsScrolledUp(true);
      } else {
        setIsScrolledUp(false);
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
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
          const translatedText =
            item.Sender_ID === fromuid
              ? null
              : [...item.translatedText].find(
                  (item) => item.language === userTranslateLanguage
                );
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
                />
              ) : (
                <ReceivedChat
                  key={index}
                  chatid={item._id}
                  message={item.text}
                  translatedMessage={translatedText}
                  time={item.createdAt}
                  type={item.type}
                  position={position}
                  onImageClick={imageOnClickHandler}
                  scrollToBottom={scrollToBottom}
                  container={containerRef.current}
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
      {isScrolledUp && (
        <motion.div
          initial={{ opacity: 0, height: 40, width: 40 }}
          animate={{ opacity: 1, height: 40, width: 40 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, height: 40, width: 40 }}
          className="go-down center"
          onClick={scrollToBottom}
        >
          <motion.span
            className="center"
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            exit={{ rotate: 180 }}
          >
            <ChevronDown />
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}
