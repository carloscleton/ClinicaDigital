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
      },
      {
        name: "Dra. Letícia",
        specialty: "Clínica Médica",
        description: "Clínica geral com abordagem integral ao paciente. Especialista em medicina preventiva e diagnóstico clínico.",
        crm: "45678-SP",
        experience: "10 anos"
      },
      {
        name: "Dr. George",
        specialty: "Clínica Médica",
        description: "Médico clínico geral com ampla experiência em atendimento ambulatorial. Atende nos períodos vespertino e matutino.",
        crm: "56789-SP",
        experience: "14 anos"
      },
      {
        name: "Dra. Paula",
        specialty: "Medicina Preventiva",
        description: "Especialista em medicina preventiva e promoção da saúde. Foco em prevenção de doenças e check-ups.",
        crm: "67890-SP",
        experience: "8 anos"
      },
      {
        name: "Dra. Patrícia",
        specialty: "Medicina Preventiva",
        description: "Médica preventivista com expertise em medicina do trabalho e programas de saúde ocupacional.",
        crm: "78901-SP",
        experience: "11 anos"
      },
      {
        name: "Dr. Luis",
        specialty: "Pequenas Cirurgias",
        description: "Cirurgião especializado em pequenos procedimentos cirúrgicos ambulatoriais. Técnicas minimamente invasivas.",
        crm: "89012-SP",
        experience: "16 anos"
      },
      {
        name: "Dr. Lucas",
        specialty: "Nutrologia",
        description: "Nutrólogo especializado em nutrição clínica e terapia nutricional. Tratamento de distúrbios nutricionais.",
        crm: "90123-SP",
        experience: "9 anos"
      },
      {
        name: "Dr. Daniel",
        specialty: "Endoscopia Digestiva",
        description: "Gastroenterologista especialista em endoscopia digestiva alta (EDA). Diagnóstico de doenças do trato digestivo.",
        crm: "01234-SP",
        experience: "13 anos"
      },
      {
        name: "Dr. Tarcísio",
        specialty: "Endoscopia Digestiva",
        description: "Endoscopista com vasta experiência em procedimentos diagnósticos e terapêuticos do aparelho digestivo.",
        crm: "12340-SP",
        experience: "17 anos"
      },
      {
        name: "Dra. Dagneide",
        specialty: "Psicanálise",
        description: "Psicanalista clínica com formação em psicanálise freudiana. Especialista em terapia psicanalítica individual.",
        crm: "23401-SP",
        experience: "12 anos"
      },
      {
        name: "Dra. Alyce",
        specialty: "Ginecologia",
        description: "Ginecologista especializada em saúde da mulher, prevenção ginecológica e acompanhamento obstétrico.",
        crm: "34012-SP",
        experience: "14 anos"
      },
      {
        name: "Dr. Lívio",
        specialty: "Neurologia",
        description: "Neurologista especialista em doenças do sistema nervoso central e periférico. Diagnóstico neurológico avançado.",
        crm: "40123-SP",
        experience: "19 anos"
      },
      {
        name: "Dra. Renata",
        specialty: "Dermatologia",
        description: "Dermatologista clínica e cirúrgica. Especialista em doenças da pele, cabelo e unhas.",
        crm: "51234-SP",
        experience: "11 anos"
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
    
    // Update testimonials with relevant content
    const updatedTestimonialsData: InsertTestimonial[] = [
      {
        authorName: "Carlos Eduardo",
        location: "São Paulo, SP",
        content: "Excelente atendimento! A Dra. Barbara realizou meu ultrassom com muito cuidado e explicou tudo detalhadamente. Equipamentos modernos e resultados rápidos.",
        rating: 5
      },
      {
        authorName: "Ana Beatriz",
        location: "Guarulhos, SP",
        content: "Dr. George é um clínico excepcional. Consulta completa, diagnóstico preciso e tratamento eficaz. Recomendo a clínica para toda família.",
        rating: 5
      },
      {
        authorName: "Roberto Silva",
        location: "Osasco, SP",
        content: "Dr. Lucas (nutrólogo) mudou minha vida! Plano alimentar personalizado e acompanhamento constante. Perdi 15kg de forma saudável.",
        rating: 5
      },
      {
        authorName: "Fernanda Costa",
        location: "Santos, SP",
        content: "Dra. Patricia (medicina preventiva) é muito atenciosa. Check-up completo me ajudou a identificar problemas antes que se tornassem sérios.",
        rating: 5
      },
      {
        authorName: "João Carlos",
        location: "São Bernardo, SP",
        content: "Dr. Daniel realizou minha endoscopia com total profissionalismo. Procedimento tranquilo e diagnóstico preciso. Muito satisfeito!",
        rating: 5
      }
    ];
    
    // Clear existing testimonials and add updated ones
    this.testimonials.clear();
    this.currentTestimonialId = 1;
    updatedTestimonialsData.forEach(testimonial => this.createTestimonial(testimonial));
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
    const doctor: Doctor = { 
      ...insertDoctor, 
      id,
      imageUrl: insertDoctor.imageUrl || null,
      experience: insertDoctor.experience || null
    };
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
      message: insertAppointment.message || null,
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
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      imageUrl: insertTestimonial.imageUrl || null,
      rating: insertTestimonial.rating || 5
    };
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
