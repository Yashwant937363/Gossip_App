import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { GearWide, List, PersonFill, X } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { changePreviousPath } from "../../store/slices/UISlice";
import { getUser, setAuthtoken } from "../../store/slices/UserSlice";
import { fetchFriends } from "../../store/slices/ChatSlice";
import Cookies from "js-cookie";
import { RootState, AppDispatch } from "../../store/store";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profile = useSelector((state: RootState) => state.user.profile);
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const authtoken = useSelector((state: RootState) => state.user.authtoken);
  const location = useLocation();

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavlinkClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const token = Cookies.get("authtoken");
    if (token) {
      dispatch(getUser({ authtoken: token }));
      dispatch(setAuthtoken(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLogin && authtoken) {
      dispatch(fetchFriends({ authtoken }));
    }
  }, [isLogin, authtoken, dispatch]);

  useEffect(() => {
    if (!location.pathname.startsWith("/settings")) {
      dispatch(changePreviousPath(location.pathname));
    }
  }, [location, dispatch]);

  return (
    <>
      <header className="relative z-50">
        <nav className="flex items-center justify-between sm:justify-center h-[45px] relative z-20 px-4 bg-bg10/80 backdrop-blur-md border-b border-bg15 text-textColor select-none">
          <h1 className="text-lg font-bold tracking-wide ">{title}</h1>

          <ul
            className={`${
              isMenuOpen
                ? "flex flex-col absolute top-[45px] left-0 w-full p-4 bg-bg10/95 backdrop-blur-md border-b border-bg20 shadow-xl sm:static sm:p-0 sm:flex-row sm:w-auto sm:border-none sm:shadow-none sm:bg-transparent"
                : "hidden sm:flex sm:flex-row sm:items-center sm:gap-6 sm:mx-auto"
            } items-center gap-4 transition-all duration-300`}
            onClick={handleNavlinkClick}
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-themeColor underline underline-offset-4 decoration-2"
                      : "text-textColor opacity-80 hover:opacity-100 hover:text-themeColor"
                  }`
                }
              >
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-themeColor underline underline-offset-4 decoration-2"
                      : "text-textColor opacity-80 hover:opacity-100 hover:text-themeColor"
                  }`
                }
              >
                <span>About</span>
              </NavLink>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="sm:hidden p-1 text-2xl text-textColor hover:text-themeColor transition-colors focus:outline-none"
              onClick={handleMenuToggle}
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X /> : <List />}
            </button>

            <NavLink
              to="/settings"
              onClick={handleNavlinkClick}
              className={({ isActive }) =>
                `w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border transition-all ${
                  isActive
                    ? "border-themeColor shadow-[0_0_8px_var(--theme-color)]"
                    : "border-bg20 hover:border-themeColor"
                }`
              }
            >
              {location.pathname !== "/chat" ? (
                <div className="w-full h-full flex items-center justify-center bg-bg15 text-textColor text-sm">
                  {profile && isLogin ? (
                    <img
                      src={profile}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <PersonFill className="text-base" />
                  )}
                </div>
              ) : (
                <GearWide className="text-base text-textColor hover:text-themeColor" />
              )}
            </NavLink>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
