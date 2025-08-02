import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { getStatusColor, getPriorityColor, formatTime } from '../utils/helpers'
import { handleApiError, validateRequiredFields } from '../utils/errorHandler'

interface QueueEntry {
  id: number
  patientName: string
  queueNumber: number
  status: 'waiting' | 'with_doctor' | 'completed' | 'cancelled' | 'no_show'
  priority: 'normal' | 'urgent' | 'emergency'
  reason?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const QueueManagement = () => {
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([])
  const [newEntry, setNewEntry] = useState({
    patientName: '',
    priority: 'normal' as 'normal' | 'urgent' | 'emergency',
    reason: '',
    notes: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const response = await apiService.getQueue()
        if (response.data) {
          setQueueEntries(response.data)
        }
      } catch (error) {

        // Fallback to empty array if API fails
        setQueueEntries([])
      }
    }
    
    loadQueue()
  }, [])

  const addToQueue = async () => {
    if (!validateRequiredFields(newEntry, ['patientName'])) return

    try {
      const response = await apiService.addToQueue({
        name: newEntry.patientName,
        priority: newEntry.priority,
        reason: newEntry.reason,
        notes: newEntry.notes
      })
      
      if (response.error) {
        handleApiError(response.error)
        return
      }
      
      if (response.data) {
        setQueueEntries([...queueEntries, response.data])
        setNewEntry({ 
          patientName: '', 
          priority: 'normal',
          reason: '',
          notes: ''
        })
        setShowAddForm(false)
      }
    } catch (error) {
      handleApiError(error, 'Failed to add patient to queue')
    }
  }

  const updateStatus = async (id: number, status: QueueEntry['status']) => {
    try {
      const response = await apiService.updateQueueStatus(id, status)
      if (response.error) {
        handleApiError(response.error)
        return
      }
      
      if (response.data) {
        setQueueEntries(queueEntries.map(entry => 
          entry.id === id ? { ...entry, status } : entry
        ))
      }
    } catch (error) {
      handleApiError(error, 'Failed to update queue status')
    }
  }

  const removeFromQueue = async (id: number) => {
    try {
      const response = await apiService.removeFromQueue(id)
      if (response.error) {
        handleApiError(response.error)
        return
      }
      
      setQueueEntries(queueEntries.filter(entry => entry.id !== id))
    } catch (error) {
      handleApiError(error, 'Failed to remove patient from queue')
    }
  }



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage patient queue and track their status
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Patient
        </button>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Patient</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                id="patientName"
                value={newEntry.patientName}
                onChange={(e) => setNewEntry({ ...newEntry, patientName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                value={newEntry.priority}
                onChange={(e) => setNewEntry({ ...newEntry, priority: e.target.value as 'normal' | 'urgent' | 'emergency' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason
              </label>
              <input
                type="text"
                id="reason"
                value={newEntry.reason}
                onChange={(e) => setNewEntry({ ...newEntry, reason: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Reason for visit"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={addToQueue}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add to Queue
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {queueEntries.map((entry) => (
            <li key={entry.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          #{entry.queueNumber}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{entry.patientName}</p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(entry.priority)}`}>
                          {entry.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {entry.reason && `Reason: ${entry.reason}`}
                        {entry.reason && entry.notes && ' • '}
                        {entry.notes && `Notes: ${entry.notes}`}
                      </p>
                      <p className="text-sm text-gray-400">Added at {formatTime(entry.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={entry.status}
                      onChange={(e) => updateStatus(entry.id, e.target.value as QueueEntry['status'])}
                      className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="waiting">Waiting</option>
                      <option value="with_doctor">With Doctor</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no_show">No Show</option>
                    </select>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => removeFromQueue(entry.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {queueEntries.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No patients in queue</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new patient to the queue.</p>
        </div>
      )}
    </div>
  )
}

export default QueueManagement 