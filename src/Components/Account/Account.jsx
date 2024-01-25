import { useEffect, useState } from "react"
import SignUp from './SignUp/SignUp'
import SignIn from "./SignIn/SignIn"
import { useSelector } from "react-redux"
import './Account.css'
import { useNavigate } from "react-router-dom"

export default function Account() {
   const [signup, setSignup] = useState(false)
   const handleSignupToggle = () => setSignup(!signup)
   const isLogin = useSelector((state) => state.user.isLogin);
   const navigate = useNavigate();

   useEffect(() => {
      if (isLogin) {
         navigate('/');
      }
   }, [isLogin, navigate]);

   if (isLogin) {
      return null;
   }
   return (
      <div className="account">
         <style>
            {`
            body{
               background:url("https://cdn.wallpapersafari.com/27/58/FjtrEx.jpg");
            }
         `}
         </style>
         <div className="mainswitch">
            <div className="innerswitch">
               <div className={signup ? '' : 'open'} onClick={() => setSignup(false)}>Sign In</div>
               <div className={signup ? 'open' : ''} onClick={() => setSignup(true)}>Sign Up</div>
            </div>
            {signup ? (<SignUp signup={signup} />) : (<SignIn signup={signup} />)}
         </div>
      </div>
   )
}
