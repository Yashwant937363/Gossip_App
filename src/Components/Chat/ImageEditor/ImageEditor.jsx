import React, { useEffect, useState } from "react";
import "./ImageEditor.css";
import { ImageEditorComponent } from "@syncfusion/ej2-react-image-editor";
import { SendFill } from "react-bootstrap-icons";
import { registerLicense } from "@syncfusion/ej2-base";
import {
  UNSAFE_DataRouterContext,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../../socket/main";

registerLicense(import.meta.env.VITE_EDITOR_LICENSE_KEY);

export default function ImageEditor() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fromuid = useSelector((state) => state.user.uid);
  const [imgObj, setImageObject] = useState(null);
  const [isImageOpen, setImageOpen] = useState(false);
  const sendImage = async () => {
    try {
      const imageData = imgObj.getImageData();

      // Create a canvas and draw the image on it
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      ctx.putImageData(imageData, 0, 0);

      // Convert the canvas to a Blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob), "image/png")
      );

      // Convert the Blob to an ArrayBuffer
      const arrayBuffer = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
      });

      // Create the message object
      const message = {
        data: arrayBuffer,
        name: "image.png", // Optional: You can include metadata like the name
        type: blob.type, // MIME type of the image
      };

      // Log the message for debugging
      console.log(message);

      // Send the message
      sendMessage({
        fromuid: fromuid,
        touid: uid,
        message: message,
        dispatch,
        type: "image",
      });
      navigate(-1);
    } catch (error) {
      console.error("Error while sending image:", error);
    }
  };

  return (
    <div className="editor fullscreen">
      <ImageEditorComponent
        ref={(ref) => setImageObject(ref)}
        cssClass="image-editor-component"
        fileOpened={() => setImageOpen(true)}
        height={`${window.innerHeight - 45}px`}
        width="100vw"
      />
      <button
        className={`btn btn-send-image ${isImageOpen ? "" : "disabled"}`}
        onClick={sendImage}
        disabled={!isImageOpen}
      >
        <SendFill className="icon"></SendFill>
      </button>
    </div>
  );
}
