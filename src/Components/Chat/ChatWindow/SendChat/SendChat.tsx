import React from "react";
import { Check, CheckAll } from "react-bootstrap-icons";
import { motion } from "motion/react";

interface SendChatProps {
  position?: string;
  message: string;
  type?: "text" | "image";
  time?: number | string;
  status?: boolean | string;
  onImageClick?: () => void;
}

export default function SendChat({
  position = "first",
  message,
  type = "text",
  time,
  status,
  onImageClick,
}: SendChatProps) {
  const formatTime = (dateInput?: number | string) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    let hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex justify-end">
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        onClick={onImageClick}
        className={`max-w-[80%] sm:max-w-[70%] p-2 flex-wrap justify-end rounded-2xl bg-themeColor text-themeMode shadow-md text-sm leading-relaxed flex gap-1   ${
          position === "first"
            ? "rounded-br-sm"
            : position === "last"
              ? "rounded-tr-sm"
              : "rounded-tr-sm rounded-br-sm"
        } ${type === "image" && "flex-col"}`}
      >
        {type === "text" ? (
          <p className="whitespace-pre-wrap break-words">{message}</p>
        ) : (
          <img
            src={message}
            alt="Sent media"
            className="rounded-xl max-h-96 object-cover cursor-pointer hover:opacity-95"
          />
        )}

        <div className="flex items-center justify-end gap-1 text-[10px] opacity-75 self-end">
          <span className="text-{0.1rem}">{formatTime(time)}</span>
          {status === true ? (
            <CheckAll className="text-sm font-bold text-sky-400" />
          ) : status === false ? (
            <CheckAll className="text-sm font-bold opacity-80" />
          ) : (
            <Check className="text-sm font-bold opacity-80" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
