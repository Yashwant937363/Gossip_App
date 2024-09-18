import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useForm } from "react-hook-form";
import {
  Calendar3,
  Envelope,
  Lock,
  Pencil,
  PencilFill,
  Person,
} from "react-bootstrap-icons";
import {
  clear,
  setErrorMsgUser,
  setProfile,
  setSignUpDetails,
  signUpUser,
} from "../../store/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToggle } from "../Hooks/useToggle";
import Cookies from "js-cookie";
import { disconnectSocket } from "../../store/socket";

export default function SignUp() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const profile = useSelector((state) => state.user.profile);
  const fullname = useSelector((state) => state.user.fullname);
  const username = useSelector((state) => state.user.username);
  const uid = useSelector((state) => state.user.uid);
  const email = useSelector((state) => state.user.email);
  const dob = new Date(useSelector((state) => state.user.dob));
  const navigate = useNavigate();
  const logOut = () => {
    dispatch(clear());
    Cookies.remove("authtoken");
    disconnectSocket();
  };
  useEffect(() => {
    if (!isLogin) {
      dispatch(setErrorMsgUser("Please Login First"));
      navigate("/login");
    }
  }, [isLogin, navigate]);

  return (
    <div className="profilepage">
      <div className="profilecontainer">
        <div className="profile">
          {profile ? (
            <img src={profile} className="profileimg" />
          ) : (
            <Person className="profileicon" />
          )}
        </div>
        <div>
          Name : {fullname?.firstname} {fullname?.lastname}
        </div>
        <div>Username : {username}</div>
        <div>Email :{email}</div>
        <div>
          DOB :{dob.toLocaleDateString("en-US", { month: "short" })}{" "}
          {dob.getDate()},{dob.getFullYear()}
        </div>
        <div>UID : {uid}</div>
        <button type="button" className="logout" onClick={logOut}>
          Log Out
        </button>
      </div>
    </div>
  );
}
