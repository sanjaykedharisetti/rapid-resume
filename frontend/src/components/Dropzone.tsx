import React, { useRef, useState } from "react";
import { UploadCloud, FileCheck, X, AlertCircle } from "lucide-react";

interface DropzoneProps {
  label: string;
  sublabel?: string;
  acceptText?: string;
  maxSizeBytes?: number;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  allowedExtensions?: string[];
}

export const Dropzone: React.FC<DropzoneProps> = ({
  label,
  sublabel = "PDF or DOCX",
  acceptText = "Maximum file size: 15 MB",
  maxSizeBytes = 15 * 1024 * 1024,
  selectedFile,
  onFileSelect,
  allowedExtensions = [".pdf", ".docx"],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setErrorMessage(null);
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(`Invalid file format '${ext}'. Please upload a ${allowedExtensions.join(" or ")} file.`);
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMessage(`File exceeds 15 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div>
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? "border-blue-500 bg-blue-50/70 scale-[1.01]"
              : "border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/70 shadow-xs"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                validateAndSelect(e.target.files[0]);
              }
            }}
            accept={allowedExtensions.join(",")}
            className="hidden"
          />

          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base font-bold text-slate-800 mb-1">{label}</h4>
          <p className="text-xs text-blue-600 font-semibold mb-2">{sublabel}</p>
          <p className="text-[11px] text-slate-400 mb-4">{acceptText}</p>

          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Browse File
          </button>
        </div>
      ) : (
        <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50/50 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold bg-emerald-200/80 text-emerald-800">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatFileSize(selectedFile.size)} &bull; Upload Validated
              </p>
            </div>
          </div>

          <button
            onClick={() => onFileSelect(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-colors"
            title="Remove File"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-2.5 flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
