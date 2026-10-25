import React from "react";
import { useForm } from "react-hook-form";
import { Envelope, Eye, EyeSlash, Lock } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { setSignInDetails, signInUser } from "../../../store/slices/UserSlice";
import { useToggle } from "../../Hooks/useToggle";
import { AppDispatch } from "../../../store/store";

interface SignInProps {
  signup?: boolean;
}

export default function SignIn({}: SignInProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [showPass, togglePass] = useToggle(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<{ email: string; password: string }>();

  const onSubmit = (data: { email: string; password: string }) => {
    dispatch(setSignInDetails(data.email));
    dispatch(
      signInUser({
        signInData: { email: data.email, password: data.password },
      }),
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-b-2xl bg-bg10/90 backdrop-blur-md border border-t-0 border-bg20 shadow-2xl text-textColor flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium opacity-90">
          Email
        </label>
        <div className="relative flex items-center">
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full bg-transparent border-b border-bg20 focus:border-themeColor text-textColor pl-3 pr-10 py-2 text-sm focus:outline-none transition-colors"
            {...register("email", {
              onBlur: () => trigger("email"),
              required: "Please enter your email",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Please enter a valid email",
              },
            })}
          />
          <Envelope className="absolute right-3 text-textColor opacity-60" />
        </div>
        {errors.email && (
          <span className="text-xs text-rose-400 mt-0.5">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium opacity-90">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            type={showPass ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            className="w-full bg-transparent border-b border-bg20 focus:border-themeColor text-textColor pl-3 pr-16 py-2 text-sm focus:outline-none transition-colors"
            {...register("password", {
              onBlur: () => trigger("password"),
              required: "Please enter password",
              minLength: {
                value: 8,
                message: "At least 8 characters required",
              },
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
          <span className="text-xs text-rose-400 mt-0.5">
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2.5 mt-4 rounded-xl font-semibold bg-themeColor text-themeMode shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
      >
        Sign In
      </button>
    </form>
  );
}
