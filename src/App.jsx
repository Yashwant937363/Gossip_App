import { useEffect } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar";
import Home from "./Components/Home/Home";
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
import { connecttoserver, socket } from "./store/socket";
import {
  addChat,
  addFriend,
  setFriendOffline,
  setFriendOnline,
  setReceivedMessages,
  setSeenMessages,
} from "./store/slices/ChatSlice";
import About from "./Components/About/About";
import {
  setCallStarted,
  setFromUid,
  setIncomingCall,
  setOffer,
  setType,
} from "./store/slices/CallSlice";
import PeerService from "./service/PeerService";
import ChatWindow from "./Components/Home/ChatWindow/ChatWindow";
import Settings from "./Components/Settings/Settings";
import Profile from "./Components/Settings/Profile/Profile";
import Themes from "./Components/Settings/Themes/Themes";
import { setThemeColor, setThemeMode } from "./store/slices/ThemeSlice";
import Cookies from "js-cookie";

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const username = useSelector((state) => state.user.username);
  const profile = useSelector((state) => state.user.profile);
  const uid = useSelector((state) => state.user.uid);
  const successmsguser = useSelector((state) => state.user.successmsg);
  const errormsguser = useSelector((state) => state.user.errormsg);
  const initializeIncomingCall = ({ fromuid, offer, type }) => {
    PeerService.create();
    dispatch(setType(type));
    dispatch(setFromUid(fromuid));
    dispatch(setOffer(offer));
    dispatch(setCallStarted(true));
    dispatch(setIncomingCall(true));
  };
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
    socket.on("call:videocallincoming", ({ fromuid, offer }) => {
      initializeIncomingCall({ fromuid, offer, type: "video" });
    });
    socket.on("call:audiocallincoming", ({ fromuid, offer }) => {
      initializeIncomingCall({ fromuid, offer, type: "audio" });
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
      socket.off("call:audiocallincoming");
      // socket.off("disconnection")
      // socket.off("reconnection")
    };
  }, [socket]);

  useEffect(() => {
    connecttoserver({ dispatch, username, profile, uid });
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
  });
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar title="Gossip App" />}>
            <Route index element={<Home />}></Route>
            <Route path="chat" element={<Home />}>
              <Route path=":uid" element={<ChatWindow />} />
            </Route>
            <Route path="/login" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />}>
              <Route path="profile" element={<Profile />}></Route>
              <Route path="themes" element={<Themes />}></Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
