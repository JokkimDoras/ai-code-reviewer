import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FilesService {
  constructor(private supabaseService: SupabaseService) {}

  async getFiles(projectId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  }

  async uploadFiles(projectId: string, files: Express.Multer.File[]) {
    const supabase = this.supabaseService.getClient();
    const uploaded:any[] = [];

    for (const file of files) {
      const content = file.buffer.toString('utf-8');
      const { data, error } = await supabase
        .from('files')
        .insert({
          name: file.originalname,
          path: file.originalname,
          content,
          project_id: projectId,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      uploaded.push(data);
    }

    return uploaded;
  }

  async deleteFile(fileId: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);
    if (error) throw new Error(error.message);
    return { message: 'File deleted' };
  }
}