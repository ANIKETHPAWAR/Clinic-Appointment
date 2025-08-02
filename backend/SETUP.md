# Backend Setup Guide

## Prerequisites

Before starting, make sure you have:
- **Node.js** (version 16 or higher)
- **MySQL** server installed and running
- **npm** or **yarn** package manager

## Step 1: Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install
```

## Step 2: Database Setup

### Create MySQL Database
```sql
-- Connect to MySQL and run:
CREATE DATABASE front_desk_system;
```

### Configure Environment Variables
1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=front_desk_system
   ```

## Step 3: Understanding the Project Structure

```
backend/
├── src/
│   ├── entities/           # Database models (tables)
│   │   ├── user.entity.ts      # Front desk staff accounts
│   │   ├── doctor.entity.ts    # Doctor profiles
│   │   ├── patient.entity.ts   # Patient information
│   │   ├── appointment.entity.ts # Scheduled appointments
│   │   ├── queue.entity.ts     # Walk-in patient queue
│   │   └── index.ts            # Export all entities
│   ├── config/             # Configuration files
│   │   ├── database.config.ts  # Database connection settings
│   │   └── jwt.config.ts       # JWT authentication settings
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── env.example             # Environment variables template
```

## Step 4: Key Concepts You're Learning

### 1. **TypeORM Entities**
- These are TypeScript classes that represent database tables
- Decorators like `@Entity()`, `@Column()` define the table structure
- Relationships between tables are defined with decorators like `@OneToMany()`

### 2. **NestJS Modules**
- Modules group related functionality together
- Each feature (auth, users, doctors) will have its own module
- Modules can import other modules and share functionality

### 3. **Validation**
- Uses `class-validator` decorators to validate incoming data
- Automatically checks data types, required fields, email formats, etc.
- Prevents invalid data from reaching the database

### 4. **Environment Configuration**
- Sensitive data stored in environment variables
- Different configurations for development and production
- Keeps secrets out of your code

## Step 5: Test the Setup

```bash
# Start the development server
npm run start:dev
```

You should see:
```
🚀 Front Desk System API is running on: http://localhost:3001
📚 API Documentation available at: http://localhost:3001/api
```

## Next Steps

Once this is working, we'll create:
1. **Authentication Module** - Login/logout functionality
2. **Users Module** - Manage front desk staff
3. **Doctors Module** - CRUD operations for doctors
4. **Patients Module** - Patient management
5. **Appointments Module** - Booking and managing appointments
6. **Queue Module** - Walk-in patient queue management

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check if MySQL is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Port Already in Use**:
   - Change PORT in `.env` file
   - Or kill the process using the port

3. **TypeScript Errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check `tsconfig.json` configuration

## Learning Objectives

By the end of this setup, you should understand:
- How NestJS applications are structured
- How TypeORM entities work
- How environment variables are used
- How validation works in NestJS
- How modules are organized 