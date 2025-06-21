import { createClient } from '@supabase/supabase-js';
import { 
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

const supabaseUrl = 'https://zdqcyemiwglybvpfczya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzIwMjksImV4cCI6MjA2NjEwODAyOX0.eRUuO0H3nuJwHMljwxAhlaZpOFRcc2LN4puAfbZvvrI';
const supabase = createClient(supabaseUrl, supabaseKey);

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
        name: "Dra. Barbara",
        specialty: "Ultrassonografia",
        description: "Especialista em ultrassonografia diagnóstica com vasta experiência em exames de imagem. Atende nos períodos matutino.",
        crm: "12345-SP",
        experience: "12 anos"
      },
      {
        name: "Dr. Epitácio",
        specialty: "Ultrassonografia",
        description: "Médico ultrassonografista com formação em radiologia e diagnóstico por imagem. Especialista em ultrassom geral.",
        crm: "23456-SP",
        experience: "15 anos"
      },
      {
        name: "Dr. Rodrigues",
        specialty: "Ultrassonografia",
        description: "Ultrassonografista experiente com especialização em ultrassom abdominal, pélvico e obstétrico.",
        crm: "34567-SP",
        experience: "18 anos"
      }
    ];

    doctorsData.forEach(doctorData => {
      const id = this.currentDoctorId++;
      const doctor: Doctor = { ...doctorData, id };
      this.doctors.set(id, doctor);
    });

    // Seed testimonials
    const testimonialsData: InsertTestimonial[] = [
      {
        authorName: "Carlos Eduardo",
        location: "Baturité, CE",
        content: "Excelente atendimento na clínica! Os profissionais são muito qualificados e o ambiente é muito acolhedor. Recomendo!",
        rating: 5
      },
      {
        authorName: "Maria Santos",
        location: "Baturité, CE", 
        content: "Muito satisfeita com o atendimento. Equipe competente e resultados de exames muito precisos.",
        rating: 5
      },
      {
        authorName: "João Silva",
        location: "Baturité, CE",
        content: "Ótima clínica, com equipamentos modernos e profissionais experientes. Voltarei sempre!",
        rating: 4
      }
    ];

    testimonialsData.forEach(testimonialData => {
      const id = this.currentTestimonialId++;
      const testimonial: Testimonial = { 
        ...testimonialData, 
        id
      };
      this.testimonials.set(id, testimonial);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(doctor => doctor.specialty === specialty);
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.currentDoctorId++;
    const doctor: Doctor = { 
      ...insertDoctor, 
      id
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

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
      status: insertAppointment.status || "pending",
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      appointment.status = status;
      this.appointments.set(id, appointment);
      return appointment;
    }
    return undefined;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

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

export class SupabaseStorage implements IStorage {
  private async seedData() {
    try {
      // Check if data already exists
      const { data: existingDoctors } = await supabase
        .from('doctors')
        .select('*')
        .limit(1);
      
      if (existingDoctors && existingDoctors.length > 0) return;
    } catch (error) {
      console.log("Database seeding skipped - tables may not exist yet");
      return;
    }

    // Seed doctors
    const doctorsData = [
      {
        name: "Dra. Barbara",
        specialty: "Ultrassonografia",
        description: "Especialista em ultrassonografia diagnóstica com vasta experiência em exames de imagem. Atende nos períodos matutino.",
        crm: "12345-SP",
        experience: "12 anos"
      },
      {
        name: "Dr. Epitácio",
        specialty: "Ultrassonografia",
        description: "Médico ultrassonografista com formação em radiologia e diagnóstico por imagem. Especialista em ultrassom geral.",
        crm: "23456-SP",
        experience: "15 anos"
      },
      {
        name: "Dr. Rodrigues",
        specialty: "Ultrassonografia",
        description: "Ultrassonografista experiente com especialização em ultrassom abdominal, pélvico e obstétrico.",
        crm: "34567-SP",
        experience: "18 anos"
      }
    ];

    await supabase.from('doctors').insert(doctorsData);

    // Seed testimonials
    const testimonialsData = [
      {
        author_name: "Carlos Eduardo",
        location: "Baturité, CE",
        content: "Excelente atendimento na clínica! Os profissionais são muito qualificados e o ambiente é muito acolhedor. Recomendo!",
        rating: 5
      },
      {
        author_name: "Maria Santos",
        location: "Baturité, CE", 
        content: "Muito satisfeita com o atendimento. Equipe competente e resultados de exames muito precisos.",
        rating: 5
      },
      {
        author_name: "João Silva",
        location: "Baturité, CE",
        content: "Ótima clínica, com equipamentos modernos e profissionais experientes. Voltarei sempre!",
        rating: 4
      }
    ];

    await supabase.from('testimonials').insert(testimonialsData);
  }

  constructor() {
    this.seedData().catch(console.error);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    return data || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data } = await supabase
      .from('users')
      .insert(user)
      .select('*')
      .single();
    return data!;
  }

  // Doctors
  async getAllDoctors(): Promise<Doctor[]> {
    const { data } = await supabase
      .from('doctors')
      .select('*');
    return data || [];
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .eq('specialty', specialty);
    return data || [];
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const { data } = await supabase
      .from('doctors')
      .insert(doctor)
      .select('*')
      .single();
    return data!;
  }

  // Appointments
  async getAllAppointments(): Promise<Appointment[]> {
    const { data } = await supabase
      .from('appointments')
      .select('*');
    return data || [];
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const { data } = await supabase
      .from('appointments')
      .insert({
        full_name: appointment.fullName,
        email: appointment.email,
        phone: appointment.phone,
        specialty: appointment.specialty,
        preferred_date: appointment.preferredDate,
        message: appointment.message,
        status: 'pending'
      })
      .select('*')
      .single();
    return {
      id: data!.id,
      fullName: data!.full_name,
      email: data!.email,
      phone: data!.phone,
      specialty: data!.specialty,
      preferredDate: data!.preferred_date,
      message: data!.message,
      status: data!.status,
      createdAt: data!.created_at
    };
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const { data } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();
    
    if (!data) return undefined;
    
    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      specialty: data.specialty,
      preferredDate: data.preferred_date,
      message: data.message,
      status: data.status,
      createdAt: data.created_at
    };
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    const { data } = await supabase
      .from('testimonials')
      .select('*');
    
    return (data || []).map(item => ({
      id: item.id,
      authorName: item.author_name,
      location: item.location,
      content: item.content,
      rating: item.rating
    }));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const { data } = await supabase
      .from('testimonials')
      .insert({
        author_name: testimonial.authorName,
        location: testimonial.location,
        content: testimonial.content,
        rating: testimonial.rating
      })
      .select('*')
      .single();
    
    return {
      id: data!.id,
      authorName: data!.author_name,
      location: data!.location,
      content: data!.content,
      rating: data!.rating
    };
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    const { data } = await supabase
      .from('contact_messages')
      .select('*');
    
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      createdAt: item.created_at
    }));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const { data } = await supabase
      .from('contact_messages')
      .insert(message)
      .select('*')
      .single();
    
    return {
      id: data!.id,
      name: data!.name,
      email: data!.email,
      subject: data!.subject,
      message: data!.message,
      createdAt: data!.created_at
    };
  }
}

export const storage = new MemStorage();