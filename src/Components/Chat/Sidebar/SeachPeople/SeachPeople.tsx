import React, { useState } from "react";
import SeachItem from "./SeachItem";
import { useSelector } from "react-redux";
import RequestItem from "./RequestItem";
import { findusers } from "../../../../socket/main";
import { apiSearchUsers } from "../../../../api/client";
import { RootState } from "../../../../store/store";

export default function SeachPeople() {
  const [users, setUsers] = useState<any[]>([]);
  const requests = useSelector((state: RootState) => state.user.requests);

  const handleSearch = async (input: string) => {
    const query = input.trim();
    if (query.length > 0) {
      try {
        // Try socket first, or fallback to REST endpoint from APIs.md
        const onlineUsers = await findusers(query).catch(() => null);
        if (onlineUsers && onlineUsers.length > 0) {
          setUsers(onlineUsers);
        } else {
          const restResult = await apiSearchUsers(query).catch(() => null);
          if (restResult?.users) {
            setUsers(
              restResult.users.map((u: any) => ({
                uid: u.uid,
                username: u.Username || u.username,
                profile: u.ProfilePicture || u.profile || "",
              }))
            );
          } else {
            setUsers([]);
          }
        }
      } catch (error: any) {
        console.error("Search error:", error);
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 mb-2 rounded-2xl bg-bg10 border border-bg20 shadow-md">
      <input
        type="text"
        placeholder="Search username or UID..."
        className="w-full px-3 py-2 text-xs rounded-xl bg-bg15 border border-bg20 text-textColor focus:outline-none focus:border-themeColor transition-all"
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Search results */}
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {users.length > 0 ? (
          users.map((item, index) => (
            <SeachItem
              key={index}
              profile={item.profile || item.ProfilePicture}
              uid={item.uid}
              username={item.username || item.Username}
            />
          ))
        ) : (
          <span className="text-xs opacity-50 text-center py-2">No users found</span>
        )}
      </div>

      {/* Pending requests */}
      {requests.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-bg15">
          <h4 className="text-xs font-bold text-themeColor tracking-wide uppercase">
            Incoming Requests ({requests.length})
          </h4>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {requests.map((item, index) => (
              <RequestItem
                key={index}
                profile={item.profile}
                uid={item.uid}
                username={item.username}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
