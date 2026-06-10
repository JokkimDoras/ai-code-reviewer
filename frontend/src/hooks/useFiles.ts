import { useState } from 'react';
import axios from 'axios';

interface FileItem {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

export function useFiles(projectId: string) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async (token: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/projects/${projectId}/files`, {
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
        `http://localhost:3001/projects/${projectId}/files`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setFiles(prev => [...prev, ...res.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string, onDeleted?: () => void) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/projects/${projectId}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(prev => prev.filter(f => f.id !== fileId));
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  return { files, setFiles, loading, uploading, fetchFiles, uploadFiles, deleteFile };
}