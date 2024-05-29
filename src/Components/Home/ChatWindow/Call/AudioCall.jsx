import React, { useCallback, useEffect, useState } from "react";
import { TelephoneFill } from "react-bootstrap-icons";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import PeerService from "../../../../service/PeerService";
import {
  sendAudioCallAnswer,
  sendAudioCallPeerNegoNeeded,
  socket,
  audioCallCalnceled,
} from "../../../../store/socket";
import { setErrorMsgUser } from "../../../../store/slices/UserSlice";
import {
  clearCalls,
  setCallAccepted,
  setCallStarted,
  setIncomingCall,
} from "../../../../store/slices/CallSlice";

export default function AudioCall() {
  const dispatch = useDispatch();
  const [myStream, setMyStream] = useState(false);
  const [friendStream, setFriendAudioStream] = useState(false);
  const [touid, setToUid] = useState("");
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const [incomingUser, setIncomingUser] = useState(null);
  const isIncoming = useSelector((state) => state.call.isIncoming);
  const fromuid = useSelector((state) => state.call.fromuid);
  const friends = useSelector((state) => state.chat.friends);
  const offer = useSelector((state) => state.call.offer);
  const isCallStarted = useSelector((state) => state.call.isCallStarted);
  const initialLoad = useCallback(async () => {
    const str = await navigator.mediaDevices.getUserMedia({
      audio: true,
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
    socket.on("call:audiocallanswer", ({ answer }) => {
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
    });
    socket.on("call:peer-nego-final", async ({ ans }) => {
      await PeerService.setLocalDescription(ans);
      setCallStarted(true);
    });
    socket.on("call:requesttracks", () => {
      sendTracks();
    });
    socket.on("call:audiocallcanceled", () => {
      dispatch(clearCalls());
    });
    return () => {
      socket.off("call:audiocallanswer");
      socket.off("call:peer-nego-needed");
      socket.off("call:requesttracks");
    };
  }, []);
  const handleNegoNeeded = useCallback(async () => {
    setCallStarted(false);
    const offer = await PeerService.getOffer();
    sendAudioCallPeerNegoNeeded({ offer, touid });
  }, []);
  const receivedTracks = (event) => {
    const remoteStream = event.streams;
    if (remoteStream.length > 0) {
      setFriendAudioStream(remoteStream[0]);
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
      console.log(ans);
      sendAudioCallAnswer({ touid: fromuid, answer: ans });
      console.log("Offer Send");
      dispatch(setIncomingCall(false));
    } else {
      dispatch(setErrorMsgUser("Offer Not Found"));
    }
  };
  const stopMedia = async () => {
    myStream.getTracks().forEach((track) => {
      track.stop();
    });
  };
  const callRejected = () => {
    sendAudioCallAnswer({ to: fromuid, answer: false });
    PeerService.disconnect();
    stopMedia();
    dispatch(clearCalls());
  };
  const callCanceled = () => {
    PeerService.disconnect();
    stopMedia();
    audioCallCalnceled({ touid });
    dispatch(clearCalls());
  };
  useEffect(() => {
    if (!friendStream && isCallStarted) {
      socket.emit("call:sendtracks", { to: touid });
    }
  }, [PeerService.peer.signalingState]);

  const getInfo = () => {
    console.log("Connection State : ", PeerService.peer.connectionState);
    console.log("Signaling State : ", PeerService.peer.signalingState);
    console.log("Ice Connection State", PeerService.peer.iceConnectionState);
    console.log("Ice Gathering State", PeerService.peer.iceGatheringState);
    console.log(
      "On Connection State Change",
      PeerService.peer.onconnectionstatechange
    );
    console.log("Friend Stream", !friendStream);
    console.log("Call Started : ", isCallStarted);
  };
  return (
    <div className="audiocall">
      {friendStream ? (
        <ReactPlayer
          playing
          url={friendStream}
          height={"calc(100dvh - 115px)"}
          width={"100vw"}
          className="friendaudio"
        />
      ) : (
        <div className="loadingaudio">
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
              <span>audio Call</span>
            </>
          ) : null}
        </div>
      )}
      {myStream && (
        <ReactPlayer
          playing
          muted
          url={myStream}
          className="myaudio"
          height={"30dvh"}
          width={"30dvw"}
        />
      )}
      <div className="controls">
        {isIncoming ? (
          <>
            <TelephoneFill className="endcall" onClick={callRejected} />
            <TelephoneFill className="pickcall" onClick={callAccepted} />
            <button onClick={getInfo}>getinfo</button>
          </>
        ) : (
          <>
            <TelephoneFill className="endcall" onClick={callCanceled} />
            <button onClick={sendTracks}>send tracks</button>
            <button onClick={getInfo}>getinfo</button>
          </>
        )}
      </div>
    </div>
  );
}
