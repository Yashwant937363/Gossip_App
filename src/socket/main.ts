import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { addChat } from "../store/slices/ChatSlice";
import { Dispatch } from "@reduxjs/toolkit";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:5000";

const initialToken = Cookies.get("authtoken") || "";

export const socket: Socket = io(SERVER_URL, {
  auth: {
    token: initialToken ? `Bearer ${initialToken}` : "",
  },
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
});

export function connectSocket(token?: string) {
  const authToken = token || Cookies.get("authtoken");
  if (authToken) {
    socket.auth = {
      token: authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`,
    };
    if (!socket.connected) {
      socket.connect();
    }
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

// Deprecated compatibility wrapper - now connects with handshake auth
export function connecttoserver({
  dispatch,
}: {
  dispatch?: Dispatch;
  username?: string;
  profile?: string;
  uid?: string;
  settings?: any;
} = {}) {
  const token = Cookies.get("authtoken");
  if (token) {
    connectSocket(token);
  }
}

export function findusers(query: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    socket.emit("user:finduser", query, (users: any) => {
      if (users) {
        resolve(users);
      } else {
        reject(new Error("No users found"));
      }
    });
  });
}

export function sendChatRequest(fromuid: string, touid: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit("user:sendchatrequest", fromuid, touid, (userResponse: any) => {
      if (userResponse) {
        resolve(userResponse);
      } else {
        reject(new Error("Your Request has been Rejected"));
      }
    });
  });
}

export function requestAnswer({
  fromuid,
  touid,
  answer,
  tousername,
}: {
  fromuid: string;
  touid: string;
  answer: boolean;
  tousername: string;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(
      "user:requestanswer",
      { fromuid, touid, answer, tousername },
      (userResponse: any) => {
        if (userResponse) {
          resolve(userResponse);
        } else {
          reject(new Error("Your Request has been Rejected"));
        }
      }
    );
  });
}

export function sendMessage({
  touid,
  message,
  dispatch,
  type = "text",
}: {
  fromuid?: string;
  touid: string;
  message: string | any;
  dispatch: Dispatch;
  type?: "text" | "image";
}): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(
      "chat:sendmessage",
      { touid, message, type },
      (ack: any) => {
        if (ack) {
          dispatch(addChat(ack));
          resolve(ack);
        } else {
          reject(new Error("Message has not been sent"));
        }
      }
    );
  });
}

export function seenMessages({ fromuid, touid }: { fromuid: string; touid: string }) {
  socket.emit("chat:seenmessages", { fromuid, touid });
}
