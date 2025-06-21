import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
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
import type { IStorage } from "./storage";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export class PostgresStorage implements IStorage {
  private async seedData() {
    try {
      // Check if data already exists
      const existingDoctors = await db.select().from(doctors).limit(1);
      if (existingDoctors.length > 0) return;

      // Seed doctors
      const doctorsData = [
        {
          name: "Dra. Barbara",
          specialty: "Ultrassonografia",
          description: "Especialista em ultrassonografia diagnóstica com vasta experiência em exames de imagem. Atende nos períodos matutino.",
          crm: "12345-CE",
          experience: "12 anos"
        },
        {
          name: "Dr. Epitácio",
          specialty: "Ultrassonografia",
          description: "Médico ultrassonografista com formação em radiologia e diagnóstico por imagem. Especialista em ultrassom geral.",
          crm: "23456-CE",
          experience: "15 anos"
        },
        {
          name: "Dr. Rodrigues",
          specialty: "Ultrassonografia",
          description: "Ultrassonografista experiente com especialização em ultrassom abdominal, pélvico e obstétrico.",
          crm: "34567-CE",
          experience: "18 anos"
        }
      ];

      await db.insert(doctors).values(doctorsData);

      // Seed testimonials
      const testimonialsData = [
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

      await db.insert(testimonials).values(testimonialsData);
      
      console.log("PostgreSQL database seeded successfully!");
    } catch (error) {
      console.log("Database seeding skipped - tables may not exist yet or data already seeded");
    }
  }

  constructor() {
    // Seed data on initialization
    this.seedData().catch(console.error);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Doctors
  async getAllDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    const result = await db.select().from(doctors).where(eq(doctors.id, id)).limit(1);
    return result[0];
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return await db.select().from(doctors).where(eq(doctors.specialty, specialty));
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const result = await db.insert(doctors).values(doctor).returning();
    return result[0];
  }

  async updateDoctor(id: number, updateData: Partial<InsertDoctor>): Promise<Doctor | undefined> {
    const result = await db.update(doctors).set(updateData).where(eq(doctors.id, id)).returning();
    return result[0];
  }

  async deleteDoctor(id: number): Promise<boolean> {
    const result = await db.delete(doctors).where(eq(doctors.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Appointments
  async getAllAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
    return result[0];
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values({
      ...appointment,
      status: 'pending'
    }).returning();
    return result[0];
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const result = await db.update(appointments).set({ status }).where(eq(appointments.id, id)).returning();
    return result[0];
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }
}