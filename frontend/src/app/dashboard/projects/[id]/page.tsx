'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400 cursor-pointer" onClick={() => router.push('/dashboard')}>← NeurolLint</h1>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
        {/* Left - File list */}
        <div className="w-64 flex-shrink-0">
          <h2 className="text-lg font-bold mb-4">Files</h2>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center mb-4 cursor-pointer transition-colors ${dragging ? 'border-blue-400 bg-blue-950' : 'border-gray-700 hover:border-gray-500'}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <p className="text-gray-400 text-sm">{uploading ? 'Uploading...' : 'Drop files here or click to upload'}</p>
            <input id="fileInput" type="file" multiple className="hidden" onChange={handleFileInput} />
          </div>

          {/* File list */}
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : files.length === 0 ? (
            <p className="text-gray-600 text-sm">No files yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {files.map(file => (
                <div
                  key={file.id}
                  className={`px-3 py-2 rounded cursor-pointer text-sm truncate ${selectedFile?.id === file.id ? 'bg-blue-900 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                  onClick={() => setSelectedFile(file)}
                >
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - File preview */}
        <div className="flex-1">
          {selectedFile ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-white text-sm">{selectedFile.name}</CardTitle>
                <Button size="sm">Review with AI</Button>
              </CardHeader>
              <CardContent>
                <pre className="text-green-400 text-xs overflow-auto max-h-[600px] whitespace-pre-wrap">
                  {selectedFile.content}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-600">
              Select a file to preview
            </div>
          )}
        </div>
      </div>
    </main>
  );
}