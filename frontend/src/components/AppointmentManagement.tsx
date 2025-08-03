import { useState, useEffect } from 'react'
import { getStatusColor } from '../utils/helpers'
import { apiService } from '../services/api'

interface Doctor {
  id: number
  firstName: string
  lastName: string
  specialization: string
  isActive: boolean
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
  const [patients, setPatients] = useState<any[]>([])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showPatientForm, setShowPatientForm] = useState(false)
  const [bookingStep, setBookingStep] = useState<'patient' | 'details' | 'confirm'>('patient')
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    address: ''
  })
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'consultation',
    notes: ''
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔍 Loading data...');
        console.log('🔍 Token in localStorage:', localStorage.getItem('token'));
        
        const [doctorsResponse, appointmentsResponse, patientsResponse] = await Promise.all([
          apiService.getAvailableDoctors(),
          apiService.getAppointments(),
          apiService.getPatients()
        ])
        
        if (doctorsResponse.data) {
          setDoctors(doctorsResponse.data)
        }
        
        if (appointmentsResponse.data) {
          setAppointments(appointmentsResponse.data)
        }

        if (patientsResponse.data) {
          setPatients(patientsResponse.data)
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        console.error('❌ Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          type: typeof error
        });
        setDoctors([])
        setAppointments([])
        setPatients([])
      }
    }
    
    loadData()
  }, [])

  // Step 1: Select or create patient
  const handlePatientSelection = (patientId: string, patientName: string) => {
    setNewAppointment({
      ...newAppointment,
      patientId,
      patientName
    })
    setBookingStep('details')
  }

  // Step 2: Fill appointment details
  const handleAppointmentDetails = () => {
    if (!newAppointment.doctorId || !newAppointment.appointmentDate || !newAppointment.appointmentTime) {
      alert('Please fill in all required fields')
      return
    }
    setBookingStep('confirm')
  }

  // Step 3: Confirm and book appointment
  const bookAppointment = async () => {
    try {
      // Check authentication first
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in. Please log in again.');
        window.location.href = '/login';
        return;
      }
      
      // Validate token by making a simple API call
      try {
        const testResponse = await apiService.getAppointments();
        if (testResponse.error) {
          console.log('❌ Token validation failed:', testResponse.error);
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        console.log('✅ Token validation successful');
      } catch (error) {
        console.log('❌ Token validation failed:', error);
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      
      // Format date properly
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const ddMmYyyyRegex = /^\d{2}-\d{2}-\d{4}$/;
      
      let formattedDate = newAppointment.appointmentDate;
      
      if (isoDateRegex.test(newAppointment.appointmentDate)) {
        console.log(`📅 Date already in ISO format: ${newAppointment.appointmentDate}`);
      } else if (ddMmYyyyRegex.test(newAppointment.appointmentDate)) {
        const dateParts = newAppointment.appointmentDate.split('-');
        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];
        formattedDate = `${year}-${month}-${day}`;
        console.log(`📅 Date conversion: ${newAppointment.appointmentDate} -> ${formattedDate}`);
      } else {
        throw new Error('Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD format.');
      }
      
      const appointmentData = {
        patientName: newAppointment.patientName,
        doctorId: parseInt(newAppointment.doctorId),
        appointmentDate: formattedDate,
        appointmentTime: newAppointment.appointmentTime,
        type: newAppointment.type,
        notes: newAppointment.notes
      };
      
      console.log('📅 Booking appointment with data:', appointmentData);
      console.log('🔍 Token in localStorage:', localStorage.getItem('token'));
      
      const response = await apiService.createAppointment(appointmentData)

      if (response.error) {
        console.error('❌ Appointment booking error:', response.error);
        alert(`Error booking appointment: ${response.error}`)
        return
      }

      if (response.data) {
        setAppointments([...appointments, response.data])
        resetBookingForm()
        alert('✅ Appointment booked successfully!')
      }
    } catch (error) {
      console.error('❌ Error in bookAppointment:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error
      });
      alert(`Failed to book appointment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const resetBookingForm = () => {
    setNewAppointment({
      patientId: '',
      patientName: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      type: 'consultation',
      notes: ''
    })
    setBookingStep('patient')
    setShowBookingForm(false)
    setShowPatientForm(false)
  }

  const createPatient = async () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.email || !newPatient.phone) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await apiService.createPatient(newPatient)
      if (response.error) {
        alert(response.error)
        return
      }
      
      if (response.data) {
        alert('✅ Patient created successfully!')
        setPatients([...patients, response.data])
        handlePatientSelection(response.data.id.toString(), `${newPatient.firstName} ${newPatient.lastName}`)
        setShowPatientForm(false)
        setNewPatient({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          gender: 'male',
          dateOfBirth: '',
          address: ''
        })
      }
    } catch (error) {
      alert('Failed to create patient')
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
      {/* Header */}
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

      {/* Create Patient Form */}
      {showPatientForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Patient</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="patientFirstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                id="patientFirstName"
                value={newPatient.firstName}
                onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label htmlFor="patientLastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                id="patientLastName"
                value={newPatient.lastName}
                onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="patientEmail"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700">
                Phone *
              </label>
              <input
                type="tel"
                id="patientPhone"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label htmlFor="patientGender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="patientGender"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="patientDateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="patientDateOfBirth"
                value={newPatient.dateOfBirth}
                onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="patientAddress" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="patientAddress"
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter address"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={createPatient}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Patient
              </button>
              <button
                onClick={() => setShowPatientForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Booking Wizard */}
      {showBookingForm && (
        <div className="bg-white shadow rounded-lg p-6">
          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${bookingStep === 'patient' ? 'text-blue-600' : bookingStep === 'details' || bookingStep === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${bookingStep === 'patient' ? 'border-blue-600 bg-blue-600 text-white' : bookingStep === 'details' || bookingStep === 'confirm' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 bg-gray-100'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Select Patient</span>
              </div>
              <div className={`w-8 h-0.5 ${bookingStep === 'details' || bookingStep === 'confirm' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${bookingStep === 'details' ? 'text-blue-600' : bookingStep === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${bookingStep === 'details' ? 'border-blue-600 bg-blue-600 text-white' : bookingStep === 'confirm' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 bg-gray-100'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Appointment Details</span>
              </div>
              <div className={`w-8 h-0.5 ${bookingStep === 'confirm' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${bookingStep === 'confirm' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${bookingStep === 'confirm' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-gray-100'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Confirm</span>
              </div>
            </div>
          </div>

          {/* Step 1: Patient Selection */}
          {bookingStep === 'patient' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Step 1: Select a Patient</h3>
              
              {/* Existing Patients */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Existing Patients</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientSelection(patient.id.toString(), `${patient.firstName} ${patient.lastName}`)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Create New Patient */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Or Create New Patient</h4>
                <button
                  onClick={() => setShowPatientForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Patient
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Appointment Details */}
          {bookingStep === 'details' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Step 2: Appointment Details</h3>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected Patient:</strong> {newAppointment.patientName}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    value={newAppointment.appointmentDate}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <select
                    id="appointmentTime"
                    value={newAppointment.appointmentTime}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointmentTime: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Appointment Type
                  </label>
                  <select
                    id="type"
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="routine_checkup">Routine Checkup</option>
                    <option value="specialist_visit">Specialist Visit</option>
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
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setBookingStep('patient')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ← Back
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAppointmentDetails}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {bookingStep === 'confirm' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Step 3: Confirm Appointment</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Appointment Summary</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Patient</p>
                    <p className="text-base text-gray-900">{newAppointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Doctor</p>
                    <p className="text-base text-gray-900">
                      {doctors.find(d => d.id.toString() === newAppointment.doctorId)?.firstName} {doctors.find(d => d.id.toString() === newAppointment.doctorId)?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-base text-gray-900">{newAppointment.appointmentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="text-base text-gray-900">{newAppointment.appointmentTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-base text-gray-900 capitalize">{newAppointment.type.replace('_', ' ')}</p>
                  </div>
                  {newAppointment.notes && (
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="text-base text-gray-900">{newAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setBookingStep('details')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ← Back
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={bookAppointment}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    ✅ Confirm & Book Appointment
                  </button>
                </div>
              </div>
            </div>
          )}
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