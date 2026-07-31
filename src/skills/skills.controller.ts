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
import { SkillsService } from './skills.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { Express } from 'express';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async getAllSkills() {
    return this.skillsService.getAllSkills();
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addSkill(
    @Body() body: { name: string; category: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.skillsService.addSkill(body.name, body.category, file);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  async deleteSkill(@Param('id') id: string) {
    return this.skillsService.deleteSkill(id);
  }

  @Patch('reorder')
  @UseGuards(SupabaseAuthGuard)
  async reorderSkills(
    @Body() body: { updates: { id: string; order_index: number }[] },
  ) {
    return this.skillsService.reorderSkills(body.updates);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateSkill(
    @Param('id') id: string,
    @Body() body: { name?: string; category?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.skillsService.updateSkill(id, body.name, body.category, file);
  }
}
