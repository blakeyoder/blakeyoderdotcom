/**
 * Email service using Resend SDK
 * Sends contact form submissions to Blake
 */

import { Resend } from "resend";
import { config } from "./config";

export interface ContactEmailData {
  name: string;
  email: string;
  linkedin: string;
  message: string;
}

/**
 * Resend is constructed on first send rather than at module load.
 *
 * Constructing it at module scope forced the lazy config Proxy to validate
 * during Next's page-data collection, which made `next build` fail without a
 * RESEND_API_KEY and turned a missing variable into an unhandled module-level
 * throw at cold start instead of a caught request error.
 */
let client: Resend | null = null;

function getClient(): Resend {
  if (!client) {
    client = new Resend(config.resendApiKey);
  }
  return client;
}

/**
 * Send a contact form submission email to Blake
 * @param data - Contact form data from visitor, already normalized
 * @returns Promise that resolves when email is sent
 * @throws Error if email sending fails
 */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const { name, email, linkedin, message } = data;

  const emailHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>LinkedIn:</strong> <a href="${escapeHtml(linkedin)}">${escapeHtml(linkedin)}</a></p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
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
    const result = await getClient().emails.send({
      from: config.contactEmailFrom,
      to: [config.contactEmailTo], // Resend expects an array
      subject: buildSubject(name),
      html: emailHtml,
      text: emailText,
      replyTo: email, // Allow Blake to reply directly
    });

    if (result.error) {
      throw new Error(`Email sending failed: ${result.error.message}`);
    }
  } catch (error) {
    // Log for debugging; the caller returns a generic message to the client.
    console.error("Failed to send contact email:", error);
    throw new Error("Failed to send email. Please try again later.", {
      cause: error,
    });
  }
}

/**
 * Builds the subject line. Defense in depth: Resend takes JSON over HTTPS and
 * encodes headers itself, so CRLF here is not a working header injection, but
 * the subject should not carry control characters or run unbounded either.
 */
export function buildSubject(name: string): string {
  const clean = name.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ").trim();
  const truncated = clean.length > 78 ? `${clean.slice(0, 77)}…` : clean;
  return `Contact Form: ${truncated}`;
}

/**
 * Escape HTML to prevent XSS in email content
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
