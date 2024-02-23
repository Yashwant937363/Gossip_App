import { useEffect } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar";
import Home from "./Components/Home/Home";
import NotFound from "./Components/NotFound/NotFound";
import { useDispatch, useSelector } from "react-redux";
import ErrorBar from "./Components/MsgBars/ErrorBar";
import SuccessBar from "./Components/MsgBars/SuccessBar";
import WarningBar from "./Components/MsgBars/WarningBar";
import Account from "./Components/Account/Account";
import {
  addRequest,
  setErrorMsgUser,
  setOnline,
  setSucessMsgUser,
} from "./store/slices/UserSlice";
import { connecttoserver, socket } from "./store/socket";
import Cookies from "js-cookie";
import Profile from "./Components/Profile/Profile";
import {
  addChat,
  setFriendOffline,
  setFriendOnline,
  setReceivedMessages,
  setSeenMessages,
} from "./store/slices/ChatSlice";
import About from "./Components/About/About";

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const username = useSelector((state) => state.user.username);
  const profile = useSelector((state) => state.user.profile);
  const uid = useSelector((state) => state.user.uid);
  const successmsguser = useSelector((state) => state.user.successmsg);
  const errormsguser = useSelector((state) => state.user.errormsg);

  useEffect(() => {
    socket.on("requestfromuser", ({ uid, profile, username }) =>
      dispatch(addRequest({ uid, profile, username }))
    );
    socket.on("successmessage", (message) =>
      dispatch(setSucessMsgUser(message))
    );
    socket.on("errormessage", (message) => dispatch(setErrorMsgUser(message)));
    socket.on("friendonline", ({ uid }) => {
      dispatch(setFriendOnline(uid));
      dispatch(setReceivedMessages(uid));
    });
    socket.on("friendoffline", ({ uid }) => dispatch(setFriendOffline(uid)));
    socket.on("chat:receivemessage", (newChat) => dispatch(addChat(newChat)));
    socket.on("seenmessages", ({ uid }) => dispatch(setSeenMessages(uid)));
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
  return (
    <>
      {successmsguser !== "" ? <SuccessBar msg={successmsguser} /> : null}
      {errormsguser !== "" ? <ErrorBar msg={errormsguser} /> : null}
      {/* {(successmsgnote !== '') ? (<SuccessMsgBar msg={successmsgnote} />) : null}
      {(errormsgnote !== '') ? (<ErrorMsgBar msg={errormsgnote} />) : null} */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar title="Gossip App" />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Account />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
