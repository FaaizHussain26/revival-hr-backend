import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp-relay.brevo.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('BREVO_EMAIL'),
            pass: configService.get<string>('BREVO_PASSWORD'),
          },
        },
        defaults: {
          from: `"DAX AI" ${configService.get<string>('BREVO_USER')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class AppMailerModule {}
