import { useEffect, useState } from "react";
import SignUp from "./SignUp/SignUp";
import SignIn from "./SignIn/SignIn";
import { useSelector } from "react-redux";
import "./Account.css";
import { useNavigate, useParams } from "react-router-dom";
import HomeLoader from "../Chat/HomeLoader/HomeLoader";
import ConnectedNodesBackground from "./ConnectedNodesBackground";
import { motion } from "motion/react";

export default function Account() {
  const [signup, setSignup] = useState(false);
  const { type } = useParams();
  const isLogin = useSelector((state) => state.user.isLogin);
  const navigate = useNavigate();
  const isPending = useSelector((state) => state.user.isPending);

  useEffect(() => {
    if (isLogin) {
      navigate("/chat/");
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    setSignup("signup" === type ? true : false);
  }, []);
  if (isPending) {
    return <HomeLoader />;
  }
  return (
    <div className="account">
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
