'use server'
 
export interface PopulateTenantWithAIProps {
  message:string
  status: string
}
export async function populateTenantWithAI(prevState: PopulateTenantWithAIProps, formData: FormData) {
  const tenantId = formData.get('tenantId')

 
console.log(tenantId);

 
  return { message: 'Tenant populated with AI', status: "success" }
}