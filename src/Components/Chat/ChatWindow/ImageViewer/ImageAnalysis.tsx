import React from "react";
import { ImageAnalysisResult } from "../../../../types";

interface ImageAnalysisProps {
  description: ImageAnalysisResult;
}

export default function ImageAnalysis({ description }: ImageAnalysisProps) {
  return (
    <div className="flex flex-col gap-3 text-textColor p-4">
      <h3 className="text-lg font-bold text-themeColor">{description.title}</h3>
      <p className="text-sm opacity-90 leading-relaxed">{description.description}</p>

      {description.details && description.details.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-2 border-t border-bg20">
          <span className="text-xs font-semibold text-themeColor uppercase tracking-wider">
            Key Elements
          </span>
          <ul className="space-y-1">
            {description.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-xs opacity-80">
                <span className="text-themeColor font-bold">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {description.mood && (
        <div className="pt-2 border-t border-bg20 text-xs opacity-80">
          <span className="font-semibold text-themeColor">Mood: </span>
          <span>{description.mood}</span>
        </div>
      )}
    </div>
  );
}
