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
- June 21, 2025. Updated phone number in header to 55(85)99408-6263 for both desktop and mobile views
- June 21, 2025. Moved Dashboard menu item to first position (before Início) and added highlight styling with blue background
- June 21, 2025. Added comprehensive sidebar navigation to dashboard with 9 sections: Dashboard, Agenda Semanal (highlighted), Clínicas, Profissionais, Especialidades, Serviços, Pacientes, Agendamentos, and Configurações
- June 21, 2025. Removed sidebar navigation from dashboard per user request, returning to clean single-page layout with tabs for different sections
- June 21, 2025. Restored sidebar navigation in dashboard per user request to return to previous state with 9 navigation sections
- June 21, 2025. Removed "Dashboard" and "Agendamentos" options from sidebar navigation, keeping 7 sections: Agenda Semanal (highlighted), Clínicas, Profissionais, Especialidades, Serviços, Pacientes, and Configurações
- June 21, 2025. Migrated to Supabase integration with @supabase/supabase-js client library using provided API credentials (URL: https://zdqcyemiwglybvpfczya.supabase.co). System configured for both in-memory storage and Supabase connectivity, currently using memory storage due to RLS policies on Supabase tables. Database schema supports doctors, testimonials, appointments, users, and contact_messages tables.
- June 21, 2025. Implemented complete CRUD system for professionals management with full API endpoints (POST, GET, PUT, DELETE /api/doctors) and comprehensive dashboard interface. System includes form validation, real-time updates, and professional management UI integrated in dashboard sidebar navigation under "Profissionais" section. All CRUD operations tested and verified working with authentic clinic data.
- June 21, 2025. Added comprehensive dark mode support with light/dark/system theme toggle. Implemented ThemeProvider context, ThemeToggle component with dropdown interface matching user's design requirements (Light, Dark, System theme with chevron). Updated all components (header, footer, dashboard) with dark mode classes and integrated theme toggle in both desktop and mobile navigation.
- June 21, 2025. Enhanced dark mode visualization throughout the entire application with improved color schemes, better contrast ratios, and optimized CSS variables. Updated dashboard, home page, services sections, and all UI components for superior dark mode experience with proper text contrast and background colors.
- June 21, 2025. Successfully configured hybrid Supabase connection with authentic clinic data. System operational with real professional profiles (3 ultrasound specialists: Dra. Barbara, Dr. Epitácio, Dr. Rodrigues) and genuine patient testimonials from Baturité, CE. API endpoints responding optimally with ~1-2ms response times for local data and ~600ms for Supabase connectivity.
- June 21, 2025. Implemented comprehensive online appointment booking system with enhanced form (CPF, date of birth, doctor selection, appointment types, urgency levels), dedicated /booking page, dashboard management interface, and full CRUD operations. System includes appointment status management and real-time updates.
- June 21, 2025. Added native PostgreSQL database to Replit application replacing Supabase integration. Created PostgresStorage class with full database operations, migrated all tables (users, doctors, appointments, testimonials, contact_messages), and optimized performance with 65-68ms response times. Complete appointment booking system tested and verified working with PostgreSQL backend.
- June 21, 2025. Implemented comprehensive customer testimonial submission system with TestimonialForm component, POST /api/testimonials endpoint, star rating interface, form validation, and integration with testimonials page. Customers can now submit their own reviews with name, location, rating (1-5 stars), and detailed feedback. System includes success confirmation and real-time updates.
- June 21, 2025. Integrated official San Mathews logomarca throughout the application. Updated header and footer to use the latest authentic clinic logo image with green design and "SanMathews Clínica e Laboratório" branding. Logo positioned in top-left corner with consistent styling across all pages.
- June 21, 2025. Created professional login system with secure authentication interface at /login route. Features include username/password validation, remember me option, password visibility toggle, loading states, error handling, and responsive design. Login page uses dedicated layout without header/footer for focused admin access experience.
- June 21, 2025. Implemented comprehensive system configuration panel for professional color management. Features include theme selection (light/dark/system), 4 predefined color schemes (Medical Blue, Healthcare Green, Clinic Purple, Warm Orange), custom color picker with categorized palettes, advanced settings with backup/restore functionality, and export/import capabilities. Integrated in dashboard sidebar under "Configurações" with professional medical-focused design.
- June 21, 2025. Redesigned configuration system removing appearance mode selector and implementing professional medical color palette with 64 colors organized in 8 medical-specific categories (Medical Blues, Healthcare Greens, Clinical Purples, Professional Grays, Energy Oranges, Calm Teals, Alert Reds, Trust Blues). Simplified interface to 2 tabs: "Esquemas de Cores" and "Cores Personalizadas" with real-time color application using CSS variables and automatic persistence via localStorage.
- June 21, 2025. Fixed transparency issues in all dropdown components throughout the system. Updated SelectContent, SelectItem, DropdownMenuContent, and DropdownMenuItem with solid backgrounds (white/dark gray), defined borders, improved hover states, and professional shadows. All dropdowns now have perfect visibility with clear text contrast and professional appearance.
- June 21, 2025. Implemented dropdown selection for medical specialties in professionals management form. Replaced free-text specialty input with structured Select component containing 18 medical specialties (Ultrassonografia, Cardiologia, Clínica Geral, etc.). Improves data consistency, reduces input errors, and provides professional user interface for administrative tasks.
- June 21, 2025. Implemented mandatory confirmation dialogs for all delete operations. Added AlertDialog components with detailed confirmation messages for professional deletion and appointment cancellation. Includes specific patient/professional information in confirmation prompts with red styling for destructive actions and "Cancel"/"Confirm" options.
- June 21, 2025. Implemented comprehensive mobile responsiveness throughout entire system. Optimized header with hamburger menu and integrated ThemeToggle in mobile sidebar. Transformed dashboard with responsive sidebar that converts to mobile menu on small screens. Updated all form grids (md: → sm:), adjusted spacing/padding for mobile, optimized hero section and footer, and configured responsive statistics cards (2 columns mobile, 4 desktop). Complete mobile-first design ensuring perfect functionality across all devices.
- June 22, 2025. Successfully connected to Supabase CAD_Profissional table with authentic clinic data. Implemented real-time connection to professional database containing 5 active professionals (IDs: 1, 11, 12, 13, 14) with verified email addresses. Created comprehensive API endpoints (/api/supabase/professionals, /api/supabase/test, /api/supabase/specialties) and integrated SupabaseProfessionalsTest component in dashboard. System now accesses real professional data from clinic's database with 600-800ms response times.
- June 22, 2025. Migrated CAD_Profissional functionality to Especialidades section with full CRUD operations. Removed separate CAD_Profissional menu item and integrated all real professional data (Renata-Dermatologista, Antonio-Cardiologista, Maria-Ginecologista, Daniel-Dermatologista, George-Clínico Geral) into comprehensive SpecialtiesManagement component. Features include professional filtering by specialty, real-time statistics, add/edit/delete operations, and seamless Supabase integration with corrected column mapping (Profissional, Profissão, CRM, email).

## User Preferences

Preferred communication style: Simple, everyday language.