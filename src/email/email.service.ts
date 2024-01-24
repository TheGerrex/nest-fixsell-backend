import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContactForm } from './interfaces/contactForm.interface';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: 'fixsell.mx',
    secure: true,
    port: '465',
    auth: {
      user: 'contacto@fixsell.mx',
      pass: 'im42xJfwB5Bj5q*dh',
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 5000, // 5 seconds
    timeout: 10000,
    debug: true,
    logger: true,
  });

  async sendEmail(formData: ContactForm) {
    // Customize the email content using the formData
    const emailContent = `
        Hay un nuevo prospecto buscando contacto, sus credenciales son:\n
        Nombre: ${formData.name}\n
        Numero de Telefono: ${formData.number}\n
        Email: ${formData.email}\n
        Mensaje: ${formData.message}
        `;

    const mailOptions = {
      from: 'contacto@fixsell.mx',
      to: 'contacto@fixsell.mx',
      subject: 'Nueva respuesta de Formulario de Contacto',
      text: emailContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true; // Email sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      return false; // Failed to send email
    }
  }
}
