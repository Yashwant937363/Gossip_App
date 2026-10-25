import React from "react";
import { PersonFill, TelephoneFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelVideoCall,
  setCallType,
  setChannel,
} from "../../../store/slices/CallSlice";
import { socketCancelVideoCall } from "../../../socket/call";
import { RootState, AppDispatch } from "../../../store/store";

interface IncomingCallProps {
  type: "video" | "audio";
}

export default function IncomingCall({ type }: IncomingCallProps) {
  const dispatch = useDispatch<AppDispatch>();
  const caller = useSelector((state: RootState) => state.call.caller);

  const pickUpVideoCall = () => {
    if (caller?.uid) {
      dispatch(setChannel(caller.uid));
      dispatch(setCallType("video"));
    }
  };

  const pickUpAudioCall = () => {};

  const handlePickUpCall = () => {
    if (type === "video") {
      pickUpVideoCall();
    } else if (type === "audio") {
      pickUpAudioCall();
    }
  };

  const handleCancelVideoCall = () => {
    socketCancelVideoCall({ touid: caller?.uid });
    dispatch(cancelVideoCall());
  };

  return (
    <div className="fixed inset-0 top-[45px] z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between items-center py-16 px-6 text-textColor">
      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-themeColor shadow-2xl flex items-center justify-center bg-bg20">
          {caller?.profile ? (
            <img src={caller.profile} alt={caller.username} className="w-full h-full object-cover" />
          ) : (
            <PersonFill className="text-6xl text-textColor opacity-70" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-themeColor">{caller?.username || "Incoming Call"}</h3>
        <span className="text-sm opacity-75 animate-pulse">Incoming {type} call...</span>
      </div>

      <div className="flex items-center gap-16 mb-12">
        {/* Decline Button */}
        <button
          type="button"
          onClick={handleCancelVideoCall}
          className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer rotate-[135deg]"
          title="Decline"
        >
          <TelephoneFill className="text-2xl" />
        </button>

        {/* Answer Button */}
        <button
          type="button"
          onClick={handlePickUpCall}
          className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer animate-bounce"
          title="Answer"
        >
          <TelephoneFill className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
