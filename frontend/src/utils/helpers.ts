// Common helper functions used across components

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'waiting': return 'bg-yellow-100 text-yellow-800'
    case 'with_doctor': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    case 'no_show': return 'bg-gray-100 text-gray-800'
    case 'booked': return 'bg-blue-100 text-blue-800'
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'emergency': return 'bg-red-100 text-red-800'
    case 'urgent': return 'bg-orange-100 text-orange-800'
    case 'normal': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString()
} 