'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Code2, Sparkles, FileText, Clock } from 'lucide-react';
import Prism from 'prismjs';

// 💡 FIX 1: Import Prism styles directly so the theme token colors are loaded
import 'prismjs/themes/prism-tomorrow.css'; 

// 💡 FIX 2: Explicitly ensure common code structural highlight assets map properly
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';

interface CodeViewerProps {
  selectedFile: any;
  review: string | null;
  reviewing: boolean;
  reviewWithAI: () => void;
}

export function CodeViewer({ selectedFile, review, reviewing, reviewWithAI }: CodeViewerProps) {
  useEffect(() => {
    if (selectedFile) Prism.highlightAll();
  }, [selectedFile, review]);

  const getLanguageClass = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'ts') return 'language-typescript';
    if (ext === 'tsx') return 'language-tsx';
    if (ext === 'js' || ext === 'jsx') return 'language-jsx';
    if (ext === 'json') return 'language-json';
    if (ext === 'css') return 'language-css';
    return 'language-javascript';
  };

  return (
    <div className="relative w-full max-w-[780px] bg-[#141416] border border-white/[0.06] rounded-[24px] shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-[#0D0D0F] border-b border-white/[0.04] px-5 py-3.5 flex items-center justify-between select-none z-10">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#61AFEF]" />
          <span className="text-neutral-400 font-mono text-xs tracking-tight">
            {selectedFile ? selectedFile.name : 'workspace_overview.log'}
          </span>
        </div>
        {selectedFile && (
          <Button
            onClick={reviewWithAI}
            disabled={reviewing}
            size="sm"
            className="bg-white hover:bg-neutral-200 text-black font-medium text-xs px-3 h-7 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-black" />
            <span>{reviewing ? 'Reviewing...' : 'Review with AI'}</span>
          </Button>
        )}
      </div>

      <div className="w-full bg-[#141416] overflow-y-auto" style={{ maxHeight: '600px' }}>
        {selectedFile ? (
          <>
            {/* Removed conflicting text-neutral-300 so Prism tokens can show their bright colored states */}
            <div className="p-5 font-mono text-xs leading-relaxed">
              {/* 💡 FIX 3: Added the language class here onto the pre tag, and forced background transparent so your nice custom container color is preserved */}
              <pre className={`${getLanguageClass(selectedFile.name)} !bg-transparent !m-0 !p-0 whitespace-pre-wrap font-normal overflow-hidden selection:bg-white/10`}>
                <code className={getLanguageClass(selectedFile.name)}>
                  {selectedFile.content}
                </code>
              </pre>
            </div>
            {review && (
              <div className="p-5 border-t border-white/[0.04] bg-[#0D0D0F]">
                <h3 className="text-xs font-semibold text-neutral-400 mb-3 uppercase tracking-wider">AI Review</h3>
                <pre className="text-neutral-300 text-xs whitespace-pre-wrap font-sans leading-relaxed">
                  {review}
                </pre>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-16 select-none">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-center text-neutral-600 mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-neutral-400 text-xs font-medium">No file selected for inspection</p>
            <p className="text-neutral-600 text-[11px] max-w-xs mt-1">
              Choose a file from the workspace navigator on the left to review code.
            </p>
          </div>
        )}
      </div>

      <div className="bg-[#0D0D0F] border-t border-white/[0.04] px-5 py-2.5 flex items-center justify-between text-[10px] text-neutral-500 font-mono select-none z-10">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400">UTF-8</span>
          <span>TypeScript React</span>
        </div>
        {selectedFile && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-600" />
            <span>Indexed payload</span>
          </div>
        )}
      </div>
    </div>
  );
}