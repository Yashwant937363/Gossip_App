import { useEffect, useState } from "react";
import SignUp from "./SignUp/SignUp";
import SignIn from "./SignIn/SignIn";
import { useDispatch, useSelector } from "react-redux";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { fetchChats, fetchFriends } from "../../store/slices/ChatSlice";
import { getUser, setAuthtoken } from "../../store/slices/UserSlice";
import Cookies from "js-cookie";
import HomeLoader from "../Chat/HomeLoader/HomeLoader";
import { setThemeColor, setThemeMode } from "../../store/slices/ThemeSlice";
import ConnectedNodesBackground from "./ConnectedNodesBackground";

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
      navigate("/chat");
    }
  }, [isLogin, navigate]);

  if (isPending) {
    return <HomeLoader />;
  }
  return (
    <div className="account">
      <ConnectedNodesBackground />
      <style>
        {`
            .navbar{
              background-color:color-mix(in srgb, transparent 30%,var(--theme-mode));
            }
            body {
              position: relative;
            }

            .threebackground {
              height: 100%;
              width: 100%;
              position: absolute !important;
              top: 0;
              left: 0;
              z-index: -1;
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
