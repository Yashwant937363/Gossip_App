import React from "react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-textColor">
      <h2 className="text-3xl font-extrabold mb-6 tracking-tight border-b border-bg20 pb-3 text-themeColor">
        About Gossip AI
      </h2>
      <div className="space-y-5 text-base leading-relaxed opacity-90">
        <p>
          Gossip App is a project created by Yashwant Poyrekar to gain practical
          experience with modern web development technologies. It is a full-stack
          application built using Node.js, Express, Socket.IO, Groq AI, and React. The
          app allows users to chat with each other in real-time, share images, make video calls,
          and interact with an AI assistant.
        </p>
        <p>
          The frontend of Gossip App is developed using React, TypeScript, Redux Toolkit for
          state management, Tailwind CSS for modern styling, and React Router for navigation. It includes
          features such as user authentication, profile management, real-time messaging, AI translation,
          and conversation summarization.
        </p>
        <p>
          The backend of Gossip App is built using Node.js and Express,
          providing RESTful APIs with JWT authentication, managing chat
          sessions, handling file uploads, and integrating high-speed Groq Cloud AI models.
          Socket.IO is used for real-time messaging, presence sync, and WebRTC signaling.
        </p>
        <div className="mt-8 pt-4 border-t border-bg15">
          <p className="font-semibold mb-3">You can find the source code of Gossip App on GitHub:</p>
          <ul className="space-y-3 pl-2">
            <li>
              <a
                href="https://github.com/Yashwant937363/Gossip_App"
                target="_blank"
                rel="noreferrer"
                className="text-themeColor hover:underline font-medium inline-flex items-center gap-1"
              >
                Frontend GitHub repository →
              </a>{" "}
              <span className="opacity-75">- Contains the code for the React frontend of the Gossip App.</span>
            </li>
            <li>
              <a
                href="https://github.com/Yashwant937363/Gossip_Backend"
                target="_blank"
                rel="noreferrer"
                className="text-themeColor hover:underline font-medium inline-flex items-center gap-1"
              >
                Backend GitHub repository →
              </a>{" "}
              <span className="opacity-75">- Contains the code for the Node.js backend of the Gossip App.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
