import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SettingsSidebar from "./SettingsSidebar/SettingsSidebar";

export default function Settings() {
  const location = useLocation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[calc(100vh-45px)] w-full overflow-hidden bg-bg5">
      <SettingsSidebar />
      <div className="h-full overflow-y-auto">
        {location.pathname === "/settings" || location.pathname === "/settings/" ? (
          <div className="hidden md:flex h-full items-center justify-center text-textColor opacity-60">
            Select a setting from the menu
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
