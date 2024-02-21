import React from "react";
import { PersonFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { changeOpenedChat } from "../../../store/slices/UISlice";
import { seenMessages } from "../../../store/socket";

export default function ListItem(props) {
  const dispatch = useDispatch();
  const useruid = useSelector((state) => state.user.uid);
  const openedchat = useSelector((state) => state.UIState.openedchat);
  const { profile, username, lastmessage, online, uid } = props;
  const OpenChat = () => {
    const touid = useruid;
    seenMessages({ fromuid: uid, touid: touid });
    dispatch(changeOpenedChat({ profile, uid, username, online }));
  };
  return (
    <div
      className={openedchat.uid === uid ? "openeditem listItem" : "listItem"}
      onClick={OpenChat}
    >
      <div className="profileimgbox">
        <div className={online ? "dot online" : "dot offline"}></div>
        {profile !== "" ? (
          <img src={profile} className="profileimg" />
        ) : (
          <div className="personfillicon">
            <PersonFill></PersonFill>
          </div>
        )}
      </div>
      <div className="listItemtext">
        <h3>{username}</h3>
        <div>{lastmessage}</div>
      </div>
    </div>
  );
}
