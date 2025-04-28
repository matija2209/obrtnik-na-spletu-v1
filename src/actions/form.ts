"use server";

import { z } from "zod";
import { sendContactEmailWithBrevo } from "@/lib/brevo";
import { createContactEmailContent, createReplyToVisitorEmailContent } from "@/utils/prepare-email";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export async function submitContactForm(formData: FormData) {
  'use server';
  try {
    // 1. Validate the form data
    const validatedData = formSchema.parse(formData);
    const { name, email, message } = validatedData;

    // 2. Prepare emails using the functions from prepare-email.ts

    // Prepare admin notification email
    const adminEmail = await createContactEmailContent(
      name,
      email,
      message,
    );

    // Send email to admin
    await sendContactEmailWithBrevo({
      from: name,
      textContent: adminEmail.textContent,
      htmlContent: adminEmail.htmlContent,
      to: "kontakt@rezanje-betona.si", // Admin email address
      subject: `Nov kontaktni obrazec na Rezanje-Betona.si`,
    });

    // Prepare auto-reply email to the visitor
    const visitorEmail = await createReplyToVisitorEmailContent(
      name,
    );

    // Send auto-reply to visitor
    await sendContactEmailWithBrevo({
      from: "Rezanje Betona",
      textContent: visitorEmail.textContent,
      htmlContent: visitorEmail.htmlContent,
      to: email,
      subject: "Zahvala za vaše povpraševanje - Rezanje Betona", // Updated subject in Slovenian
    });

    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    
    if (error instanceof z.ZodError) {
      // Return validation errors
      return { 
        success: false, 
        message: "Validation failed",
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      };
    }
    
    return { success: false, message: "Failed to send your message. Please try again later." };
  }
}

