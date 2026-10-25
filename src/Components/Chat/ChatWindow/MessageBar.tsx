import React, { useRef, useState } from "react";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { EmojiSmileFill, FileImage, SendFill, X } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

interface MessageBarProps {
  submitMessage: (message: string) => void;
}

export default function MessageBar({ submitMessage }: MessageBarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isEmojiOpened, setEmojiOpened] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || message.trim() === "") return;
    submitMessage(message);
    setMessage("");
    inputRef.current?.focus();
  };

  const emojiSelected = (emojiData: any) => {
    setMessage((prev) => prev + (emojiData.native || ""));
  };

  return (
    <form onSubmit={sendMessage} className="relative flex items-center gap-2 w-full">
      {/* Emoji picker popup */}
      {isEmojiOpened && (
        <div className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-bg20">
          <EmojiPicker
            data={data}
            onEmojiSelect={emojiSelected}
            onClickOutside={() => setEmojiOpened(false)}
            icons="solid"
            previewPosition="none"
            searchPosition="none"
            theme="auto"
          />
        </div>
      )}

      {/* Image attachment button (hidden in chatbot) */}
      {!pathname.includes("/chatbot") && (
        <button
          type="button"
          onClick={() => navigate("sendimage")}
          className="p-2 rounded-xl text-textColor opacity-75 hover:opacity-100 hover:bg-bg15 transition-all cursor-pointer flex-shrink-0"
          title="Send image"
        >
          <FileImage className="text-xl" />
        </button>
      )}

      {/* Main input wrapper */}
      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl bg-bg15/80 border border-bg20 focus-within:border-themeColor/70 transition-all">
        <button
          type="button"
          onClick={() => setEmojiOpened(!isEmojiOpened)}
          className="text-textColor opacity-75 hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
        >
          {isEmojiOpened ? (
            <motion.span initial={{ rotate: 0 }} animate={{ rotate: 90 }}>
              <X className="text-lg" />
            </motion.span>
          ) : (
            <EmojiSmileFill className="text-lg" />
          )}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent text-sm text-textColor placeholder-textColor/40 focus:outline-none"
        />
      </div>

      {/* Send button */}
      <button
        type="submit"
        disabled={!message.trim()}
        className="p-2.5 rounded-xl bg-themeColor text-themeMode shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer flex-shrink-0"
        title="Send"
      >
        <SendFill className="text-base" />
      </button>
    </form>
  );
}
