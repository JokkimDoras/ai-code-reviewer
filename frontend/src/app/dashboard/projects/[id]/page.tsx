'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useFiles } from '@/hooks/useFiles';
import { useReviews } from '@/hooks/useReviews';
import { FilePanel } from '@/components/project/FilePanel';
import { CodeViewer } from '@/components/project/CodeViewer';

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const { files, loading, uploading, fetchFiles, uploadFiles, deleteFile } = useFiles(projectId);
  const { 
    reviews, review, setReview, reviewing, reviewType, setReviewType, 
    showReviews, setShowReviews, fetchReviews, reviewWithAI 
  } = useReviews(projectId);

  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchFiles(token);
    fetchReviews(token);
  }, [projectId]);

  return (
    <main className="min-h-screen w-full flex bg-[#000000] font-sans antialiased selection:bg-white/10">
      {/* Global Prism Styles overrides */}
      <style jsx global>{`
        .token.comment { color: #5c6370; font-style: italic; }
        .token.keyword { color: #c678dd; font-weight: 500; }
        .token.string { color: #98c379; }
        .token.function { color: #61afef; }
        .token.number { color: #d19a66; }
        .token.class-name, .token.maybe-class-name { color: #e5c07b; }
        .token.operator, .token.punctuation { color: #abb2bf; }
        .token.attr-name { color: #d19a66; }
        .token.tag { color: #e06c75; }
      `}</style>

      {/* LEFT PANEL */}
      <FilePanel 
        files={files}
        loading={loading}
        uploading={uploading}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setReview={setReview}
        reviewType={reviewType}
        setReviewType={setReviewType}
        uploadFiles={uploadFiles}
        deleteFile={deleteFile}
        reviews={reviews}
        showReviews={showReviews}
        setShowReviews={setShowReviews}
      />

      {/* RIGHT PANEL & MOBILE WRAPPER */}
      <div className="w-full lg:w-[68%] xl:w-[72%] flex flex-col justify-center items-center p-4 sm:p-8 xl:p-12 bg-[#0A0A0C] overflow-y-auto relative min-h-screen">
        
        {/* Mobile Top Bar */}
        <div className="w-full lg:hidden flex items-center justify-between mb-4 px-2 select-none">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <Terminal className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">NeurolLint</span>
          </div>
          <div className="flex items-center gap-2">
            <input id="mobileFileInput" type="file" multiple className="hidden" onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
            <Button
              size="sm"
              onClick={() => document.getElementById('mobileFileInput')?.click()}
              disabled={uploading}
              className="bg-white text-black hover:bg-neutral-200 text-xs py-1 h-8 rounded-lg"
            >
              {uploading ? 'Uploading...' : 'Add Files'}
            </Button>
          </div>
        </div>

        {/* Mobile File Scroll */}
        <div className="w-full lg:hidden overflow-x-auto flex gap-2 pb-3 mb-2 no-scrollbar">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono border ${
                selectedFile?.id === file.id ? 'bg-white text-black border-white' : 'bg-[#141416] text-neutral-400 border-white/[0.04]'
              }`}
            >
              {file.name}
            </button>
          ))}
          {!loading && files.length === 0 && (
            <span className="text-xs text-neutral-500 italic px-2">No files loaded.</span>
          )}
        </div>

        {/* Dynamic Code Window */}
        <CodeViewer 
          selectedFile={selectedFile}
          review={review}
          reviewing={reviewing}
          reviewWithAI={() => reviewWithAI(selectedFile.content, selectedFile.name)}
        />
      </div>
    </main>
  );
}