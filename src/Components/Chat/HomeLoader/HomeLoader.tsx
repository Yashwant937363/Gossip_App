import React from "react";

export default function HomeLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-45px)] w-full overflow-hidden bg-bg5 text-textColor animate-pulse">
      {/* Sidebar skeleton */}
      <div className="h-full border-r border-bg20 bg-bg10/70 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center pb-2 border-b border-bg15">
          <div className="h-6 w-20 bg-bg20 rounded-md" />
          <div className="h-6 w-8 bg-bg20 rounded-md" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-bg15/40">
            <div className="w-12 h-12 rounded-full bg-bg20 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-bg20 rounded w-2/3" />
              <div className="h-3 bg-bg20 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Main chat window skeleton */}
      <div className="hidden md:flex flex-col items-center justify-center h-full p-8 text-center text-textColor opacity-40">
        <div className="w-16 h-16 rounded-full bg-bg20 mb-4" />
        <div className="h-4 bg-bg20 rounded w-48 mb-2" />
        <div className="h-3 bg-bg20 rounded w-32" />
      </div>
    </div>
  );
}
