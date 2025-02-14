import React, { useEffect, useState } from "react";
import { ChevronCompactUp, X } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./ImageViewer.css";
import { getImageDescription } from "./../../../../socket/ai";
import { motion, useAnimate } from "motion/react";

export default function ImageViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = location.state || {};
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [descriptionRef, descriptionAnimate] = useAnimate();
  const [drawerIconRef, drawerIconAnimate] = useAnimate();
  const [description, setDescription] = useState(null);
  const [isPending, setPending] = useState(false);

  const closeImage = () => {
    navigate(-1);
  };
  const getDescription = async () => {
    setPending(true);
    const response = await getImageDescription({ url: message });

    console.log(response);
    setDescription(response);
    setPending(false);
  };
  const handleOpenDescription = () => {
    setDrawerOpen(isDrawerOpen ? false : true);
    if (!description) {
      if (isPending) {
        return;
      }
      getDescription();
    }
  };
  useEffect(() => {
    let duration = { duration: 0.4 };
    if (isDrawerOpen) {
      descriptionAnimate(
        descriptionRef.current,
        { height: "auto", opacity: 1, padding: "1rem" },
        duration
      );
      drawerIconAnimate(drawerIconRef.current, { rotate: 180 }, duration);
    } else {
      descriptionAnimate(
        descriptionRef.current,
        { height: 0, opacity: 0.5, padding: 0 },
        duration
      );
      drawerIconAnimate(drawerIconRef.current, { rotate: 0 }, duration);
    }
  }, [isDrawerOpen]);
  return (
    <div className="imageviewer fullscreen">
      <div onClick={closeImage}>
        <X className="icon" />
        close
      </div>
      <div className="viewimage center">
        <motion.img layoutId="openedimage" className="image" src={message} />
      </div>
      <div className="description-container">
        <motion.button
          className="drawer-btn btn"
          onClick={handleOpenDescription}
        >
          <motion.div ref={drawerIconRef}>
            <ChevronCompactUp className="drawer-icon" />
          </motion.div>
        </motion.button>
        <div ref={descriptionRef} className="description">
          {description ? (
            <span dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <div className="loader">
              <div className="loading">
                Lorem ipsum dolor sit amet consectetur adipisicing elit
              </div>
              <div className="loading">
                Lorem ipsum dolor sit amet consectetur adipisicing elit
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
