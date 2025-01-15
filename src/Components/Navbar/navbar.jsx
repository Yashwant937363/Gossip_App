import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, Outlet, useHref, useLocation } from "react-router-dom";
import "./navbar.css";
import { GearWide, List, PersonFill, X } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { changePreviousPath } from "../../store/slices/UISlice";
import { getUser, setAuthtoken } from "../../store/slices/UserSlice";
import { fetchFriends } from "../../store/slices/ChatSlice";
import Cookies from "js-cookie";

function Navbar(props) {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profile = useSelector((state) => state.user.profile);
  const isLogin = useSelector((state) => state.user.isLogin);
  const authtoken = useSelector((state) => state.user.authtoken);
  const url = useHref();
  const location = useLocation();
  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleNavlinkClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const authtoken = Cookies.get("authtoken");
    if (authtoken) {
      dispatch(getUser({ authtoken }));
      dispatch(setAuthtoken(authtoken));
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      dispatch(fetchFriends({ authtoken }));
    }
  }, [isLogin]);

  useEffect(() => {
    if (!location.pathname.startsWith("/settings")) {
      dispatch(changePreviousPath(location.pathname));
    }
  }, [location]);
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
            <label
              htmlFor="togglemenu"
              className="togglemenu"
              onClick={handleMenuToggle}
            >
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
            <NavLink
              onClick={handleNavlinkClick}
              className="link profilelink"
              to="/settings"
            >
              {url !== "/chat" ? (
                <div className="profile">
                  {profile !== "" && isLogin ? (
                    <img src={profile} alt="" />
                  ) : (
                    <PersonFill></PersonFill>
                  )}
                </div>
              ) : (
                <GearWide className="settingicon"></GearWide>
              )}
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
