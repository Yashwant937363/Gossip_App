import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setColors,
  setThemeColor,
  setThemeMode,
} from "../../../store/slices/ThemeSlice";
import { Check } from "react-bootstrap-icons";
import "./Themes.css";
import Cookies from "js-cookie";
import GoBackButton from "../../Buttons/GoBackButton/GoBackButton";

export default function Themes() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.themeMode);
  const themeColor = useSelector((state) => state.theme.themeColor);
  const colorStyle = useSelector((state) => state.theme.colorStyle);
  const colors = useSelector((state) => state.theme.colors);
  const toggleTheme = (e) => {
    dispatch(setThemeMode(e.target.value));
    Cookies.set("themeMode", e.target.value, { expires: 365 });
  };
  const changeThemeColor = (color, colorsObject) => {
    dispatch(setThemeColor(color));
    dispatch(setColors(colorsObject));
    console.log(colorsObject);
    Cookies.set("themeColor", color, { expires: 365 });
    Cookies.set("colors", colorsObject, { expires: 365 });
  };
  return (
    <div className="themepage mainpage">
      <style>
        {`
                .whitecheckmark:after{
                    display:${themeMode === "white" ? "block" : "none"}
                }
                .blackcheckmark:after{
                    display:${themeMode === "black" ? "block" : "none"}
                }
            `}
      </style>
      <h2 className="settings-heading">
        <GoBackButton /> Themes
      </h2>
      <div className="themes-section">
        <h3>Theme Mode</h3>
        <div className="thememodes">
          <label className="radio-container">
            light
            <input
              type="radio"
              name="thememode"
              id=""
              value="white"
              checked={themeMode === "white" && "checked"}
              onChange={toggleTheme}
            />
            <span className="checkmark whitecheckmark"></span>
          </label>
          <label className="radio-container">
            dark
            <input
              type="radio"
              name="thememode"
              id=""
              value="black"
              onChange={toggleTheme}
            />
            <span className="checkmark blackcheckmark"></span>
          </label>
        </div>
      </div>
      <div className="themes-section">
        <h3>Theme Colors</h3>
        <div className="colorlist">
          <div
            className="colorlistitem"
            onClick={() =>
              changeThemeColor("grey", {
                rgbBackground: "225, 225, 225",
                rgbText: "38, 38, 38",
                rgbAccent: "128, 128, 128",
              })
            }
          >
            <div className="color defaultcolor">
              {"grey" === themeColor && <Check className="checkicon" />}
            </div>
            <div className="name">Default</div>
          </div>
          {colorStyle.map((value, index) => (
            <div
              key={index}
              className="colorlistitem"
              onClick={() => changeThemeColor(value.color, value.colors)}
            >
              <div className="color" style={{ backgroundColor: value.color }}>
                {value.color === themeColor && <Check className="checkicon" />}
              </div>
              <div className="name">{value.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
