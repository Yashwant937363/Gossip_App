import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import { PersonFillAdd, PersonFillSlash, Robot } from "react-bootstrap-icons";
import SeachPeople from "./SeachPeople/SeachPeople";
import { useSelector } from "react-redux";
import SideProfile from "./SideProfile";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { RootState } from "../../../store/store";

export default function SideBar() {
  const requests = useSelector((state: RootState) => state.user.requests);
  const friends = useSelector((state: RootState) => state.chat.friends);
  const uid = useSelector((state: RootState) => state.user.uid);
  const [sortedFriends, setSortedFriends] = useState<any[]>([]);
  const chats = useSelector((state: RootState) => state.chat.chats);
  const [addperson, setAddPerson] = useState(false);
  const location = useLocation();

  const findLastMessageByUID = (targetUid?: string) => {
    if (!targetUid) return undefined;
    const reversedMessages = [...chats].reverse();
    for (const message of reversedMessages) {
      if (
        message.Sender_ID === targetUid ||
        message.Receiver_ID === targetUid
      ) {
        return message;
      }
    }
    return undefined;
  };

  useEffect(() => {
    const friendList = [...friends];
    friendList.sort((a, b) => {
      const msgA = findLastMessageByUID(a.uid);
      const msgB = findLastMessageByUID(b.uid);
      const dateA = msgA ? new Date(msgA.createdAt).getTime() : 0;
      const dateB = msgB ? new Date(msgB.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    setSortedFriends(friendList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, friends]);

  // In mobile view: hide sidebar if a specific chat or chatbot is active
  const isChatOpenOnMobile =
    location.pathname !== "/chat" && location.pathname !== "/chat/";

  return (
    <aside
      className={`h-full border-r border-bg20 bg-bg10/95 backdrop-blur-md flex flex-col gap-2 overflow-y-auto select-none ${
        isChatOpenOnMobile ? "hidden md:flex" : "flex"
      }`}
    >
      <AnimatePresence>
        {(location.pathname === "/chat" || location.pathname === "/chat/") && (
          <SideProfile />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-2 py-2">
        <h3 className="font-extrabold text-base tracking-wide ">
          Conversations
        </h3>
        <div className="relative">
          {requests.length !== 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          )}
          <button
            type="button"
            onClick={() => setAddPerson(!addperson)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              addperson
                ? "bg-themeColor text-themeMode shadow-md"
                : "bg-bg15 text-textColor hover:bg-bg20"
            }`}
            title="Add Friend / Search"
          >
            <PersonFillAdd className="text-base" />
          </button>
        </div>
      </div>

      {addperson && <SeachPeople />}

      {/* AI Bot item */}
      <ListItem
        username="AI ChatBot"
        uid="chatbot"
        profile=""
        online={true}
        lastMessage={findLastMessageByUID("chatbot")}
      />

      {/* Friends chat list */}
      <div className="flex flex-col gap-1 overflow-y-auto flex-1 mt-1">
        {sortedFriends.length > 0 ? (
          sortedFriends.map((item, index) => (
            <ListItem
              key={index}
              username={item?.username}
              uid={item?.uid}
              profile={item?.profile}
              online={item?.online}
              lastMessage={findLastMessageByUID(item?.uid)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center opacity-60">
            <PersonFillSlash className="text-3xl mb-2" />
            <span className="text-xs">No conversations yet</span>
          </div>
        )}
      </div>
    </aside>
  );
}
