import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AboutService } from './about.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { Express } from 'express';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('info')
  async getAboutInfo() {
    return this.aboutService.getAboutInfo();
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'resume', maxCount: 1 },
      { name: 'profileImage', maxCount: 1 },
    ]),
  )
  async updateAboutInfo(
    @Body()
    body: {
      aboutText: string;
      githubUrl?: string;
      linkedinUrl?: string;
      twitterUrl?: string;
    },
    @UploadedFiles()
    files?: {
      resume?: Express.Multer.File[];
      profileImage?: Express.Multer.File[];
    },
  ) {
    const resumeFile = files?.resume?.[0];
    const profileImageFile = files?.profileImage?.[0];
    return this.aboutService.updateAboutInfo(
      body.aboutText,
      resumeFile,
      profileImageFile,
      body.githubUrl,
      body.linkedinUrl,
      body.twitterUrl,
    );
  }
}
