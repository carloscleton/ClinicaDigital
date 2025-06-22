import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema, insertContactMessageSchema, insertDoctorSchema, insertTestimonialSchema } from "@shared/schema";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Configure Supabase directly in server
const supabaseUrl = 'https://zdqcyemiwglybvpfczya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzIwMjksImV4cCI6MjA2NjEwODAyOX0.eRUuO0H3nuJwHMljwxAhlaZpOFRcc2LN4puAfbZvvrI';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  // Get doctor by ID
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const doctor = await storage.getDoctorById(id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  });

  // Get doctors by specialty
  app.get("/api/doctors/specialty/:specialty", async (req, res) => {
    try {
      const specialty = req.params.specialty;
      const doctors = await storage.getDoctorsBySpecialty(specialty);
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors by specialty" });
    }
  });

  // Create new doctor
  app.post("/api/doctors", async (req, res) => {
    try {
      const validatedData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(validatedData);
      res.status(201).json(doctor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid doctor data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create doctor" });
    }
  });

  // Update doctor
  app.put("/api/doctors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDoctorSchema.partial().parse(req.body);
      const doctor = await storage.updateDoctor(id, validatedData);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid doctor data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update doctor" });
    }
  });

  // Delete doctor
  app.delete("/api/doctors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDoctor(id);
      if (!success) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.json({ message: "Doctor deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete doctor" });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // Get all appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Update appointment status
  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const appointment = await storage.updateAppointmentStatus(id, status);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment status" });
    }
  });

  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Create testimonial
  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  // Create contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.createContactMessage(validatedData);
      res.status(201).json(contactMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Get all contact messages
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Supabase CAD_Profissional endpoints
  
  // Get all professionals from Supabase
  app.get("/api/supabase/professionals", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('*')
        .limit(50);

      if (error) {
        console.error('Erro ao buscar profissionais do Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao conectar com Supabase",
          error: error.message 
        });
      }

      // Convert to format compatible with current system using correct Supabase column names
      const formattedProfessionals = (data || []).map((prof: any) => ({
        id: prof.id,
        name: prof.Profissional || "Nome não informado",
        specialty: prof.Profissão || "Especialidade não informada", 
        crm: prof.CRM || "CRM não informado",
        description: prof.atendimentos ? `Horários: ${prof.atendimentos.split('\n')[0]}` : "",
        experience: prof.atendimentos ? prof.atendimentos : "",
        phone: "",
        email: prof.email || ""
      }));

      res.json(formattedProfessionals);
    } catch (error) {
      console.error("Erro na conexão com Supabase:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Get professional by ID from Supabase
  app.get("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar profissional do Supabase:', error);
        return res.status(404).json({ message: "Profissional não encontrado" });
      }

      const formattedProfessional = {
        id: data.id,
        name: data.Profissional || "Nome não informado",
        specialty: data.Profissão || "Especialidade não informada",
        crm: data.CRM || "CRM não informado",
        description: data.atendimentos ? `Horários: ${data.atendimentos.split('\n')[0]}` : "",
        experience: data.atendimentos || "",
        phone: "",
        email: data.email || ""
      };

      res.json(formattedProfessional);
    } catch (error) {
      console.error("Erro ao buscar profissional:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Get professionals by specialty from Supabase
  app.get("/api/supabase/specialty/:specialty", async (req, res) => {
    try {
      const specialty = decodeURIComponent(req.params.specialty);
      
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('*')
        .eq('Profissão', specialty)
        .limit(50);

      if (error) {
        console.error('Erro ao buscar profissionais por especialidade:', error);
        return res.status(500).json({ 
          message: "Erro ao buscar profissionais",
          error: error.message 
        });
      }

      const formattedProfessionals = (data || []).map((prof: any) => ({
        id: prof.id,
        name: prof.Profissional || "Nome não informado",
        specialty: prof.Profissão || "Especialidade não informada",
        crm: prof.CRM || "CRM não informado",
        description: prof.atendimentos ? `Horários: ${prof.atendimentos.split('\n')[0]}` : "",
        experience: prof.atendimentos || "",
        phone: "",
        email: prof.email || ""
      }));

      res.json(formattedProfessionals);
    } catch (error) {
      console.error("Erro ao buscar profissionais por especialidade:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Get unique specialties from Supabase
  app.get("/api/supabase/specialties", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('Profissão')
        .limit(100);

      if (error) {
        console.error('Erro ao buscar especialidades:', error);
        return res.status(500).json({ 
          message: "Erro ao buscar especialidades",
          error: error.message 
        });
      }

      // Extract unique specialties
      const specialties = Array.from(new Set((data || []).map((item: any) => item.Profissão).filter(Boolean)));
      res.json(specialties);
    } catch (error) {
      console.error("Erro ao buscar especialidades:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Test Supabase connection
  app.get("/api/supabase/test", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Erro na conexão com Supabase:', error);
        return res.status(500).json({ 
          connected: false,
          message: "Erro na conexão com Supabase",
          error: error.message 
        });
      }

      res.json({ 
        connected: true,
        message: "Conexão com Supabase CAD_Profissional funcionando",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      res.status(500).json({ 
        connected: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Debug endpoint to inspect table structure
  app.get("/api/supabase/debug", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Erro ao buscar dados para debug:', error);
        return res.status(500).json({ 
          error: error.message 
        });
      }

      const structure = data && data.length > 0 ? {
        availableColumns: Object.keys(data[0]),
        sampleRecord: data[0],
        totalFields: Object.keys(data[0]).length
      } : {
        message: "Nenhum registro encontrado"
      };

      res.json(structure);
    } catch (error) {
      console.error("Erro no debug:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
