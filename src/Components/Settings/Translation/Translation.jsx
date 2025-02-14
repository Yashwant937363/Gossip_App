import React, { useEffect } from "react";
import GoBackButton from "../../Buttons/GoBackButton/GoBackButton";
import ReactDropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAlwaysTranslate,
  changeLanguage,
} from "../../../store/slices/UserSlice";
import { AnimatePresence, motion } from "motion/react";
import { socket } from "./../../../socket/main";

export default function Translation() {
  const dispatch = useDispatch();
  const authtoken = useSelector((state) => state.user.authtoken);

  const { alwaysTranslate, language } = useSelector(
    (state) => state.user.settings.translation
  );
  const options = ["Hindi", "Marathi", "English", "Spanish", "Punjabi"];
  const handleLanguageOnChange = (value) => {
    const lang = value.value.toLowerCase();
    dispatch(changeLanguage(lang));
    socket.emit("settings:translate:languageChange", {
      authtoken,
      language: lang,
    });
  };

  const handleAlwaysTranslate = (value) => {
    dispatch(changeAlwaysTranslate(value));
    socket.emit("settings:translate:alwaysTranslateChange", {
      authtoken,
      alwaysTranslate: value,
    });
  };

  return (
    <div className="mainpage translation">
      <div>
        <h2 className="settings-heading">
          <GoBackButton />
          Trasnlation
        </h2>
        <div className="setting-item">
          <span className="center">Language</span>
          <ReactDropdown
            options={options}
            value={language}
            onChange={handleLanguageOnChange}
            placeholder="Select a Language"
          />
        </div>
        <div className="setting-item">
          <span className="center">Always Translate</span>
          <div className="yes-no-switch">
            <motion.div
              layout
              initial={{ x: alwaysTranslate ? 0 : 50 }} // Start position
              animate={{ x: alwaysTranslate ? 0 : 50 }}
              className="animate-container"
              style={{ display: "flex" }}
            >
              <motion.div layout></motion.div>
            </motion.div>
            <div
              className="text center"
              onClick={() => handleAlwaysTranslate(true)}
            >
              Yes
            </div>
            <div
              className="text center"
              onClick={() => handleAlwaysTranslate(false)}
            >
              No
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
