import React from "react";
import { Outlet, useHref } from "react-router-dom";
import "../Chat/Chat.css";
import "./Settings.css";
import SettingsSidebar from "./SettingsSidebar/SettingsSidebar";

export default function Settings() {
  const url = useHref();
  return (
    <div className="chatpage settings">
      <SettingsSidebar></SettingsSidebar>
      {url === "/settings" ? <div></div> : <Outlet></Outlet>}
    </div>
  );
}
