'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Terminal, 
  FileCode, 
  ChevronRight, 
  UploadCloud, 
  Layers, 
  Sparkles, 
  ArrowLeft, 
  FileText,
  Clock,
  Code2
} from 'lucide-react';

// Purely for UI code coloring
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';

interface File {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchFiles(token);
  }, []);

  // UI trigger to repaint syntax colors whenever a new file is highlighted
  useEffect(() => {
    if (selectedFile) {
      Prism.highlightAll();
    }
  }, [selectedFile]);

  const fetchFiles = async (token: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/projects/${params.id}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (fileList: FileList) => {
    setUploading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Array.from(fileList).forEach(file => formData.append('files', file));

    try {
      const res = await axios.post(
        `http://localhost:3001/projects/${params.id}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setFiles(prev => [...prev, ...res.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) uploadFiles(e.target.files);
  };

  // Helper UI function to map file extensions to Prism languages
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
    <main className="min-h-screen w-full flex bg-[#000000] font-sans antialiased selection:bg-white/10">
      
      {/* Custom Embedded CSS Token Colors to match our premium aesthetic */}
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
      
      {/* LEFT PANEL: Deep Pitch Black Repository Directory */}
      <div className="hidden lg:flex lg:w-[32%] xl:w-[28%] p-8 flex-col justify-between relative bg-[#000000] border-r border-white/[0.04] flex-shrink-0">
        <div className="space-y-6 w-full">
          {/* Header & Back Action */}
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

          {/* Directory Title */}
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-white tracking-tight">Workspace Files</h2>
            <p className="text-xs text-neutral-500">Upload and select source trees to run review passes.</p>
          </div>

          {/* Drag & Drop Node */}
          <div
            className={`border border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              dragging 
                ? 'border-white bg-white/[0.02] scale-[0.99]' 
                : 'border-white/[0.06] hover:border-neutral-600 bg-[#050506]'
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
            <input id="fileInput" type="file" multiple className="hidden" onChange={handleFileInput} />
          </div>

          {/* Active File Tree Directory */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-neutral-600 tracking-wider uppercase block">Project Files</span>
            
            {loading ? (
              <div className="py-4 text-center text-xs text-neutral-500 font-mono animate-pulse">Scanning context...</div>
            ) : files.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-600 border border-white/[0.04] rounded-xl bg-[#050506]">
                No files in index tree
              </div>
            ) : (
              <div className="space-y-0.5 max-h-[320px] overflow-y-auto pr-1">
                {files.map(file => {
                  const isSelected = selectedFile?.id === file.id;
                  return (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-all outline-none truncate group ${
                        isSelected 
                          ? 'bg-white/[0.04] text-white border border-white/10' 
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.01] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#E5C07B]' : 'text-neutral-600 group-hover:text-neutral-400'}`} />
                        <span className="truncate font-mono">{file.name}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 text-neutral-600 group-hover:text-neutral-400 transition-transform ${isSelected ? 'translate-x-0.5 text-white' : ''}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* System Node Footer */}
        <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-neutral-600 select-none">
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Node Target Active</span>
          </div>
          <span className="font-mono">v1.4.0</span>
        </div>
      </div>

      {/* RIGHT PANEL: Sleek Off-Black Workspace Canvas holding Device Shell */}
      <div className="w-full lg:w-[68%] xl:w-[72%] flex flex-col justify-center items-center p-4 sm:p-8 xl:p-12 bg-[#0A0A0C] overflow-y-auto relative min-h-screen">
        
        {/* Mobile-only Top Action Strip */}
        <div className="w-full lg:hidden flex items-center justify-between mb-4 px-2 select-none">
          <div className="flex items-center gap-2" onClick={() => router.push('/dashboard')}>
            <Terminal className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">NeurolLint</span>
          </div>
          <div className="flex items-center gap-2">
            <input id="mobileFileInput" type="file" multiple className="hidden" onChange={handleFileInput} />
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

        {/* Mobile-only horizontal file scroll */}
        <div className="w-full lg:hidden overflow-x-auto flex gap-2 pb-3 mb-2 no-scrollbar">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono border ${
                selectedFile?.id === file.id
                  ? 'bg-white text-black border-white'
                  : 'bg-[#141416] text-neutral-400 border-white/[0.04]'
              }`}
            >
              {file.name}
            </button>
          ))}
          {!loading && files.length === 0 && (
            <span className="text-xs text-neutral-500 italic px-2">No files loaded.</span>
          )}
        </div>

        {/* PHYSICAL 3D CANVAS CODE COMPONENT BOX */}
        <div className="relative w-full max-w-[780px] h-[680px] bg-[#141416] border border-white/[0.06] rounded-[24px] shadow-2xl overflow-hidden flex flex-col justify-between">
          
          {/* IDE Window Title Bar Header Area */}
          <div className="bg-[#0D0D0F] border-b border-white/[0.04] px-5 py-3.5 flex items-center justify-between select-none z-10">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#61AFEF]" />
              <span className="text-neutral-400 font-mono text-xs tracking-tight">
                {selectedFile ? selectedFile.name : 'workspace_overview.log'}
              </span>
            </div>
            {selectedFile && (
              <Button 
                onClick={() => {}} 
                size="sm"
                className="bg-white hover:bg-neutral-200 text-black font-medium font-sans text-xs px-3 h-7 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-black" />
                <span>Review with AI</span>
              </Button>
            )}
          </div>

          {/* SCREEN CONTEXT LAYER - FIXED DOUBLE SCROLLBAR */}
          <div className="flex-1 w-full bg-[#141416] overflow-y-auto relative flex flex-col">
            {selectedFile ? (
              <div className="p-5 font-mono text-xs leading-relaxed text-neutral-300 flex-1">
                {/* Changed overflow-auto to overflow-hidden to let the parent layout handle scrolling */}
                <pre className="whitespace-pre-wrap font-normal overflow-hidden selection:bg-white/10">
                  <code className={getLanguageClass(selectedFile.name)}>
                    {selectedFile.content}
                  </code>
                </pre>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-center text-neutral-600 mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-neutral-400 text-xs font-medium font-sans">No file selected for inspection</p>
                <p className="text-neutral-600 text-[11px] max-w-xs font-sans mt-1">
                  Choose a layout tree script from the workspace navigator node on the left to review code lines.
                </p>
              </div>
            )}
          </div>

          {/* Device Base Info Bar */}
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

      </div>

    </main>
  );
}