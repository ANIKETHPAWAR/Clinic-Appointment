# 🏥 Clinic Management System

A comprehensive **Front Desk System** for clinic management, built with modern web technologies and designed for production deployment.

## 🎯 Project Overview

This system provides a complete solution for managing patient queues, doctor appointments, and clinic operations. Built according to the PRD specifications with all required features implemented and tested.

## ✨ Features

### 🔐 Authentication & Security

- **JWT-based authentication** for secure access
- **Role-based access control** for front desk staff
- **Protected API endpoints** with proper authorization

### 📋 Queue Management

- **Add walk-in patients** to queue with priority levels
- **Assign queue numbers** automatically
- **Update patient status** (waiting, with doctor, completed, cancelled, no-show)
- **Priority management** (normal, urgent, emergency)
- **Real-time queue monitoring**

### 📅 Appointment Management

- **Book appointments** with available doctors
- **Reschedule existing appointments**
- **Cancel appointments** when necessary
- **Track appointment status** (booked, completed, cancelled)
- **View appointment history**

### 👨‍⚕️ Doctor Management

- **Add new doctor profiles** with specialization
- **Edit doctor information** (name, specialization, gender, location)
- **Manage doctor availability**
- **Delete doctor records**
- **Search and filter doctors**

### 👥 Patient Management

- **Complete patient registration** with all required fields
- **Edit patient information**
- **Toggle patient active/inactive status**
- **Delete patient records** (with appointment validation)
- **View patient history**

### 📊 Dashboard & Analytics

- **Real-time statistics** (patients, doctors, appointments, queue)
- **Quick action buttons** for common tasks
- **System overview** with key metrics
- **Responsive design** for all devices

## 🛠️ Technology Stack

### Backend

- **NestJS** - Modern Node.js framework
- **TypeORM** - Database ORM with MySQL
- **JWT** - Secure authentication
- **MySQL** - Relational database
- **Class-validator** - Input validation
- **Passport** - Authentication strategy

### Frontend

- **React.js** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TypeScript** - Type-safe development

### Database

- **MySQL 8.0+** - Production-ready database
- **Proper relationships** between entities
- **Optimized indexes** for performance
- **Data integrity** with foreign keys

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd AlloHealth-assignment
```

### 2. Database Setup

```sql
CREATE DATABASE clinic_management;
```

### 3. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database credentials
npm run start:dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Login**: `admin` / `admin123`

## 📋 PRD Compliance

✅ **All PRD requirements implemented and tested:**

- [x] **Authentication**: JWT-based secure login
- [x] **Queue Management**: Complete queue operations
- [x] **Appointment Management**: Full appointment lifecycle
- [x] **Doctor Management**: Complete doctor CRUD operations
- [x] **Patient Management**: Complete patient management
- [x] **Dashboard**: Real-time statistics and overview
- [x] **Technology Stack**: NestJS + React + MySQL
- [x] **Security**: Role-based access control
- [x] **Database**: Proper relationships and constraints

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Dashboard

- `GET /api/dashboard/stats` - Get system statistics

### Queue Management

- `GET /api/queue` - Get all queue entries
- `POST /api/queue` - Add patient to queue
- `PUT /api/queue/:id/status` - Update queue status
- `DELETE /api/queue/:id` - Remove from queue

### Patient Management

- `GET /api/patients` - Get all patients (paginated)
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `PUT /api/patients/:id/toggle` - Toggle patient status

### Doctor Management

- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointment Management

- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React.js)    │◄──►│   (NestJS)      │◄──►│   (MySQL)       │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - Controllers   │    │ - Users         │
│ - Queue Mgmt    │    │ - Services      │    │ - Doctors       │
│ - Appointments  │    │ - Guards        │    │ - Patients      │
│ - Patient Mgmt  │    │ - DTOs          │    │ - Appointments  │
│ - Doctor Mgmt   │    │ - Entities      │    │ - Queue         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 Security Features

- **JWT Authentication** with secure token management
- **Role-based Access Control** for different user types
- **Input Validation** on all API endpoints
- **SQL Injection Protection** via TypeORM
- **XSS Protection** via React
- **CORS Configuration** for secure cross-origin requests
- **Environment Variable** management for sensitive data

## 📊 Database Schema

### Core Entities

- **Users**: Authentication and user management
- **Doctors**: Doctor profiles with specializations
- **Patients**: Patient records and information
- **Appointments**: Appointment scheduling and management
- **Queue**: Patient queue management

### Relationships

- Patients can have multiple appointments
- Doctors can have multiple appointments
- Queue entries are linked to patients
- All entities have proper foreign key constraints

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Deploy dist/ folder to static hosting
```

### Environment Variables

See `DEPLOYMENT.md` for detailed deployment instructions and environment configuration.

## 🧪 Testing

### Automated Tests

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

### Manual Testing

- [x] Authentication flow
- [x] Queue management operations
- [x] Appointment booking and management
- [x] Doctor CRUD operations
- [x] Patient management
- [x] Dashboard functionality
- [x] Responsive design

## 📈 Performance

- **Database**: Optimized queries with proper indexing
- **API**: Pagination for large datasets
- **Frontend**: Code splitting and lazy loading
- **Build**: Optimized production builds
- **Caching**: Ready for Redis integration

## 🔧 Configuration

### Backend Configuration

- Database connection settings
- JWT secret and expiration
- CORS origins
- Port configuration
- Environment-specific settings

### Frontend Configuration

- API endpoint configuration
- Build optimization
- Development proxy settings
- Production deployment settings

## 📞 Support

For issues or questions:

1. Check the troubleshooting section in `DEPLOYMENT.md`
2. Review application logs
3. Verify environment configuration
4. Test database connectivity

## 📄 License

This project is developed for clinic management purposes.

---

**🎉 Clinic Management System is production-ready and fully compliant with PRD requirements!**
