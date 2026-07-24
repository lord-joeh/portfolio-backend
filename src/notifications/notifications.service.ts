import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: this.configService.get<string>('SMTP_PORT') === '465',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async submitContactForm(name: string, email: string, message: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .insert([{ name, email, message }])
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to save notification: ${error.message}`, error);
      throw new InternalServerErrorException('Failed to process your request.');
    }

    try {
      const smtpFrom = this.configService.get<string>('SMTP_FROM');
      const notificationEmail =
        this.configService.get<string>('NOTIFICATION_EMAIL');

      if (!smtpFrom || !notificationEmail) {
        this.logger.warn(
          'SMTP_FROM or NOTIFICATION_EMAIL is not configured. Skipping email notifications.',
        );
        return { success: true, data };
      }

      // 1. Send notification email to the site owner
      await this.transporter.sendMail({
        from: smtpFrom,
        to: notificationEmail,
        subject: `New Contact Form Submission from ${name}`,
        text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        html: `<p>You have received a new message from your portfolio contact form.</p><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`,
      });

      // 2. Send confirmation auto-responder to the user
      await this.transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: `Thank you for reaching out, ${name}!`,
        text: `Hi ${name},\n\nThank you for contacting me! I have received your message and will get back to you as soon as possible.\n\nHere is a copy of your message:\n${message}\n\nBest regards,\nJoseph Mensah`,
        html: `<p>Hi ${name},</p><p>Thank you for contacting me! I have received your message and will get back to you as soon as possible.</p><p><strong>Here is a copy of your message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p><p>Best regards,<br/>Joseph Mensah</p>`,
      });

      this.logger.log(
        `Successfully processed contact form submission for ${email}`,
      );
    } catch (mailError) {
      this.logger.error(
        `Failed to send emails for contact form submission from ${email}`,
        mailError,
      );
      // We don't throw an error here so the user still sees a success message since their data was saved to Supabase.
    }

    return { success: true, data };
  }

  async getNotifications() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(
        `Failed to fetch notifications: ${error.message}`,
        error,
      );
      throw new InternalServerErrorException('Failed to fetch notifications.');
    }
    return { success: true, data };
  }
}
