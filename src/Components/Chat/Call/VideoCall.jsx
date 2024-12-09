import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Call.css";
import {
  CameraVideoFill,
  CameraVideoOffFill,
  MicFill,
  MicMuteFill,
  PersonFill,
  TelephoneFill,
} from "react-bootstrap-icons";
import { cancelVideoCall } from "../../../store/slices/CallSlice";
import { socket } from "../../../socket/main";
import { socketCancelVideoCall } from "../../../socket/call";

export default function VideoCall() {
  const dispatch = useDispatch();
  const [cameraFocus, setCameraFocus] = useState(false);
  const caller = useSelector((state) => state.call.caller);
  const callInitialize = useSelector((state) => state.call.callInitialize);
  const profile = useSelector((state) => state.user.profile);
  const appID = import.meta.env.VITE_AGORA_APP_ID;
  useJoin({ appid: appID, channel: "timepass", token: null, callInitialize });
  const [status, setStatus] = useState("calling");
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  const remoteUsers = useRemoteUsers();
  const handleCameraFocus = (user, e) => {
    e.stopPropagation();
    console.log(user);
    if (remoteUsers.length <= 1) {
      if (user === "local") {
        setCameraFocus(true);
      } else {
        setCameraFocus(false);
      }
    }
  };
  const handlecancelVideoCall = () => {
    socketCancelVideoCall({ touid: caller?.uid });
    dispatch(cancelVideoCall());
  };
  useEffect(() => {
    socket.on("call:videocallringing", () => {
      console.log(status);
      setStatus("ringing");
    });
    return () => {
      socket.off("call:videocallringing");
    };
  });
  return (
    <div className="video-call call">
      <div className="remote-users">
        {remoteUsers.length <= 0 ? (
          <div
            className={"profileimgbox " + (cameraFocus ? "local-user" : "")}
            onClick={(e) => handleCameraFocus("remote", e)}
          >
            <div className="profileimg">
              {caller?.profile !== "" ? (
                <img src={caller?.profile} />
              ) : (
                <div className="personfillicon">
                  <PersonFill></PersonFill>
                </div>
              )}
            </div>
            <span>{status}</span>
          </div>
        ) : (
          remoteUsers.map((user) => (
            <div
              className={cameraFocus ? "local-user" : "user"}
              key={user.uid}
              onClick={(e) => handleCameraFocus("remote", e)}
            >
              <RemoteUser cover={caller.profile} user={user}>
                <samp className="user-name">{caller.username}</samp>
              </RemoteUser>
            </div>
          ))
        )}
        <div
          className={cameraFocus ? "user" : "local-user"}
          onClick={(e) => handleCameraFocus("local", e)}
        >
          <LocalUser
            cameraOn={cameraOn}
            micOn={micOn}
            videoTrack={localCameraTrack}
            cover={profile ? profile : ""}
          >
            <samp className="user-name">You</samp>
          </LocalUser>
        </div>
      </div>
      <div className="control-buttons">
        <button className="btn" onClick={() => setMic((a) => !a)}>
          {micOn ? <MicFill /> : <MicMuteFill />}
        </button>
        <button className="btn call-cancel" onClick={handlecancelVideoCall}>
          <TelephoneFill />
        </button>
        <button className="btn" onClick={() => setCamera((a) => !a)}>
          {cameraOn ? <CameraVideoFill /> : <CameraVideoOffFill />}
        </button>
      </div>
    </div>
  );
}
