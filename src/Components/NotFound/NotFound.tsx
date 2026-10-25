import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-45px)] text-center px-4 text-textColor">
      <h1 className="text-7xl font-extrabold text-themeColor mb-4 tracking-wider">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="opacity-75 max-w-md mb-6">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-themeColor text-themeMode font-semibold hover:opacity-90 transition-all shadow-md"
      >
        Back to Home
      </Link>
    </div>
  );
}
