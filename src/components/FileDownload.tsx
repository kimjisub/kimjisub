'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';

interface FileDownloadProps {
  href: string;
  filename: string;
  type?: string;
}

const FILE_TYPE_COLORS: Record<string, string> = {
  PDF: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  DOC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DOCX: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  XLS: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  XLSX: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PPT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  PPTX: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  HWP: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  HWPX: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  ZIP: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  DEFAULT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export const FileDownload = ({ href, filename, type = 'FILE' }: FileDownloadProps) => {
  const colorClass = FILE_TYPE_COLORS[type.toUpperCase()] || FILE_TYPE_COLORS.DEFAULT;

  return (
    <a
      href={href}
      download={filename}
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-accent transition-colors group my-2 ${colorClass}`}
    >
      <FileText className="w-5 h-5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{filename}</p>
        <p className="text-xs opacity-70">{type} 파일</p>
      </div>
      <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
    </a>
  );
};
