'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useState } from "react";
import { submitContactForm } from "@/actions/form";

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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ContactForm() {

  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  
  // Define form schema
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Ime mora vsebovati vsaj 2 znaka."
    }),
    email: z.string().email({
      message: "Vnesite veljaven e-poštni naslov."
    }),
    message: z.string().min(10, {
      message: "Sporočilo mora vsebovati vsaj 10 znakov."
    }),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormStatus(null);

    startTransition(async () => {
      try {
        const result = await submitContactForm(values);
        
        if (result.success) {
          form.reset();
          setFormStatus({
            success: true,
            message: "Vaše sporočilo je bilo uspešno poslano!"
          });
        } else {
          setFormStatus({
            success: false,
            message: result.message || "Napaka pri pošiljanju sporočila. Poskusite znova."
          });
          
          // If there are validation errors, set them in the form
          if (result.errors) {
            result.errors.forEach(error => {
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
          message: "Prišlo je do nepričakovane napake. Poskusite znova kasneje."
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form id="contact" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-4 rounded-lg shadow-sm">
        {formStatus && (
          <Alert variant={formStatus.success ? "default" : "destructive"}>
            <AlertDescription>{formStatus.message}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ime</FormLabel>
              <FormControl>
                <Input placeholder="Janez Novak" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-pošta</FormLabel>
              <FormControl>
                <Input placeholder="janez@primer.si" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sporočilo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Vaše sporočilo..." 
                  className="h-24 resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isPending}
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Pošiljanje...
            </>
          ) : (
            "Pošlji"
          )}
        </Button>
      </form>
    </Form>
  );
} 