import { UseFormReturn, useForm } from "react-hook-form"
import { ContactFormData, orderFormSchema } from "@/lib/schemas/contact-form-schema"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { submitContactForm } from "@/actions/form"
import { redirect } from "next/navigation"
import { CheckCircle, AlertCircle } from "lucide-react"

const OrderForm = () => {
    const [isPending, startTransition] = useTransition()
    const formRef = useRef<HTMLFormElement>(null)
    const [success, setSuccess] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    
    // Initialize form
    const form = useForm<ContactFormData>({
      resolver: zodResolver(orderFormSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        service: undefined,
        message: "",
      },
    })
    
    // Form action handler
    const formAction = async (formData: FormData) => {
      // Clear any previous errors
      setFormError(null)
      
      // Client-side validation before server submission
      const isValid = await form.trigger(["name", "service"])
      if (!isValid) {
        setFormError("Prosimo, izpolnite vsa obvezna polja.")
        return
      }
      
      // Check if either email or phone is provided
      const email = form.getValues("email")
      const phone = form.getValues("phone")
      if (!email && !phone) {
        setFormError("Vnesite e-pošto ali telefonsko številko.")
        form.setError("email", {
          type: "manual",
          message: "Vnesite e-pošto ali telefonsko številko.",
        })
        return
      }
      
      startTransition(async () => {
        try {
          // Get current form values
          const formValues = form.getValues()
          
          // Ensure all form values are included in the FormData
          Object.entries(formValues).forEach(([key, value]) => {
            // Only set if the value exists and is not already in the FormData
            if (value && !formData.has(key)) {
              formData.set(key, value)
            }
          })
          
          // Log form data for debugging
          console.log("Form data being submitted:", {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            service: formData.get("service"),
            message: formData.get("message"),
          })
          
          // Ensure required fields are set
          if (!formData.get("name") || !formData.get("service")) {
            setFormError("Prosimo, izpolnite vsa obvezna polja.")
            return
          }
          
          // Extract values from FormData for the server action
          const submitData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            message: `
              Service: ${formData.get("service")}
              Phone: ${formData.get("phone") || "Not provided"}
              Message: ${formData.get("message") || "No additional message"}
            `,
          }
          
          console.log("Submitting form to server action...");
          const result = await submitContactForm(submitData)
          console.log("Server action response:", result);
          
          if (result.success) {
            console.log("Form submission successful!");
            setSuccess(true)
            form.reset()
            setTimeout(() => {
              redirect("/hvala-za-povprasevanje")
            }, 1000)
          } else {
            // Handle errors
            console.error("Form submission errors:", result.message, result.errors)
            setFormError(result.message || "Prišlo je do napake pri pošiljanju. Prosimo, poskusite znova.")
            if (result.errors) {
              result.errors.forEach((error) => {
                const fieldName = error.path as keyof ContactFormData
                form.setError(fieldName, {
                  type: "manual",
                  message: error.message || "Napaka pri validaciji",
                })
              })
            }
          }
        } catch (error) {
          console.error("Form submission error:", error)
          setFormError("Prišlo je do nepričakovane napake. Prosimo, poskusite znova.")
        }
      })
    }
    
    return (
      <>
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Sporočilo uspešno poslano!</p>
              <p className="text-green-700 text-sm">Preusmerjamo vas...</p>
            </div>
          </div>
        )}
        
        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-700">{formError}</p>
              <p className="text-red-600 text-sm">Prosimo, poskusite znova ali nas kontaktirajte neposredno.</p>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form
            ref={formRef}
            className="space-y-6 rounded-lg p-6 bg-white/5 backdrop-blur-sm border border-gray-100/10 shadow-md"
            action={formAction}
            onSubmit={(e) => {
              // Additional client-side validation              
              // Ensure either email or phone is provided
              const email = form.getValues("email")
              const phone = form.getValues("phone")
              if (!email && !phone) {
                form.setError("email", {
                  type: "manual",
                  message: "Vnesite e-pošto ali telefonsko številko.",
                })
              }
              
              // Service validation
              const service = form.getValues("service")
              if (!service) {
                form.setError("service", {
                  type: "manual",
                  message: "Prosimo, izberite storitev."
                })
              }
              
              // Manually add form values to the FormData if needed
              const formData = new FormData(e.currentTarget)
              const currentValues = form.getValues()
              
              // Ensure all form values are included in the FormData
              Object.entries(currentValues).forEach(([key, value]) => {
                if (value && !formData.get(key)) {
                  formData.set(key, value)
                }
              })
            }}
          >
            <p className="text-xs text-muted-foreground mb-4">Polja označena z * so obvezna.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Ime in priimek *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Vnesite vaše ime in priimek" 
                        {...field} 
                        className="rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">E-pošta</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="vase.ime@primer.si" 
                        {...field} 
                        className="rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Telefonska številka</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="041 123 456" 
                        {...field} 
                        className="rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Izberite storitev *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      name="service"
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all">
                          <SelectValue placeholder="Izberite storitev" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Masaža">Masaža</SelectItem>
                        <SelectItem value="Nega nog">Nega nog</SelectItem>
                        <SelectItem value="Permanentno lakiranje">Permanentno lakiranje</SelectItem>
                        <SelectItem value="Limfna drenaža">Limfna drenaža</SelectItem>
                        <SelectItem value="Anticelulitni tretmaji">Anticelulitni tretmaji</SelectItem>
                        <SelectItem value="Anti age tretma">Anti age tretma</SelectItem>
                        <SelectItem value="Energijski tretmaji">Energijski tretmaji</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Dodatne informacije (neobvezno)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Opišite svoje potrebe, želje ali vprašanja..." 
                      className="min-h-[120px] rounded-md border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full py-6 rounded-md font-medium text-base transition-all hover:shadow-lg"
              disabled={isPending || success}
            >
              {isPending ? 
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Pošiljanje...
                </span> : 
                success ? 
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Poslano!
                </span> : 
                "Pošlji povpraševanje"
              }
            </Button>
            
            <p className="text-xs text-center text-muted-foreground pt-2">
              Z oddajo obrazca se strinjate s politiko zasebnosti.
            </p>
          </form>
        </Form>
      </>
    )
  }

export default OrderForm