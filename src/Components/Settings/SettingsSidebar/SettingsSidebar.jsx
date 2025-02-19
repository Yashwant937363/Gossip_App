import React, { useState } from "react";
import {
  ChatLeftDotsFill,
  ChevronLeft,
  FileArrowDownFill,
  PaletteFill,
  Robot,
  PersonFill,
  Translate,
} from "react-bootstrap-icons";
import "./SettingsSidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SettingsSidebar() {
  const previousPath = useSelector((state) => state.UIState.previousPath);
  const isLogin = useSelector((state) => state.user.isLogin);
  console.log(isLogin);
  const navigate = useNavigate();
  const goBack = () => navigate(previousPath);
  return (
    <div className="sidebarlist settingsidebar">
      <h2>
        <ChevronLeft onClick={goBack} className="arrowlefticon"></ChevronLeft>
        <span>Settings</span>
      </h2>

      <NavLink to="/settings/profile" className="listitem">
        <PersonFill></PersonFill> Profile
      </NavLink>

      <NavLink to="/settings/themes" className="listitem">
        <PaletteFill />
        Themes
      </NavLink>
      <NavLink to="/settings/ai-settings" className="listitem">
        <Robot />
        AI Settings
      </NavLink>
    </div>
  );
}
