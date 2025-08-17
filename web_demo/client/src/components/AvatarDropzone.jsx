import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const AvatarDropzone = ({ setAvatarFile, setPreview, setAvatarError }) => {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setAvatarError(""); // Clear previous errors

      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === "file-too-large") {
          setAvatarError("Hình ảnh quá lớn. Kích thước tối đa là 5MB.");
        } else if (error.code === "file-invalid-type") {
          setAvatarError("Vui lòng chọn file hình ảnh (PNG, JPEG, JPG).");
        } else {
          setAvatarError("Lỗi khi chọn file. Vui lòng thử lại.");
        }
        setAvatarFile(null);
        setPreview("");
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setAvatarFile(file);

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [setAvatarFile, setPreview, setAvatarError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-2 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-600 font-medium">Thả hình ảnh tại đây...</p>
      ) : (
        <p className="text-gray-600 font-medium">
          Kéo và thả hình ảnh tại đây, hoặc nhấp để chọn file (PNG, JPEG, tối đa
          5MB)
        </p>
      )}
    </div>
  );
};

export default AvatarDropzone;
