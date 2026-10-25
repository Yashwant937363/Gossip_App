import React from "react";
import { Person, PersonFillExclamation } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { clear } from "../../../store/slices/UserSlice";
import GoBackButton from "../../Buttons/GoBackButton/GoBackButton";
import { disconnectSocket } from "../../../socket/main";
import { clearChat } from "../../../store/slices/ChatSlice";
import { RootState, AppDispatch } from "../../../store/store";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const profile = useSelector((state: RootState) => state.user.profile);
  const fullname = useSelector((state: RootState) => state.user.fullname);
  const username = useSelector((state: RootState) => state.user.username);
  const uid = useSelector((state: RootState) => state.user.uid);
  const email = useSelector((state: RootState) => state.user.email);
  const userDob = useSelector((state: RootState) => state.user.dob);
  const dob = userDob ? new Date(userDob) : null;

  const logOut = () => {
    dispatch(clear());
    dispatch(clearChat());
    Cookies.remove("authtoken");
    disconnectSocket();
  };

  if (!isLogin) {
    return (
      <div className="max-w-xl mx-auto p-6 md:p-10 text-textColor flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-full flex items-center gap-3 mb-8">
          <GoBackButton />
          <h2 className="text-2xl font-bold text-themeColor">Profile</h2>
        </div>
        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-bg10/70 border border-bg20 shadow-lg w-full max-w-sm">
          <PersonFillExclamation className="text-5xl text-themeColor mb-4" />
          <h2 className="text-xl font-bold mb-2">You are not logged in</h2>
          <p className="text-sm opacity-75 mb-6">Log in to view and customize your account details</p>
          <div className="flex items-center gap-4 w-full">
            <Link
              to="/login/signin"
              className="flex-1 py-2.5 rounded-xl font-semibold text-center bg-themeColor text-themeMode shadow hover:opacity-95 transition-all text-sm"
            >
              Sign In
            </Link>
            <Link
              to="/login/signup"
              className="flex-1 py-2.5 rounded-xl font-semibold text-center bg-bg20 hover:bg-bg30 transition-all text-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 md:p-10 text-textColor">
      <div className="flex items-center gap-3 mb-6 border-b border-bg15 pb-4">
        <GoBackButton />
        <h2 className="text-2xl font-bold text-themeColor">Profile</h2>
      </div>

      <div className="p-6 rounded-2xl bg-bg10/80 border border-bg20 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-themeColor bg-bg15 flex items-center justify-center shadow-md">
            {profile ? (
              <img src={profile} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Person className="text-4xl text-textColor opacity-70" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-themeColor">{username}</h3>
            {fullname?.firstname && (
              <p className="text-sm opacity-80">
                {fullname.firstname} {fullname.lastname}
              </p>
            )}
            <span className="text-xs opacity-60 font-mono">UID: {uid}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-bg15 text-sm">
          <div className="flex justify-between py-2 border-b border-bg10">
            <span className="opacity-70">Email</span>
            <span className="font-medium">{email || "Not provided"}</span>
          </div>
          {dob && (
            <div className="flex justify-between py-2 border-b border-bg10">
              <span className="opacity-70">Date of Birth</span>
              <span className="font-medium">
                {dob.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={logOut}
          className="w-full py-2.5 mt-2 rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md active:scale-98 transition-all cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
