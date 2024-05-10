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
  setCallAccepted,
  setIncomingCall,
} from "../../../../store/slices/CallSlice";

export default function VideoCall() {
  const dispatch = useDispatch();
  const [myStream, setMyStream] = useState(false);
  const [friendStream, setFriendStream] = useState(false);
  const [touid, setToUid] = useState("");
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const [incomingUser, setIncomingUser] = useState(null);
  const isIncoming = useSelector((state) => state.call.isIncoming);
  const fromuid = useSelector((state) => state.call.fromuid);
  const friends = useSelector((state) => state.chat.friends);
  const offer = useSelector((state) => state.call.offer);
  const isCallAccepted = useSelector((state) => state.call.isCallAccepted);
  const myuid = useSelector((state) => state.user.uid);
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
  const sendTracks = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        PeerService.addTrack({ track, myStream });
      }
    }
  }, [myStream]);
  useEffect(() => {
    socket.on("call:videocallanswer", ({ answer }) => {
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
    });
    socket.on("call:peer-nego-final", async ({ ans }) => {
      await PeerService.setLocalDescription(ans);
      socket.emit("call:sendtracks", { to: touid });
      if (myStream) {
        sendTracks();
      } else {
        console.log("My Stream is not available");
      }
    });
    socket.on("call:requesttracks", () => {
      sendTracks();
    });
    socket.on("call:videocallcanceled", () => {
      dispatch(clearCalls());
    });
    return () => {
      socket.off("call:videocallanswer");
      socket.off("call:peer-nego-needed");
      socket.off("call:requesttracks");
    };
  }, []);
  const handleNegoNeeded = useCallback(async () => {
    const offer = await PeerService.getOffer();
    sendVideoCallPeerNegoNeeded({ offer, touid });
  }, []);
  const receivedTracks = (event) => {
    const remoteStream = event.streams;
    if (remoteStream.length > 0) {
      setFriendStream(remoteStream[0]);
    }
  };
  useEffect(() => {
    PeerService.peer.addEventListener("track", receivedTracks);
    PeerService.peer.addEventListener("negotiationneeded", handleNegoNeeded);
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
      console.log("Offer Send");
      dispatch(setIncomingCall(false));
    } else {
      dispatch(setErrorMsgUser("Offer Not Found"));
    }
  };
  const stopMedia = () => {
    myStream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };
  const callRejected = () => {
    sendVideoCallAnswer({ to: fromuid, answer: false });
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
          muted
          url={friendStream}
          height={"calc(100vh - 105px)"}
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
          <>
            <TelephoneFill className="endcall" onClick={callCanceled} />
            <button onClick={sendTracks}>send tracks</button>
          </>
        )}
      </div>
    </div>
  );
}
