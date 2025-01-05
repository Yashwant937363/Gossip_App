import React from "react";
import { X } from "react-bootstrap-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ImageViewer.css";
import { motion } from "motion/react";

export default function ImageViewer() {
  const { layoutId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = location.state || {};
  const closeImage = () => {
    navigate(-1);
  };
  return (
    <div className="imageviewer fullscreen">
      <div onClick={closeImage}>
        <X className="icon" />
        close
      </div>
      <div className="viewimage center">
        <motion.img layoutId={layoutId} className="image" src={message} />
      </div>
    </div>
  );
}
