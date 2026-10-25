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
import { RootState, AppDispatch } from "../../../store/store";

const virtualBackgrounds = [
  "/virtual_backgrounds/background1.jpg",
  "/virtual_backgrounds/background2.jpg",
  "/virtual_backgrounds/background3.jpg",
  "/virtual_backgrounds/background4.jpg",
];

export default function VideoCall() {
  const dispatch = useDispatch<AppDispatch>();
  const extension = useRef(new VirtualBackgroundExtension());
  const processor = useRef<any>(null);
  const colorPickerInput = useRef<HTMLInputElement>(null);
  const filePickerInput = useRef<HTMLInputElement>(null);
  const [vbackgroundDrawerRef, vbackgroundDrawerAnimation] = useAnimate();
  const [isvDrawerOpen, setvDrawerOpen] = useState(false);
  const [cameraFocus, setCameraFocus] = useState(false);
  const caller = useSelector((state: RootState) => state.call.caller);
  const callInitialize = useSelector((state: RootState) => state.call.callInitialize);
  const profile = useSelector((state: RootState) => state.user.profile);
  const appID = import.meta.env.VITE_AGORA_APP_ID || "7687706453784212a454267521654b1a";

  useJoin({ appid: appID, channel: "timepass", token: null }, callInitialize);
  const [status, setStatus] = useState("calling");
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const [isVirtualOn, setIsVirtualOn] = useState(false);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  const remoteUsers = useRemoteUsers();

  const handleCameraFocus = (user: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (remoteUsers.length <= 1) {
      setCameraFocus(user === "local");
    }
  };

  const handleCancelVideoCall = () => {
    socketCancelVideoCall({ touid: caller?.uid });
    dispatch(cancelVideoCall());
  };

  useEffect(() => {
    const initExtension = async () => {
      try {
        AgoraRTC.registerExtensions([extension.current]);
        processor.current = extension.current.createProcessor();
        await processor.current.init();
      } catch (err) {
        console.error("Failed to init virtual background:", err);
      }
    };
    initExtension();
  }, []);

  const enableBackground = async () => {
    if (processor.current && localCameraTrack) {
      try {
        localCameraTrack
          .pipe(processor.current)
          .pipe(localCameraTrack.processorDestination);
        await processor.current.enable();
        setIsVirtualOn(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const disableBackground = async () => {
    if (processor.current && localCameraTrack) {
      try {
        localCameraTrack.unpipe();
        await processor.current.disable();
        setIsVirtualOn(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (localCameraTrack) {
      enableBackground();
    }
    return () => {
      disableBackground();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localCameraTrack]);

  const blurBackground = () => {
    processor.current?.setOptions({ type: "blur", blurDegree: 2 });
  };

  const colorBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    processor.current?.setOptions({ type: "color", color: e.target?.value });
  };

  const imageBackground = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      processor.current?.setOptions({ type: "img", source: img });
    };
    img.src = imageUrl;
  };

  const handleDrawer = () => {
    const willOpen = !isvDrawerOpen;
    setvDrawerOpen(willOpen);
    if (vbackgroundDrawerRef.current) {
      vbackgroundDrawerAnimation(vbackgroundDrawerRef.current, {
        x: willOpen ? 0 : -(window.innerWidth - 60),
      });
    }
  };

  useEffect(() => {
    socket.on("call:videocallringing", () => {
      setStatus("ringing");
    });
    return () => {
      socket.off("call:videocallringing");
    };
  }, []);

  return (
    <div className="fixed inset-0 top-[45px] z-40 bg-black flex flex-col justify-between overflow-hidden">
      {/* Video Streams */}
      <div className="flex-1 relative w-full h-full">
        {remoteUsers.length <= 0 ? (
          <div
            className={`w-full h-full flex flex-col items-center justify-center gap-4 ${
              cameraFocus ? "hidden" : "flex"
            }`}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-themeColor bg-bg20 flex items-center justify-center">
              {caller?.profile ? (
                <img src={caller.profile} alt={caller.username} className="w-full h-full object-cover" />
              ) : (
                <PersonFill className="text-6xl text-textColor opacity-70" />
              )}
            </div>
            <span className="text-base font-semibold text-white capitalize animate-pulse">{status}...</span>
          </div>
        ) : (
          remoteUsers.map((user) => (
            <motion.div
              layout
              key={user.uid}
              className={`w-full h-full ${cameraFocus ? "hidden" : "block"}`}
              onClick={(e) => handleCameraFocus("remote", e)}
            >
              <RemoteUser cover={caller?.profile} user={user}>
                <span className="absolute bottom-4 left-4 p-2 bg-black/60 rounded-xl text-white text-xs">
                  {caller?.username || user.uid}
                </span>
              </RemoteUser>
            </motion.div>
          ))
        )}

        {/* Local user PIP */}
        <motion.div
          layout
          onClick={(e) => handleCameraFocus("local", e)}
          className={`absolute bottom-20 right-4 rounded-2xl overflow-hidden border-2 border-themeColor shadow-2xl z-30 transition-all ${
            cameraFocus ? "w-full h-full bottom-0 right-0 rounded-none border-none" : "w-36 sm:w-48 h-28 sm:h-36"
          }`}
        >
          <LocalUser
            cameraOn={cameraOn}
            micOn={micOn}
            videoTrack={localCameraTrack}
            cover={profile || ""}
          >
            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-lg text-white text-[10px]">
              You
            </span>
          </LocalUser>
        </motion.div>
      </div>

      {/* Controls Bar */}
      <div className="relative flex items-center justify-center gap-6 py-4 px-6 bg-black/80 backdrop-blur-md border-t border-bg20 z-40">
        {/* Virtual background drawer */}
        <motion.div
          ref={vbackgroundDrawerRef}
          initial={{ x: -(window.innerWidth - 60) }}
          className="absolute left-0 bottom-full mb-2 p-3 bg-bg10/95 backdrop-blur-md rounded-r-2xl border border-l-0 border-bg20 shadow-2xl flex items-center gap-3 z-50 max-w-[90vw] overflow-x-auto"
        >
          <button
            type="button"
            onClick={isVirtualOn ? disableBackground : enableBackground}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-bg20 hover:bg-themeColor hover:text-themeMode transition-all whitespace-nowrap"
          >
            {isVirtualOn ? "Disable VB" : "Enable VB"}
          </button>
          <button
            type="button"
            onClick={blurBackground}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-bg20 hover:bg-themeColor hover:text-themeMode transition-all"
          >
            <Grid3x3Gap />
            <span>Blur</span>
          </button>
          <button
            type="button"
            onClick={() => colorPickerInput.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-bg20 hover:bg-themeColor hover:text-themeMode transition-all"
          >
            <PaletteFill />
            <span>Color</span>
          </button>
          <input
            type="color"
            ref={colorPickerInput}
            onChange={colorBackground}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => filePickerInput.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-bg20 hover:bg-themeColor hover:text-themeMode transition-all"
          >
            <ImageIcon />
            <span>Custom</span>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={filePickerInput}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                imageBackground(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="hidden"
          />

          {virtualBackgrounds.map((bg, idx) => (
            <img
              key={idx}
              src={bg}
              alt="Preset background"
              onClick={() => imageBackground(bg)}
              className="w-12 h-9 rounded-lg object-cover cursor-pointer hover:scale-105 border border-bg20"
            />
          ))}

          <button
            type="button"
            onClick={handleDrawer}
            className="p-1 text-textColor hover:text-themeColor ml-1"
          >
            <ChevronCompactRight className="text-xl" />
          </button>
        </motion.div>

        {/* Mic toggle */}
        <button
          type="button"
          onClick={() => setMic(!micOn)}
          className={`p-3.5 rounded-full shadow-lg transition-all cursor-pointer ${
            micOn ? "bg-bg20 text-white hover:bg-bg30" : "bg-rose-500 text-white"
          }`}
          title={micOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {micOn ? <MicFill className="text-xl" /> : <MicMuteFill className="text-xl" />}
        </button>

        {/* End call button */}
        <button
          type="button"
          onClick={handleCancelVideoCall}
          className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer rotate-[135deg]"
          title="End Call"
        >
          <TelephoneFill className="text-2xl" />
        </button>

        {/* Camera toggle */}
        <button
          type="button"
          onClick={() => setCamera(!cameraOn)}
          className={`p-3.5 rounded-full shadow-lg transition-all cursor-pointer ${
            cameraOn ? "bg-bg20 text-white hover:bg-bg30" : "bg-rose-500 text-white"
          }`}
          title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {cameraOn ? <CameraVideoFill className="text-xl" /> : <CameraVideoOffFill className="text-xl" />}
        </button>
      </div>
    </div>
  );
}
