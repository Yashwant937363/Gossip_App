import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeColor, setThemeMode } from "../../../store/slices/ThemeSlice";
import { Check } from "react-bootstrap-icons";
import "./Themes.css";

export default function Themes() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.themeMode);
  const themeColor = useSelector((state) => state.theme.themeColor);
  const colorStyle = useSelector((state) => state.theme.colorStyle);
  console.log(colorStyle);
  const changeTheme = () => {
    // logic to change css variables
  };
  const toggleTheme = (e) => {
    dispatch(setThemeMode(e.target.value));
  };
  const changeThemeColor = (color) => {
    dispatch(setThemeColor(color));
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
      <h3> Theme Mode</h3>
      <div className="thememodes">
        <label class="radio-container">
          light
          <input
            type="radio"
            name="thememode"
            id=""
            value="white"
            checked={themeMode === "white" && "checked"}
            onChange={toggleTheme}
          />
          <span class="checkmark whitecheckmark"></span>
        </label>
        <label class="radio-container">
          dark
          <input
            type="radio"
            name="thememode"
            id=""
            value="black"
            onChange={toggleTheme}
          />
          <span class="checkmark blackcheckmark"></span>
        </label>
      </div>
      <div>
        <h3>Theme Colors</h3>
        <div className="colorlist">
          {colorStyle.map((value, index) => (
            <div
              key={index}
              className="colorlistitem"
              onClick={() => changeThemeColor(value.color)}
            >
              <div className="color" style={{ backgroundColor: value.color }}>
                {value.color === themeColor && (
                  <Check style={{ opacity: 0.6 }} />
                )}
              </div>
              <div className="name">{value.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
