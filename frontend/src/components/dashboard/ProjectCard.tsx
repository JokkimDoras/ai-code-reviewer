'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card
      className="bg-[#141416] border border-white/[0.04] hover:border-white/[0.12] rounded-2xl shadow-xl transition-all cursor-pointer overflow-hidden group flex flex-col justify-between"
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-neutral-200 font-medium text-sm tracking-tight group-hover:text-white transition-colors font-sans truncate">
            {project.name}
          </CardTitle>
          <div className="w-6 h-6 rounded-md bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-neutral-500 group-hover:text-neutral-300 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-4">
        <p className="text-neutral-400 text-xs leading-relaxed font-normal min-h-[32px] line-clamp-2">
          {project.description || 'No description provided for this codebase reference.'}
        </p>
        <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-neutral-500 font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-600" />
            <span>
              {new Date(project.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="text-red-500/50 hover:text-red-400 text-[10px] transition-colors"
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
}