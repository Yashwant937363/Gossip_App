import React from 'react';
import './About.css'; // Import CSS file for About component styles

const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-heading">About</h2>
      <div className="about-content">
        <p>
          Gossip App is a project created by Yashwant Poyrekar to gain practical experience with web development technologies.
          It is a full-stack application built using Node.js, Express, Socket.io, and React.
          The app allows users to chat with each other in real-time.
        </p>
        <p>
          The frontend of the Gossip App is developed using React, Redux for state management, and React Router for navigation.
          It includes features such as user authentication, profile management, and real-time chat functionalities.
        </p>
        <p>
          The backend of the Gossip App is built using Node.js and Express, providing RESTful APIs for user authentication, managing chat sessions, and handling user data.
          Socket.io is used for enabling real-time communication between clients and the server.
        </p>
        <p>
          You can find the source code of the Gossip App on GitHub:
        </p>
        <ul className="about-links">
          <li>
            <a href="https://github.com/Yashwant937363/Gossip_App">Frontend GitHub repository</a> - Contains the code for the React frontend of the Gossip App.
          </li>
          <li>
            <a href="https://github.com/Yashwant937363/Gossip_Backend">Backend GitHub repository</a> - Contains the code for the Node.js backend of the Gossip App.
          </li>
        </ul>
        <p>
          Feel free to explore the code, contribute, or use it as a reference for your own projects.
        </p>
      </div>
    </div>
  );
};

export default About;
