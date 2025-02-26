import React, { useEffect, useState } from "react";
import "./SignUp.css";
import { set, useForm } from "react-hook-form";
import {
  Eye,
  Calendar3,
  Envelope,
  EyeSlash,
  Lock,
  PencilFill,
  Person,
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
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

export default function SignUp(props) {
  const dispatch = useDispatch();
  const [showPass, setPassToggle] = useToggle();
  const profile = useSelector((state) => state.user.profile);
  const [dateError, setDateError] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [OTP, setOTP] = useState();
  const [inputOTP, setInputOTP] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
    trigger,
    getValues,
  } = useForm();
  const [daysInMonth, setDaysInMonth] = useState(31);
  const showOTPVerification = isVerified && touchedFields.email;
  const onSubmit = (data) => {
    if (!isVerified) {
      dispatch(setErrorMsgUser("Verify Email First"));
      return;
    }
    const signUpData = new FormData();
    const { day, month, year } = data.date;
    if (day === 29 && year % 4 !== 0) {
      setDateError(true);
      return;
    }
    const birthDate = new Date(
      `${parseInt(year, 10)}-${parseInt(month, 10)}-${parseInt(day, 10)}`
    );
    signUpData.append("profile", data.profile?.[0]);
    signUpData.append("fullname", JSON.stringify(data.fullname));
    signUpData.append("username", data.username);
    signUpData.append("email", data.email);
    signUpData.append("password", data.password);
    signUpData.append("dob", birthDate);
    dispatch(
      setSignUpDetails({
        profile: profile,
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        date: `${birthDate}`,
      })
    );
    dispatch(signUpUser({ signUpData }));
  };
  const onMonthChange = async (e) => {
    setDateError(false);
    let month = getValues("date.month");
    const year = getValues("date.year");
    let lastDay = new Date(
      year ? year : new Date().getFullYear(),
      month,
      0
    ).getDate();
    if (lastDay === 29) {
      const year = getValues("date.year");
    }
    setDaysInMonth(lastDay);
  };

  const handleSendEmailOtp = async () => {
    const email = watch("email");
    if (email.trim() === "") {
      dispatch(setErrorMsgUser("Empty Email"));
      return;
    }
    setOtpLoading(true);

    const response = await axios.post(SERVER_URL + "/api/auth/send-email-otp", {
      email,
    });
    if (response.data?.success) {
      setOTP(response.data.otp.toString());
    } else {
      dispatch(setErrorMsgUser("Email - Something Went Wrong"));
    }
    console.log(response.data);
    setOtpLoading(false);
  };

  const handleVerifyOTP = () => {
    setOtpLoading(true);
    if (OTP === inputOTP) {
      setTimeout(() => {
        setVerified(true);
        dispatch(setSucessMsgUser("Email Verification Successful"));
        setOtpLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        dispatch(setErrorMsgUser("Invalid OTP"));
        setOtpLoading(false);
      }, 1000);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" id="signup">
      <label htmlFor="profile" className="profile">
        {profile ? (
          <img src={profile} className="profileimg" />
        ) : (
          <Person className="profileicon" />
        )}
        <PencilFill className="edit"></PencilFill>
        <input
          type="file"
          id="profile"
          accept="image/*"
          {...register("profile", {
            onChange: (e) =>
              e.target.files[0]
                ? dispatch(setProfile(URL.createObjectURL(e.target.files[0])))
                : null,
          })}
        />
      </label>
      <div className="firstlastname">
        <input
          type="text"
          placeholder="Firstname"
          {...register("fullname.firstname")}
        />
        <input
          type="text"
          placeholder="Surname"
          {...register("fullname.lastname")}
        />
      </div>
      <div className={errors.username ? "error" : ""}>Username : </div>
      <div className={errors.username ? "withicon error" : "withicon"}>
        <input
          type="text"
          {...register("username", {
            required: "Username cannot be Empty",
            minLength: {
              message: "5 Characters Required",
              value: 5,
            },
            onBlur: () => trigger("username"),
          })}
        />
        <Person></Person>
        {errors.username && (
          <div className="errortext">{errors.username.message}</div>
        )}
      </div>
      <div className={errors.email ? "error" : ""}>Email : </div>
      <div className={errors.email ? "withicon error" : "withicon"}>
        <input
          type="email"
          id="email"
          {...register("email", {
            onBlur: () => trigger("email"), // Trigger validation on blur
            onChange: () => {
              setOTP("");
              setVerified(false);
            },
            required: "Please Enter Email",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Please Enter Valid Email",
            },
          })}
        />
        <Envelope></Envelope>
        {errors.email ? (
          <div className="errortext">{errors.email.message}</div>
        ) : (
          !isVerified && (
            <motion.div
              initial={{ height: 0 }}
              exit={{ height: 0 }}
              animate={{ height: "auto" }}
            >
              {OTP ? (
                <>
                  <input
                    value={inputOTP}
                    onChange={(e) => setInputOTP(e.target.value)}
                  />
                  <button
                    className="btn btn-send-email"
                    onClick={handleVerifyOTP}
                    disabled={isVerified || otpLoading}
                  >
                    {otpLoading ? (
                      <div className="btn-spinner"></div>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                  {isVerified === null && (
                    <div className="errortext">Invalid OTP</div>
                  )}
                </>
              ) : (
                <button
                  className="btn btn-send-email"
                  onClick={handleSendEmailOtp}
                  type="button"
                  disabled={otpLoading || OTP}
                >
                  {otpLoading ? (
                    <div className="btn-spinner"></div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}
            </motion.div>
          )
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
                message: "8 Characters Required",
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
      <div>DOB : </div>
      <div className="withicon dob">
        <select
          {...register("date.day", {
            required: "Day is required",
            onChange: () => setDateError(false),
          })}
        >
          <option value="">Day</option>
          {/* Generate options for days 1 to 31 */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        {/* Month dropdown */}
        <select
          {...register("date.month", {
            required: "Month is required",
            onChange: onMonthChange,
          })}
        >
          <option value="">Month</option>
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((monthAbbr, index) => (
            <option key={index + 1} value={index + 1}>
              {monthAbbr}
            </option>
          ))}
        </select>

        <select
          {...register("date.year", {
            required: "Year is required",
            onChange: () => setDateError(false),
          })}
        >
          <option value="">Year</option>
          {/* Generate options for years, adjust the range based on your needs */}
          {Array.from(
            { length: 100 },
            (_, i) => new Date().getFullYear() - i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <Calendar3></Calendar3>
        {dateError && <div>Invalid Date</div>}
      </div>
      <input type="submit" className="submit" value="Submit" />
    </form>
  );
}
