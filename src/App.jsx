import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar";
import Home from "./Components/Home/Home";
import Chat from "./Components/Chat/Chat";
import NotFound from "./Components/NotFound/NotFound";
import { useDispatch, useSelector } from "react-redux";
import ErrorBar from "./Components/MsgBars/ErrorBar";
import SuccessBar from "./Components/MsgBars/SuccessBar";
import Account from "./Components/Account/Account";
import {
  addRequest,
  setErrorMsgUser,
  setSucessMsgUser,
} from "./store/slices/UserSlice";

import {
  addChat,
  addFriend,
  setFriendOffline,
  setFriendOnline,
  setMultipleTranslatedMessages,
  setReceivedMessages,
  setSeenMessages,
} from "./store/slices/ChatSlice";
import About from "./Components/About/About";
import ChatWindow from "./Components/Chat/ChatWindow/ChatWindow";
import Settings from "./Components/Settings/Settings";
import Profile from "./Components/Settings/Profile/Profile";
import Themes from "./Components/Settings/Themes/Themes";
import ImageEditor from "./Components/Chat/ImageEditor/ImageEditor";
import { setThemeColor, setThemeMode } from "./store/slices/ThemeSlice";
import Cookies from "js-cookie";
import Translation from "./Components/Settings/Translation/Translation";
import { connecttoserver, socket } from "./socket/main";
import ChatBot from "./Components/ChatBot/ChatBot";
import { cancelVideoCall, initializeVideoCall } from "./store/slices/CallSlice";
import { store } from "./store/store";
import { videoCallRingingReceiverSide } from "./socket/call";
import ImageViewer from "./Components/Chat/ChatWindow/ImageViewer/ImageViewer";
import { setWarningMsg } from "./store/slices/UISlice";
import WarningBar from "./Components/MsgBars/WarningBar";

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const username = useSelector((state) => state.user.username);
  const profile = useSelector((state) => state.user.profile);
  const uid = useSelector((state) => state.user.uid);
  const settings = useSelector((state) => state.user.settings);
  const successmsguser = useSelector((state) => state.user.successmsg);
  const errormsguser = useSelector((state) => state.user.errormsg);
  const friends = useSelector((state) => state.chat.friends);
  const warningmsg = useSelector((state) => state.UIState.warningmsg);
  useEffect(() => {
    socket.on("requestfromuser", ({ uid, profile, username }) =>
      dispatch(addRequest({ uid, profile, username }))
    );
    socket.on("successmessage", ({ msg, user }) => {
      dispatch(setSucessMsgUser(msg));
      dispatch(addFriend(user));
    });
    socket.on("errormessage", (message) => dispatch(setErrorMsgUser(message)));
    socket.on("friendonline", ({ uid }) => {
      dispatch(setFriendOnline(uid));
      dispatch(setReceivedMessages(uid));
    });
    socket.on("friendoffline", ({ uid }) => dispatch(setFriendOffline(uid)));
    socket.on("chat:receivemessage", (newChat) => dispatch(addChat(newChat)));
    socket.on("seenmessages", ({ uid }) => dispatch(setSeenMessages(uid)));
    socket.on("call:videocallincoming", ({ fromuid }) => {
      const currentFriends = store.getState().chat.friends;
      const user = currentFriends.find((user) => user.uid === fromuid);
      videoCallRingingReceiverSide({ fromuid });
      dispatch(initializeVideoCall({ type: "incomingvideo", caller: user }));
    });
    socket.on("call:videocallcanceled", () => {
      dispatch(setErrorMsgUser("Call Ended"));
      dispatch(cancelVideoCall());
    });
    socket.on("ai:translated:multiple-messages", (data) => {
      console.log("translated:", data);
      dispatch(setMultipleTranslatedMessages(data));
    });
    // socket.on("disconnetion", () => {
    //   dispatch(setOnline(false))
    // })
    // socket.on('reconnection', () => {
    //   // socket.emit('reconnecting', {uid, profile, username})
    //   console.log({ uid, profile, username })
    // })

    return () => {
      socket.off("requsetfromuser");
      socket.off("successmessage");
      socket.off("errormessage");
      socket.off("friendonline");
      socket.off("friendoffline");
      socket.off("chat:receivemessage");
      socket.off("seenmessages");
      socket.off("call:videocallincoming");
      socket.off("call:videocallcanceled");
      // socket.off("disconnection")
      // socket.off("reconnection")
    };
  }, [socket]);

  useEffect(() => {
    connecttoserver({ dispatch, username, profile, uid, settings });
  }, [isLogin]);

  useEffect(() => {
    if (successmsguser !== "") {
      setTimeout(() => {
        dispatch(setSucessMsgUser(""));
      }, 3000);
    }
    if (errormsguser !== "") {
      setTimeout(() => {
        dispatch(setErrorMsgUser(""));
      }, 5000);
    }
    if (warningmsg !== "") {
      setTimeout(() => {
        dispatch(setWarningMsg(""));
      }, 2000);
    }
    console.log(warningmsg);
  }, [successmsguser, errormsguser, warningmsg]);
  const themeColor = useSelector((state) => state.theme.themeColor);
  const themeMode = useSelector((state) => state.theme.themeMode);
  const colors = useSelector((state) => state.theme.colors);
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-mode", themeMode);
    document.documentElement.style.setProperty("--theme-color", themeColor);
    document.documentElement.style.setProperty(
      "--opposite-theme-mode",
      themeMode === "white" ? "black" : "white"
    );
    document.documentElement.style.setProperty(
      "--rgb-accent",
      colors.rgbAccent
    );
    if (themeMode == "white") {
      document.documentElement.style.setProperty(
        "--rgb-background",
        colors.rgbBackground
      );
      document.documentElement.style.setProperty("--rgb-color", colors.rgbText);
    } else {
      document.documentElement.style.setProperty(
        "--rgb-background",
        colors.rgbText
      );
      document.documentElement.style.setProperty(
        "--rgb-color",
        colors.rgbBackground
      );
    }
  }, [themeColor, themeMode]);
  useEffect(() => {
    const themeColor = Cookies.get("themeColor");
    const themeMode = Cookies.get("themeMode");
    if (themeColor && themeMode) {
      dispatch(setThemeColor(themeColor));
      dispatch(setThemeMode(themeMode));
    }
  }, []);
  return (
    <>
      {successmsguser !== "" ? <SuccessBar msg={successmsguser} /> : null}
      {errormsguser !== "" ? <ErrorBar msg={errormsguser} /> : null}
      {warningmsg !== "" ? <WarningBar msg={warningmsg} /> : null}
      {}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar title="Gossip AI" />}>
            <Route index element={<Home />}></Route>
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="chat" element={<Chat />}>
              <Route
                index
                element={<div className="closedchat">Click on chat</div>}
              />
              <Route path=":uid" element={<ChatWindow />}>
                <Route path="sendimage" element={<ImageEditor />} />
                <Route path="viewimage" element={<ImageViewer />} />
              </Route>
              <Route path="chatbot" element={<ChatBot />} />
            </Route>
            <Route path="/login/:type" element={<Account />} />
            <Route path="/login" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />}>
              <Route path="profile" element={<Profile />}></Route>
              <Route path="themes" element={<Themes />}></Route>
              <Route path="translation" element={<Translation />}></Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
