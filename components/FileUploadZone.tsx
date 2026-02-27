"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, X, CheckCircle } from "lucide-react";

interface FileUploadZoneProps {
  onFiles: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  label?: string;
  hint?: string;
}

export default function FileUploadZone({
  onFiles,
  accept = { "image/*": [".jpg", ".jpeg", ".png", ".webp"], "application/pdf": [".pdf"] },
  maxFiles = 4,
  label = "Upload Dokumen",
  hint = "Seret & lepas file di sini, atau klik untuk pilih",
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = [...files, ...accepted].slice(0, maxFiles);
    setFiles(newFiles);
    onFiles(newFiles);
  }, [files, maxFiles, onFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, maxFiles });

  const removeFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    onFiles(updated);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        {...getRootProps()}
        style={{
          border: isDragActive ? "2px solid #D4A017" : "2px dashed rgba(26,58,92,0.25)",
          borderRadius: 14,
          padding: "32px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: isDragActive ? "rgba(212,160,23,0.06)" : "rgba(26,58,92,0.03)",
          transition: "all 0.3s ease",
        }}
      >
        <input {...getInputProps()} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: isDragActive ? "linear-gradient(135deg, #D4A017, #F0C040)" : "rgba(26,58,92,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s",
          }}>
            <Upload size={24} color={isDragActive ? "#1A3A5C" : "#1A3A5C"} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#1A3A5C" }}>{label}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8899AA", marginTop: 4 }}>{hint}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(139,153,170,0.7)", marginTop: 3 }}>
              JPG, PNG, PDF · Max {maxFiles} file
            </div>
          </div>
        </div>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {files.map((file, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(46,125,82,0.06)",
              border: "1px solid rgba(46,125,82,0.2)",
            }}>
              <FileImage size={18} color="#2E7D52" />
              <div style={{ flex: 1, fontSize: 13, fontFamily: "var(--font-body)", color: "#1A3A5C", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </div>
              <CheckCircle size={16} color="#2E7D52" />
              <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <X size={14} color="#B5341A" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
