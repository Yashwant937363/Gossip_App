import React from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

export default function SideProfile() {
  const profile = useSelector((state) => state.user.profile);
  const username = useSelector((state) => state.user.username);
  return (
    <motion.div
      initial={{ height: 0, paddingTop: 0, paddingBottom: 0 }}
      animate={{ height: "auto", paddingTop: 30, paddingBottom: 30 }}
      exit={{ height: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.4 }}
      className="sideprofile"
    >
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
