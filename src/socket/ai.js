import { socket } from "./main";

export function sendChatBotPrompt({ message, uid, tone }) {
  return new Promise((resolve, reject) => {
    socket.emit("ai:chatbot:fromclient", { message, uid, tone }, (response) => {
      console.log(response);
      resolve(response);
    });
  });
}

export function getImageDescription({ url }) {
  return new Promise((resolve, reject) => {
    socket.emit("ai:image-analyze", { url }, (response) => {
      console.log(response);
      resolve(response);
    });
  });
}
