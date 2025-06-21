import { 
  users, 
  doctors, 
  appointments, 
  testimonials, 
  contactMessages,
  type User, 
  type InsertUser,
  type Doctor,
  type InsertDoctor,
  type Appointment,
  type InsertAppointment,
  type Testimonial,
  type InsertTestimonial,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Doctors
  getAllDoctors(): Promise<Doctor[]>;
  getDoctorById(id: number): Promise<Doctor | undefined>;
  getDoctorsBySpecialty(specialty: string): Promise<Doctor[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  
  // Appointments
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Contact Messages
  getAllContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private doctors: Map<number, Doctor>;
  private appointments: Map<number, Appointment>;
  private testimonials: Map<number, Testimonial>;
  private contactMessages: Map<number, ContactMessage>;
  private currentUserId: number;
  private currentDoctorId: number;
  private currentAppointmentId: number;
  private currentTestimonialId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.appointments = new Map();
    this.testimonials = new Map();
    this.contactMessages = new Map();
    this.currentUserId = 1;
    this.currentDoctorId = 1;
    this.currentAppointmentId = 1;
    this.currentTestimonialId = 1;
    this.currentContactMessageId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed doctors
    const doctorsData: InsertDoctor[] = [
      {
        name: "Dra. Ana Silva",
        specialty: "Cardiologia",
        description: "Especialista em cardiologia com mais de 15 anos de experiência. Formada pela USP com pós-graduação em Harvard.",
        crm: "12345-SP",
        experience: "15 anos"
      },
      {
        name: "Dr. Carlos Santos",
        specialty: "Neurologia",
        description: "Neurologista renomado com expertise em doenças neurodegenerativas. Doutor pela UNIFESP.",
        crm: "23456-SP",
        experience: "12 anos"
      },
      {
        name: "Dra. Maria Oliveira",
        specialty: "Pediatria",
        description: "Pediatra dedicada ao cuidado infantil com abordagem humanizada. Especialização em neonatologia.",
        crm: "34567-SP",
        experience: "10 anos"
      }
    ];

    doctorsData.forEach(doctor => this.createDoctor(doctor));

    // Seed testimonials
    const testimonialsData: InsertTestimonial[] = [
      {
        authorName: "Maria José",
        location: "São Paulo, SP",
        content: "Atendimento excepcional! A Dra. Ana foi muito atenciosa e o diagnóstico foi preciso. Toda a equipe demonstrou profissionalismo e cuidado.",
        rating: 5
      },
      {
        authorName: "João Silva",
        location: "Campinas, SP",
        content: "Clínica moderna com equipamentos de última geração. O Dr. Carlos me explicou tudo detalhadamente e o tratamento foi muito eficaz.",
        rating: 5
      },
      {
        authorName: "Ana Paula",
        location: "Santos, SP",
        content: "A Dra. Maria é uma pediatra incrível! Minha filha se sentiu muito à vontade e o atendimento foi cuidadoso e carinhoso.",
        rating: 5
      }
    ];

    testimonialsData.forEach(testimonial => this.createTestimonial(testimonial));
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Doctors
  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(doctor => 
      doctor.specialty.toLowerCase() === specialty.toLowerCase()
    );
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.currentDoctorId++;
    const doctor: Doctor = { ...insertDoctor, id };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Appointments
  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id, 
      status: "pending",
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      const updatedAppointment = { ...appointment, status };
      this.appointments.set(id, updatedAppointment);
      return updatedAppointment;
    }
    return undefined;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const contactMessage: ContactMessage = { 
      ...insertContactMessage, 
      id, 
      createdAt: new Date()
    };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }
}

export const storage = new MemStorage();
