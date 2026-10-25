import React, { useState } from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { setSingleTranslatedMessage } from "../../../../store/slices/ChatSlice";
import { translateMessages } from "../../../../socket/ai";
import { ArrowClockwise, Translate } from "react-bootstrap-icons";
import { RootState, AppDispatch } from "../../../../store/store";

interface ReceivedChatProps {
  chatid?: string;
  message: string;
  translatedMessage?: any;
  position?: string;
  type?: "text" | "image";
  time?: number | string;
  onImageClick?: () => void;
  container?: any;
  scrollToBottom?: () => void;
}

export default function ReceivedChat({
  chatid,
  message,
  translatedMessage,
  position = "first",
  type = "text",
  time,
  onImageClick,
}: ReceivedChatProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { alwaysTranslate, language } = useSelector(
    (state: RootState) => state.user.settings.translation,
  );
  const [translating, setTranslating] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);

  const formatTime = (dateInput?: number | string) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    let hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleTranslateSingle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!chatid || translating) return;
    setTranslating(true);
    try {
      const response = await translateMessages({
        messages: [{ id: chatid, text: message }],
        to: language,
      });
      if (response?.messages?.[0]) {
        dispatch(
          setSingleTranslatedMessage({
            id: chatid,
            translatedText: response.messages[0].translatedText,
            language,
          }),
        );
      }
    } catch (err) {
      console.error("Single message translation error:", err);
    } finally {
      setTranslating(false);
    }
  };

  // Resolved text to show based on settings
  const hasTranslation =
    translatedMessage &&
    (typeof translatedMessage === "string"
      ? translatedMessage
      : translatedMessage.translatedText);

  const primaryText =
    alwaysTranslate && hasTranslation ? hasTranslation : message;
  const secondaryText =
    alwaysTranslate && hasTranslation
      ? message
      : hasTranslation
        ? hasTranslation
        : null;

  return (
    <div className="flex items-center justify-start w-full my-0.5 group">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        onClick={
          type === "image"
            ? onImageClick
            : () => setShowSecondary(!showSecondary)
        }
        className={`max-w-[80%] sm:max-w-[70%] p-2 rounded-2xl bg-bg15/90 text-textColor border border-bg20 shadow-md text-sm leading-relaxed flex flex-wrap gap-1 cursor-pointer ${
          position === "first"
            ? "rounded-bl-sm"
            : position === "last"
              ? "rounded-tl-sm"
              : ""
        }`}
      >
        {type === "text" ? (
          <div>
            <p className="whitespace-pre-wrap break-words">{primaryText}</p>

            {/* Translation view toggle / status */}
            {secondaryText && showSecondary && (
              <div className="mt-2 pt-2 border-t border-bg20 text-xs opacity-80 italic">
                <span className="font-semibold not-italic text-[10px] uppercase tracking-wider block text-themeColor mb-0.5">
                  {alwaysTranslate
                    ? "Original Text"
                    : `Translated (${language})`}
                </span>
                <p className="whitespace-pre-wrap break-words">
                  {secondaryText}
                </p>
              </div>
            )}
          </div>
        ) : (
          <img
            src={message}
            alt="Received media"
            className="rounded-xl max-h-60 sm:max-h-80 w-auto object-cover cursor-pointer hover:opacity-95"
          />
        )}

        <div className="flex items-center justify-end text-[10px] opacity-70 mt-0.5">
          <span>{formatTime(time)}</span>
        </div>
      </motion.div>

      {/* Translate icon button outside the chat bubble - visible on hover */}
      {type === "text" && !alwaysTranslate && (
        <button
          type="button"
          onClick={
            hasTranslation
              ? (e) => {
                  e.stopPropagation();
                  setShowSecondary(!showSecondary);
                }
              : handleTranslateSingle
          }
          disabled={translating}
          className={`ml-2 p-1.5 rounded-full transition-all cursor-pointer flex-shrink-0 ${
            translating
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus:opacity-100"
          } ${
            hasTranslation
              ? "text-themeColor bg-themeColor/15 hover:bg-themeColor/25"
              : "text-textColor hover:text-themeColor hover:bg-bg15"
          }`}
          title={
            hasTranslation
              ? showSecondary
                ? "Hide original text"
                : "Show original text"
              : `Translate to ${language}`
          }
          aria-label={`Translate to ${language}`}
        >
          {translating ? (
            <ArrowClockwise className="text-sm animate-spin text-themeColor" />
          ) : (
            <Translate className="text-base" />
          )}
        </button>
      )}
    </div>
  );
}
