'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, ArrowLeft, UploadCloud, FileCode, ChevronRight, Layers } from 'lucide-react';
import { ReviewHistory } from './ReviewHistory';

interface FilePanelProps {
  files: any[];
  loading: boolean;
  uploading: boolean;
  selectedFile: any;
  setSelectedFile: (file: any) => void;
  setReview: (review: string | null) => void;
  reviewType: string;
  setReviewType: (type: string) => void;
  uploadFiles: (files: FileList) => void;
  deleteFile: (id: string, callback: () => void) => void;
  reviews: any[];
  showReviews: boolean;
  setShowReviews: (show: boolean) => void;
}

export function FilePanel({
  files, loading, uploading, selectedFile, setSelectedFile, setReview,
  reviewType, setReviewType, uploadFiles, deleteFile, reviews, showReviews, setShowReviews
}: FilePanelProps) {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="hidden lg:flex lg:w-[32%] xl:w-[28%] p-8 flex-col justify-between relative bg-[#000000] border-r border-white/[0.04] flex-shrink-0">
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-2 select-none">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.02] border border-white/10 text-white">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="text-white font-medium tracking-tight text-sm">NeurolLint</span>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-neutral-500 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
          >
            <ArrowLeft className="w-3 h-3" /> Dashboard
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-sm font-medium text-white tracking-tight">Workspace Files</h2>
          <p className="text-xs text-neutral-500">Upload and select source trees to run review passes.</p>
        </div>

        {/* Review Types */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-600 tracking-wider uppercase block">Review Type</span>
          <div className="flex flex-col gap-1">
            {['general', 'security', 'performance'].map(type => (
              <button
                key={type}
                onClick={() => setReviewType(type)}
                className={`px-3 py-2 rounded-lg text-xs text-left capitalize transition-all border ${
                  reviewType === type ? 'bg-white/[0.04] text-white border-white/10' : 'text-neutral-500 border-transparent hover:text-neutral-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop */}
        <div
          className={`border border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragging ? 'border-white bg-white/[0.02] scale-[0.99]' : 'border-white/[0.06] hover:border-neutral-600 bg-[#050506]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className={`w-5 h-5 ${uploading ? 'animate-pulse text-neutral-400' : 'text-neutral-600'}`} />
            <p className="text-neutral-400 text-xs font-medium leading-normal">
              {uploading ? 'Processing streams...' : 'Drop source files or click'}
            </p>
            <span className="text-[10px] text-neutral-600">Supports text/code payloads</span>
          </div>
          <input id="fileInput" type="file" multiple className="hidden" onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
        </div>

        {/* File List */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-600 tracking-wider uppercase block">Project Files</span>
          {loading ? (
            <div className="py-4 text-center text-xs text-neutral-500 font-mono animate-pulse">Scanning context...</div>
          ) : files.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-600 border border-white/[0.04] rounded-xl bg-[#050506]">
              No files in index tree
            </div>
          ) : (
            <div className="space-y-0.5 max-h-[280px] overflow-y-auto pr-1">
              {files.map(file => {
                const isSelected = selectedFile?.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => { setSelectedFile(file); setReview(null); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-all outline-none truncate group ${
                      isSelected ? 'bg-white/[0.04] text-white border border-white/10' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.01] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#E5C07B]' : 'text-neutral-600'}`} />
                      <span className="truncate font-mono">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChevronRight className={`w-3 h-3 text-neutral-600 ${isSelected ? 'translate-x-0.5 text-white' : ''}`} />
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteFile(file.id, () => { if(isSelected) setSelectedFile(null); }); }}
                        className="text-neutral-700 hover:text-red-400 transition-colors ml-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ReviewHistory reviews={reviews} showReviews={showReviews} setShowReviews={setShowReviews} setReview={setReview} />

      <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-neutral-600 select-none">
        <div className="flex items-center gap-1">
          <Layers className="w-3 h-3" />
          <span>Node Target Active</span>
        </div>
        <span className="font-mono">v1.4.0</span>
      </div>
    </div>
  );
}