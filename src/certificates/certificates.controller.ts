import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CertificatesService } from './certificates.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { Express } from 'express';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  async getAllCertificates() {
    return this.certificatesService.getAllCertificates();
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addCertificate(
    @Body() body: { title: string; description: string; issueDate?: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.certificatesService.addCertificate(
      body.title,
      body.description,
      body.issueDate || '',
      file,
    );
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  async deleteCertificate(@Param('id') id: string) {
    return this.certificatesService.deleteCertificate(id);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateCertificate(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; issueDate?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.certificatesService.updateCertificate(
      id,
      body.title,
      body.description,
      body.issueDate,
      file,
    );
  }
}
