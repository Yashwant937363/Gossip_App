import React from "react";
import { useSelector } from "react-redux";
import VideoCall from "./VideoCall";
import IncomingCall from "./IncomingCall";
import { RootState } from "../../../store/store";

export default function Call() {
  const type = useSelector((state: RootState) => state.call.type);

  if (type === "video") {
    return <VideoCall />;
  }
  if (type === "incomingvideo") {
    return <IncomingCall type="video" />;
  }
  return null;
}
