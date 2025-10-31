"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, FileVideo, FileAudio } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export function FileUpload({
  onFilesChange,
  acceptedTypes = [".mp4", ".mp3", ".pdf", ".docx", ".txt"],
  maxSize = 50,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [files]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      processFiles(selectedFiles);
    },
    [files]
  );

  const processFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const updatedFiles = [...files, ...uploadedFiles];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("video")) return <FileVideo className="h-5 w-5" />;
    if (type.includes("audio")) return <FileAudio className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer",
          isDragging
            ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/5"
            : "border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50"
        )}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-4 bg-[rgb(var(--card))] rounded-full">
              <Upload className="h-8 w-8 text-[rgb(var(--primary))]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">
              Arraste vídeos, áudios ou textos seus aqui
            </p>
            <p className="text-xs text-[rgb(var(--foreground-secondary))] mt-1">
              ou clique para selecionar
            </p>
          </div>
          <p className="text-xs text-[rgb(var(--foreground-secondary))]">
            Formatos: {acceptedTypes.join(", ")} • Máximo {maxSize}MB
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--card))] border border-[rgb(var(--border))] group hover:border-[rgb(var(--primary))]/50 transition-all"
            >
              <div className="text-[rgb(var(--primary))]">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-[rgb(var(--foreground-secondary))]">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="p-1 hover:bg-[rgb(var(--error))]/10 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4 text-[rgb(var(--error))]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
