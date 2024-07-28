import React from "react";
import { Outlet, useHref } from "react-router-dom";
import "../Home/Home.css";
import "./Settings.css";
import SettingsSidebar from "./SettingsSidebar/SettingsSidebar";

export default function Settings() {
  const url = useHref();
  return (
    <div className="home settings">
      <SettingsSidebar></SettingsSidebar>
      {url === "/settings" ? (
        <div>
          <div>hellow</div>
        </div>
      ) : (
        <Outlet></Outlet>
      )}
    </div>
  );
}
