import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setColors,
  setThemeColor,
  setThemeMode,
} from "../../../store/slices/ThemeSlice";
import { Check } from "react-bootstrap-icons";
import Cookies from "js-cookie";
import GoBackButton from "../../Buttons/GoBackButton/GoBackButton";
import { RootState, AppDispatch } from "../../../store/store";

export default function Themes() {
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => state.theme.themeMode);
  const themeColor = useSelector((state: RootState) => state.theme.themeColor);
  const colorStyle = useSelector((state: RootState) => state.theme.colorStyle);

  const toggleTheme = (mode: string) => {
    dispatch(setThemeMode(mode));
    Cookies.set("themeMode", mode, { expires: 365 });
  };

  const changeThemeColor = (color: string, colorsObject: any) => {
    dispatch(setThemeColor(color));
    dispatch(setColors(colorsObject));
    Cookies.set("themeColor", color, { expires: 365 });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 text-textColor">
      <div className="flex items-center gap-3 mb-8 border-b border-bg15 pb-4">
        <GoBackButton />
        <h2 className="text-2xl font-bold">Themes & Appearance</h2>
      </div>

      <div className="flex flex-col gap-8">
        {/* Mode Selector */}
        <section className="p-6 rounded-2xl bg-bg10/80 border border-bg20 shadow-md">
          <h3 className="text-lg font-bold mb-4">Theme Mode</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => toggleTheme("white")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                themeMode === "white"
                  ? "border-themeColor bg-themeColor text-themeMode shadow-md"
                  : "border-bg20 hover:border-themeColor/50 bg-bg15 text-textColor"
              }`}
            >
              {themeMode === "white" && <Check className="text-lg" />}
              Light Mode
            </button>
            <button
              type="button"
              onClick={() => toggleTheme("black")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                themeMode === "black"
                  ? "border-themeColor bg-themeColor text-themeMode shadow-md"
                  : "border-bg20 hover:border-themeColor/50 bg-bg15 text-textColor"
              }`}
            >
              {themeMode === "black" && <Check className="text-lg" />}
              Dark Mode
            </button>
          </div>
        </section>

        {/* Accent Color Selector */}
        <section className="p-6 rounded-2xl bg-bg10/80 border border-bg20 shadow-md">
          <h3 className="text-lg font-bold mb-4">Accent Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              onClick={() =>
                changeThemeColor("grey", {
                  rgbBackground: "225, 225, 225",
                  rgbText: "38, 38, 38",
                  rgbAccent: "128, 128, 128",
                })
              }
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                themeColor === "grey"
                  ? "border-themeColor bg-bg20 shadow"
                  : "border-bg20 hover:border-bg30 bg-bg15/60"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white shadow">
                {themeColor === "grey" && (
                  <Check className="text-sm font-bold" />
                )}
              </div>
              <span className="text-xs font-semibold">Default</span>
            </div>

            {colorStyle.map((item, index) => (
              <div
                key={index}
                onClick={() => changeThemeColor(item.color, item.colors)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  themeColor === item.color
                    ? "border-themeColor bg-bg20 shadow"
                    : "border-bg20 hover:border-bg30 bg-bg15/60"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow"
                  style={{ backgroundColor: item.color }}
                >
                  {themeColor === item.color && (
                    <Check className="text-sm font-bold" />
                  )}
                </div>
                <span className="text-xs font-semibold">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
