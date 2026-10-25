import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./Sidebar/SideBar";
import { connectSocket } from "../../socket/main";
import Call from "./Call/Call";
import { RootState } from "../../store/store";

export default function Chat() {
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const authtoken = useSelector((state: RootState) => state.user.authtoken);
  const callInitialize = useSelector((state: RootState) => state.call.callInitialize);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    if (isLogin && authtoken) {
      connectSocket(authtoken);
    }
  }, [isLogin, authtoken]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-45px)] w-full overflow-hidden bg-bg5 text-textColor relative">
      <SideBar />
      <div className="h-full overflow-hidden flex flex-col relative">
        <Outlet />
      </div>
      {callInitialize && <Call />}
    </div>
  );
}
