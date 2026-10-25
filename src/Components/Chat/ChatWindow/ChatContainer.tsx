import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SendChat from "./SendChat/SendChat";
import ReceivedChat from "./ReceiveChat/Received";
import { useNavigate } from "react-router-dom";
import ChatDate from "./ChatDate";
import { translateMessages } from "../../../socket/ai";
import { setMultipleTranslatedMessages } from "../../../store/slices/ChatSlice";
import { RootState, AppDispatch } from "../../../store/store";
import { ChevronDown } from "react-bootstrap-icons";

export default function ChatContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const openedchat = useSelector(
    (state: RootState) => state.UIState.openedchat,
  );
  const fromuid = useSelector((state: RootState) => state.user.uid);
  const username = useSelector((state: RootState) => state.user.username);
  const chats = useSelector((state: RootState) => state.chat.chats);
  const userTranslateLanguage = useSelector(
    (state: RootState) => state.user.settings.translation.language,
  );
  const alwaysTranslate = useSelector(
    (state: RootState) => state.user.settings.translation.alwaysTranslate,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [userchat, setUserChats] = useState<any[]>([]);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const isNearBottomRef = useRef(true);
  const prevOpenedChatRef = useRef<string | null>(null);
  const prevChatsLengthRef = useRef<number>(0);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const isNear = distanceFromBottom < 120;
    isNearBottomRef.current = isNear;

    if (isNear) {
      setShowScrollDown(false);
      setNewMessagesCount(0);
    } else {
      setShowScrollDown(true);
    }
  };

  const handleScrollDownClick = () => {
    scrollToBottom("smooth");
    setNewMessagesCount(0);
    setShowScrollDown(false);
  };

  useEffect(() => {
    if (!openedchat?.uid) return;

    const filteredChats = chats.filter(
      (item) =>
        item.Sender_ID === openedchat.uid ||
        item.Receiver_ID === openedchat.uid,
    );
    setUserChats(filteredChats);

    const isNewChat = prevOpenedChatRef.current !== openedchat.uid;
    const addedCount = filteredChats.length - prevChatsLengthRef.current;

    if (isNewChat) {
      // Switched / opened a new conversation: reset counters and scroll down
      setNewMessagesCount(0);
      setShowScrollDown(false);
      isNearBottomRef.current = true;
      setTimeout(() => {
        scrollToBottom("auto");
      }, 50);
    } else if (addedCount > 0) {
      // Brand new message(s) added
      const lastMessage = filteredChats[filteredChats.length - 1];
      const isSentByMe = lastMessage?.Sender_ID === fromuid;

      if (isSentByMe || isNearBottomRef.current) {
        // User sent it or was already at the bottom: scroll down
        setTimeout(() => {
          scrollToBottom("smooth");
        }, 50);
        setNewMessagesCount(0);
      } else {
        // User is scrolled up: DO NOT auto-scroll, increment counter and show button
        setNewMessagesCount((prev) => prev + addedCount);
        setShowScrollDown(true);
      }
    }
    // Note: If addedCount <= 0 (e.g. in-place translation update), NO scroll is triggered!

    prevOpenedChatRef.current = openedchat.uid;
    prevChatsLengthRef.current = filteredChats.length;

    // If always translate is on, call backend POST /api/ai/translate
    if (
      alwaysTranslate &&
      userTranslateLanguage &&
      userTranslateLanguage !== "original"
    ) {
      const neededTranslations = filteredChats.filter(
        (chat) =>
          chat.Receiver_ID === fromuid &&
          chat.type === "text" &&
          (!chat.translatedText ||
            !chat.translatedText.some(
              (t) => t?.language === userTranslateLanguage,
            )),
      );

      const inputTexts = neededTranslations.map((chat) => ({
        id: chat._id?.toString() || "",
        text: chat.text,
      }));

      if (inputTexts.length > 0) {
        translateMessages({
          messages: inputTexts,
          to: userTranslateLanguage,
        })
          .then((res) => {
            if (res?.messages) {
              dispatch(setMultipleTranslatedMessages(res));
            }
          })
          .catch((err) => {
            console.error("Multi-message translation failed:", err);
          });
      }
    }
  }, [
    chats,
    openedchat,
    alwaysTranslate,
    userTranslateLanguage,
    fromuid,
    dispatch,
  ]);

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const getConversationForDate = (date: Date) => {
    return userchat
      .filter(
        (item) =>
          isSameDate(new Date(item.createdAt), date) && item.type === "text",
      )
      .map((item) => ({
        username: item.Sender_ID === fromuid ? username : openedchat.username,
        message: item.text,
      }));
  };

  let lastRenderedDate: Date | null = null;

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative bg-bg5"
      >
        {userchat.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60 text-center select-none">
            <p className="text-sm font-semibold">
              No messages in this chat yet
            </p>
            <span className="text-xs mt-1">
              Send a message to get the conversation started!
            </span>
          </div>
        ) : (
          userchat.map((item, index) => {
            const currentDate = new Date(item.createdAt);
            const shouldRenderDate =
              !lastRenderedDate || !isSameDate(lastRenderedDate, currentDate);

            if (shouldRenderDate) {
              lastRenderedDate = currentDate;
            }
            const compareDates = (previousDate, currentDate) => {
              return (
                !previousDate ||
                previousDate.getDate() !== currentDate.getDate() ||
                previousDate.getMonth() !== currentDate.getMonth() ||
                previousDate.getFullYear() !== currentDate.getFullYear()
              );
            };

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
                nextChatDate,
              );
              return userchat[index - 1].Sender_ID === item.Sender_ID
                ? userchat[index + 1].Sender_ID === item.Sender_ID &&
                  !isNextChatDataDifferent
                  ? "between"
                  : "last"
                : "first";
            };

            const isSender = item.Sender_ID === fromuid;
            const translatedObj = isSender
              ? null
              : item.translatedText?.find(
                  (t: any) => t?.language === userTranslateLanguage,
                );

            const handleImageClick = () => {
              if (item.type === "image") {
                navigate("viewimage", {
                  state: { message: item.text },
                });
              }
            };
            const position = myPosition();
            return (
              <React.Fragment key={item._id || index}>
                {shouldRenderDate && (
                  <ChatDate
                    date={currentDate}
                    userchat={userchat}
                    getConversation={getConversationForDate}
                  />
                )}

                {isSender ? (
                  <SendChat
                    message={item.text}
                    type={item.type}
                    time={item.createdAt}
                    status={item.seen}
                    onImageClick={handleImageClick}
                    position={position}
                  />
                ) : (
                  <ReceivedChat
                    chatid={item._id}
                    message={item.text}
                    translatedMessage={translatedObj}
                    type={item.type}
                    time={item.createdAt}
                    position={position}
                    onImageClick={handleImageClick}
                  />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Floating Scroll Down button with New Messages Badge */}
      {showScrollDown && (
        <button
          type="button"
          onClick={handleScrollDownClick}
          className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5 px-3 py-2 rounded-full bg-themeColor text-themeMode shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-semibold text-xs border border-bg20 animate-fadein"
          title="Scroll to bottom"
        >
          <ChevronDown className="text-base" />
          {newMessagesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-sm animate-pulse">
              {newMessagesCount > 99 ? "99+" : newMessagesCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
