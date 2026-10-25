import React from "react";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

interface WarningBarProps {
  msg: string;
}

export default function WarningBar({ msg }: WarningBarProps) {
  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 p-3 text-base md:text-lg w-[min(400px,90vw)] rounded-xl flex items-center bg-amber-400 text-gray-900 font-medium shadow-lg transition-all animate-slideDown">
      <ExclamationTriangleFill className="mr-2.5 text-xl text-amber-900 drop-shadow flex-shrink-0" />
      <span>{msg}</span>
    </div>
  );
}
