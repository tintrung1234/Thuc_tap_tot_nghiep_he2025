import { useDropzone } from "react-dropzone";

const AvatarDropzone = ({ setAvatarFile, setPreview, setAvatarError }) => {
  const maxSize = 2 * 1024 * 1024;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize,
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setAvatarFile(file);
      setAvatarError("");

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    },
    onDropRejected: (fileRejections) => {
      if (!fileRejections.length) return;
      const errorCode = fileRejections[0].errors[0].code;

      if (errorCode === "file-invalid-type") {
        setAvatarError("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP.");
      } else if (errorCode === "file-too-large") {
        setAvatarError("Dung lượng ảnh vượt quá 2MB.");
      } else {
        setAvatarError("Tệp không hợp lệ.");
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`p-4 border-2 border-dashed rounded cursor-pointer transition ${
        isDragActive ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-sm text-gray-500">
        Kéo thả hoặc chọn ảnh (JPEG, PNG, WebP, ≤ 2MB)
      </p>
    </div>
  );
};

export default AvatarDropzone;
