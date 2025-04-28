import * as z from "zod";

export const orderFormSchema = z.object({
  name: z.string().min(2, {
    message: "Ime mora vsebovati vsaj 2 znaka.",
  }),
  email: z.string().email({
    message: "Prosimo, vnesite veljaven e-poštni naslov.",
  }).optional(),
  phone: z.string().optional(),
  service: z.enum([
    "Masaža",
    "Nega nog",
    "Permanentno lakiranje",
    "Limfna drenaža",
    "Anticelulitni tretmaji",
    "Anti age tretma",
    "Energijski tretmaji"
  ], {
    required_error: "Prosimo, izberite storitev.",
  }),
  message: z.string().optional().or(z.literal("")),
}).refine(
  (data) => data.email || data.phone,
  {
    message: "Vnesite e-pošto ali telefonsko številko.",
    path: ["email"],
  }
);

export type ContactFormData = z.infer<typeof orderFormSchema>; 