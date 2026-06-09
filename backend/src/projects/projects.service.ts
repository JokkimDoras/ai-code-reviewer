import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProjectsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async create(userId: string, name: string, description: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('projects')
      .insert({ name, description, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  async getReviews(projectId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string, userId: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return { message: 'Project deleted' };
  }
}