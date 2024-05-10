import React, { useEffect, useState } from "react";
import "./SignIn.css";
import { useForm } from "react-hook-form";
import { Envelope, Eye, EyeSlash, Lock } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { setSignInDetails, signInUser } from "../../../store/slices/UserSlice";
import { useToggle } from "../../Hooks/useToggle";

export default function SignIn() {
  const dispatch = useDispatch();
  const [showPass, setPassToggle] = useToggle();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();
  const onSubmit = (data) => {
    const signInData = new FormData();
    signInData.append("email", data.email);
    signInData.append("password", data.password);
    dispatch(setSignInDetails(data.email));
    dispatch(signInUser({ signInData }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" id="signin">
      <div className={errors.email ? "error" : ""}>Email : </div>
      <div className={errors.email ? "withicon error" : "withicon"}>
        <input
          type="email"
          id="email"
          {...register("email", {
            onBlur: () => trigger("email"), // Trigger validation on blur
            required: "Please Enter Email",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Please Enter Valid Email",
            },
          })}
        />
        <Envelope></Envelope>
        {errors.email && (
          <div className="errortext">{errors.email.message}</div>
        )}
      </div>
      <div className={errors.password ? "error" : ""}>Password : </div>
      <div className={errors.password ? "withicon error" : "withicon"}>
        <div className="password">
          <input
            type={showPass ? "text" : "password"}
            {...register("password", {
              onBlur: () => trigger("password"),
              required: "Please enter Password",
              minLength: {
                message: "Password have atl least 8 Characters",
                value: 8,
              },
            })}
          />
          {showPass ? (
            <Eye onClick={setPassToggle} />
          ) : (
            <EyeSlash onClick={setPassToggle}></EyeSlash>
          )}
        </div>
        <Lock></Lock>
        {errors.password && (
          <div className="errortext">{errors.password.message}</div>
        )}
      </div>
      <input type="submit" className="submit" value="Submit" />
    </form>
  );
}
