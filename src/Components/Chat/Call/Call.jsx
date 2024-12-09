import React from "react";
import { useSelector } from "react-redux";
import VideoCall from "./VideoCall";
import "./Call.jsx";
import IncomingCall from "./IncomingCall";

export default function Call() {
  const type = useSelector((state) => state.call.type);
  if (type == "video") {
    return <VideoCall></VideoCall>;
  }
  if (type === "incomingvideo") {
    return <IncomingCall type="video" />;
  }
  return <div>Something Went Wrong</div>;
}
