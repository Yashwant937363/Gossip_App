import React from "react";
import {
  ChevronLeft,
  PaletteFill,
  Robot,
  PersonFill,
} from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

export default function SettingsSidebar() {
  const previousPath = useSelector(
    (state: RootState) => state.UIState.previousPath,
  );
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const navigate = useNavigate();

  const goBack = () => navigate(previousPath || "/chat");

  return (
    <div className="h-full border-r border-bg20 bg-bg10/90 backdrop-blur-md p-4 flex flex-col gap-2 text-textColor select-none">
      <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-bg15">
        <button
          type="button"
          onClick={goBack}
          className="p-1 rounded-lg hover:bg-bg20 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ChevronLeft className="text-xl" />
        </button>
        <h2 className="text-xl font-bold tracking-tight ">Settings</h2>
      </div>

      <nav className="flex flex-col gap-1.5">
        <NavLink
          to="/settings/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? "bg-themeColor text-themeMode shadow-md font-bold"
                : "hover:bg-bg20 text-textColor opacity-85 hover:opacity-100"
            }`
          }
        >
          <PersonFill className="text-lg" />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings/themes"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? "bg-themeColor text-themeMode shadow-md font-bold"
                : "hover:bg-bg20 text-textColor opacity-85 hover:opacity-100"
            }`
          }
        >
          <PaletteFill className="text-lg" />
          <span>Themes</span>
        </NavLink>

        {isLogin && (
          <NavLink
            to="/settings/ai-settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-themeColor text-themeMode shadow-md font-bold"
                  : "hover:bg-bg20 text-textColor opacity-85 hover:opacity-100"
              }`
            }
          >
            <Robot className="text-lg" />
            <span>AI Settings</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
}
