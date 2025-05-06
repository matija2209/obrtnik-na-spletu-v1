"use server";


import { createFormSubmission } from '@/lib/payload';
import { getTenantIdBySlug } from '@/lib/payload';


interface SubmitActionArgs {
  formId: string;
  submissionData: Record<string, any>;
  tenantSlug: string;
}

export async function submitContactForm(args: SubmitActionArgs) {
  'use server';
  console.log("submitContactForm received tenantSlug:", args.tenantSlug);
  const { formId, submissionData, tenantSlug } = args;
  
  const tenantIdNumber = await getTenantIdBySlug(tenantSlug);

  if (tenantIdNumber === null) {
    console.error("Invalid tenant slug provided or tenant not found:", tenantSlug);
    return {
      success: false,
      message: "Invalid tenant identifier provided.",
    };
  }

  try {
    // Create a new submission using the dedicated function
    const submission = await createFormSubmission(formId, submissionData, tenantIdNumber);

    // The form-builder plugin handles emails and confirmation messages based on form config.
    // We can retrieve the form's confirmation message if needed, or rely on a generic one.
    // For simplicity, returning a generic success message here.
    // To get form-specific confirmation:
    // const formConfig = await payload.findByID({ collection: 'forms', id: formId, depth: 0 });
    // const confirmationMessage = formConfig?.confirmationMessage || "Form submitted successfully!";

    return { 
      success: true, 
      message: "Form submitted successfully!" // Replace with formConfig.confirmationMessage if dynamic
    };

  } catch (error: any) {
    // payloadInstance.logger.error(`Error submitting form ID ${formId}:`, error); // payloadInstance no longer available here
    console.error(`Error submitting form ID ${formId}:`, error); // Generic error logging
    
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

