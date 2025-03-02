import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogTitle } from "./ui/Dialog";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// Helper function to create a centered crop with a specific aspect
function centerAspectCrop(mediaWidth, mediaHeight) {
  // Always use 1:1 aspect ratio
  const aspect = 1;

  // Calculate the size for the crop (use the smaller dimension to ensure it fits)
  const size = Math.min(
    90,
    (Math.min(mediaWidth, mediaHeight) / Math.max(mediaWidth, mediaHeight)) * 90
  );

  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: size,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper({
  open,
  onOpenChange,
  imageFile,
  onCropComplete,
}) {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [scale, setScale] = useState(1);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewRef = useRef(null);

  // Load the image when the component mounts or when imageFile changes
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result));
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  // When the image loads, set up an initial centered crop
  function onImageLoad(e) {
    const { width, height } = e.currentTarget;

    // Default to a centered square crop
    const initialCrop = centerAspectCrop(width, height);
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }

  // Update the preview image whenever crop or scale changes
  useEffect(() => {
    if (!completedCrop || !imgRef.current || !previewRef.current) return;

    const image = imgRef.current;
    const previewCanvas = previewRef.current;
    const ctx = previewCanvas.getContext("2d");

    // Set preview canvas to be square
    const size = 150; // Size of the preview
    previewCanvas.width = size;
    previewCanvas.height = size;

    // Clear the canvas with black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);

    // Calculate the crop area in pixels, accounting for scale
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate the visible portion of the image considering the zoom scale
    const visibleWidth = image.width / scale;
    const visibleHeight = image.height / scale;

    // Calculate the center point of the image
    const centerX = image.width / 2;
    const centerY = image.height / 2;

    // Calculate the top-left corner of the visible portion
    const visibleStartX = centerX - visibleWidth / 2;
    const visibleStartY = centerY - visibleHeight / 2;

    // Calculate the crop area relative to the visible portion
    const cropX = (completedCrop.x / 100) * image.width;
    const cropY = (completedCrop.y / 100) * image.height;
    const cropWidth = (completedCrop.width / 100) * image.width;
    const cropHeight = (completedCrop.height / 100) * image.height;

    // Draw the cropped image to the preview canvas
    ctx.drawImage(
      image,
      cropX * scaleX,
      cropY * scaleY,
      cropWidth * scaleX,
      cropHeight * scaleY,
      0,
      0,
      size,
      size
    );
  }, [completedCrop, scale]);

  // Generate the cropped image
  const getCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");

    // Account for the scaling factor applied to the displayed image
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate the actual crop dimensions
    const cropX = (completedCrop.x / 100) * image.width * scaleX;
    const cropY = (completedCrop.y / 100) * image.height * scaleY;
    const cropWidth = (completedCrop.width / 100) * image.width * scaleX;
    const cropHeight = (completedCrop.height / 100) * image.height * scaleY;

    // Set canvas dimensions to be a perfect square
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cropWidth, cropHeight);
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped image
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          blob.name = imageFile.name;
          const previewUrl = URL.createObjectURL(blob);

          // Create an Image object to verify dimensions
          const img = new Image();
          img.onload = () => {
            console.log(
              "Cropped image dimensions:",
              img.width,
              "x",
              img.height
            );
            resolve({
              blob,
              previewUrl,
              width: img.width,
              height: img.height,
            });
          };
          img.src = previewUrl;
        },
        "image/jpeg",
        1.0
      );
    });
  };

  const handleSave = async () => {
    try {
      const result = await getCroppedImage();
      if (result) {
        onCropComplete({
          croppedImage: result.blob,
          fullImage: imageFile,
          previewUrl: result.previewUrl,
          dimensions: {
            width: result.width,
            height: result.height,
          },
        });

        // Open the cropped image in a new tab
        window.open(result.previewUrl, "_blank");

        onOpenChange(false);
      }
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  // Handle zoom change
  const handleZoomChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-full bg-[#111111]">
        <DialogTitle className="text-xl font-semibold text-white">
          Crop Image
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-white text-sm">Zoom:</div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={handleZoomChange}
              className="w-3/4 accent-blue-500"
            />
          </div>

          {/* Main cropping area */}
          <div className="bg-[#0F0F0F] rounded-xl p-4 flex items-center justify-center relative h-[350px] overflow-hidden">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1} // Fixed 1:1 aspect ratio
                /*   className="max-h-[300px]"
                minWidth={50} */
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  /*  className="max-h-[300px] object-contain"
                  style={{ transform: `scale(${scale})` }} */
                />
              </ReactCrop>
            )}
          </div>

          {/* Preview section */}
          <div className="mt-2">
            <p className="text-white text-sm mb-2">Preview</p>
            <div className="bg-black rounded-lg overflow-hidden mx-auto">
              <canvas ref={previewRef} className="w-full h-full" />
            </div>
          </div>

          <p className="text-white/60 text-sm text-center">
            Drag to adjust the crop area and use the zoom slider to zoom in/out
          </p>

          <div className="flex justify-between gap-3 mt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-full bg-white text-[#111111] font-medium hover:bg-white/90 transition-colors"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

ImageCropper.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  imageFile: PropTypes.object,
  onCropComplete: PropTypes.func.isRequired,
};
