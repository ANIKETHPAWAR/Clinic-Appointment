import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

interface Doctor {
  id: number
  firstName: string
  lastName: string
  specialization: string
  gender: 'male' | 'female' | 'other'
  location: string
  isActive: boolean
  email: string
  phone: string
}

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [newDoctor, setNewDoctor] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    gender: 'male' as 'male' | 'female' | 'other',
    location: '',
    isActive: true,
    email: '',
    phone: ''
  })

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await apiService.getDoctors()
        if (response.data) {
          setDoctors(response.data)
        }
      } catch (error) {

        // Fallback to empty array if API fails
        setDoctors([])
      }
    }
    
    loadDoctors()
  }, [])

  const addDoctor = async () => {
    if (!newDoctor.firstName || !newDoctor.lastName || !newDoctor.specialization || !newDoctor.location) return

    try {
      console.log('👨‍⚕️ Creating doctor with data:', newDoctor);
      const response = await apiService.createDoctor(newDoctor)
      if (response.error) {
        alert(response.error)
        return
      }
      
      if (response.data) {
        setDoctors([...doctors, response.data])
        setNewDoctor({
          firstName: '',
          lastName: '',
          specialization: '',
          gender: 'male',
          location: '',
          isActive: true,
          email: '',
          phone: ''
        })
        setShowAddForm(false)
      }
    } catch (error) {
      alert('Failed to add doctor')
    }
  }

  const updateDoctor = async () => {
    if (!editingDoctor || !newDoctor.firstName || !newDoctor.lastName || !newDoctor.specialization || !newDoctor.location) return

    try {
      const response = await apiService.updateDoctor(editingDoctor.id, newDoctor)
      if (response.error) {
        alert(response.error)
        return
      }
      
      if (response.data) {
        setDoctors(doctors.map(doctor => 
          doctor.id === editingDoctor.id ? { ...doctor, ...newDoctor } : doctor
        ))
        setEditingDoctor(null)
        setNewDoctor({
          firstName: '',
          lastName: '',
          specialization: '',
          gender: 'male',
          location: '',
          isActive: true,
          email: '',
          phone: ''
        })
      }
    } catch (error) {
      alert('Failed to update doctor')
    }
  }

  const deleteDoctor = async (id: number) => {
    try {
      const response = await apiService.deleteDoctor(id)
      if (response.error) {
        alert(response.error)
        return
      }
      
      setDoctors(doctors.filter(doctor => doctor.id !== id))
    } catch (error) {
      alert('Failed to delete doctor')
    }
  }

  const toggleDoctorActive = async (id: number) => {
    try {
      const response = await apiService.toggleDoctorActive(id)
      if (response.error) {
        alert(response.error)
        return
      }
      
      if (response.data) {
        setDoctors(doctors.map(doctor => 
          doctor.id === id ? { ...doctor, isActive: !doctor.isActive } : doctor
        ))
      }
    } catch (error) {
      alert('Failed to toggle doctor status')
    }
  }

  const editDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setNewDoctor({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialization: doctor.specialization,
      gender: doctor.gender,
      location: doctor.location,
      isActive: doctor.isActive,
      email: doctor.email,
      phone: doctor.phone
    })
  }

  const cancelEdit = () => {
    setEditingDoctor(null)
    setNewDoctor({
      firstName: '',
      lastName: '',
      specialization: '',
      gender: 'male',
      location: '',
      isActive: true,
      email: '',
      phone: ''
    })
  }

  const specializations = [
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Dermatology', value: 'dermatology' },
    { label: 'Endocrinology', value: 'endocrinology' },
    { label: 'Gastroenterology', value: 'gastroenterology' },
    { label: 'General Medicine', value: 'general_medicine' },
    { label: 'Gynecology', value: 'gynecology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Oncology', value: 'oncology' },
    { label: 'Orthopedics', value: 'orthopedics' },
    { label: 'Pediatrics', value: 'pediatrics' },
    { label: 'Psychiatry', value: 'psychiatry' },
    { label: 'Radiology', value: 'radiology' },
    { label: 'Surgery', value: 'surgery' },
    { label: 'Urology', value: 'urology' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage doctor profiles and their availability
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Doctor
        </button>
      </div>

      {/* Add/Edit Doctor Form */}
      {(showAddForm || editingDoctor) && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={newDoctor.firstName}
                onChange={(e) => setNewDoctor({ ...newDoctor, firstName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={newDoctor.lastName}
                onChange={(e) => setNewDoctor({ ...newDoctor, lastName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <select
                id="specialization"
                value={newDoctor.specialization}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select specialization</option>
                {specializations.map(spec => (
                  <option key={spec.value} value={spec.value}>{spec.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                value={newDoctor.gender}
                onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location/Room
              </label>
              <input
                type="text"
                id="location"
                value={newDoctor.location}
                onChange={(e) => setNewDoctor({ ...newDoctor, location: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Room 101"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="doctor@clinic.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={newDoctor.phone}
                onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+1-555-0123"
              />
            </div>
            <div className="flex items-center">
              <input
                id="isActive"
                type="checkbox"
                checked={newDoctor.isActive}
                onChange={(e) => setNewDoctor({ ...newDoctor, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={editingDoctor ? updateDoctor : addDoctor}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
              </button>
              <button
                onClick={editingDoctor ? cancelEdit : () => setShowAddForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctors List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {doctor.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {doctor.specialization} • {doctor.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doctor.email} • {doctor.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleDoctorActive(doctor.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        doctor.isActive 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                      title={doctor.isActive ? 'Set as Inactive' : 'Set as Active'}
                    >
                      {doctor.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => editDoctor(doctor)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteDoctor(doctor.id)}
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

      {doctors.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new doctor.</p>
        </div>
      )}
    </div>
  )
}

export default DoctorManagement 