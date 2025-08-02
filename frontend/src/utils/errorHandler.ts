// Common error handling utilities

export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  const message = error?.message || error?.error || defaultMessage
  alert(message)
}

export const validateRequiredFields = (data: Record<string, any>, requiredFields: string[]): boolean => {
  for (const field of requiredFields) {
    if (!data[field] || !data[field].toString().trim()) {
      alert(`Please fill in ${field}`)
      return false
    }
  }
  return true
} 