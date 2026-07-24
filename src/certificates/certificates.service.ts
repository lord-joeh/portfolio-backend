import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CertificatesService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllCertificates() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('certifications')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return { success: true, data };
  }

  async addCertificate(
    title: string,
    description: string,
    issueDate: string,
    file: Express.Multer.File,
  ) {
    if (!file)
      throw new InternalServerErrorException(
        'File is required for certificates',
      );

    const ext = file.originalname.split('.').pop();
    const path = `certificates/${uuidv4()}.${ext}`;
    const imageUrl = await this.supabaseService.uploadFile(
      file,
      'portfolio-assets',
      path,
    );

    const { data, error } = await this.supabaseService
      .getClient()
      .from('certifications')
      .insert([
        {
          title,
          description,
          image_url: imageUrl,
          issue_date: issueDate || null,
        },
      ])
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }

  async deleteCertificate(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('certifications')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }

  async updateCertificate(
    id: string,
    title?: string,
    description?: string,
    issueDate?: string,
    file?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      const ext = file.originalname.split('.').pop();
      const path = `certificates/${uuidv4()}.${ext}`;
      imageUrl = await this.supabaseService.uploadFile(
        file,
        'portfolio-assets',
        path,
      );
    }
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (issueDate !== undefined) updateData.issue_date = issueDate || null;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('certifications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return { success: true, data };
  }
}
