import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import "./SideBar.css";
import {
  PeopleFill,
  PersonFillAdd,
  PersonFillSlash,
  PlusCircleFill,
} from "react-bootstrap-icons";
import SeachPeople from "./SeachPeople/SeachPeople";
import { useSelector } from "react-redux";
import SideProfile from "./SideProfile";
import { useHref, useLocation } from "react-router-dom";

export default function SideBar() {
  const path = useLocation();
  const requests = useSelector((state) => state.user.requests);
  const friends = useSelector((state) => state.chat.friends);
  const uid = useSelector((state) => state.user.uid);
  const [sortedFriends, setSortedFriends] = useState(new Array());
  const chats = useSelector((state) => state.chat.chats);
  const [addperson, setAddPerson] = useState(false);
  const url = useHref();
  const findLastMessageByUID = (uid) => {
    if (!uid) return;
    const reversedMessages = [...chats].reverse();
    for (const message of reversedMessages) {
      if (message.Sender_ID === uid || message.Receiver_ID === uid) {
        return message;
      }
    }
    let newDate = new Date();
    const newMessage = {
      Sender_ID: uid,
      Receiver_ID: uid,
      createdAt: newDate.toISOString(),
    };
    return newMessage;
  };

  useEffect(() => {
    let lastMessages = friends.map((value, index) => {
      return findLastMessageByUID(value.uid);
    });
    lastMessages = lastMessages.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const getFriendByUID = (uid) => {
      for (const friend of friends) {
        if (friend.uid === uid) return friend;
      }
    };
    let newFriendArray = lastMessages.map((value, index) => {
      return getFriendByUID(
        value.Sender_ID !== uid ? value.Sender_ID : value.Receiver_ID
      );
    });
    setSortedFriends(newFriendArray);
  }, [chats, friends]);

  return (
    <>
      <style>
        {`
          .sidebarlist{
            animation: ${
              path.pathname === "/chat"
                ? `
  fadein 0.4s ease-in forwards`
                : `none`
            }  ;
          }
        `}
      </style>
      <div className="sidebarlist">
        {url === "/chat" && <SideProfile />}
        <h3 className="chats">
          <span className="chatstext">Chats</span>
          {/* <div className='groupaddicon'>
                    <PeopleFill />
                    <PlusCircleFill className='pluscirclefill' />
                </div> */}
          <div className="addperson">
            {requests.length !== 0 ? <div className="reddot"></div> : null}
            <PersonFillAdd
              onClick={() => setAddPerson(!addperson)}
              className="addpersonicon"
            />
          </div>
        </h3>
        {addperson ? <SeachPeople></SeachPeople> : null}
        <ListItem
          username="Chatbot"
          uid={"chatbot"}
          profile=""
          online={true}
          lastMessage={""}
        ></ListItem>
        {friends.length !== 0 ? (
          sortedFriends.map((item, index) => (
            <ListItem
              key={index}
              username={item?.username}
              uid={item?.uid}
              profile={item?.profile}
              online={item?.online}
              lastMessage={findLastMessageByUID(item?.uid)}
            />
          ))
        ) : (
          <div className="nochats">
            <PersonFillSlash className="nochatsicon"></PersonFillSlash>
            <span>No Friends</span>
          </div>
        )}
      </div>
    </>
  );
}
