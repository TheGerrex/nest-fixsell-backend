// email.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { ContactForm } from './interfaces/contactForm.interface';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-email')
  async sendEmail(
    @Body() formData: ContactForm,
  ): Promise<{ success: boolean }> {
    const emailSent = await this.emailService.sendEmail(formData);
    return { success: emailSent };
  }
}
