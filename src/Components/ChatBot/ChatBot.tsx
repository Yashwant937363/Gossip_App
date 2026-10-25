import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Robot } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, changeTone } from "../../store/slices/AIChatBotSlice";
import MessageBar from "../Chat/ChatWindow/MessageBar";
import { sendChatBotPrompt } from "../../socket/ai";
import SendChat from "../Chat/ChatWindow/SendChat/SendChat";
import ReceivedChat from "../Chat/ChatWindow/ReceiveChat/Received";
import { RootState, AppDispatch } from "../../store/store";

export default function ChatBot() {
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const tones = useSelector((state: RootState) => state.chatbot.tones);
  const tone = useSelector((state: RootState) => state.chatbot.selectedTone);
  const messages = useSelector((state: RootState) => state.chatbot.messages);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      navigate("/chat");
    }
  }, [isLogin, navigate]);

  const submitMessage = async (message: string) => {
    if (!message || message.trim() === "" || loading) return;

    dispatch(addMessage({ message, ai: false }));
    setLoading(true);

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.ai ? ("assistant" as const) : ("user" as const),
        content: m.text,
      }));

      const response = await sendChatBotPrompt({
        tone,
        message,
        history,
      });

      dispatch(addMessage({ message: response.reply, ai: true }));
    } catch (err) {
      console.error("Chatbot response error:", err);
      dispatch(
        addMessage({
          message: "Sorry, I had trouble processing that request. Please try again.",
          ai: true,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-[calc(100vh-45px)] w-full bg-bg5 text-textColor animate-fadein relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg10/90 backdrop-blur-md border-b border-bg20 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/chat/")}
            className="p-1 rounded-lg hover:bg-bg20 transition-colors cursor-pointer"
            aria-label="Back to Chats"
          >
            <ChevronLeft className="text-xl" />
          </button>
          <div className="w-9 h-9 rounded-full bg-themeColor/20 border border-themeColor flex items-center justify-center text-themeColor">
            <Robot className="text-xl" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide text-themeColor">AI Assistant</h2>
            <span className="text-[11px] text-emerald-400 font-medium">Online • Groq Powered</span>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-75 hidden sm:inline">Tone:</span>
          <select
            value={tone}
            onChange={(e) => dispatch(changeTone(e.target.value))}
            className="bg-bg15 border border-bg20 rounded-xl px-3 py-1.5 text-xs font-semibold text-textColor focus:outline-none focus:border-themeColor cursor-pointer"
          >
            {tones.map((t) => (
              <option key={t} value={t} className="bg-bg20 text-textColor">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <Robot className="text-5xl text-themeColor mb-3" />
            <p className="text-base font-semibold">How can I help you today?</p>
            <p className="text-xs max-w-xs mt-1">
              Ask anything, request recommendations, or change my tone using the dropdown above.
            </p>
          </div>
        ) : (
          messages.map((value, index) => {
            if (value.ai) {
              return (
                <ReceivedChat
                  key={index}
                  message={value.text}
                  time={value.time}
                  type={value.type}
                  translatedMessage={false}
                  position="first"
                />
              );
            } else {
              return (
                <SendChat
                  key={index}
                  message={value.text}
                  time={value.time}
                  type={value.type}
                  position="first"
                />
              );
            }
          })
        )}

        {loading && (
          <div className="flex items-center gap-2 p-3 max-w-[200px] rounded-2xl bg-bg15 text-textColor text-xs animate-pulse">
            <Robot className="text-sm text-themeColor" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Message input bar */}
      <div className="p-3 bg-bg10/90 border-t border-bg20 backdrop-blur-md">
        <MessageBar submitMessage={submitMessage} />
      </div>
    </div>
  );
}
