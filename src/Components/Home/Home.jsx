import { Facebook, Instagram, Twitter, Whatsapp } from "react-bootstrap-icons";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import WavingLine from "./WavingLine";
import { useRef } from "react";
import HeroBackground from "./HeroBackground";

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef();
  const features = [
    {
      title: "Real-Time Translation",
      descripiton:
        "Enables seamless communication between users who speak different languages and helps to break the language barrier.",
    },
    {
      title: "Chat Summarization",
      descripiton:
        "Summarizes long conversations, saving time and making lengthy discussions easier to understand quickly.",
    },
    {
      title: "Auto-Generated Responses",
      descripiton:
        "Generates automated replies based on previous messages, saving time by responding to common questions and repetitive messages.",
    },
    {
      title: "Personalized Chatbot",
      descripiton:
        "Choose the personality and tone of the chatbot, like formal, friendly, or sarcastic. Features like funny replies, quotes, and memes make interactions engaging and fun.",
    },
    {
      title: "Virtual Background",
      descripiton:
        "Replace your background with a custom image during video calls, or generate new background images to suit your mood or environment.",
    },
    {
      title: "Image Recognition",
      descripiton:
        "Identify objects, landmarks, and other elements in images, adding an informative edge to your conversations.",
    },
  ];
  return (
    <div className="home">
      <header className="hero-container" ref={heroRef}>
        <HeroBackground heroRef={heroRef}></HeroBackground>
        <h1>AI Powered Chat Application</h1>
        <p>engage more with AI</p>
        <button onClick={() => navigate("/login")}>Get Started</button>
      </header>
      <div className="features-container">
        <h2>Features</h2>
        <div className="features-list">
          {features.map((item, index) => (
            <div className="feature-item" key={index}>
              <h3>{item.title}</h3>
              <p>{item.descripiton}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <div className="social">
          <a href="#" className="social-item">
            <Facebook className="social-icon"></Facebook>
            <span className="social-text">facebook</span>
          </a>
          <a href="#" className="social-item">
            <Instagram className="social-icon"></Instagram>
            <span className="social-text">instagram</span>
          </a>
          <a href="#" className="social-item">
            <Twitter className="social-icon"></Twitter>
            <span className="social-text">twiter</span>
          </a>
          <a href="#" className="social-item">
            <Whatsapp className="social-icon"></Whatsapp>
            <span className="social-text">whatsapp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
