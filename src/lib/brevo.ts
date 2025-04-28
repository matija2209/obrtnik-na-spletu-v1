"use server";

// This is a placeholder for the actual email sending functionality
// In a real implementation, you would use a service like MailerSend, SendGrid, etc.
import nodemailer from 'nodemailer';

export async function sendContactEmailWithBrevo(
  options: {
    from: string,
    textContent: string,
    htmlContent: string,
    to: string,
    subject: string,
  }
): Promise<{ success: boolean;}> {
  try {
    const { from, htmlContent, to, subject } = options;
    // Check if SMTP credentials are set
    if (!process.env.BREVO_SMTP_HOST || !process.env.BREVO_SMTP_PORT || 
        !process.env.BREVO_SMTP_LOGIN || !process.env.BREVO_SMTP_KEY) {
      console.error("SMTP credentials are not set in environment variables");
      throw new Error("SMTP credentials are not set in environment variables");
    }
    
    console.log("SMTP credentials are set");
  
    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port: parseInt(process.env.BREVO_SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });
    
    console.log("Nodemailer transporter created");
    
    // Setup email data
    const mailOptions = {
      from: `"${from}" <info@obrtniknaspletu.si>`,
      to,
      replyTo: "matija@obrtniknaspletu.si",
      subject: subject,
      html: htmlContent,
    };
    
    console.log("Email options prepared, attempting to send...");
    
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true };
    } catch (error: any) {
      throw error
    }
  } catch (error: any) {
    throw error
  }
} 