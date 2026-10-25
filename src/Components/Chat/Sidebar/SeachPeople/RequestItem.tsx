import React from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  removeRequest,
  setSucessMsgUser,
} from "../../../../store/slices/UserSlice";
import { addFriend } from "../../../../store/slices/ChatSlice";
import { requestAnswer } from "../../../../socket/main";
import { motion } from "motion/react";
import { RootState, AppDispatch } from "../../../../store/store";

interface RequestItemProps {
  uid: string;
  username: string;
  profile?: string;
}

export default function RequestItem({ profile, username, uid }: RequestItemProps) {
  const touid = useSelector((state: RootState) => state.user.uid);
  const tousername = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch<AppDispatch>();

  const answerRequest = async (answer: boolean) => {
    const fromuid = uid;
    try {
      const res = await requestAnswer({
        fromuid,
        touid,
        answer,
        tousername,
      });
      dispatch(setSucessMsgUser(res));
      if (answer) {
        dispatch(addFriend({ uid, profile: profile || "", username, online: true }));
      }
      dispatch(removeRequest(fromuid));
    } catch (err: any) {
      console.log("Error While Answering Request: ", err);
    }
  };

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg15/90 border border-bg20 shadow-sm">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-bg20 flex-shrink-0 flex items-center justify-center">
          {profile ? (
            <img src={profile} alt={username} className="w-full h-full object-cover" />
          ) : (
            <PersonFill className="text-lg text-textColor opacity-70" />
          )}
        </div>
        <h4 className="font-bold text-xs truncate max-w-[100px]">{username}</h4>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
          onClick={() => answerRequest(true)}
        >
          Accept
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-all cursor-pointer"
          onClick={() => answerRequest(false)}
        >
          Reject
        </motion.button>
      </div>
    </div>
  );
}
