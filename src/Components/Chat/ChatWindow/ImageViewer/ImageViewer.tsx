import React, { useState } from "react";
import { ChevronCompactUp, X } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getImageDescription } from "../../../../socket/ai";
import { motion } from "motion/react";
import ImageAnalysis from "./ImageAnalysis";
import { ImageAnalysisResult } from "../../../../types";

export default function ImageViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = (location.state as { message?: string }) || {};
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [description, setDescription] = useState<ImageAnalysisResult | null>(null);
  const [isPending, setPending] = useState(false);

  const closeImage = () => {
    navigate(-1);
  };

  const getDescription = async () => {
    if (!message) return;
    setPending(true);
    try {
      const response = await getImageDescription({ url: message });
      setDescription(response);
    } catch (err) {
      console.error("Image analysis failed:", err);
    } finally {
      setPending(false);
    }
  };

  const handleOpenDescription = () => {
    setDrawerOpen(!isDrawerOpen);
    if (!description && !isPending) {
      getDescription();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between items-center overflow-hidden">
      {/* Top close button */}
      <div className="w-full flex justify-between items-center p-4 z-20">
        <button
          type="button"
          onClick={closeImage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all cursor-pointer"
        >
          <X className="text-xl" />
          <span>Close</span>
        </button>
      </div>

      {/* Main Image View */}
      <div className="flex-1 flex items-center justify-center p-4 max-h-[75vh]">
        {message ? (
          <motion.img
            src={message}
            alt="Expanded view"
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
          />
        ) : (
          <span className="text-white opacity-60">No image loaded</span>
        )}
      </div>

      {/* AI Description Drawer */}
      <div className="w-full max-w-xl z-20 flex flex-col items-center">
        <button
          type="button"
          onClick={handleOpenDescription}
          className="flex items-center justify-center p-2 rounded-t-2xl bg-bg10 border border-b-0 border-bg20 text-textColor w-28 hover:bg-bg15 transition-all cursor-pointer shadow-lg"
          title="Toggle AI Image Analysis"
        >
          <motion.div animate={{ rotate: isDrawerOpen ? 180 : 0 }}>
            <ChevronCompactUp className="text-2xl" />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{ height: isDrawerOpen ? "auto" : 0 }}
          className="w-full bg-bg10/95 backdrop-blur-md border-t border-bg20 overflow-hidden rounded-t-2xl shadow-2xl"
        >
          {isDrawerOpen && (
            <div className="p-4 max-h-60 overflow-y-auto">
              {description ? (
                <ImageAnalysis description={description} />
              ) : isPending ? (
                <div className="py-6 flex flex-col items-center justify-center text-center gap-2 text-textColor opacity-70">
                  <div className="w-6 h-6 border-2 border-themeColor border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Analyzing image with AI Vision model...</span>
                </div>
              ) : (
                <div className="py-4 text-center text-xs opacity-60">
                  Click arrow to generate analysis
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
