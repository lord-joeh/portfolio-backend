import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AboutService {
  constructor(private supabaseService: SupabaseService) {}

  async getAboutInfo() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('about_section')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine
      throw new InternalServerErrorException(error.message);
    }
    return { success: true, data };
  }

  async updateAboutInfo(
    aboutText?: string,
    resumeFile?: Express.Multer.File,
    profileImageFile?: Express.Multer.File,
    githubUrl?: string,
    linkedinUrl?: string,
    twitterUrl?: string,
  ): Promise<any> {
    const client = this.supabaseService.getClient();
    let resumeUrl: string | undefined;
    let profileImageUrl: string | undefined;

    if (resumeFile) {
      const ext = resumeFile.originalname?.split('.').pop() || 'pdf';
      const path = `resumes/${uuidv4()}.${ext}`;
      resumeUrl = await this.supabaseService.uploadFile(
        resumeFile,
        'portfolio-assets',
        path,
      );
    }

    if (profileImageFile) {
      const ext = profileImageFile.originalname?.split('.').pop() || 'png';
      const path = `profile/${uuidv4()}.${ext}`;
      profileImageUrl = await this.supabaseService.uploadFile(
        profileImageFile,
        'portfolio-assets',
        path,
      );
    }

    // Check if exists
    const { data: existing } = await client
      .from('about_section')
      .select('id')
      .single();

    const updateData: any = {};
    if (aboutText !== undefined) updateData.about_text = aboutText;
    if (resumeUrl !== undefined) updateData.resume_url = resumeUrl;
    if (profileImageUrl !== undefined)
      updateData.profile_image_url = profileImageUrl;
    if (githubUrl !== undefined) updateData.github_url = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedin_url = linkedinUrl;
    if (twitterUrl !== undefined) updateData.twitter_url = twitterUrl;
    updateData.updated_at = new Date().toISOString();

    if (existing) {
      // Update
      const { data, error } = await client
        .from('about_section')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new InternalServerErrorException(error.message);
      return { success: true, data };
    } else {
      // Insert
      const insertData: any = { ...updateData };
      if (!insertData.about_text) insertData.about_text = '';

      const { data, error } = await client
        .from('about_section')
        .insert([insertData])
        .select()
        .single();

      if (error) throw new InternalServerErrorException(error.message);
      return { success: true, data };
    }
  }
}
