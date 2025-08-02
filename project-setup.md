# Project Setup Guide - Step by Step

## Phase 1: Backend Setup (NestJS + TypeORM + MySQL)

### Step 1: Initialize Backend Project
```bash
# Create backend directory and initialize NestJS project
mkdir backend
cd backend
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcryptjs class-validator class-transformer
npm install --save-dev @nestjs/cli @types/node typescript
```

### Step 2: Database Design
We'll create these entities:
- **User**: Front desk staff accounts
- **Doctor**: Doctor profiles with specializations
- **Patient**: Patient information
- **Appointment**: Scheduled appointments
- **Queue**: Walk-in patient queue management

### Step 3: Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control

## Phase 2: Frontend Setup (React.js + Tailwind CSS)

### Step 1: Initialize React Project
```bash
# Create React app with Vite for faster development
npx create-react-app frontend --template typescript
cd frontend
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Project Structure
```
frontend/src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   └── forms/          # Form components
├── pages/              # Page components
│   ├── Login/
│   ├── Dashboard/
│   ├── Queue/
│   ├── Appointments/
│   └── Doctors/
├── context/            # React Context for state management
├── hooks/              # Custom React hooks
├── services/           # API service functions
└── types/              # TypeScript type definitions
```

### Step 3: State Management
- React Context API for global state
- Local state for component-specific data
- Custom hooks for reusable logic

## Phase 3: Development Approach

### Learning-Focused Development
1. **Start with Backend**: Build APIs first to understand data flow
2. **Database First**: Design entities and relationships
3. **Authentication**: Implement secure login system
4. **Core Features**: Build queue and appointment management
5. **Frontend Integration**: Connect React to backend APIs
6. **UI/UX**: Polish the interface with Tailwind CSS

### Key Learning Points
- **TypeORM**: Understanding ORM concepts and database relationships
- **JWT Authentication**: Token-based authentication flow
- **React Hooks**: useState, useEffect, useContext, custom hooks
- **API Integration**: Axios for HTTP requests
- **State Management**: Context API vs local state
- **Routing**: React Router for navigation
- **Form Handling**: Controlled components and validation

## Phase 4: Testing and Deployment
- API testing with Postman/Insomnia
- Frontend testing with React Testing Library
- Deployment preparation 