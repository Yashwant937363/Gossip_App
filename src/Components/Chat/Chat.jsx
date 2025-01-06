import React, { useEffect } from "react";
import "./Chat.css";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow/ChatWindow";
import SideBar from "./Sidebar/SideBar";

import { socket } from "../../socket/main";
import Call from "./Call/Call";

export default function Chat() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const callInitialize = useSelector((state) => state.call.callInitialize);
  const navigate = useNavigate();
  const { uid } = useParams();
  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return null;
  }

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <div className="chatpage">
      <SideBar></SideBar>
      {uid ? (
        <Outlet></Outlet>
      ) : (
        <div className="closedchat">Click on Chat to Open The Chat</div>
      )}
      {callInitialize && <Call></Call>}
    </div>
  );
}
