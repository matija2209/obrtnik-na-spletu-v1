"use server";


import { createFormSubmission, getPayloadClient } from '@/lib/payload';


interface SubmitActionArgs {
  formId: string;
  submissionData: Record<string, any>;
}

const payload = await getPayloadClient();

export async function submitContactForm(args: SubmitActionArgs) {
  'use server';

  const { formId, submissionData } = args;    
  try {
    // Create a new submission using the dedicated function
    const submission = await createFormSubmission(formId, submissionData);

    // The form-builder plugin handles emails and confirmation messages based on form config.
    // We can retrieve the form's confirmation message if needed, or rely on a generic one.
    // For simplicity, returning a generic success message here.
    // To get form-specific confirmation:
    const formConfig = await payload.findByID({ collection: 'forms', id: formId, depth: 0 });
    const confirmationMessage = formConfig?.confirmationMessage || "Form submitted successfully!";

    return { 
      success: true, 
      message: confirmationMessage
    };

  } catch (error: any) {
    // Handle Payload validation errors or other errors from the create operation
    if (error.data && Array.isArray(error.data)) {
      // Format Payload validation errors to be compatible with react-hook-form
      const fieldErrors = error.data.map((err: { field?: string, message: string }) => ({
        path: err.field || 'form', // Fallback to a general form error if field is not specified
        message: err.message,
      }));
      return { 
        success: false, 
        message: error.message || "Validation failed. Please check your input.",
        errors: fieldErrors,
      };
    } else if (error instanceof Error) {
        return { 
            success: false, 
            message: error.message || "An unexpected error occurred while submitting the form."
        };
    }
    
    return { 
      success: false, 
      message: "Failed to submit form due to an unexpected error. Please try again later." 
    };
  }
}

