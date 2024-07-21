import React from "react";
import { PaletteFill, PersonFill } from "react-bootstrap-icons";
import "./SettingsSidebar.css";
import { Link } from "react-router-dom";

export default function SettingsSidebar() {
  return (
    <div className="sidebarlist settingsidebar">
      <Link to="/settings/profile" className="listitem">
        <PersonFill></PersonFill> Profile
      </Link>
      <Link to="/settings/themes" className="listitem">
        <PaletteFill />
        Themes
      </Link>
    </div>
  );
}
