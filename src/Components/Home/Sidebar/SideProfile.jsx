import React from "react";
import { useSelector } from "react-redux";

export default function SideProfile() {
  const profile = useSelector((state) => state.user.profile);
  const username = useSelector((state) => state.user.username);
  return (
    <div className="sideprofile">
      <img src={profile} className="profile" alt="" />
      <h2>Welcome {username}</h2>
    </div>
  );
}
