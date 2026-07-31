import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllProjects() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return { success: true, data };
  }

  async addProject(
    title: string,
    description: string,
    link: string,
    file: Express.Multer.File,
    githubLink?: string,
    tags?: string,
  ) {
    if (!file)
      throw new InternalServerErrorException('File is required for projects');

    const ext = file.originalname.split('.').pop();
    const path = `projects/${uuidv4()}.${ext}`;
    const imageUrl = await this.supabaseService.uploadFile(
      file,
      'portfolio-assets',
      path,
    );

    const { data, error } = await this.supabaseService
      .getClient()
      .from('projects')
      .insert([
        {
          title,
          description,
          link,
          image_url: imageUrl,
          github_link: githubLink,
          tags: tags,
        },
      ])
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }

  async deleteProject(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('projects')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }

  async updateProject(
    id: string,
    title?: string,
    description?: string,
    link?: string,
    file?: Express.Multer.File,
    githubLink?: string,
    tags?: string,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      const ext = file.originalname.split('.').pop();
      const path = `projects/${uuidv4()}.${ext}`;
      imageUrl = await this.supabaseService.uploadFile(
        file,
        'portfolio-assets',
        path,
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (link !== undefined) updateData.link = link;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (githubLink !== undefined) updateData.github_link = githubLink;
    if (tags !== undefined) updateData.tags = tags;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }

  async reorderProjects(updates: { id: string; order_index: number }[]) {
    const promises = updates.map((update) =>
      this.supabaseService
        .getClient()
        .from('projects')
        .update({ order_index: update.order_index })
        .eq('id', update.id),
    );

    await Promise.all(promises);
    return { success: true, message: 'Projects reordered successfully' };
  }
}
