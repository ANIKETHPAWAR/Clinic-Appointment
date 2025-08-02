import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { getStatusColor } from '../utils/helpers'

interface Doctor {
  id: number
  name: string
  specialization: string
  available: boolean
}

interface Appointment {
  id: number
  patientName: string
  doctorName: string
  date: string
  time: string
  status: 'booked' | 'completed' | 'cancelled'
  notes?: string
}

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctorId: '',
    date: '',
    time: '',
    notes: ''
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsResponse, appointmentsResponse] = await Promise.all([
          apiService.getDoctors(),
          apiService.getAppointments()
        ])
        
        if (doctorsResponse.data) {
          setDoctors(doctorsResponse.data)
        }
        
        if (appointmentsResponse.data) {
          setAppointments(appointmentsResponse.data)
        }
      } catch (error) {

        // Fallback to empty arrays if API fails
        setDoctors([])
        setAppointments([])
      }
    }
    
    loadData()
  }, [])

  const bookAppointment = async () => {
    if (!newAppointment.patientName || !newAppointment.doctorId || !newAppointment.date || !newAppointment.time) {
      return
    }

    try {
      const response = await apiService.createAppointment({
        patientName: newAppointment.patientName,
        doctorId: parseInt(newAppointment.doctorId),
        date: newAppointment.date,
        time: newAppointment.time,
        notes: newAppointment.notes
      })
      
      if (response.error) {
        alert(response.error)
        return
      }
      
      if (response.data) {
        setAppointments([...appointments, response.data])
        setNewAppointment({ patientName: '', doctorId: '', date: '', time: '', notes: '' })
        setShowBookingForm(false)
      }
    } catch (error) {
      alert('Failed to book appointment')
    }
  }

  const updateAppointmentStatus = async (id: number, status: Appointment['status']) => {
    try {
      const response = await apiService.updateAppointment(id, { status })
      if (response.error) {
        alert(response.error)
        return
      }
      
      if (response.data) {
        setAppointments(appointments.map(appointment => 
          appointment.id === id ? { ...appointment, status } : appointment
        ))
      }
    } catch (error) {
      alert('Failed to update appointment status')
    }
  }

  const cancelAppointment = async (id: number) => {
    try {
      const response = await apiService.deleteAppointment(id)
      if (response.error) {
        alert(response.error)
        return
      }
      
      setAppointments(appointments.filter(appointment => appointment.id !== id))
    } catch (error) {
      alert('Failed to cancel appointment')
    }
  }



  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Book and manage patient appointments
          </p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Appointment
        </button>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Book New Appointment</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                id="patientName"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                Doctor
              </label>
              <select
                id="doctor"
                value={newAppointment.doctorId}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a doctor</option>
                {doctors.filter(d => d.available).map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <select
                id="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Optional notes about the appointment"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={bookAppointment}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Book Appointment
              </button>
              <button
                onClick={() => setShowBookingForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {appointment.doctorName} • {appointment.date} at {appointment.time}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={appointment.status}
                      onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as Appointment['status'])}
                      className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="booked">Booked</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
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

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by booking a new appointment.</p>
        </div>
      )}
    </div>
  )
}

export default AppointmentManagement 