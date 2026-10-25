import React from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../../store/store";

interface ListItemProps {
  uid: string;
  username: string;
  profile?: string;
  online?: boolean;
  lastMessage?: any;
}

export default function ListItem({
  uid,
  username,
  profile,
  online,
  lastMessage,
}: ListItemProps) {
  const location = useLocation();
  const openedchat = useSelector(
    (state: RootState) => state.UIState.openedchat,
  );

  function formatDate(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isSameDay = date.toDateString() === now.toDateString();
    const isYesterday =
      date.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString();
    const isSameYear = date.getFullYear() === new Date().getFullYear();

    if (isSameDay) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (isYesterday) {
      return "Yesterday";
    } else if (isSameYear) {
      return date.toLocaleDateString([], { day: "numeric", month: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", year: "numeric" });
    }
  }

  const isCurrentChat =
    openedchat?.uid === uid ||
    (location.pathname === "/chat/chatbot" && uid === "chatbot");

  return (
    <Link
      to={uid === "chatbot" ? "/chat/chatbot" : `/chat/${uid}`}
      className={`flex items-center gap-3 p-3 transition-all cursor-pointer select-none ${
        isCurrentChat
          ? "bg-themeColor text-themeMode shadow-md font-medium"
          : "hover:bg-bg15/80 text-textColor"
      }`}
    >
      {/* Profile avatar with online status indicator */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <div
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 ${
            isCurrentChat ? "border-themeMode" : "border-bg10"
          } ${online ? "bg-emerald-500" : "bg-gray-500"}`}
        />
        {profile ? (
          <img
            src={profile}
            alt={username}
            className="w-full h-full object-cover rounded-full border border-bg20 shadow-sm"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-bg20 flex items-center justify-center text-textColor shadow-sm">
            <PersonFill className="text-xl" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="font-bold text-sm truncate">{username}</h3>
          <span className="text-[11px] opacity-70 ml-2 whitespace-nowrap">
            {formatDate(lastMessage?.createdAt)}
          </span>
        </div>
        <p className="text-xs opacity-75 truncate">
          {lastMessage?.type === "image"
            ? "📷 Image"
            : lastMessage?.text ||
              (uid === "chatbot" ? "AI Companion" : "Say hello!")}
        </p>
      </div>
    </Link>
  );
}
