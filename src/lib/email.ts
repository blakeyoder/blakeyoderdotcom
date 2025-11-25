/**
 * Email service using Resend SDK
 * Sends contact form submissions to Blake
 */

import { Resend } from 'resend';
import { config } from './config';

// Initialize Resend client
const resend = new Resend(config.resendApiKey);

export interface ContactEmailData {
  name: string;
  email: string;
  linkedin: string;
  message: string;
}

/**
 * Send a contact form submission email to Blake
 * @param data - Contact form data from visitor
 * @returns Promise that resolves when email is sent
 * @throws Error if email sending fails
 */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const { name, email, linkedin, message } = data;

  // Format email content
  const emailHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>LinkedIn:</strong> <a href="${escapeHtml(linkedin)}">${escapeHtml(linkedin)}</a></p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    <hr>
    <p><small>Sent from blakeyoder.com contact form</small></p>
  `;

  const emailText = `
New Contact Form Submission

From: ${name}
Email: ${email}
LinkedIn: ${linkedin}

Message:
${message}

---
Sent from blakeyoder.com contact form
  `.trim();

  try {
    // Log configuration for debugging (safe in production logs)
    console.log('Email config:', {
      from: config.contactEmailFrom,
      to: config.contactEmailTo,
      toType: typeof config.contactEmailTo,
      toLength: config.contactEmailTo.length,
    });

    const result = await resend.emails.send({
      from: config.contactEmailFrom,
      to: [config.contactEmailTo], // Resend expects an array
      subject: `Contact Form: ${name}`,
      html: emailHtml,
      text: emailText,
      replyTo: email, // Allow Blake to reply directly
    });

    if (result.error) {
      throw new Error(`Email sending failed: ${result.error.message}`);
    }
  } catch (error) {
    // Log error for debugging (don't expose details to user)
    console.error('Failed to send contact email:', error);
    throw new Error('Failed to send email. Please try again later.');
  }
}

/**
 * Escape HTML to prevent XSS in email content
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
