import { func } from "prop-types";
import { socket } from "./main";

export function sendOutgoingVideoCall({ fromuid, touid }) {
  socket.emit("call:videocalloutgoing", { fromuid, touid });
}

export function socketCancelVideoCall({ touid }) {
  socket.emit("call:videocallcanceled", { touid });
}

export function videoCallRingingReceiverSide({ fromuid }) {
  socket.emit("call:videocallringing", { fromuid });
}
