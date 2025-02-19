import React, { useEffect, useState } from "react";
import { motion, useAnimate, useWillChange } from "motion/react";
import { socket } from "../../../socket/main";
import { useSelector } from "react-redux";
import { func } from "prop-types";

export default function ChatDate(props) {
  const { date, userchat, getConversation } = props;
  const [dateRef, dateAnimation] = useAnimate();
  const [showSummary, setShowSummary] = useState();
  const [summary, setSummary] = useState(null);
  const { format } = useSelector((state) => state.user.settings.summarization);
  const handleOnDoubleClick = () => {
    if (!showSummary) {
      setShowSummary(true);
      let animation = dateAnimation(
        dateRef.current,
        { opacity: [1, 0.7, 1] },
        { repeat: Infinity, duration: 1, ease: "easeInOut" }
      );
      if (!summary) {
        socket.emit(
          "ai:summarization",
          {
            conversation: getConversation(date),
            format,
          },
          (response) => {
            animation.stop();
            dateAnimation(dateRef.current, { width: "90%", opacity: 1 });
            setSummary(response);
          }
        );
      } else {
        animation.stop();
        dateAnimation(dateRef.current, { width: "90%", opacity: 1 });
      }
    } else {
      dateAnimation(dateRef.current, { width: "auto" });
      setShowSummary(false);
    }
  };
  return (
    <motion.div
      ref={dateRef}
      className="date-container"
      onDoubleClick={handleOnDoubleClick}
    >
      <div className="date">
        {`${date.getDate()} ${date.toLocaleString("default", {
          month: "short",
        })}, ${date.getFullYear()}`}
      </div>
      {showSummary && summary && (
        <>
          {format === "paragraph" ? (
            <ParagraphFormat summary={summary} />
          ) : format === "bullet" ? (
            <BulletFormat summary={summary} />
          ) : (
            <StructuredFormat summary={summary} />
          )}
        </>
      )}
    </motion.div>
  );
}

function ParagraphFormat(props) {
  const { summary } = props;
  return <div className="paragraph summary">{summary?.summary}</div>;
}
function BulletFormat(props) {
  const { summary } = props;
  console.log(summary);
  return (
    <ul
      className="bullet summary"
      style={{ listStylePosition: "inside", textAlign: "justify" }}
    >
      {summary?.summary?.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
function StructuredFormat(props) {
  const { summary } = props;
  console.log(summary);
  return (
    <div className="structured summary">
      <div>
        <h3 style={{ textAlign: "center" }}>{summary.summary.topic}</h3>
      </div>
      <div>
        <strong>Key Points :</strong>
        <ul
          className="bullet"
          style={{ listStylePosition: "inside", textAlign: "justify" }}
        >
          {summary?.summary?.keyPoints?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Conclusion :</strong> {summary.summary.conclusion}
      </div>
    </div>
  );
}
