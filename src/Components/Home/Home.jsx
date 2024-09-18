import React, { useEffect } from "react";
import "./Home.css";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow/ChatWindow";
import { socket } from "../../store/socket";
import SideBar from "./Sidebar/SideBar";
import CallWindow from "./ChatWindow/Call/Call";

export default function Home() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const isCallStarted = useSelector((state) => state.call.isCallStarted);
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
    <div className="home">
      <SideBar></SideBar>
      {uid ? (
        <Outlet></Outlet>
      ) : (
        <div className="closedchat">Click on Chat to Open The Chat</div>
      )}
      {isCallStarted && <CallWindow />}
    </div>
  );
}
