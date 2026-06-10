import { useState } from 'react';
import axios from 'axios';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async (token: string) => {
    try {
      const res = await axios.get('http://localhost:3001/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (onSuccess: () => void) => {
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3001/projects',
        newProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(prev => [...prev, res.data]);
      setNewProject({ name: '', description: '' });
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return {
    projects,
    loading,
    creating,
    newProject,
    setNewProject,
    fetchProjects,
    createProject,
    deleteProject
  };
}