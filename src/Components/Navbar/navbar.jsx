import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink, Outlet } from "react-router-dom";
import "./navbar.css";
import { List, PersonFill, X } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import CustomSelect from "../ThemeSelect/ThemeSelect";
import ThemeSelect from "../ThemeSelect/ThemeSelect";

function Navbar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profile = useSelector((state) => state.user.profile);
  const isLogin = useSelector((state) => state.user.isLogin);

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleNavlinkClick = () => {
    setIsMenuOpen(false);
  };
  return (
    <>
      <header>
        <style>
          {`
          #list{
            display:${isMenuOpen ? "block" : "none"};
          }
          @media (min-width: 500px){
            #list{
              display:inline-flex;
            }
          }
        `}
        </style>
        <nav className="navbar">
          <h1 className="title">{props.title}</h1>
          <ul id="list" onClick={handleNavlinkClick}>
            <li>
              <NavLink onClick={handleNavlinkClick} className="link" to="/">
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={handleNavlinkClick}
                className="link"
                to="/about"
              >
                <span>About</span>
              </NavLink>
            </li>
          </ul>
          <div className="icons">
            <label htmlFor="togglemenu" onClick={handleMenuToggle}>
              {isMenuOpen ? (
                <X className="icon menu" />
              ) : (
                <List className="icon menu" />
              )}
            </label>
            <input
              type="checkbox"
              id="togglemenu"
              checked={isMenuOpen}
              readOnly
            />
            {/* <ThemeSelect></ThemeSelect>  */}
            <NavLink
              onClick={handleNavlinkClick}
              className="link profilelink"
              to="/profile"
            >
              <div className="profile">
                {profile !== "" && isLogin ? (
                  <img src={profile} alt="" />
                ) : (
                  <PersonFill></PersonFill>
                )}
              </div>
            </NavLink>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Navbar;
