"use client";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const openWidget = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error: any, result: { event: string; info: { secure_url: string } }) => {
        if (!error && result && result.event === "success") {
          onChange(result.info.secure_url);
        }
      }
    );

    widget.open();
  };

  // If an image is already uploaded → show preview
  if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          alt="Uploaded"
          className="rounded-md size-40 object-cover"
        />

        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
        >
          Remove
        </button>
      </div>
    );
  }

  // If no image → show upload button
  return (
    <button
      type="button"
      onClick={openWidget}
      className="w-full p-4 border rounded-md text-center bg-gray-100"
    >
      Upload Image
    </button>
  );
}
