import React, { useEffect } from "react";
import "./Profile.css";
import { Person } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { clear, setErrorMsgUser } from "../../../store/slices/UserSlice";
import GoBackButton from "../../Buttons/GoBackButton/GoBackButton";
import { disconnectSocket } from "../../../socket/main";
import { clearChat } from "../../../store/slices/ChatSlice";

export default function Profile() {
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
    dispatch(clearChat());
    Cookies.remove("authtoken");
    disconnectSocket();
  };

  if (!isLogin) {
    return (
      <div className="profilecontainer mainpage center redirect-page">
        <div className="container">
          <h2>Your not login yet</h2>
          <div className="login-buttons">
            <Link className="btn btn-signin">sign in</Link>
            <Link className="btn btn-signup">sign up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profilecontainer mainpage">
      <h2 className="settings-heading">
        <GoBackButton />
        Profile
      </h2>
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
  );
}
