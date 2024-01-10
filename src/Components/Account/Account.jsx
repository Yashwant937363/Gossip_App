import { useState } from "react"
import SignUp from './SignUp/SignUp'
import SignIn from "./SignIn/SignIn"
import { useSelector } from "react-redux"
import './Account.css'

export default function Account() {
   const [signup, setSignup] = useState(true)
   const handleSignupToggle = () => setSignup(!signup)
   const isLogin = useSelector((state)=> state.user.isLogin)
   return (
      <div className="account">
         <style>
         {`
            body{
               background:url("https://cdn.wallpapersafari.com/27/58/FjtrEx.jpg");
            }
         `}
         </style>
         {signup ? (<SignUp />) : (<SignIn />)}
      </div>
   )
}
