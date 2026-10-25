import React, { useEffect, useState } from "react";
import SignUp from "./SignUp/SignUp";
import SignIn from "./SignIn/SignIn";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import HomeLoader from "../Chat/HomeLoader/HomeLoader";
import ConnectedNodesBackground from "./ConnectedNodesBackground";
import { RootState } from "../../store/store";

export default function Account() {
  const [signup, setSignup] = useState<boolean>(false);
  const { type } = useParams<{ type?: string }>();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const navigate = useNavigate();
  const isPending = useSelector((state: RootState) => state.user.isPending);

  useEffect(() => {
    if (isLogin) {
      navigate("/chat/");
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    setSignup(type === "signup");
  }, [type]);

  if (isPending) {
    return <HomeLoader />;
  }

  return (
    <div className="relative flex justify-center items-center min-h-[calc(100vh-45px)] px-4 py-8 overflow-hidden">
      {/* <ConnectedNodesBackground /> */}
      <div className="w-full max-w-sm sm:max-w-md z-10 flex flex-col shadow-2xl">
        {/* Switcher tabs */}
        <div className="flex w-full rounded-t-2xl overflow-hidden bg-slate-800 backdrop-blur-md border border-b-0 border-bg20">
          <button
            type="button"
            className={`flex-1 py-3 text-center text-sm font-semibold transition-all cursor-pointer ${
              !signup
                ? "bg-themeColor text-themeMode shadow-inner"
                : "text-textColor opacity-70 hover:opacity-100 hover:bg-bg20"
            }`}
            onClick={() => setSignup(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-center text-sm font-semibold transition-all cursor-pointer ${
              signup
                ? "bg-themeColor text-themeMode shadow-inner"
                : "text-textColor opacity-70 hover:opacity-100 hover:bg-bg20"
            }`}
            onClick={() => setSignup(true)}
          >
            Sign Up
          </button>
        </div>

        {signup ? <SignUp signup={signup} /> : <SignIn signup={signup} />}
      </div>
    </div>
  );
}
