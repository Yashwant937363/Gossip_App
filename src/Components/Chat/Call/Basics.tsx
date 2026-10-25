import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useState } from "react";

export const Basics = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("7687706453784212a454267521654b1a");
  const [channel, setChannel] = useState("channel_name_test");
  const [token, setToken] = useState("");

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <div className="p-4 flex flex-col gap-4">
      {isConnected ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="h-60 rounded-xl overflow-hidden bg-black">
            <LocalUser
              audioTrack={localMicrophoneTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              videoTrack={localCameraTrack}
            >
              <span className="p-2 text-white text-xs">You</span>
            </LocalUser>
          </div>
          {remoteUsers.map((user) => (
            <div className="h-60 rounded-xl overflow-hidden bg-black" key={user.uid}>
              <RemoteUser user={user}>
                <span className="p-2 text-white text-xs">{user.uid}</span>
              </RemoteUser>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <input
            className="p-2 bg-bg15 border border-bg20 rounded-xl text-sm"
            onChange={(e) => setAppId(e.target.value)}
            placeholder="App ID"
            value={appId}
          />
          <input
            className="p-2 bg-bg15 border border-bg20 rounded-xl text-sm"
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Channel Name"
            value={channel}
          />
          <input
            className="p-2 bg-bg15 border border-bg20 rounded-xl text-sm"
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token (optional)"
            value={token}
          />

          <button
            className="py-2.5 rounded-xl bg-themeColor text-themeMode font-semibold"
            disabled={!appId || !channel}
            onClick={() => setCalling(true)}
          >
            Join Channel
          </button>
        </div>
      )}
    </div>
  );
};
