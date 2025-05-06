'use client';

import { useForm } from "react-hook-form";
import { useTransition, useState } from "react";
import { useParams } from 'next/navigation'; // Import useParams
import { submitContactForm } from "@/actions/form"; // This will need to be updated later
import { type Form as PayloadFormType } from "@payload-types"; // Import the Form type

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Keep for potential 'textarea' field type
import { Alert, AlertDescription } from "@/components/ui/alert";
// Import other UI components as needed for different field types (e.g., Select)

interface ContactFormProps {
  form: PayloadFormType;
}

export function ContactForm({ form: payloadForm }: ContactFormProps) {
  const params = useParams(); // Get URL parameters
  const tenantSlug = params.tenant as string; // Extract tenantSlug

  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  
  // react-hook-form setup. Default values can be dynamically generated.
  // Schema validation will also need to be dynamic based on payloadForm.fields
  const form = useForm({
    // resolver: zodResolver(formSchema), // This needs to be dynamic
    defaultValues: payloadForm.fields?.reduce((acc, field) => {
      if ('name' in field && field.name) { // Ensure field has a name property
        // @ts-ignore // field type is complex, handle specific blockTypes later
        acc[field.name] = field.defaultValue || "";
      }
      return acc;
    }, {} as Record<string, any>) || {},
  });

  function onSubmit(values: Record<string, any>) {
    setFormStatus(null);

    startTransition(async () => {
      try {
        // The submitContactForm action will need to be adapted
        // It should receive the form ID and the submitted values
        const result = await submitContactForm({
          formId: String(payloadForm.id),
          submissionData: values,
          tenantSlug: tenantSlug, // Pass the tenantSlug
        });
        
        if (result.success) {
          form.reset();
          setFormStatus({
            success: true,
            message: result.message || "Your message has been sent successfully!"
          });
        } else {
          setFormStatus({
            success: false,
            message: result.message || "Failed to send message. Please try again."
          });
          
          // Handle server-side validation errors if provided
          if (result.errors) {
            result.errors.forEach((error: { path: string; message: string }) => {
              form.setError(error.path as any, { 
                type: "server", 
                message: error.message 
              });
            });
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormStatus({
          success: false,
          message: "An unexpected error occurred. Please try again later."
        });
      }
    });
  }

  // Helper function to render appropriate input based on field type
  const renderField = (fieldConfig: any) => {
    // Ensure fieldConfig is an object and has a 'name' and 'blockType'
    if (typeof fieldConfig !== 'object' || !fieldConfig || !('name' in fieldConfig) || !('blockType' in fieldConfig)) {
      // Or handle this case more gracefully, e.g., log an error or return null
      return <p key={Math.random()}>Invalid field configuration</p>; 
    }
    
    const fieldName = fieldConfig.name;

    return (
      <FormField
        control={form.control}
        // @ts-ignore
        name={fieldName}
        key={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fieldConfig.label || fieldName}</FormLabel>
            <FormControl>
              {/* Basic input for now, expand with switch for blockType */}
              {fieldConfig.blockType === 'textarea' ? (
                <Textarea placeholder={fieldConfig.placeholder || ''} {...field} />
              ) : fieldConfig.blockType === 'email' ? (
                 <Input type="email" placeholder={fieldConfig.placeholder || ''} {...field} />
              ) : (
                <Input placeholder={fieldConfig.placeholder || ''} {...field} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form id={String(payloadForm.id)} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-4 rounded-lg shadow-sm">
        {formStatus && (
          <Alert variant={formStatus.success ? "default" : "destructive"}>
            <AlertDescription>{formStatus.message}</AlertDescription>
          </Alert>
        )}
        
        {payloadForm.fields?.map(renderField)}
        
        <Button 
          type="submit" 
          disabled={isPending || !payloadForm.fields || payloadForm.fields.length === 0} // Disable if no fields
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            payloadForm.submitButtonLabel || "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
} 