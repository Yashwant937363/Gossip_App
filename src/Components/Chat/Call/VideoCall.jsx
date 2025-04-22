import AgoraRTC, {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Call.css";
import {
  CameraVideoFill,
  CameraVideoOffFill,
  ChevronCompactRight,
  Grid3x3Gap,
  Image as ImageIcon,
  MicFill,
  MicMuteFill,
  PaletteFill,
  PersonFill,
  TelephoneFill,
} from "react-bootstrap-icons";
import { cancelVideoCall } from "../../../store/slices/CallSlice";
import { socket } from "../../../socket/main";
import { socketCancelVideoCall } from "../../../socket/call";
import { motion, useAnimate } from "motion/react";
import VirtualBackgroundExtension from "agora-extension-virtual-background";
const virtualBackgrounds = [
  "/virtual_backgrounds/background1.jpg",
  "/virtual_backgrounds/background2.jpg",
  "/virtual_backgrounds/background3.jpg",
  "/virtual_backgrounds/background4.jpg",
];

export default function VideoCall() {
  const dispatch = useDispatch();
  const [extensionActive, setExtensionActive] = useState(false);
  const extension = useRef(new VirtualBackgroundExtension());
  const processor = useRef();
  const colorPickerInput = useRef();
  const filePickerInput = useRef();
  const [vbackgroundDrawerRef, vbackgroundDrawerAnimation] = useAnimate();
  const [isvDrawerOpen, setvDrawerOpen] = useState(false);
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
  const [isVirtualOn, setIsVirtualOn] = useState(false);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  const remoteUsers = useRemoteUsers();
  const handleCameraFocus = (user, e) => {
    e.stopPropagation();
    if (remoteUsers.length < 1) return;
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
    const initExtension = async () => {
      AgoraRTC.registerExtensions([extension.current]);
      processor.current = extension.current.createProcessor();
      await processor.current.init();
    };
    initExtension();
  }, []);

  const enableBackground = async () => {
    if (processor.current && localCameraTrack) {
      localCameraTrack
        .pipe(processor.current)
        .pipe(localCameraTrack.processorDestination);
      await processor.current.enable();
      setIsVirtualOn(true);
      setExtensionActive(true);
    }
  };

  const disableBackground = async () => {
    if (processor.current && localCameraTrack) {
      localCameraTrack.unpipe();
      await processor.current.disable();
      setIsVirtualOn(false);
      setExtensionActive(false);
    }
  };

  useEffect(() => {
    enableBackground();
    return () => disableBackground();
  }, [localCameraTrack]);

  const offBackground = async () => {
    await processor.current?.disable();
    setIsVirtualOn(false);
  };
  const onBackground = async () => {
    await processor.current?.disable();
    setIsVirtualOn(true);
  };

  const blurBackground = () => {
    processor.current?.setOptions({ type: "blur", blurDegree: 2 });
  };

  const colorBackground = (e) => {
    processor.current?.setOptions({ type: "color", color: e.target?.value });
  };

  const openColorPicker = () => {
    colorPickerInput.current.click();
  };

  const handleImageBackgroundChange = (e) => {
    if (e.target.files[0]) {
      imageBackground(URL.createObjectURL(e.target.files[0]));
    }
  };

  const imageBackground = (imageUrl) => {
    console.log(imageUrl);
    const image = new Image(); // Create an Image instance
    image.crossOrigin = "anonymous";
    console.log("Image element: ", image);
    image.onload = () => {
      processor.current?.setOptions({ type: "img", source: image }); // Set the loaded image as the background
    };
    image.onerror = (error) => {
      console.error("Failed to load the image:", error); // Handle loading errors
    };
    image.src = imageUrl; // Set the URL of the image
  };

  const handlevBackgroudDrawer = () => {
    console.log(isvDrawerOpen);
    if (isvDrawerOpen) {
      closevDrawer();
    } else {
      openvDrawer();
    }
  };
  const openvDrawer = () => {
    console.log("Open Drawer");
    setvDrawerOpen(true);
    vbackgroundDrawerAnimation(vbackgroundDrawerRef.current, { translateX: 0 });
  };
  const closevDrawer = () => {
    setvDrawerOpen(false);
    vbackgroundDrawerAnimation(vbackgroundDrawerRef.current, {
      translateX: -(window.innerWidth - 15),
    });
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
            <motion.div
              layout
              className={cameraFocus ? "local-user" : "user"}
              key={user.uid}
              onClick={(e) => handleCameraFocus("remote", e)}
            >
              <RemoteUser cover={caller.profile} user={user}>
                <samp className="user-name">{caller.username}</samp>
              </RemoteUser>
            </motion.div>
          ))
        )}
        <motion.div
          className={cameraFocus ? "user" : "local-user"}
          onClick={(e) => handleCameraFocus("local", e)}
          layout
        >
          <LocalUser
            cameraOn={cameraOn}
            micOn={micOn}
            videoTrack={localCameraTrack}
            cover={profile ? profile : ""}
          >
            <samp className="user-name">You</samp>
          </LocalUser>
        </motion.div>
      </div>

      <div className="control-buttons">
        <motion.div
          initial={{ translateX: 0 }}
          animate={{ translateX: -(innerWidth - 15) }}
          ref={vbackgroundDrawerRef}
          className="virtual-background-container"
        >
          <div className="virtual-backgrounds">
            <motion.div
              whileHover={{ opacity: 0.5 }}
              className="virtual-background custom"
              onClick={isVirtualOn ? offBackground : onBackground}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-ban"
                viewBox="0 0 16 16"
                className="icon"
              >
                <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
              </svg>
              {isVirtualOn ? "Off" : "On"}
            </motion.div>
            <motion.div
              whileHover={{ opacity: 0.5 }}
              className="virtual-background custom"
              onClick={blurBackground}
            >
              <Grid3x3Gap className="icon" />
              blur
            </motion.div>
            <motion.div
              whileHover={{ opacity: 0.5 }}
              className="virtual-background custom"
              onClick={openColorPicker}
            >
              <input
                type="color"
                ref={colorPickerInput}
                onChange={colorBackground}
                style={{ display: "none" }}
              />
              <PaletteFill className="icon" />
              color
            </motion.div>
            <motion.div
              whileHover={{ opacity: 0.5 }}
              className="virtual-background custom"
              onClick={() => filePickerInput.current.click()}
            >
              <input
                type="file"
                accept="image/*"
                ref={filePickerInput}
                onChange={handleImageBackgroundChange}
                style={{ display: "none" }}
              />
              <ImageIcon className="icon" />
              picture
            </motion.div>
            {virtualBackgrounds.map((item, index) => (
              <motion.img
                key={index}
                whileHover={{ opacity: 0.5 }}
                className="virtual-background"
                onClick={() => imageBackground(item)}
                src={item}
              ></motion.img>
            ))}
          </div>
          <button className="btn btn-drawer" onClick={handlevBackgroudDrawer}>
            <ChevronCompactRight />
          </button>
        </motion.div>
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
