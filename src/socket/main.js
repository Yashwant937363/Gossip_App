import { io } from "socket.io-client";
import { setOnline } from "../store/slices/UserSlice";
import { addChat } from "../store/slices/ChatSlice";
const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

export const socket = io(SERVER_URL, {
  autoConnect: false,
});

export function connecttoserver({ dispatch, username, profile, uid }) {
  socket.emit(
    "user:connection",
    { username, profile, uid },
    (acknowledgment) => {
      if (acknowledgment && acknowledgment.success) {
        dispatch(setOnline(true));
      } else {
        dispatch(setOnline(false));
        console.error("Error in user connection:", acknowledgment.error);
      }
    }
  );
}

export function findusers(uid) {
  return new Promise((resolve, reject) => {
    socket.emit("user:finduser", uid, (users) => {
      if (users) {
        resolve(users);
      } else {
        reject(new Error("No users found"));
      }
    });
  });
}

export function sendChatRequest(fromuid, touid) {
  return new Promise((resolve, reject) => {
    socket.emit("user:sendchatrequest", fromuid, touid, (userResponse) => {
      if (userResponse) {
        resolve(userResponse);
      } else {
        reject(new Error("Your Request has been Rejected"));
      }
    });
  });
}

export function requestAnswer({ fromuid, touid, answer, tousername }) {
  return new Promise((resolve, reject) => {
    socket.emit(
      "user:requestanswer",
      { fromuid, touid, answer, tousername },
      (userResponse) => {
        if (userResponse) {
          resolve(userResponse);
        } else {
          reject(new Error("Your Request has been Rejected"));
        }
      }
    );
  });
}

export function sendMessage({ fromuid, touid, message, dispatch, type }) {
  return new Promise((resolve, reject) => {
    socket.emit(
      "chat:sendmessage",
      { fromuid, touid, message, type },
      (userResponse) => {
        if (userResponse) {
          dispatch(addChat(userResponse));
          resolve(userResponse);
        } else {
          // dispatch(setErrorMsgUser("empty message connot be send"));
          reject(new Error("Message has been not Send"));
        }
      }
    );
  });
}

export function seenMessages({ fromuid, touid }) {
  socket.emit("chat:seenmessages", { fromuid, touid });
}

export function disconnectSocket() {
  socket.disconnect();
}
