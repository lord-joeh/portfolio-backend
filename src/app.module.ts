import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AboutModule } from './about/about.module';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { CertificatesModule } from './certificates/certificates.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AboutModule,
    SkillsModule,
    ProjectsModule,
    CertificatesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
