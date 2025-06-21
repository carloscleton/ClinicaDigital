# San Mathews Clínica e Laboratório Platform

## Overview

San Mathews Clínica e Laboratório is a comprehensive medical clinic platform built as a full-stack web application. It serves as both a patient-facing website and an administrative portal for managing appointments, doctors, testimonials, and contact messages. The application is designed to provide a seamless experience for patients to learn about services, book appointments, and connect with healthcare providers.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives with custom theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Built-in session handling with connect-pg-simple
- **API Design**: RESTful API with structured error handling

### Development Environment
- **Platform**: Replit with Node.js 20
- **Hot Reload**: Vite development server with HMR
- **Type Checking**: TypeScript with strict mode enabled
- **Package Manager**: npm with lockfile version 3

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: Authentication and user management
- **Doctors**: Professional profiles with specialties and credentials
- **Appointments**: Patient booking system with status tracking
- **Testimonials**: Patient reviews and ratings
- **Contact Messages**: General inquiries and communication

### Frontend Pages
- **Home**: Hero section, services overview, and stats display
- **Services**: Detailed service offerings and pricing
- **Specialties**: Medical specializations and treatments
- **Doctors**: Team profiles and qualifications
- **Testimonials**: Patient reviews and satisfaction metrics
- **Contact**: Appointment booking and contact forms
- **404**: Custom not found page

### UI Components
- **Shared Components**: Header navigation, footer, hero section, stats display
- **Form Components**: Appointment booking form with validation
- **UI Library**: Complete shadcn/ui implementation with custom medical theme

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Express server handles requests with structured middleware
3. Drizzle ORM manages database operations
4. PostgreSQL stores and retrieves data
5. Responses flow back through the same path with error handling

### Form Handling
1. React Hook Form captures user input
2. Zod schemas validate data on client and server
3. Validated data submits to appropriate API endpoints
4. Success/error feedback displays via toast notifications

### State Management
1. TanStack Query manages server state and caching
2. Local form state handled by React Hook Form
3. UI state managed through React hooks
4. Global notifications through toast system

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **@neondatabase/serverless**: PostgreSQL database connection
- **@radix-ui/***: Accessible UI component primitives
- **react-hook-form**: Form state management and validation
- **zod**: Schema validation for TypeScript

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **tailwindcss**: Utility-first CSS framework
- **@hookform/resolvers**: Zod integration for form validation

### UI Enhancement
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS class handling
- **lucide-react**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting

## Deployment Strategy

### Build Process
1. **Development**: `npm run dev` starts Vite dev server and Express backend
2. **Production Build**: 
   - Frontend: Vite builds optimized React bundle
   - Backend: esbuild bundles Express server for Node.js
3. **Database**: Drizzle handles schema migrations and pushes

### Environment Configuration
- **Development**: Hot reload with source maps and error overlay
- **Production**: Optimized bundles with environment-specific configurations
- **Database**: PostgreSQL connection via environment variables

### Replit Configuration
- **Modules**: Node.js 20, web server, PostgreSQL 16
- **Ports**: Frontend/backend on port 5000, external port 80
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## Changelog
- June 21, 2025. Initial setup
- June 21, 2025. Updated contact information to real clinic address in Baturité, CE: R Vereador Francisco Francilino, 1431 - Centro, Baturité, CE - CEP: 62.760-000, phone: 55(85)99408-6263, email: georgelucasamaro@hotmail.com
- June 21, 2025. Added Google Maps embed to contact page showing real clinic location in Baturité
- June 21, 2025. Updated clinic name throughout the website from "MedCare" to "San Mathews Clínica e Laboratório Ltda"

## User Preferences

Preferred communication style: Simple, everyday language.