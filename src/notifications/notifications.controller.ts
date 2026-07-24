import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { SubmitContactDto } from './dto/submit-contact.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async submitContactForm(@Body() submitContactDto: SubmitContactDto) {
    return this.notificationsService.submitContactForm(
      submitContactDto.name,
      submitContactDto.email,
      submitContactDto.message,
    );
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  async getNotifications() {
    return this.notificationsService.getNotifications();
  }
}
