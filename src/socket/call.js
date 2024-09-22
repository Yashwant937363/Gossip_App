import { socket } from "./main";

export function sendOutgoingVideoCall({ fromuid, touid, offer }) {
  socket.emit("call:videocalloutgoing", { fromuid, touid, offer });
}

export function sendVideoCallAnswer({ touid, answer }) {
  socket.emit("call:videocallanswer", { touid, answer });
}

export function sendVideoCallPeerNegoNeeded({ offer, touid }) {
  socket.emit("call:peer-nego-needed", { offer, to: touid });
}

export function videoCallCalnceled({ touid }) {
  socket.emit("call:videocallcanceled", { touid });
}

export function sendOutgoingAudioCall({ fromuid, touid, offer }) {
  socket.emit("call:audiocalloutgoing", { fromuid, touid, offer });
}

export function sendAudioCallAnswer({ touid, answer }) {
  socket.emit("call:audiocallanswer", { touid, answer });
}

export function sendAudioCallPeerNegoNeeded({ offer, touid }) {
  socket.emit("call:peer-nego-needed", { offer, to: touid });
}

export function audioCallCalnceled({ touid }) {
  socket.emit("call:audiocallcanceled", { touid });
}
