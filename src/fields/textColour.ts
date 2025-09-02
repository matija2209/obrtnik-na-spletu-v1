import { Field } from "payload"

// Define the shared color options once
const colorOptions = [
  { label: 'Inherit', value: 'inherit' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Accent', value: 'accent' },
  { label: 'Dark', value: 'dark' },
  { label: 'Dark 80%', value: 'dark-80' },
  { label: 'Dark 50%', value: 'dark-50' },
  { label: 'White', value: 'white' },
  { label: 'White 80%', value: 'white-80' },
  { label: 'White 50%', value: 'white-50' },
  { label: 'Muted', value: 'muted' },
]

// Title color field using select type
export const titleColor = (): Field => ({
  name: 'tc',
  label: {
    sl: 'Barva naslova',
    de: 'Titelfarbe',
    en: 'Title Color',
  },
  type: 'select',
  options: colorOptions,
  defaultValue: 'inherit',
  admin: {
    description: {
      sl: 'Barva besedila za naslov',
      de: 'Textfarbe für den Titel',
      en: 'Text color for the title',
    },
  },
})

// Subtitle color field using select type
export const subtitleColor = (): Field => ({
  name: 'sc',
  label: {
    sl: 'Barva podnaslova',
    de: 'Untertitelfarbe', 
    en: 'Subtitle Color',
  },
  type: 'select',
  options: colorOptions,
  defaultValue: 'inherit',
  admin: {
    description: {
      sl: 'Barva besedila za podnaslov',
      de: 'Textfarbe für den Untertitel',
      en: 'Text color for the subtitle',
    },
  },
})

// Description color field using select type
export const descriptionColor = (): Field => ({
  name: 'dc',
  label: {
    sl: 'Barva opisa',
    de: 'Beschreibungsfarbe',
    en: 'Description Color', 
  },
  type: 'select',
  options: colorOptions,
  defaultValue: 'inherit',
  admin: {
    description: {
      sl: 'Barva besedila za opis',
      de: 'Textfarbe für die Beschreibung', 
      en: 'Text color for the description',
    },
  },
})

// Export all three as an array for easy use
export const textColors = [titleColor(), subtitleColor(), descriptionColor()]

// Default export for backward compatibility
export default { titleColor, subtitleColor, descriptionColor }