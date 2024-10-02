import { socket } from "./main";

export function sendChatBotPrompt({ message, uid, tone }) {
  return new Promise((resolve, reject) => {
    socket.emit("ai:chatbot:fromclient", { message, uid, tone }, (response) => {
      console.log(response);
      resolve(response);
    });
  });
}
