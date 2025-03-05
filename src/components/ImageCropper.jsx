import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent } from "../components/ui/Dialog";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function ImageCropper({
  open,
  onOpenChange,
  imageFile,
  onCropComplete,
}) {
  const [imgSrc, setImgSrc] = useState("");
  const cropperRef = useRef(null);

  // Load image when imageFile changes
  useEffect(() => {
    if (imageFile && open) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgSrc(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImgSrc("");
    }
  }, [imageFile, open]);

  const handleSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    // Get cropped canvas
    const canvas = cropper.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      fillColor: "transparent",
    });

    if (!canvas) return;

    // Get crop dimensions
    const data = cropper.getData();
    const dimensions = {
      width: Math.round(data.width),
      height: Math.round(data.height),
      x: Math.round(data.x),
      y: Math.round(data.y),
    };

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }

        // Create URL for preview
        const previewUrl = URL.createObjectURL(blob);

        // Return data in the format expected by handleCropComplete
        onCropComplete({
          croppedImage: blob,
          fullImage: imageFile, // Pass the original image file
          previewUrl: previewUrl,
          dimensions: dimensions,
        });

        onOpenChange(false);
      },
      "image/jpeg",
      1
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-[#1A1A1A] border-[#333] text-white">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[#333]">
            <h2 className="text-xl font-semibold">Crop Image</h2>
            <p className="text-sm text-gray-400">
              Drag to reposition. Use handles to resize.
            </p>
          </div>

          <div className="p-4 flex-1 overflow-hidden">
            {imgSrc ? (
              <Cropper
                src={imgSrc}
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={16 / 9}
                guides={true}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                ref={cropperRef}
              />
            ) : (
              <div className="flex items-center justify-center h-[400px] bg-[#222] rounded-md">
                <p className="text-gray-400">Loading image...</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#333] flex justify-end space-x-3">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-full bg-[#333] text-white hover:bg-[#444] transition-colors"
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
