import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { Attachment } from '../../types';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  existingFiles?: Attachment[];
  onFileRemove?: (fileId: string) => void;
  maxSize?: number; // in bytes, default 2MB
  accept?: string;
}

const DEFAULT_MAX_SIZE = 2 * 1024 * 1024; // 2MB
const DEFAULT_ACCEPT = '.doc,.docx,.pdf,.xls,.xlsx,.png,.jpg,.jpeg';

export function FileUpload({
  onFileSelect,
  existingFiles = [],
  onFileRemove,
  maxSize = DEFAULT_MAX_SIZE,
  accept = DEFAULT_ACCEPT,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setError('');

    // Validate file size
    const invalidFiles = files.filter(file => file.size > maxSize);
    if (invalidFiles.length > 0) {
      setError(`Les fichiers suivants dépassent la taille maximale de 2Mo : ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    onFileSelect(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Upload className="w-4 h-4" />
          Ajouter des fichiers
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        <span className="text-sm text-gray-500">
          Maximum 2Mo par fichier
        </span>
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {existingFiles.length > 0 && (
        <div className="space-y-2">
          {existingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 text-sm bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{file.name}</span>
                <span className="text-gray-500">({formatFileSize(file.size)})</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Voir
                </a>
                {onFileRemove && (
                  <button
                    type="button"
                    onClick={() => onFileRemove(file.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}