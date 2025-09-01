import { ContainedSection } from "@/components/layout/container-section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MissingFieldsAlertProps {
  missingFields?: string[]
  sectionName?: string
}

export const MissingFieldsAlert = ({
  missingFields,
  sectionName,
}: MissingFieldsAlertProps) => {
  const title = sectionName
    ? `Missing required fields in ${sectionName}`
    : "Missing required fields"
  const description =
    missingFields && missingFields.length > 0
      ? `Please ensure the following required fields are filled: ${missingFields.join(
          ", "
        )}.`
      : "Please ensure all required fields for the selected template are filled."

  return (
    <ContainedSection overlayClassName="bg-gray-100">
      <div>
        <Alert variant="default">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      </div>
    </ContainedSection>
  )
}

export default MissingFieldsAlert 