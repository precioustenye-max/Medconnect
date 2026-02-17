import { useState } from "react";
import { Upload, FileText, CheckCircle, Clock, X, Download } from 'lucide-react';
export default function ImageUpload() {
  const [preview, setPreview] = useState(null);
  const [fileInfo, setFileInfo] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a temporary browser URL
    const previewURL = URL.createObjectURL(file);

    setPreview(previewURL);
    setFileInfo(`${file.name} (${Math.round(file.size / 1024)} KB)`);
  };

  return (
    <div className=" ">
      <div className=" rounded-xl  mt-6">
        <h2 className="text-lg font-semibold text-center mb-4">
          
        </h2>

        <label className="cursor-pointer block">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="h-58 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-blue-300 p-4">
            {preview ? (
                <img
                src={preview}
                alt="Live Preview"
                className="w-full h-full object-cover"
                />
            ) : (
                <div className="text-gray-500 flex flex-col items-center gap-2">

                < Upload className="w-12 h-12 " />
                <span className="text-2xl py-3">Click to upload or drack and drop</span>

                <span className="text-xl">PDF,JPG,PNG (MAX 10MB)</span>
              </div>
            )}
          </div>
        </label>

        {fileInfo && (
          <p className="mt-3 text-sm text-gray-600 text-center">
            {fileInfo}
          </p>
        )}
      </div>
    </div>
  );
}
