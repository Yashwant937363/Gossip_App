import React, { useState } from "react";
import {
  ChatLeftDotsFill,
  ChevronLeft,
  FileArrowDownFill,
  PaletteFill,
  PersonFill,
  Translate,
} from "react-bootstrap-icons";
import "./SettingsSidebar.css";
import { Link, useNavigate } from "react-router-dom";
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
      {isLogin && (
        <Link to="/settings/profile" className="listitem">
          <PersonFill></PersonFill> Profile
        </Link>
      )}
      <Link to="/settings/themes" className="listitem">
        <PaletteFill />
        Themes
      </Link>
      <Link to="/settings/translation" className="listitem">
        <Translate />
        Translation
      </Link>
      <Link to="/settings/themes" className="listitem">
        <FileArrowDownFill />
        Summarization
      </Link>
      <Link to="/settings/themes" className="listitem">
        <ChatLeftDotsFill />
        Auto Generated Messages
      </Link>
    </div>
  );
}
