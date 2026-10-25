import React from "react";
import { CheckCircleFill } from "react-bootstrap-icons";

interface SuccessBarProps {
  msg: string;
}

export default function SuccessBar({ msg }: SuccessBarProps) {
  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 p-3 text-base md:text-lg w-[min(400px,90vw)] rounded-xl flex items-center bg-emerald-600 text-white shadow-lg transition-all animate-slideDown">
      <CheckCircleFill className="mr-2.5 text-xl text-emerald-200 drop-shadow flex-shrink-0" />
      <span>{msg}</span>
    </div>
  );
}
