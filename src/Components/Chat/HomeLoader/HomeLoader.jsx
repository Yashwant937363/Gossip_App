import React from "react";
import "../Chat.css";
import "../Sidebar/SideBar.css";
import "./HomeLoader.css";

export default function HomeLoader() {
  return (
    <div className="chatpage homeloader">
      <div className="sidebarlist">
        <div className="chats">
          <span className="loading">Chats</span>
          <span className="loading">ok</span>
        </div>
        <div className="listItem">
          <div className="profileimgbox loading"></div>
          <div className="listItemtext">
            <h3 className="loading">something</h3>
            <div className="loading">something</div>
          </div>
        </div>
        <div className="listItem">
          <div className="profileimgbox loading"></div>
          <div className="listItemtext">
            <h3 className="loading">something</h3>
            <div className="loading">something</div>
          </div>
        </div>
        <div className="listItem">
          <div className="profileimgbox loading"></div>
          <div className="listItemtext">
            <h3 className="loading">something</h3>
            <div className="loading">something</div>
          </div>
        </div>
        <div className="listItem">
          <div className="profileimgbox loading"></div>
          <div className="listItemtext">
            <h3 className="loading">something</h3>
            <div className="loading">something</div>
          </div>
        </div>
        <div className="listItem">
          <div className="profileimgbox loading"></div>
          <div className="listItemtext">
            <h3 className="loading">something</h3>
            <div className="loading">something</div>
          </div>
        </div>
      </div>
      <div className="closedchat">
        <span className="loading">somethign to filll ok some more</span>
      </div>
    </div>
  );
}
