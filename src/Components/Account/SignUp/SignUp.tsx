import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CameraFill,
  Envelope,
  Eye,
  EyeSlash,
  Lock,
  Person,
  PersonBadge,
} from "react-bootstrap-icons";
import {
  setErrorMsgUser,
  setProfile,
  setSignUpDetails,
  setSucessMsgUser,
  signUpUser,
} from "../../../store/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToggle } from "../../Hooks/useToggle";
import { apiSendEmailOtp } from "../../../api/client";
import { RootState, AppDispatch } from "../../../store/store";

interface SignUpProps {
  signup?: boolean;
}

export default function SignUp({}: SignUpProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [showPass, togglePass] = useToggle(false);
  const profile = useSelector((state: RootState) => state.user.profile);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [serverOTP, setServerOTP] = useState<string>("");
  const [inputOTP, setInputOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<{
    profile: FileList;
    username: string;
    email: string;
    password: string;
    otp: string;
  }>();

  const handleSendEmailOtp = async () => {
    const email = watch("email");
    if (!email || email.trim() === "") {
      dispatch(setErrorMsgUser("Please enter email first"));
      return;
    }
    setOtpLoading(true);
    try {
      const response = await apiSendEmailOtp(email);
      setOtpSent(true);
      if (response?.otp) {
        setServerOTP(response.otp.toString());
      }
      dispatch(setSucessMsgUser(response.message || "OTP sent to your email"));
    } catch (err: any) {
      console.error(err);
      dispatch(
        setErrorMsgUser(err.response?.data?.message || "Failed to send OTP"),
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (!inputOTP || inputOTP.trim() === "") {
      dispatch(setErrorMsgUser("Please enter the received OTP"));
      return;
    }
    setOtpLoading(true);
    setTimeout(() => {
      // If server returned an OTP check it, otherwise allow verification if OTP was sent
      if (!serverOTP || serverOTP === inputOTP.trim()) {
        setVerified(true);
        dispatch(setSucessMsgUser("Email Verification Successful"));
      } else {
        dispatch(setErrorMsgUser("Invalid OTP entered"));
      }
      setOtpLoading(false);
    }, 500);
  };

  const onSubmit = (data: {
    profile: FileList;
    username: string;
    email: string;
    password: string;
  }) => {
    if (!isVerified) {
      dispatch(setErrorMsgUser("Please verify your email first"));
      return;
    }

    const signUpData = new FormData();
    if (data.profile?.[0]) {
      signUpData.append("profile", data.profile[0]);
    }
    signUpData.append("username", data.username.trim());
    signUpData.append("email", data.email.trim());
    signUpData.append("password", data.password);

    dispatch(
      setSignUpDetails({
        profile: profile,
        fullname: { firstname: data.username, lastname: "" },
        username: data.username,
        email: data.email,
        date: new Date().toISOString(),
      }),
    );
    dispatch(signUpUser({ signUpData }));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-b-2xl bg-bg10/90 backdrop-blur-md border border-t-0 border-bg20 shadow-2xl text-textColor flex flex-col gap-4"
    >
      {/* Profile picture upload */}
      <div className="flex flex-col items-center justify-center my-1">
        <label
          htmlFor="profile"
          className="relative w-20 h-20 rounded-full border-2 border-dashed border-themeColor flex items-center justify-center cursor-pointer overflow-hidden bg-bg15/50 hover:bg-bg15 transition-all group"
        >
          {profile ? (
            <img
              src={profile}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Person className="text-3xl text-textColor opacity-70 group-hover:scale-110 transition-transform" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <CameraFill className="text-white text-base" />
          </div>
          <input
            type="file"
            id="profile"
            accept="image/*"
            className="hidden"
            {...register("profile", {
              onChange: (e) => {
                if (e.target.files?.[0]) {
                  dispatch(setProfile(URL.createObjectURL(e.target.files[0])));
                }
              },
            })}
          />
        </label>
        <span className="text-xs opacity-70 mt-1">Upload Avatar</span>
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium opacity-90">
          Username
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            id="username"
            placeholder="Choose a username"
            className="w-full bg-transparent border-b border-bg20 focus:border-themeColor text-textColor pl-3 pr-10 py-1.5 text-sm focus:outline-none transition-colors"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 1, message: "Min 1 character" },
            })}
          />
          <PersonBadge className="absolute right-3 text-textColor opacity-60" />
        </div>
        {errors.username && (
          <span className="text-xs text-rose-400">
            {errors.username.message}
          </span>
        )}
      </div>

      {/* Email and OTP */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="signup-email"
          className="text-sm font-medium opacity-90"
        >
          Email
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              type="email"
              id="signup-email"
              placeholder="Enter your email"
              disabled={isVerified}
              className="w-full bg-transparent border-b border-bg20 focus:border-themeColor text-textColor pl-3 pr-10 py-1.5 text-sm focus:outline-none transition-colors disabled:opacity-60"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email",
                },
              })}
            />
            <Envelope className="absolute right-3 text-textColor opacity-60" />
          </div>

          {!isVerified ? (
            <button
              type="button"
              onClick={handleSendEmailOtp}
              disabled={otpLoading}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-bg20 hover:bg-themeColor hover:text-themeMode transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {otpLoading ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
            </button>
          ) : (
            <span className="text-xs font-semibold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-lg">
              ✓ Verified
            </span>
          )}
        </div>
        {errors.email && (
          <span className="text-xs text-rose-400">{errors.email.message}</span>
        )}

        {/* OTP Input box */}
        {otpSent && !isVerified && (
          <div className="flex items-center gap-2 mt-2 p-2 rounded-xl bg-bg5/80 border border-bg20">
            <input
              type="text"
              placeholder="Enter OTP"
              value={inputOTP}
              onChange={(e) => setInputOTP(e.target.value)}
              className="flex-1 bg-transparent border-b border-bg20 focus:border-themeColor text-textColor px-2 py-1 text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={otpLoading}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-themeColor text-themeMode cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="signup-password"
          className="text-sm font-medium opacity-90"
        >
          Password
        </label>
        <div className="relative flex items-center">
          <input
            type={showPass ? "text" : "password"}
            id="signup-password"
            placeholder="At least 8 characters"
            className="w-full bg-transparent border-b border-bg20 focus:border-themeColor text-textColor pl-3 pr-16 py-1.5 text-sm focus:outline-none transition-colors"
            {...register("password", {
              onBlur: () => trigger("password"),
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters required" },
            })}
          />
          <div className="absolute right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={togglePass}
              className="text-textColor opacity-70 hover:opacity-100 transition-opacity"
            >
              {showPass ? <Eye /> : <EyeSlash />}
            </button>
            <Lock className="text-textColor opacity-60" />
          </div>
        </div>
        {errors.password && (
          <span className="text-xs text-rose-400">
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2.5 mt-3 rounded-xl font-semibold bg-themeColor text-themeMode shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
      >
        Create Account
      </button>
    </form>
  );
}
