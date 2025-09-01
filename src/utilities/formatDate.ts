/**
 * Formats a date string into a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Format as DD.MM.YYYY (Slovenian format)
    return date.toLocaleDateString('sl-SI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
} 