import React from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { RootState } from "../../../store/store";

export default function SideProfile() {
  const profile = useSelector((state: RootState) => state.user.profile);
  const username = useSelector((state: RootState) => state.user.username);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-4 mb-2 rounded-2xl bg-bg15/60  text-center"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden mb-2 flex items-center justify-center bg-bg20 ">
        {profile ? (
          <img
            src={profile}
            alt={username}
            className="w-full h-full object-cover"
          />
        ) : (
          <PersonFill className="text-3xl opacity-70" />
        )}
      </div>
      <h2 className="text-base font-bold ">Welcome, {username}!</h2>
    </motion.div>
  );
}
