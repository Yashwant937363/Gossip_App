import { socket } from "./main";

export function sendOutgoingVideoCall({ touid, offer, fromuid }: { touid: string; offer?: any; fromuid?: string }) {
  socket.emit("call:videocalloutgoing", { touid, offer, fromuid });
}

export function socketCancelVideoCall({ touid }: { touid?: string }) {
  if (touid) {
    socket.emit("call:videocallcanceled", { touid });
  }
}

export function videoCallRingingReceiverSide({ fromuid }: { fromuid: string }) {
  socket.emit("call:videocallringing", { fromuid });
}

export function sendVideoCallAnswer({ touid, answer }: { touid: string; answer: any }) {
  socket.emit("call:videocallanswer", { touid, answer });
}
