import React, { useEffect } from "react";
import GoBackButton from "../../Buttons/GoBackButton/GoBackButton";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAlwaysTranslate,
  changeLanguage,
  changeSummarizationFormat,
} from "../../../store/slices/UserSlice";
import { socket } from "../../../socket/main";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../../store/store";

export default function AISettings() {
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const navigate = useNavigate();

  const { alwaysTranslate, language } = useSelector(
    (state: RootState) => state.user.settings.translation,
  );
  const { format } = useSelector(
    (state: RootState) => state.user.settings.summarization,
  );

  const translationOptions = [
    { label: "Original", value: "original" },
    { label: "English", value: "english" },
    { label: "Spanish", value: "spanish" },
    { label: "Hindi", value: "hindi" },
    { label: "Marathi", value: "marathi" },
    { label: "French", value: "french" },
  ];

  const formatOptions = [
    { label: "Paragraph", value: "paragraph" },
    { label: "Bullet Points", value: "bullet" },
    { label: "Structured", value: "structured" },
  ];

  const handleLanguageChange = (newLang: string) => {
    dispatch(changeLanguage(newLang));
    socket.emit("settings:translate:languageChange", { language: newLang });
  };

  const handleAlwaysTranslateChange = (val: boolean) => {
    dispatch(changeAlwaysTranslate(val));
    socket.emit("settings:translate:alwaysTranslateChange", {
      alwaysTranslate: val,
    });
  };

  const handleFormatChange = (newFormat: string) => {
    dispatch(changeSummarizationFormat(newFormat));
    socket.emit("settings:summarization:formatChange", { format: newFormat });
  };

  useEffect(() => {
    if (!isLogin) {
      navigate(-1);
    }
  }, [isLogin, navigate]);

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 text-textColor">
      <div className="flex items-center gap-3 mb-8 border-b border-bg15 pb-4">
        <GoBackButton />
        <h2 className="text-2xl font-bold ">AI & Translation Settings</h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Translation Section */}
        <section className="p-6 rounded-2xl bg-bg10/80 border border-bg20 shadow-md flex flex-col gap-5">
          <h3 className="text-lg font-bold border-b border-bg15 pb-2">
            Message Translation
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-sm">Target Language</span>
              <p className="text-xs opacity-75">
                Language for received message translations
              </p>
            </div>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-bg15 border border-bg20 rounded-xl px-4 py-2 text-sm text-textColor focus:outline-none focus:border-themeColor cursor-pointer"
            >
              {translationOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-bg20 text-textColor"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-bg15">
            <div>
              <span className="font-semibold text-sm">Always Translate</span>
              <p className="text-xs opacity-75">
                Automatically translate incoming messages
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAlwaysTranslateChange(!alwaysTranslate)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                alwaysTranslate ? "bg-themeColor" : "bg-bg20"
              }`}
            >
              <div
                className={`bg-themeMode w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  alwaysTranslate ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Summarization Section */}
        <section className="p-6 rounded-2xl bg-bg10/80 border border-bg20 shadow-md flex flex-col gap-5">
          <h3 className="text-lg font-bold border-b border-bg15 pb-2">
            Chat Summarization
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-sm">Summary Format</span>
              <p className="text-xs opacity-75">
                Preferred format for double-tap date chat summaries
              </p>
            </div>
            <div className="flex gap-2">
              {formatOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFormatChange(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    format === opt.value
                      ? "border-themeColor bg-themeColor text-themeMode shadow"
                      : "border-bg20 bg-bg15 hover:border-themeColor/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
