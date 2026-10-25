import React, { useState } from "react";
import "./ImageEditor.css";
import { ImageEditorComponent } from "@syncfusion/ej2-react-image-editor";
import { SendFill, X } from "react-bootstrap-icons";
import { registerLicense } from "@syncfusion/ej2-base";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../../socket/main";
import { apiUploadImage } from "../../../api/client";
import { RootState, AppDispatch } from "../../../store/store";

if (import.meta.env.VITE_EDITOR_LICENSE_KEY) {
  registerLicense(import.meta.env.VITE_EDITOR_LICENSE_KEY);
}

export default function ImageEditor() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const fromuid = useSelector((state: RootState) => state.user.uid);
  const [imgObj, setImageObject] = useState<any>(null);
  const [isImageOpen, setImageOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sendImage = async () => {
    if (!imgObj || !uid || uploading) return;
    setUploading(true);

    try {
      const imageData = imgObj.getImageData();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = imageData.width;
      canvas.height = imageData.height;
      ctx.putImageData(imageData, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );

      if (!blob) {
        throw new Error("Canvas export failed");
      }

      // Step 1: Upload image file to POST /api/chat/upload
      const uploadRes = await apiUploadImage(blob);

      // Step 2: Send URL over socket with type: "image"
      if (uploadRes?.url) {
        await sendMessage({
          fromuid,
          touid: uid,
          message: uploadRes.url,
          dispatch,
          type: "image",
        });
      }

      navigate(-1);
    } catch (error) {
      console.error("Error uploading & sending image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between">
      {/* Top cancel/close bar */}
      <div className="flex justify-between items-center p-3 bg-bg10/80 border-b border-bg20 z-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg15 hover:bg-bg20 text-textColor text-sm font-semibold transition-all cursor-pointer"
        >
          <X className="text-xl" />
          <span>Cancel</span>
        </button>
        <span className="text-xs font-semibold text-textColor opacity-75">
          Gossip Image Studio
        </span>
      </div>

      {/* Syncfusion Image Editor Component */}
      <div className="flex-1 w-full overflow-hidden relative">
        <ImageEditorComponent
          ref={(ref: any) => setImageObject(ref)}
          cssClass="image-editor-component"
          fileOpened={() => setImageOpen(true)}
          height={`${window.innerHeight - 90}px`}
          width="100vw"
        />

        {/* Send Action Floating Button */}
        <button
          type="button"
          onClick={sendImage}
          disabled={!isImageOpen || uploading}
          className={`absolute bottom-6 right-6 p-4 rounded-full font-bold shadow-2xl flex items-center justify-center transition-all cursor-pointer z-30 ${
            isImageOpen && !uploading
              ? "bg-themeColor text-themeMode hover:scale-110 active:scale-95 shadow-[0_0_20px_var(--theme-color)]"
              : "bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed"
          }`}
          title="Send edited image"
        >
          <SendFill className="text-xl" />
        </button>
      </div>
    </div>
  );
}
