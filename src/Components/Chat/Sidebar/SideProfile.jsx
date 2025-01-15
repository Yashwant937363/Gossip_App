import React from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

export default function SideProfile() {
  const profile = useSelector((state) => state.user.profile);
  const username = useSelector((state) => state.user.username);
  return (
    <motion.div exit={{ height: 0, padding: 0 }} className="sideprofile">
      {profile !== "" ? (
        <img src={profile} className="profile" alt="" />
      ) : (
        <div className="profilewrapper profile">
          <PersonFill></PersonFill>
        </div>
      )}
      <h2>Welcome {username}</h2>
    </motion.div>
  );
}
