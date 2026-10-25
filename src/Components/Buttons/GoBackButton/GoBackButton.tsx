import React from "react";
import { ChevronLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

interface GoBackButtonProps extends React.ComponentProps<typeof ChevronLeft> {
  className?: string;
}

export default function GoBackButton({ className = "", ...props }: GoBackButtonProps) {
  const navigate = useNavigate();
  return (
    <ChevronLeft
      {...props}
      className={`mr-1.5 cursor-pointer sm:hidden ${className}`}
      onClick={() => navigate(-1)}
    />
  );
}
