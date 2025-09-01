import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-\/]+/g, '')
    .toLowerCase()

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    // If a value is provided (manual entry), format and return it
    if (typeof value === 'string' && value.trim() !== '') {
      return format(value)
    }

    // If no value provided and this is a create operation, generate from fallback
    if (operation === 'create') {
      const fallbackData = (data && data[fallback]) || (originalDoc && originalDoc[fallback])

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    // For update operations without a value, keep the existing slug
    if (operation === 'update' && originalDoc && originalDoc.slug) {
      return originalDoc.slug
    }

    return value
  }