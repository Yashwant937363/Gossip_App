import React from "react";
import "./Call.css";
import { useSelector } from "react-redux";
import VideoCall from "./VideoCall";
import AudioCall from "./AudioCall";

export default function CallWindow() {
  const type = useSelector((state) => state.call.type);
  return (
    <div className="callwindow">
      {type === "video" ? <VideoCall /> : <AudioCall />}
    </div>
  );
}
