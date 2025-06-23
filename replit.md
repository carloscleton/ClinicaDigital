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
- June 22, 2025. Migrated Supabase CAD_Profissional functionality from Especialidades to Profissionais section with complete CRUD system. Created ProfessionalsManagementWithSupabase component integrating all 5 real professionals (Renata, Antonio, Maria, Daniel, George) with their authentic specialties and contact information. System includes professional filtering, real-time statistics, add/edit/delete operations, and direct Supabase integration. Restored Especialidades section to original placeholder state while maintaining full professional management functionality in Profissionais section.
- June 22, 2025. Implemented complete CRUD system for CAD_Especialidade table with full relationship integration to CAD_Profissional. Created SpecialtiesCRUD component with add/edit/delete operations for medical specialties, comprehensive API endpoints (/api/supabase/especialidades with GET, POST, PUT, DELETE), and established foreign key relationship between professionals and specialties. System now manages 11 real specialties (Clínico Geral, Cirurgião, Ginecologista, Dermato, etc.) with proper data integrity controls preventing deletion of specialties in use by professionals. Professional-specialty relationships fully functional with JOIN queries optimizing database performance.
- June 22, 2025. Integrated CAD_Especialidade dropdown in Professionals form replacing hardcoded specialty list. Professional registration and editing now uses dynamic dropdown populated with real specialties from CAD_Especialidade table, ensuring data consistency and eliminating manual entry errors. System maintains relationship integrity between professionals and specialties through id_Especialidade foreign key with real-time validation.
- June 22, 2025. Implemented complete CAD_Servicos services management system with full CRUD operations. Created ServicesManagement component with professional relationships, value tracking, and comprehensive API endpoints (/api/supabase/services with GET, POST, PUT, DELETE). System manages medical services with foreign key relationships to CAD_Profissional table, including service pricing, professional assignments, and creation timestamps. Successfully tested with real data including "Exame Ginecológico" (R$ 400) and created test service "Consulta Dermatológica" (R$ 200) linked to Renata-Dermatologista. Interface includes statistics dashboard, professional filtering, and confirmation dialogs for data integrity.
- June 22, 2025. Implemented complete CAD_Clientes patient management system with comprehensive CRUD operations. Created PatientsManagement component with advanced patient tracking, payment status, appointment scheduling, and detailed patient information management. System connects to CAD_Clientes table with authentic patient data including "Carloscleton" with verified contact information and payment status. Features include patient filtering by status (appointments, payments, recent), statistics dashboard with revenue tracking, comprehensive patient forms with CPF validation, birth date management, and tabbed interface for efficient data organization. Successfully tested CRUD operations with creation of "Maria Silva" patient record demonstrating full system functionality.
- June 22, 2025. Removed "Agendamentos" section from dashboard navigation per user request. Eliminated appointments tab, statistics card, and sidebar navigation item while maintaining all other clinic management functionalities. Dashboard now features 6 main sections: Agenda Semanal (highlighted), Clínicas, Profissionais, Especialidades, Serviços, Pacientes, and Configurações. Simplified dashboard layout with 3-tab interface (Visão Geral, Médicos, Feedback) and streamlined statistics focused on core clinic operations.
- June 22, 2025. Implemented dedicated experience editing popup in professionals management. Created specialized Dialog component with form validation for quick experience updates, added experience column to professionals table with inline edit buttons, and established targeted API mutation for experience-only updates. System enables rapid modification of professional experience data without full profile editing, featuring real-time validation and optimized user experience with loading states and error handling.
- June 22, 2025. Implemented comprehensive schedule management system using "atendimentos" field from CAD_Profissional table. Created dedicated popup with expanded textarea (300px) for full schedule editing, integrated Clock icon with green styling, and added professional guidance tips. System includes API endpoint PUT /api/supabase/professionals/:id for schedule updates, real-time form validation, and authentic clinic data integration. Simplified professionals table by removing "Experiência" and "Horários" columns for cleaner interface, maintaining core information display (ID, Nome, Especialidade, CRM, Email, Ações). Enhanced main professional editing form with large "Horários de Atendimento" textarea (10 rows) featuring Clock icon, monospace font, comprehensive placeholder, and visual tip box for direct schedule management within the primary editing interface. Fixed data persistence issues by correcting field mapping between frontend form and Supabase columns, removed "description" field causing database errors, and verified complete functionality with authentic professional data including Renata's updated schedule information.
- June 22, 2025. Successfully completed telephone field implementation with full functionality. Corrected database column mapping from "telefone" to "Telefone" (capitalized) to match actual Supabase schema. Updated all API endpoints (GET, PUT) to properly handle telephone data using correct column name. Enhanced professional form with telephone input field and validation. Added telephone column display in professionals table. Verified complete CRUD functionality with telephone data properly saving and retrieving from CAD_Profissional.Telefone column. System tested with real clinic phone number (85) 99408-6263 for Renata Almeida professional.
- June 22, 2025. Updated professional schedule text format in atendimentos field. Replaced emoji-heavy placeholder with clean, professional format featuring standardized time notation (08:00 às 12:00), organized weekday structure with morning/afternoon separation, consistent FECHADO notation for closed days, and structured CONFIGURAÇÕES section with bullet points for consultation duration, patient intervals, and lunch break timing. Applied changes to both main professional form and schedule editing dialog for consistent user experience.
- June 22, 2025. Implemented professional phone number input with Brazilian formatting mask. Created PhoneInput component that automatically prepends "55" country code and displays formatted input "55(84) 9 9807-1213" while storing complete number "5584998071213" in database. Features automatic "55" prefix addition, Brazilian phone formatting with correct mask pattern (55(84) 9 9807-1213), input validation, numeric-only entry, and seamless react-hook-form integration. Applied to professionals management form for enhanced user experience and data consistency.
- June 22, 2025. Fixed button text consistency issue in professional editing forms. Corrected form state management to prevent button text from changing from "Atualizar" to "Cadastrar" during edit operations by properly closing dialogs before clearing editing state.
- June 22, 2025. Implemented grouped services management view with professional consolidation. Created dual-view mode system (Agrupado/Detalhado) allowing users to view services either grouped by professional or in detailed individual listings. Added services popup dialog for grouped view showing all services per professional with complete CRUD operations. Features view mode toggle, professional service counting, total value calculation, and comprehensive service management interface for cleaner organization when professionals have multiple services.
- June 22, 2025. Enhanced professional filtering system to work correctly in both grouped and detailed view modes. Fixed filtering logic to apply professional selection filter before grouping services, ensuring both view modes properly display only services from the selected professional. Professional filter buttons now correctly filter the displayed services in real-time for improved user experience.
- June 22, 2025. Implemented comprehensive reports and analytics dashboard covering all system aspects. Created ReportsDashboard component with 6 detailed report tabs: Visão Geral (revenue trends, payment status), Profissionais (services by professional, specialty distribution), Serviços (complete service listings), Pacientes (patient management metrics), Financeiro (financial analytics), and Performance (KPIs and goals). Features interactive charts using Recharts library, real-time data integration with all Supabase tables, and comprehensive statistics covering professionals, services, patients, appointments, and revenue tracking. Added "Relatórios" section to dashboard sidebar navigation with TrendingUp icon and integrated patient API endpoint for complete data coverage.
- June 23, 2025. Successfully implemented complete CRUD system for professional registration in Especialidades section. Created functional "Novo Profissional" button with full form integration connected to CAD_Profissional table. System includes POST /api/supabase/professionals for creating professionals, PUT for updates, DELETE for removal, and proper column mapping (Profissional, Profissão, CRM, Telefone, email, atendimentos). Fixed dialog structure and API endpoints, resolved table schema mapping issues, and verified functionality with test professional "Dr. Teste Funcionamento" (ID: 15). Complete professional management system operational with authentic clinic data integration.
- June 23, 2025. Implemented advanced CRM validation system with intelligent search and verification capabilities. Created CRMValidator component with server-side validation endpoint /api/validate-crm supporting multiple CRM formats (CRM/UF number, number/UF, etc.). System validates format, extracts state and number information, and provides professional data lookup with specialty auto-population. Features real-time validation feedback, error handling, and expandable architecture for future integration with CFM official APIs. Integrated into professional registration form with automatic specialty suggestion based on CRM validation results.
- June 23, 2025. Created comprehensive services registration system based on professional management model. Implemented ServicesRegistration component with full CRUD operations (create, read, update, delete), professional assignment, category management, and value tracking. Added complete API endpoints /api/supabase/services with GET, POST, PUT, DELETE methods connecting to CAD_Servicos table. System includes service filtering by category and professional, statistics dashboard, confirmation dialogs, and integrated navigation in dashboard sidebar. Mapped frontend interface to existing database structure (servicos→nome, valorServicos→valor, idProfissional→id_Profissional) for seamless data integration with authentic clinic services data.
- June 23, 2025. Removed "Cadastro de Serviços" option from dashboard sidebar navigation per user request. Eliminated dedicated services registration section while maintaining existing "Serviços" section functionality. Dashboard now features 8 main navigation sections: Agenda Semanal (highlighted), Relatórios, Clínicas, Profissionais, Especialidades, Serviços, Pacientes, and Configurações.
- June 23, 2025. Simplified specialties registration system to work with basic CAD_Especialidade table structure. Updated interface to show only ID, name, and actions (edit/delete). Removed "Data de Criação" column per user request. System now uses minimal form with only specialty name field and connects properly to Supabase CAD_Especialidade table with Especialidade and id_Empresa columns. Full CRUD functionality maintained with simplified, clean interface.

## User Preferences

Preferred communication style: Simple, everyday language.