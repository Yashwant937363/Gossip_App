import React from "react";
import { PersonAdd, PersonFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { setSucessMsgUser } from "../../../../store/slices/UserSlice";
import { sendChatRequest } from "../../../../socket/main";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

export default function SeachItem(props) {
  const dispatch = useDispatch();
  const fromuid = useSelector((state) => state.user.uid);
  const { profile, username, uid } = props;
  const handlePersonAdd = () => {
    sendChatRequest(fromuid, uid)
      .then((data) => dispatch(setSucessMsgUser(data)))
      .catch((error) => console.log("Error : ", error));
  };
  return (
    <div className="searchandreqitem">
      {profile !== "" ? (
        <img src={profile} className="profileimg" />
      ) : (
        <div className="personfillicon">
          <PersonFill></PersonFill>
        </div>
      )}
      <div className="seachitemtext">
        <h3>{username}</h3>
        <div>{uid}</div>
      </div>
      <PersonAdd
        className="personaddicon"
        onClick={handlePersonAdd}
      ></PersonAdd>
    </div>
  );
}
