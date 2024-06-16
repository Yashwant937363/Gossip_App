import React, { useCallback, useEffect, useState } from "react";
import { TelephoneFill } from "react-bootstrap-icons";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import PeerService from "../../../../service/PeerService";
import {
  sendVideoCallAnswer,
  sendVideoCallPeerNegoNeeded,
  socket,
  videoCallCalnceled,
} from "../../../../store/socket";
import { setErrorMsgUser } from "../../../../store/slices/UserSlice";
import {
  clearCalls,
  setCallStarted,
  setIncomingCall,
} from "../../../../store/slices/CallSlice";

export default function VideoCall() {
  const dispatch = useDispatch();
  const [myStream, setMyStream] = useState(false);
  const [friendStream, setFriendVideoStream] = useState(false);
  const [touid, setToUid] = useState("");
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const [incomingUser, setIncomingUser] = useState(null);
  const isIncoming = useSelector((state) => state.call.isIncoming);
  const fromuid = useSelector((state) => state.call.fromuid);
  const friends = useSelector((state) => state.chat.friends);
  const offer = useSelector((state) => state.call.offer);
  const initialLoad = useCallback(async () => {
    const str = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(str);
    if (fromuid) {
      const index = friends.map((value) => value.uid === fromuid).indexOf(true);
      setIncomingUser(friends[index]);
      setToUid(fromuid);
    } else {
      setToUid(openedchat.uid);
    }
  }, []);

  useEffect(() => {
    initialLoad();
  }, []);

  useEffect(() => {
    socket.on("call:videocallanswer", ({ answer }) => {
      setCallStarted(answer);
      if (answer) {
        PeerService.setLocalDescription(answer);
      } else {
        dispatch(setErrorMsgUser("Call Denied"));
        dispatch(clearCalls());
      }
    });
    socket.on("call:peer-nego-needed", async ({ offer }) => {
      const ans = await PeerService.getAnswer(offer);
      socket.emit("call:peer-nego-done", { to: touid, ans });
      sendAllTracks();
    });
    socket.on("call:peer-nego-final", async ({ ans, from }) => {
      await PeerService.setLocalDescription(ans);
      setCallStarted(true);
      socket.emit("call:requesttracks");
    });
    socket.on("call:videocallcanceled", () => {
      dispatch(setErrorMsgUser("Call Canceled"));
      dispatch(clearCalls());
    });
    socket.on("call:requesttracks", () => {
      try {
        for (const track of myStream.getTracks()) {
          PeerService.addTrack({ track, myStream });
        }
      } catch (error) {
        sendAllTracks();
      }
    });
    return () => {
      socket.off("call:videocallanswer");
      socket.off("call:peer-nego-needed");
      socket.off("call:requesttracks");
    };
  }, []);
  const handleNegoNeeded = useCallback(async () => {
    setCallStarted(false);
    const offer = await PeerService.getOffer();
    sendVideoCallPeerNegoNeeded({ offer, touid });
  }, []);
  const receivedTracks = (event) => {
    const remoteStream = event.streams;
    if (remoteStream.length > 0) {
      setFriendVideoStream(remoteStream[0]);
    }
  };
  useEffect(() => {
    PeerService.peer?.addEventListener("track", receivedTracks);
    PeerService.peer?.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      PeerService.peer?.removeEventListener("track", receivedTracks);
      PeerService.peer?.removeEventListener(
        "negotiationneeded",
        handleNegoNeeded
      );
    };
  }, []);
  const callAccepted = async () => {
    if (offer) {
      const ans = await PeerService.getAnswer(offer);
      sendVideoCallAnswer({ touid: fromuid, answer: ans });
      dispatch(setIncomingCall(false));
      sendAllTracks();
      socket.emit("call:sendtracks", { to: touid });
    } else {
      dispatch(setErrorMsgUser("Offer Not Found"));
    }
  };
  const stopMedia = async () => {
    myStream.getTracks().forEach((track) => {
      track.stop();
    });
  };
  const sendAllTracks = () => {
    console.log(myStream);
    for (const track of myStream.getTracks()) {
      PeerService.addTrack({ track, myStream });
    }
  };
  const callRejected = () => {
    sendVideoCallAnswer({ touid: fromuid, answer: false });
    PeerService.disconnect();
    stopMedia();
    dispatch(clearCalls());
  };
  const callCanceled = () => {
    PeerService.disconnect();
    stopMedia();
    videoCallCalnceled({ touid });
    dispatch(clearCalls());
  };

  return (
    <div className="videocall">
      {friendStream ? (
        <ReactPlayer
          playing
          url={friendStream}
          height={"calc(100dvh - 115px)"}
          width={"100vw"}
          className="friendvideo"
        />
      ) : (
        <div className="loadingvideo">
          {openedchat ? (
            <>
              <span>{openedchat.username}</span>
              <img src={openedchat.profile} alt="userprofilephoto" />
              Connecting...
            </>
          ) : incomingUser ? (
            <>
              <span>{incomingUser.username}</span>
              <img src={incomingUser.profile} alt="userprofiephoto" />
              <span>Video Call</span>
            </>
          ) : null}
        </div>
      )}
      {myStream && (
        <ReactPlayer
          playing
          muted
          url={myStream}
          className="myvideo"
          height={"30dvh"}
          width={"30dvw"}
        />
      )}
      <div className="controls">
        {isIncoming ? (
          <>
            <TelephoneFill className="endcall" onClick={callRejected} />
            <TelephoneFill className="pickcall" onClick={callAccepted} />
          </>
        ) : (
          <TelephoneFill className="endcall" onClick={callCanceled} />
        )}
      </div>
    </div>
  );
}
