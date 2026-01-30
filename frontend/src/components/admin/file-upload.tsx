'use client';

import { useState, useRef, useEffect } from 'react';

interface FileUploadProps {
  label: string;
  currentFile: string | null;
  onChange: (file: File) => void;
  accept?: string;
  helperText?: string;
}

export default function FileUpload({ 
  label, 
  currentFile, 
  onChange, 
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png",
  helperText = "Supported: PDF, Word, Excel, PowerPoint, Images"
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onChange(file);
    }
  };

  const getFileName = (filePath: string | null): string => {
    if (!filePath) return '';
    return filePath.split('/').pop() || '';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex flex-col gap-3">
        {/* Current File Display */}
        {currentFile && !selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-300 truncate">
                {getFileName(currentFile)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Current File</p>
            </div>
            <a 
              href={currentFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="View File"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </a>
          </div>
        )}

        {/* Selected File Display */}
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/30">
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-400 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-green-500/70 mt-0.5">
                Ready to upload • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-2 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors"
              title="Remove Selection"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full group relative overflow-hidden px-4 py-4 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
              selectedFile 
                ? 'bg-white/5 border-white/20 hover:border-white/30' 
                : 'bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5'
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${
              selectedFile ? 'bg-white/10 text-gray-300' : 'bg-white/5 text-gray-400 group-hover:text-purple-400 group-hover:bg-purple-500/10'
            }`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-center">
              <span className={`text-sm font-medium transition-colors ${
                selectedFile ? 'text-gray-300' : 'text-gray-400 group-hover:text-purple-300'
              }`}>
                {currentFile || selectedFile ? 'Change File' : 'Click to Upload'}
              </span>
              <p className="text-xs text-gray-500 mt-1">{helperText}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
