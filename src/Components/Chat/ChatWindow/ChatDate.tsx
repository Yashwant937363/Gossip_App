import React, { useState } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { summarizeConversation } from "../../../socket/ai";
import { RootState } from "../../../store/store";

interface ChatDateProps {
  date: Date;
  userchat?: any[];
  getConversation: (date: Date) => Array<{ username: string; message: string }>;
}

export default function ChatDate({ date, getConversation }: ChatDateProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { format } = useSelector(
    (state: RootState) => state.user.settings.summarization
  );

  const handleDoubleClick = async () => {
    if (!showSummary) {
      setShowSummary(true);
      if (!summary) {
        setLoading(true);
        try {
          const conversation = getConversation(date);
          if (conversation && conversation.length > 0) {
            const res = await summarizeConversation({
              conversation,
              format,
            });
            setSummary(res);
          }
        } catch (err) {
          console.error("Summarization error:", err);
        } finally {
          setLoading(false);
        }
      }
    } else {
      setShowSummary(false);
    }
  };

  const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
    month: "short",
  })}, ${date.getFullYear()}`;

  return (
    <div className="flex flex-col items-center my-4 select-none">
      <motion.div
        onDoubleClick={handleDoubleClick}
        className="px-4 py-1 rounded-full bg-bg15/90 border border-bg20 text-xs font-semibold opacity-75 hover:opacity-100 hover:border-themeColor transition-all cursor-pointer shadow-sm text-center"
        title="Double-click to generate AI summary of this day"
      >
        {formattedDate}
      </motion.div>

      {showSummary && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="w-[90%] max-w-lg mt-3 p-4 rounded-2xl bg-bg15/95 border border-themeColor/40 shadow-xl text-xs leading-relaxed text-textColor"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-bg20">
            <span className="font-bold text-themeColor uppercase tracking-wider text-[11px]">
              AI Daily Summary ({format})
            </span>
            <button
              type="button"
              onClick={() => setShowSummary(false)}
              className="opacity-60 hover:opacity-100 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="py-4 text-center opacity-70 animate-pulse">
              Generating summary with AI...
            </div>
          ) : summary?.summary ? (
            <div>
              {format === "bullet" && Array.isArray(summary.summary) ? (
                <ul className="list-disc list-inside space-y-1.5">
                  {summary.summary.map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              ) : format === "structured" && typeof summary.summary === "object" ? (
                <div className="space-y-2">
                  <h4 className="font-bold text-center text-themeColor text-sm">
                    {summary.summary.topic}
                  </h4>
                  {summary.summary.keyPoints && (
                    <div>
                      <span className="font-semibold block mb-1">Key Points:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {summary.summary.keyPoints.map((pt: string, i: number) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {summary.summary.conclusion && (
                    <p className="mt-2 pt-2 border-t border-bg20 font-medium">
                      <span className="font-bold">Conclusion:</span> {summary.summary.conclusion}
                    </p>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{summary.summary}</p>
              )}
            </div>
          ) : (
            <div className="text-center opacity-60">No conversation found to summarize for this date.</div>
          )}
        </motion.div>
      )}
    </div>
  );
}
