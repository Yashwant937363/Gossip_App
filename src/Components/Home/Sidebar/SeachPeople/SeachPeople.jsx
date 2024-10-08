import React, { useEffect, useState } from "react";
import "./SearchPeople.css";
import SeachItem from "./SeachItem";
import { useSelector } from "react-redux";
import RequestItem from "./RequestItem";
import { findusers } from "../../../../socket/main";

export default function SeachPeople() {
  const [users, setUsers] = useState([]);
  const requests = useSelector((state) => state.user.requests);
  const handleSearch = (input) => {
    if (input.length != 0) {
      findusers(input)
        .then((users) => {
          setUsers(users);
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    } else {
      setUsers([]);
    }
  };

  return (
    <div className="searchpeople">
      <input
        type="text"
        className="searchfield"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="searchandreqitems">
        {users && users.length > 0 ? (
          users.map((item, index) => (
            <SeachItem
              key={index}
              profile={item.profile}
              uid={item.uid}
              username={item.username}
            />
          ))
        ) : (
          <span>Users not found</span>
        )}
      </div>
      {requests.length !== 0 ? (
        <div className="userrequest searchandreqitems">
          <h3>Requests</h3>
          {requests.map((item, index) => (
            <RequestItem
              key={index}
              profile={item.profile}
              uid={item.uid}
              username={item.username}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
