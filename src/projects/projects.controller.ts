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
import { ProjectsService } from './projects.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { Express } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addProject(
    @Body()
    body: {
      title: string;
      description: string;
      link: string;
      githubLink?: string;
      tags?: string;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.addProject(
      body.title,
      body.description,
      body.link,
      file,
      body.githubLink,
      body.tags,
    );
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  async deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }

  @Patch('reorder')
  @UseGuards(SupabaseAuthGuard)
  async reorderProjects(
    @Body() body: { updates: { id: string; order_index: number }[] },
  ) {
    return this.projectsService.reorderProjects(body.updates);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProject(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      link?: string;
      githubLink?: string;
      tags?: string;
    },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectsService.updateProject(
      id,
      body.title,
      body.description,
      body.link,
      file,
      body.githubLink,
      body.tags,
    );
  }
}
