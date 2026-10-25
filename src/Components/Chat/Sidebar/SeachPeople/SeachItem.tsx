import React from "react";
import { PersonAdd, PersonFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { setSucessMsgUser, setErrorMsgUser } from "../../../../store/slices/UserSlice";
import { sendChatRequest } from "../../../../socket/main";
import { RootState, AppDispatch } from "../../../../store/store";

interface SeachItemProps {
  uid: string;
  username: string;
  profile?: string;
}

export default function SeachItem({ profile, username, uid }: SeachItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fromuid = useSelector((state: RootState) => state.user.uid);

  const handlePersonAdd = () => {
    sendChatRequest(fromuid, uid)
      .then((data) => dispatch(setSucessMsgUser(data)))
      .catch((error) => {
        console.error("Error sending request:", error);
        dispatch(setErrorMsgUser(error.message || "Failed to send request"));
      });
  };

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg15/80 border border-bg20 shadow-sm hover:border-themeColor/40 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-bg20 flex-shrink-0 flex items-center justify-center">
          {profile ? (
            <img src={profile} alt={username} className="w-full h-full object-cover" />
          ) : (
            <PersonFill className="text-xl text-textColor opacity-70" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm truncate">{username}</h4>
          <span className="text-[11px] opacity-60 font-mono">ID: {uid}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePersonAdd}
        className="p-2 rounded-xl bg-themeColor text-themeMode hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer ml-2"
        title="Send Chat Request"
      >
        <PersonAdd className="text-base" />
      </button>
    </div>
  );
}
