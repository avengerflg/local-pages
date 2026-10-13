'use client';

import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  X, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';

const MAX_FILES = 10;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png', 'webp', 'pdf', 'doc', 'docx'];
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface AttachmentUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
}

export function AttachmentUploader({
  files,
  onFilesChange,
  error: externalError,
}: AttachmentUploaderProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    setInternalError(null);
    const validToAdd: File[] = [];

    if (files.length + newFiles.length > MAX_FILES) {
      setInternalError(`You can upload a maximum of ${MAX_FILES} attachments.`);
      return;
    }

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
      const isValidMime = ALLOWED_MIME_TYPES.includes(file.type) || isValidExt;

      if (!isValidExt && !isValidMime) {
        setInternalError(`"${file.name}" is not a supported file type. Allowed: JPG, PNG, WEBP, PDF, DOC, DOCX.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setInternalError(`"${file.name}" exceeds the maximum 10MB file size limit.`);
        return;
      }

      validToAdd.push(file);
    }

    onFilesChange([...files, ...validToAdd]);
  };

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4" data-testid="attachment-uploader">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpeg,.jpg,.png,.webp,.pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndAddFiles(e.target.files);
            e.target.value = '';
          }
        }}
        data-testid="file-input"
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-brand-pink bg-rose-50/50 scale-[1.01]'
            : 'border-slate-200 hover:border-brand-pink/50 hover:bg-slate-50/60 bg-white'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h4 className="font-heading text-sm font-bold text-brand-navy mb-1">
          Upload Job Photos & Documentation
        </h4>
        <p className="text-xs text-slate-500 mb-3 max-w-sm mx-auto">
          Drag and drop images or blueprints, or <span className="text-brand-pink font-bold">browse your device</span>.
        </p>
        <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-2">
          <span>Supported: JPG, PNG, WEBP, PDF, DOCX</span>
          <span>•</span>
          <span>Up to 10MB per file</span>
          <span>•</span>
          <span>Max 10 files</span>
        </div>
      </div>

      {/* Error message */}
      {(internalError || externalError) && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-semibold" role="alert" data-testid="attachment-error">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{internalError || externalError}</span>
        </div>
      )}

      {/* Previews List */}
      {files.length > 0 && (
        <div className="space-y-2 mt-4" data-testid="attachments-preview-list">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Attached Files ({files.length} / {MAX_FILES})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {files.map((file, idx) => {
              const isImage = file.type.startsWith('image/');
              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-sm hover:border-slate-300 transition-colors"
                  data-testid={`attachment-item-${idx}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      {isImage ? (
                        <ImageIcon className="w-4 h-4 text-brand-pink" />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Remove attachment"
                    data-testid={`remove-attachment-${idx}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privacy Guarantee Note */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Photos and documents are stored privately with pre-signed access for quoting tradies only.</span>
      </div>
    </div>
  );
}
