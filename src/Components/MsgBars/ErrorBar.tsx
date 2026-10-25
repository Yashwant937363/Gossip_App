import React from "react";
import { XCircleFill } from "react-bootstrap-icons";

interface ErrorBarProps {
  msg: string;
}

export default function ErrorBar({ msg }: ErrorBarProps) {
  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 p-3 text-base md:text-lg w-[min(400px,90vw)] rounded-xl flex items-center bg-rose-500 text-white shadow-lg transition-all animate-slideDown">
      <XCircleFill className="mr-2.5 text-xl text-rose-200 drop-shadow flex-shrink-0" />
      <span>{msg}</span>
    </div>
  );
}
