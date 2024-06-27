import React, { useState, useEffect, useRef } from "react";
import "./ThemeSelect.css";

export default function ThemeSelect() {
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Pick an option!");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsActive(false);
  };

  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  useEffect(() => console.log(isActive), [isActive]);
  return (
    <div
      className="wrapper-dropdown"
      ref={dropdownRef}
      onClick={handleDropdownToggle}
    >
      <span className="selected-display" id="destination">
        {selectedOption}
      </span>
      <svg
        className={`arrow ${isActive ? "rotated" : ""}`}
        id="drp-arrow"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 14.5l5-5 5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
      <ul className={`dropdown ${isActive ? "active" : ""}`}>
        {options.map((option, index) => (
          <li
            key={index}
            className="item"
            onClick={() => handleOptionClick(option)}
          >
            <div></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
