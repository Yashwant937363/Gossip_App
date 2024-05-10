import { useEffect, useState } from "react";
import SignUp from "./SignUp/SignUp";
import SignIn from "./SignIn/SignIn";
import { useDispatch, useSelector } from "react-redux";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { fetchChats, fetchFriends } from "../../store/slices/ChatSlice";
import { getUser, setAuthtoken } from "../../store/slices/UserSlice";
import Cookies from "js-cookie";
import HomeLoader from "../Home/HomeLoader/HomeLoader";

export default function Account() {
  const dispatch = useDispatch();
  const [signup, setSignup] = useState(false);
  const isLogin = useSelector((state) => state.user.isLogin);
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.user.authtoken);
  const isPending = useSelector((state) => state.user.isPending);

  useEffect(() => {
    const authtoken = Cookies.get("authtoken");
    if (authtoken) {
      dispatch(getUser({ authtoken }));
      dispatch(setAuthtoken(authtoken));
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      dispatch(fetchFriends({ authtoken }));
      navigate("/");
    }
  }, [isLogin, navigate]);

  if (isPending) {
    return <HomeLoader />;
  }
  return (
    <div className="account">
      <style>
        {`
            body{
               background:url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzPLoLzdNHFfCGCMOO2D1IANkNFoyd2Kv_Ow&usqp=CAU");
            }
         `}
      </style>
      <div className="mainswitch">
        <div className="innerswitch">
          <div
            className={signup ? "" : "open"}
            onClick={() => setSignup(false)}
          >
            Sign In
          </div>
          <div className={signup ? "open" : ""} onClick={() => setSignup(true)}>
            Sign Up
          </div>
        </div>
        {signup ? <SignUp signup={signup} /> : <SignIn signup={signup} />}
      </div>
    </div>
  );
}
