'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
// Import Payload UI components
import { FieldLabel, TextField } from '@payloadcms/ui'
import { FieldClientComponent } from 'payload'
// We might not need the base type import if we construct carefully
// import type { TextField as TextFieldType } from 'payload'

// Define the expected shape of the 'colors' group value
type ColorGroupValue = {
  primary?: string
  primaryForeground?: string
  secondary?: string
  secondaryForeground?: string
  accent?: string
  accentForeground?: string
  background?: string
  foreground?: string
}

type Props = {
  path: string
}

const colorFields: (keyof ColorGroupValue)[] = [
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'accent',
  'accentForeground',
  'background',
  'foreground',
]

// Function to generate a readable label from camelCase field name
const generateLabel = (fieldName: string): string => {
  const result = fieldName.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

function TenantFields(props: Props) {
  const { path: groupPath } = props // Rename props.path to groupPath for clarity

  // useField hook provides field state and utilities for the entire group
  // We don't need the group's value/setValue directly here anymore,
  // as each TextField will manage its own state via its path.
  // const { value, setValue } = useField<ColorGroupValue>({ path: groupPath })

  return (
    <div style={{ marginBottom: 'var(--field-margin-bottom)' }}>
      <h3 style={{ marginBottom: 'calc(var(--base-spacing) / 2)' }}>
        Custom Color Theme Editor
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--base-spacing)',
        }}
      >
        {colorFields.map((fieldName) => {
          // Construct the full path to the sub-field (e.g., "colors.primary")
          const fieldPath = `${groupPath}.${fieldName}`

          // Construct the minimal field object required by TextFieldClient type
          const minimalFieldObject = {
            name: fieldName, // Required property
            label: generateLabel(fieldName), // Seems required or useful
            // type: 'text', // Optional according to the error type Omit<..., "type">
            admin: { 
              // Add other client-specific admin props if needed/known
            }, 
            // Add other required properties from TextFieldClient if errors occur
            // For now, keep it minimal based on error feedback
          }

          return (
            <div key={fieldName}>
              {/* Use Payload's FieldLabel */}
              <FieldLabel
                label={generateLabel(fieldName)}
                path={fieldPath}
                required={false} // Assuming these are not strictly required
              />
              {/* Use Payload's TextField with the constructed field prop */}
              <TextField
                path={fieldPath}
                field={minimalFieldObject as any} // Use type assertion for now to bypass strict check
              />
            </div>
          )
        })}
      </div>
      {/* Optional: Display raw value for debugging the GROUP value */}
      {/* <pre style={{ gridColumn: '1 / -1' }}>{JSON.stringify(value, null, 2)}</pre> */}
    </div>
  )
}

export default TenantFields