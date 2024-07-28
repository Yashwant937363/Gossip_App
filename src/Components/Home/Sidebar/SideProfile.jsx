import React from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";

export default function SideProfile() {
  const profile = useSelector((state) => state.user.profile);
  const username = useSelector((state) => state.user.username);
  return (
    <div className="sideprofile">
      {profile !== "" ? (
        <img src={profile} className="profile" alt="" />
      ) : (
        <div className="profilewrapper profile">
          <PersonFill></PersonFill>
        </div>
      )}
      <h2>Welcome {username}</h2>
    </div>
  );
}
