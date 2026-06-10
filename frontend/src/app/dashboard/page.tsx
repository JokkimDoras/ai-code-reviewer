'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Terminal, 
  LogOut, 
  FolderCode, 
  Plus, 
  Layers, 
  User as UserIcon 
} from 'lucide-react';

import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/dashboard/ProjectCard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const {
    projects,
    loading,
    creating,
    newProject,
    setNewProject,
    fetchProjects,
    createProject,
    deleteProject
  } = useProjects();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data from localStorage', err);
      }
    }

    fetchProjects(token);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <main className="min-h-screen w-full flex bg-[#000000] font-sans antialiased selection:bg-white/10">
      
      {/* LEFT PANEL: Deep Pitch Black Navigation Console */}
      <div className="hidden lg:flex lg:w-[28%] xl:w-[24%] p-8 flex-col justify-between relative bg-[#000000] border-r border-white/[0.04] flex-shrink-0">
        <div className="space-y-8 w-full">
          {/* Header Branding */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.04] select-none">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.02] border border-white/10 text-white">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-white font-medium tracking-tight text-sm">NeurolLint</span>
              <span className="text-neutral-600 font-light text-xs ml-1">Console</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 bg-[#050506] border border-white/[0.04] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 border border-neutral-800">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-neutral-500 font-medium tracking-wide uppercase">Active Operator</p>
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Loading...'}</p>
            </div>
          </div>

          {/* Management Shortcuts */}
          <div className="space-y-3">
            <span className="text-[10px] font-semibold text-neutral-600 tracking-wider uppercase block">Workspaces</span>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs text-neutral-400 hover:text-white hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04] transition-all outline-none group">
                  <Plus className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                  <span className="font-medium">Initialize Project</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A0A0C] border border-white/[0.06] text-white max-w-sm rounded-2xl p-6 shadow-2xl">
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-lg font-medium tracking-tight text-white flex items-center gap-2">
                    <FolderCode className="w-4 h-4 text-neutral-400" /> New Repository Node
                  </DialogTitle>
                </DialogHeader>
                
                {/* INLINE FORM DISMISSES RE-RENDER UNMOUNTING */}
                <div className="flex flex-col gap-4 mt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-400">Project Name</Label>
                    <Input
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="bg-[#141416] border-white/[0.06] text-white placeholder:text-neutral-700 text-sm h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-500 outline-none transition-all"
                      placeholder="e.g., core-api-service"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-400">Description</Label>
                    <Input
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="bg-[#141416] border-white/[0.06] text-white placeholder:text-neutral-700 text-sm h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-500 outline-none transition-all"
                      placeholder="What is this repository context about?"
                    />
                  </div>
                  <Button 
                    onClick={() => createProject(() => setOpen(false))} 
                    disabled={creating}
                    className="w-full bg-white hover:bg-neutral-200 text-black font-medium h-10 rounded-xl transition-colors text-xs mt-2"
                  >
                    {creating ? 'Spawning Index...' : 'Create Workspace'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <button 
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs text-red-400/60 hover:text-red-400 hover:bg-red-950/10 border border-transparent hover:border-red-900/10 transition-all outline-none"
            >
              <LogOut className="w-4 h-4 opacity-50" />
              <span className="font-medium">Terminate Session</span>
            </button>
          </div>
        </div>

        {/* System Diagnostics Info */}
        <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-neutral-600 select-none">
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Node Controller</span>
          </div>
          <span className="font-mono">v1.4.0</span>
        </div>
      </div>

      {/* RIGHT PANEL: Sleek Off-Black Workspace Canvas */}
      <div className="flex-1 flex flex-col bg-[#0A0A0C] min-h-screen overflow-y-auto px-6 py-8 lg:p-12">
        
        {/* Mobile Header Block */}
        <div className="flex lg:hidden justify-between items-center pb-4 mb-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.04] border border-white/10 text-white">
              <Terminal className="w-3 h-3" />
            </div>
            <h1 className="text-sm font-semibold text-white tracking-tight">NeurolLint</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 text-xs">Hi, {user?.name || 'Operator'}</span>
            <button onClick={logout} className="text-red-400 hover:underline text-xs font-medium">Logout</button>
          </div>
        </div>

        {/* Content Header Deck */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-medium text-white tracking-tight">Your Projects</h2>
            <p className="hidden sm:block text-xs text-neutral-500">Select an environment file tree to review technical execution health.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-neutral-200 font-medium text-xs px-4 h-9 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0C] border border-white/[0.06] text-white max-w-sm rounded-2xl p-6 shadow-2xl">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-lg font-medium tracking-tight text-white flex items-center gap-2">
                  <FolderCode className="w-4 h-4 text-neutral-400" /> New Repository Node
                </DialogTitle>
              </DialogHeader>
              
              {/* COMPACT INLINE REPLICA FOR MOBILE PANEL VIEWPORTS */}
              <div className="flex flex-col gap-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-400">Project Name</Label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="bg-[#141416] border-white/[0.06] text-white placeholder:text-neutral-700 text-sm h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-500 outline-none transition-all"
                    placeholder="e.g., core-api-service"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-400">Description</Label>
                  <Input
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="bg-[#141416] border-white/[0.06] text-white placeholder:text-neutral-700 text-sm h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-500 outline-none transition-all"
                    placeholder="What is this repository context about?"
                  />
                </div>
                <Button 
                  onClick={() => createProject(() => setOpen(false))} 
                  disabled={creating}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-medium h-10 rounded-xl transition-colors text-xs mt-2"
                >
                  {creating ? 'Spawning Index...' : 'Create Workspace'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Conditional Grid Engine Layout */}
        {loading ? (
          <div className="flex items-center justify-center py-32 text-xs font-mono text-neutral-500 animate-pulse">
            Fetching active cluster databases...
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 border border-white/[0.04] border-dashed rounded-3xl bg-[#050506] p-8 max-w-xl mx-auto w-full shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center text-neutral-500 border border-white/[0.04] mb-4">
              <FolderCode className="w-5 h-5" />
            </div>
            <p className="text-neutral-300 text-sm font-medium">No workspace targets discovered</p>
            <p className="text-neutral-500 text-xs max-w-xs mt-1 mb-5">
              Get started by establishing a new tracking index path connection to your source repository files.
            </p>
            <Button 
              onClick={() => setOpen(true)}
              className="bg-white text-black hover:bg-neutral-200 font-medium text-xs px-4 h-9 rounded-xl"
            >
              Initialize Node Pipeline
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                onDelete={deleteProject}
              />
            ))}
          </div>
        )}
      </div>

    </main>
  );
}