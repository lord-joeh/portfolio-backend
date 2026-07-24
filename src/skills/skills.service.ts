import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SkillsService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllSkills() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return { success: true, data };
  }

  async addSkill(name: string, category: string, file: Express.Multer.File) {
    if (!file)
      throw new InternalServerErrorException('File is required for skills');

    const ext = file.originalname.split('.').pop();
    const path = `skills/${uuidv4()}.${ext}`;
    const imageUrl = await this.supabaseService.uploadFile(
      file,
      'portfolio-assets',
      path,
    );

    const { data, error } = await this.supabaseService
      .getClient()
      .from('skills')
      .insert([{ name, image_url: imageUrl, category }])
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }

  async deleteSkill(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('skills')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }

  async updateSkill(
    id: string,
    name?: string,
    category?: string,
    file?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      const ext = file.originalname.split('.').pop();
      const path = `skills/${uuidv4()}.${ext}`;
      imageUrl = await this.supabaseService.uploadFile(
        file,
        'portfolio-assets',
        path,
      );
    }
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }
}
