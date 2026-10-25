import React, { useEffect } from "react";
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
  setOnline,
  setSucessMsgUser,
} from "./store/slices/UserSlice";
import {
  addChat,
  addFriend,
  setFriendOffline,
  setFriendOnline,
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
import { connectSocket, socket } from "./socket/main";
import ChatBot from "./Components/ChatBot/ChatBot";
import { cancelVideoCall, initializeVideoCall } from "./store/slices/CallSlice";
import { store, RootState, AppDispatch } from "./store/store";
import { videoCallRingingReceiverSide } from "./socket/call";
import ImageViewer from "./Components/Chat/ChatWindow/ImageViewer/ImageViewer";
import { setWarningMsg } from "./store/slices/UISlice";
import WarningBar from "./Components/MsgBars/WarningBar";
import AISettings from "./Components/Settings/AISettings/AISettings";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLogin, authtoken } = useSelector((state: RootState) => state.user);
  const successmsg = useSelector((state: RootState) => state.user.successmsg);
  const errormsg = useSelector((state: RootState) => state.user.errormsg);
  const warningmsg = useSelector((state: RootState) => state.UIState.warningmsg);
  const themeColor = useSelector((state: RootState) => state.theme.themeColor);
  const themeMode = useSelector((state: RootState) => state.theme.themeMode);
  const colors = useSelector((state: RootState) => state.theme.colors);

  // Setup Socket listeners with Handshake lifecycle
  useEffect(() => {
    const handleConnect = () => {
      dispatch(setOnline(true));
    };

    const handleDisconnect = () => {
      dispatch(setOnline(false));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", (err) => {
      console.warn("Socket connect error:", err.message);
      dispatch(setOnline(false));
    });

    socket.on("requestfromuser", ({ uid, profile, username }: any) => {
      dispatch(addRequest({ uid, profile, username }));
    });

    socket.on("successmessage", ({ msg, user }: any) => {
      if (msg) dispatch(setSucessMsgUser(msg));
      if (user) dispatch(addFriend(user));
    });

    socket.on("errormessage", (message: string) => {
      dispatch(setErrorMsgUser(message));
    });

    socket.on("friendonline", ({ uid }: { uid: string }) => {
      dispatch(setFriendOnline(uid));
      dispatch(setReceivedMessages(uid));
    });

    socket.on("friendoffline", ({ uid }: { uid: string }) => {
      dispatch(setFriendOffline(uid));
    });

    socket.on("chat:receivemessage", (newChat: any) => {
      dispatch(addChat(newChat));
    });

    socket.on("seenmessages", ({ uid }: { uid: string }) => {
      dispatch(setSeenMessages(uid));
    });

    socket.on("call:videocallincoming", ({ fromuid }: { fromuid: string }) => {
      const currentFriends = store.getState().chat.friends;
      const caller = currentFriends.find((u) => u.uid === fromuid);
      videoCallRingingReceiverSide({ fromuid });
      dispatch(initializeVideoCall({ type: "incomingvideo", caller: caller || { uid: fromuid, username: fromuid } }));
    });

    socket.on("call:videocallcanceled", () => {
      dispatch(setErrorMsgUser("Call Ended"));
      dispatch(cancelVideoCall());
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error");
      socket.off("requestfromuser");
      socket.off("successmessage");
      socket.off("errormessage");
      socket.off("friendonline");
      socket.off("friendoffline");
      socket.off("chat:receivemessage");
      socket.off("seenmessages");
      socket.off("call:videocallincoming");
      socket.off("call:videocallcanceled");
    };
  }, [dispatch]);

  // Connect socket on login/token availability
  useEffect(() => {
    if (isLogin && authtoken) {
      connectSocket(authtoken);
    }
  }, [isLogin, authtoken]);

  // Auto-clear messages
  useEffect(() => {
    if (successmsg) {
      const timer = setTimeout(() => {
        dispatch(setSucessMsgUser(""));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successmsg, dispatch]);

  useEffect(() => {
    if (errormsg) {
      const timer = setTimeout(() => {
        dispatch(setErrorMsgUser(""));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errormsg, dispatch]);

  useEffect(() => {
    if (warningmsg) {
      const timer = setTimeout(() => {
        dispatch(setWarningMsg(""));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [warningmsg, dispatch]);

  // Sync theme css variables
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-mode", themeMode);
    document.documentElement.style.setProperty("--theme-color", themeColor);
    document.documentElement.style.setProperty(
      "--opposite-theme-mode",
      themeMode === "white" ? "black" : "white"
    );
    if (colors?.rgbAccent) {
      document.documentElement.style.setProperty("--rgb-accent", colors.rgbAccent);
    }
    if (themeMode === "white") {
      document.documentElement.classList.remove("dark");
      if (colors?.rgbBackground) {
        document.documentElement.style.setProperty("--rgb-background", colors.rgbBackground);
      }
      if (colors?.rgbText) {
        document.documentElement.style.setProperty("--rgb-color", colors.rgbText);
      }
    } else {
      document.documentElement.classList.add("dark");
      if (colors?.rgbText) {
        document.documentElement.style.setProperty("--rgb-background", colors.rgbText);
      }
      if (colors?.rgbBackground) {
        document.documentElement.style.setProperty("--rgb-color", colors.rgbBackground);
      }
    }
  }, [themeColor, themeMode, colors]);

  useEffect(() => {
    const savedThemeColor = Cookies.get("themeColor");
    const savedThemeMode = Cookies.get("themeMode");
    if (savedThemeColor) dispatch(setThemeColor(savedThemeColor));
    if (savedThemeMode) dispatch(setThemeMode(savedThemeMode));
  }, [dispatch]);

  return (
    <>
      {successmsg ? <SuccessBar msg={successmsg} /> : null}
      {errormsg ? <ErrorBar msg={errormsg} /> : null}
      {warningmsg ? <WarningBar msg={warningmsg} /> : null}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar title="Gossip AI" />}>
            <Route index element={<Home />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="chat" element={<Chat />}>
              <Route
                index
                element={
                  <div className="hidden md:flex h-full items-center justify-center opacity-60 text-sm">
                    Select a conversation to start chatting
                  </div>
                }
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
              <Route path="profile" element={<Profile />} />
              <Route path="themes" element={<Themes />} />
              <Route path="ai-settings" element={<AISettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
