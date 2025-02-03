import React from "react";
import { TelephoneFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelVideoCall,
  setCallType,
  setChannel,
} from "../../../store/slices/CallSlice";
import { socketCancelVideoCall } from "../../../socket/call";

export default function IncomingCall(props) {
  const dispatch = useDispatch();
  const { type } = props;
  const caller = useSelector((state) => state.call.caller);
  console.log(caller);
  const pickUpVideoCall = () => {
    dispatch(setChannel(caller.uid));
    dispatch(setCallType("video"));
  };
  const pickUpAudioCall = () => {};
  const handlePickUpCall = () => {
    if (type === "video") {
      pickUpVideoCall();
    } else if (type === "audio") {
      pickUpAudioCall();
    }
  };
  const handlecancelVideoCall = () => {
    socketCancelVideoCall({ touid: caller?.uid });
    dispatch(cancelVideoCall());
  };
  return (
    <div className="call">
      <div className="profileimgbox">
        {caller?.profile !== "" ? (
          <img
            src={caller?.profile}
            height={100}
            width={100}
            className="profileimg"
          />
        ) : (
          <div className="personfillicon">
            <PersonFill></PersonFill>
          </div>
        )}
        <span>{caller?.username}</span>
      </div>
      <div className="control-buttons">
        <button className="btn call-cancel" onClick={handlecancelVideoCall}>
          <TelephoneFill />
        </button>
        <button className="btn call-pickup" onClick={handlePickUpCall}>
          <TelephoneFill />
        </button>
      </div>
    </div>
  );
}
