import React, { useRef } from "react";
import { Facebook, Instagram, Twitter, Whatsapp } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import HeroBackground from "./HeroBackground";

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);

  const features = [
    {
      title: "Real-Time Translation",
      description:
        "Enables seamless communication between users who speak different languages and helps to break the language barrier.",
    },
    {
      title: "Chat Summarization",
      description:
        "Summarizes long conversations, saving time and making lengthy discussions easier to understand quickly.",
    },
    {
      title: "Auto-Generated Responses",
      description:
        "Generates automated replies based on previous messages, saving time by responding to common questions and repetitive messages.",
    },
    {
      title: "Personalized Chatbot",
      description:
        "Choose the personality and tone of the chatbot, like formal, friendly, or sarcastic. Features like funny replies, quotes, and memes make interactions engaging and fun.",
    },
    {
      title: "Virtual Background",
      description:
        "Replace your background with a custom image during video calls, or generate new background images to suit your mood or environment.",
    },
    {
      title: "Image Recognition",
      description:
        "Identify objects, landmarks, and other elements in images, adding an informative edge to your conversations.",
    },
  ];

  return (
    <div className="w-full text-textColor">
      <header
        ref={heroRef}
        className="relative flex flex-col justify-center items-center text-center px-4 overflow-hidden min-h-[calc(100vh-45px)]"
      >
        <HeroBackground heroRef={heroRef} />
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-themeColor drop-shadow-md">
          AI Powered Chat Application
        </h1>
        <p className="text-lg sm:text-2xl font-light opacity-90 max-w-xl mb-8">
          Engage more naturally and intelligently with next-gen AI features
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3.5 rounded-xl font-bold text-base sm:text-lg bg-themeColor text-themeMode shadow-lg hover:shadow-[0_0_20px_var(--theme-color)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Get Started
        </button>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-12 text-themeColor">
          Explore Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-bg10/60 border border-bg20 shadow-md hover:border-themeColor/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-3 text-themeColor">{item.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full py-10 border-t border-bg15 bg-bg5/50 mt-10">
        <div className="flex justify-center items-center gap-6 sm:gap-10 text-textColor">
          <a
            href="#"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 hover:text-themeColor transition-all text-sm font-medium"
          >
            <Facebook className="text-xl" />
            <span className="hidden sm:inline">Facebook</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 hover:text-themeColor transition-all text-sm font-medium"
          >
            <Instagram className="text-xl" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 hover:text-themeColor transition-all text-sm font-medium"
          >
            <Twitter className="text-xl" />
            <span className="hidden sm:inline">Twitter</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 hover:text-themeColor transition-all text-sm font-medium"
          >
            <Whatsapp className="text-xl" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
