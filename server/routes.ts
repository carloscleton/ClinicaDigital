import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema, insertContactMessageSchema, insertDoctorSchema, insertTestimonialSchema } from "@shared/schema";
import { z } from "zod";
import { supabase } from "./supabase-client";
import routes from "./routes/index";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register API routes from routes/index.ts
  app.use("/api", routes);

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
  
  // Get all professionals from Supabase with specialty relationship
  app.get("/api/supabase/professionals", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select(`
          id,
          Profissional,
          email,
          CRM,
          atendimentos,
          Telefone,
          Profissão,
          sexo,
          id_Especialidade,
          CAD_Especialidade(id, Especialidade)
        `)
        .limit(50);

      if (error) {
        console.error('Erro ao buscar profissionais do Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao conectar com Supabase",
          error: error.message 
        });
      }

      // Convert to format compatible with current system using JOIN data
      const formattedProfessionals = (data || []).map((prof: any) => ({
        id: prof.id,
        name: prof.Profissional || "Nome não informado",
        specialty: prof.CAD_Especialidade?.Especialidade || prof.Profissão || "Especialidade não informada",
        specialtyId: prof.id_Especialidade || null,
        crm: prof.CRM || "CRM não informado",
        description: prof.atendimentos ? `Horários: ${prof.atendimentos.split('\n')[0]}` : "",
        experience: prof.atendimentos ? prof.atendimentos : "",
        phone: prof.Telefone || "",
        email: prof.email || "",
        sexo: prof.sexo || ""
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
        .select(`
          id,
          Profissional,
          email,
          CRM,
          atendimentos,
          Telefone,
          Profissão,
          sexo,
          id_Especialidade,
          CAD_Especialidade(id, Especialidade)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar profissional do Supabase:', error);
        return res.status(404).json({ message: "Profissional não encontrado" });
      }

      // Get specialty name from CAD_Especialidade if id_Especialidade exists
      let specialtyName = data.Profissão || "Especialidade não informada";
      if (data.id_Especialidade) {
        try {
          const { data: specialtyData, error: specialtyError } = await supabase
            .from('CAD_Especialidade')
            .select('Especialidade')
            .eq('id', data.id_Especialidade)
            .single();
          
          if (!specialtyError && specialtyData) {
            specialtyName = specialtyData.Especialidade;
          }
        } catch (error) {
          console.log('Erro ao buscar especialidade:', error);
        }
      }

      const formattedProfessional = {
        id: data.id,
        name: data.Profissional || "Nome não informado",
        specialty: specialtyName,
        specialtyId: data.id_Especialidade || null,
        crm: data.CRM || "CRM não informado",
        description: data.atendimentos ? `Horários: ${data.atendimentos.split('\n')[0]}` : "",
        experience: data.atendimentos || "",
        phone: data.Telefone || "",
        email: data.email || "",
        sexo: data.sexo || ""
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
        phone: prof.Telefone || "",
        email: prof.email || "",
        sexo: prof.sexo || ""
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

  // Add telefone column to CAD_Profissional table
  app.post("/api/supabase/add-telefone-column", async (req, res) => {
    try {
      // Try to execute the ALTER TABLE command using SQL
      const { data, error } = await supabase.rpc('exec', {
        sql: `ALTER TABLE "CAD_Profissional" ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);`
      });

      if (error) {
        console.error('Erro ao adicionar coluna telefone:', error);
        
        // If RPC doesn't work, provide manual instructions
        res.status(400).json({
          success: false,
          message: "Para adicionar a coluna telefone, acesse o Supabase Dashboard:",
          instructions: [
            "1. Vá para https://supabase.com/dashboard",
            "2. Selecione seu projeto",
            "3. Vá em Table Editor > CAD_Profissional",
            "4. Clique em 'Add Column'",
            "5. Nome: telefone",
            "6. Tipo: varchar",
            "7. Tamanho: 20",
            "8. Nullable: true",
            "9. Clique em 'Save'"
          ],
          error: error.message
        });
      } else {
        res.json({
          success: true,
          message: "Coluna 'telefone' adicionada com sucesso à tabela CAD_Profissional!",
          data
        });
      }
    } catch (error: any) {
      console.error('Erro ao executar SQL:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        message: "Para adicionar manualmente: Supabase Dashboard > CAD_Profissional > Add Column > telefone (varchar, 20)"
      });
    }
  });

  // Update professional specialty relationship
  app.put("/api/supabase/professionals/:id/specialty", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { specialtyId } = req.body;

      const { data, error } = await supabase
        .from('CAD_Profissional')
        .update({ id_Especialidade: specialtyId })
        .eq('id', id)
        .select(`
          id,
          Profissional,
          email,
          CRM,
          id_Especialidade,
          CAD_Especialidade(id, Especialidade)
        `)
        .single();

      if (error) {
        console.error('Erro ao atualizar especialidade do profissional:', error);
        return res.status(500).json({ 
          message: "Erro ao atualizar especialidade",
          error: error.message 
        });
      }

      const formattedProfessional = {
        id: data.id,
        name: data.Profissional || "Nome não informado",
        specialty: data.CAD_Especialidade?.Especialidade || "Especialidade não informada",
        specialtyId: data.id_Especialidade,
        crm: data.CRM || "CRM não informado",
        email: data.email || ""
      };

      res.json(formattedProfessional);
    } catch (error) {
      console.error("Erro ao atualizar especialidade:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Update professional data (experience, schedule, etc.)
  app.put("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, specialty, crm, email, phone, atendimentos, sexo, specialtyId } = req.body;

      // Build update object with only valid Supabase columns
      const updateData: any = {};
      
      // Map form fields to Supabase columns
      if (name !== undefined && name !== '') {
        updateData.Profissional = name;
      }
      
      if (crm !== undefined && crm !== '') {
        updateData.CRM = crm;
      }
      
      if (email !== undefined && email !== '') {
        updateData.email = email;
      }
      
      if (atendimentos !== undefined) {
        updateData.atendimentos = atendimentos;
      }
      
      // Add telefone if provided (column name is "Telefone" with capital T)
      if (phone !== undefined && phone !== '') {
        updateData.Telefone = phone;
      }

      // Add sexo if provided
      if (sexo !== undefined && sexo !== '') {
        updateData.sexo = sexo;
      }

      // Add specialty if provided
      if (specialty !== undefined && specialty !== '') {
        updateData.Profissão = specialty;
      }

      // Add specialty ID if provided
      if (specialtyId !== undefined) {
        updateData.id_Especialidade = specialtyId;
      }

      // First update the data
      const { error: updateError } = await supabase
        .from('CAD_Profissional')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error('Erro ao atualizar profissional:', updateError);
        return res.status(500).json({ 
          message: "Erro ao atualizar profissional",
          error: updateError.message 
        });
      }

      // Then fetch the updated data
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select(`
          id,
          Profissional,
          email,
          CRM,
          atendimentos,
          Telefone,
          Profissão,
          sexo,
          id_Especialidade,
          CAD_Especialidade(id, Especialidade)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar profissional atualizado:', error);
        return res.status(500).json({ 
          message: "Erro ao buscar dados atualizados",
          error: error.message 
        });
      }

      const formattedProfessional = {
        id: data.id,
        name: data.Profissional || "Nome não informado",
        specialty: data.CAD_Especialidade?.Especialidade || data.Profissão || "Especialidade não informada",
        specialtyId: data.id_Especialidade,
        crm: data.CRM || "CRM não informado",
        description: data.atendimentos ? `Horários: ${data.atendimentos.split('\n')[0]}` : "",
        experience: data.atendimentos || "",
        atendimentos: data.atendimentos || "",
        phone: data.Telefone || "",
        email: data.email || "",
        sexo: data.sexo || ""
      };

      res.json(formattedProfessional);
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Supabase CAD_Servicos endpoints
  
  // Get all services from CAD_Servicos with professional relationship
  app.get("/api/supabase/services", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Servicos')
        .select(`
          id,
          servicos,
          valorServicos,
          id_Empresa,
          idProfissional,
          created_at,
          CAD_Profissional(id, Profissional)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar serviços do Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao conectar com Supabase",
          error: error.message 
        });
      }

      // Format services data
      const formattedServices = (data || []).map((service: any) => ({
        id: service.id,
        servicos: service.servicos || "Serviço não informado",
        valorServicos: service.valorServicos || 0,
        id_Empresa: service.id_Empresa,
        idProfissional: service.idProfissional,
        created_at: service.created_at,
        professionalName: service.CAD_Profissional?.Profissional || null
      }));

      res.json(formattedServices);
    } catch (error) {
      console.error("Erro na conexão com Supabase:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Create new service in CAD_Servicos
  app.post("/api/supabase/services", async (req, res) => {
    try {
      const { servicos, valorServicos, idProfissional, id_Empresa } = req.body;

      const { data, error } = await supabase
        .from('CAD_Servicos')
        .insert([{
          servicos,
          valorServicos: valorServicos || null,
          idProfissional: idProfissional || null,
          id_Empresa: id_Empresa || 1
        }])
        .select(`
          id,
          servicos,
          valorServicos,
          id_Empresa,
          idProfissional,
          created_at,
          CAD_Profissional(id, Profissional)
        `)
        .single();

      if (error) {
        console.error('Erro ao criar serviço no Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao criar serviço",
          error: error.message 
        });
      }

      const formattedService = {
        id: data.id,
        servicos: data.servicos,
        valorServicos: data.valorServicos || 0,
        id_Empresa: data.id_Empresa,
        idProfissional: data.idProfissional,
        created_at: data.created_at,
        professionalName: data.CAD_Profissional?.Profissional || null
      };

      res.json(formattedService);
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Update service in CAD_Servicos
  app.put("/api/supabase/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { servicos, valorServicos, idProfissional, id_Empresa } = req.body;

      const { data, error } = await supabase
        .from('CAD_Servicos')
        .update({
          servicos,
          valorServicos: valorServicos || null,
          idProfissional: idProfissional || null,
          id_Empresa: id_Empresa || 1
        })
        .eq('id', id)
        .select(`
          id,
          servicos,
          valorServicos,
          id_Empresa,
          idProfissional,
          created_at,
          CAD_Profissional(id, Profissional)
        `)
        .single();

      if (error) {
        console.error('Erro ao atualizar serviço no Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao atualizar serviço",
          error: error.message 
        });
      }

      const formattedService = {
        id: data.id,
        servicos: data.servicos,
        valorServicos: data.valorServicos || 0,
        id_Empresa: data.id_Empresa,
        idProfissional: data.idProfissional,
        created_at: data.created_at,
        professionalName: data.CAD_Profissional?.Profissional || null
      };

      res.json(formattedService);
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Delete service from CAD_Servicos
  app.delete("/api/supabase/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const { error } = await supabase
        .from('CAD_Servicos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar serviço do Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao deletar serviço",
          error: error.message 
        });
      }

      res.json({ message: "Serviço removido com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Supabase CAD_Clientes endpoints
  
  // Get all patients from CAD_Clientes
  app.get("/api/supabase/patients", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Clientes')
        .select(`
          id,
          created_at,
          nomeCliente,
          telefoneCliente,
          emailCliente,
          nascimentoCliente,
          CPF,
          statusAgendamento,
          statusPagamento,
          valor,
          ultimo_pagamento,
          ultimaMensagem,
          etapa,
          desejo,
          id_Empresa
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pacientes do Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao conectar com Supabase",
          error: error.message 
        });
      }

      res.json(data || []);
    } catch (error) {
      console.error("Erro na conexão com Supabase:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Create new patient in CAD_Clientes
  app.post("/api/supabase/patients", async (req, res) => {
    try {
      const { 
        nomeCliente, 
        telefoneCliente, 
        emailCliente, 
        nascimentoCliente, 
        CPF,
        statusAgendamento,
        statusPagamento,
        valor,
        desejo,
        id_Empresa 
      } = req.body;

      const { data, error } = await supabase
        .from('CAD_Clientes')
        .insert([{
          nomeCliente,
          telefoneCliente,
          emailCliente,
          nascimentoCliente: nascimentoCliente || null,
          CPF,
          statusAgendamento: statusAgendamento || false,
          statusPagamento: statusPagamento || false,
          valor: valor || null,
          desejo,
          id_Empresa: id_Empresa || 1
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar paciente no Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao criar paciente",
          error: error.message 
        });
      }

      res.json(data);
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Update patient in CAD_Clientes
  app.put("/api/supabase/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { 
        nomeCliente, 
        telefoneCliente, 
        emailCliente, 
        nascimentoCliente, 
        CPF,
        statusAgendamento,
        statusPagamento,
        valor,
        desejo,
        id_Empresa 
      } = req.body;

      const { data, error } = await supabase
        .from('CAD_Clientes')
        .update({
          nomeCliente,
          telefoneCliente,
          emailCliente,
          nascimentoCliente: nascimentoCliente || null,
          CPF,
          statusAgendamento: statusAgendamento || false,
          statusPagamento: statusPagamento || false,
          valor: valor || null,
          desejo,
          id_Empresa: id_Empresa || 1
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar paciente no Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao atualizar paciente",
          error: error.message 
        });
      }

      res.json(data);
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Delete patient from CAD_Clientes
  app.delete("/api/supabase/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const { error } = await supabase
        .from('CAD_Clientes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar paciente do Supabase:', error);
        return res.status(500).json({ 
          message: "Erro ao deletar paciente",
          error: error.message 
        });
      }

      res.json({ message: "Paciente removido com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Supabase CAD_Especialidade endpoints
  
  // Get all specialties from CAD_Especialidade table
  app.get("/api/supabase/especialidades", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Especialidade')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Erro ao buscar especialidades:', error);
        return res.status(500).json({ 
          message: "Erro ao buscar especialidades",
          error: error.message 
        });
      }

      const formattedSpecialties = (data || []).map((specialty: any) => ({
        id: specialty.id,
        name: specialty.Especialidade || "Especialidade não informada",
        idEmpresa: specialty.id_Empresa,
        createdAt: specialty.created_at
      }));

      res.json(formattedSpecialties);
    } catch (error) {
      console.error("Erro ao buscar especialidades:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Get specialty by ID from CAD_Especialidade
  app.get("/api/supabase/especialidades/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const { data, error } = await supabase
        .from('CAD_Especialidade')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar especialidade:', error);
        return res.status(404).json({ message: "Especialidade não encontrada" });
      }

      const formattedSpecialty = {
        id: data.id,
        name: data.Especialidade || "Especialidade não informada",
        idEmpresa: data.id_Empresa,
        createdAt: data.created_at
      };

      res.json(formattedSpecialty);
    } catch (error) {
      console.error("Erro ao buscar especialidade:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Create new specialty in CAD_Especialidade
  app.post("/api/supabase/especialidades", async (req, res) => {
    try {
      const { name, idEmpresa } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: "Nome da especialidade é obrigatório" });
      }

      const { data, error } = await supabase
        .from('CAD_Especialidade')
        .insert([{
          Especialidade: name.trim(),
          id_Empresa: idEmpresa || 1
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar especialidade:', error);
        return res.status(500).json({ 
          message: "Erro ao criar especialidade",
          error: error.message 
        });
      }

      const formattedSpecialty = {
        id: data.id,
        name: data.Especialidade,
        idEmpresa: data.id_Empresa,
        createdAt: data.created_at
      };

      res.status(201).json(formattedSpecialty);
    } catch (error) {
      console.error("Erro ao criar especialidade:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Update specialty in CAD_Especialidade
  app.put("/api/supabase/especialidades/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, idEmpresa } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: "Nome da especialidade é obrigatório" });
      }

      const { data, error } = await supabase
        .from('CAD_Especialidade')
        .update({
          Especialidade: name.trim(),
          id_Empresa: idEmpresa
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar especialidade:', error);
        return res.status(500).json({ 
          message: "Erro ao atualizar especialidade",
          error: error.message 
        });
      }

      const formattedSpecialty = {
        id: data.id,
        name: data.Especialidade,
        idEmpresa: data.id_Empresa,
        createdAt: data.created_at
      };

      res.json(formattedSpecialty);
    } catch (error) {
      console.error("Erro ao atualizar especialidade:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Delete specialty from CAD_Especialidade
  app.delete("/api/supabase/especialidades/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // Check if specialty is being used by professionals
      const { data: professionalsUsingSpecialty, error: checkError } = await supabase
        .from('CAD_Profissional')
        .select('id, Profissional')
        .eq('id_Especialidade', id);

      if (checkError) {
        console.error('Erro ao verificar uso da especialidade:', checkError);
      }

      if (professionalsUsingSpecialty && professionalsUsingSpecialty.length > 0) {
        return res.status(400).json({ 
          message: `Não é possível excluir esta especialidade pois está sendo usada por ${professionalsUsingSpecialty.length} profissional(is)`,
          professionals: professionalsUsingSpecialty.map(p => p.Profissional)
        });
      }

      const { error } = await supabase
        .from('CAD_Especialidade')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar especialidade:', error);
        return res.status(500).json({ 
          message: "Erro ao deletar especialidade",
          error: error.message 
        });
      }

      res.json({ message: "Especialidade excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar especialidade:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Supabase CAD_Profissional endpoints
  
  // Get all professionals from CAD_Profissional
  app.get("/api/supabase/professionals", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select(`
          id,
          Profissional,
          Profissão,
          CRM,
          Telefone,
          email,
          atendimentos,
          sexo,
          id_Especialidade,
          CAD_Especialidade(id, Especialidade)
        `)
        .order('id', { ascending: true });

      if (error) {
        console.error('Erro ao buscar profissionais:', error);
        return res.status(500).json({ 
          message: "Erro ao buscar profissionais",
          error: error.message 
        });
      }

      const formattedProfessionals = (data || []).map((prof: any) => ({
        id: prof.id,
        name: prof.Profissional,
        specialty: prof.CAD_Especialidade?.Especialidade || prof.Profissão,
        specialtyId: prof.id_Especialidade,
        crm: prof.CRM || "",
        phone: prof.Telefone || "",
        email: prof.email || "",
        atendimentos: prof.atendimentos || "",
        sexo: prof.sexo || ""
      }));

      res.json(formattedProfessionals);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Create new professional in CAD_Profissional
  app.post("/api/supabase/professionals", async (req, res) => {
    try {
      const { name, specialty, sexo, crm, phone, email, atendimentos, specialtyId } = req.body;
      
      if (!name || !specialty) {
        return res.status(400).json({ 
          error: "Nome e especialidade são obrigatórios" 
        });
      }

      // Inserir novo profissional na tabela CAD_Profissional
      const { data, error } = await supabase
        .from("CAD_Profissional")
        .insert([{
          Profissional: name,
          Profissão: specialty,
          sexo: sexo || "",
          CRM: crm || "",
          Telefone: phone || "",
          email: email || "",
          atendimentos: atendimentos || "",
          id_Especialidade: specialtyId || null,
          id_Empresa: 1
        }])
        .select()
        .single();

      if (error) {
        console.error("Erro ao inserir profissional:", error);
        return res.status(500).json({ 
          error: "Erro ao cadastrar profissional",
          details: error.message 
        });
      }

      // Retornar profissional criado no formato esperado
      const formattedProfessional = {
        id: data.id,
        name: data.Profissional,
        specialty: data.Profissão,
        specialtyId: data.id_Especialidade,
        sexo: data.sexo,
        crm: data.CRM,
        phone: data.Telefone,
        email: data.email,
        atendimentos: data.atendimentos
      };

      res.status(201).json(formattedProfessional);
    } catch (error) {
      console.error("Erro ao criar profissional:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Update professional in CAD_Profissional
  app.put("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, specialty, sexo, crm, phone, email, atendimentos, specialtyId } = req.body;
      
      const updateData: any = {};
      
      if (name !== undefined) updateData.Profissional = name;
      if (specialty !== undefined) updateData.Profissão = specialty;
      if (sexo !== undefined) updateData.sexo = sexo;
      if (crm !== undefined) updateData.CRM = crm;
      if (phone !== undefined) updateData.Telefone = phone;
      if (email !== undefined) updateData.email = email;
      if (atendimentos !== undefined) updateData.atendimentos = atendimentos;
      if (specialtyId !== undefined) updateData.id_Especialidade = specialtyId;
      
      const { data, error } = await supabase
        .from("CAD_Profissional")
        .update(updateData)
        .eq("id", id)
        .select(`
          id,
          Profissional,
          Profissão,
          CRM,
          Telefone,
          email,
          atendimentos,
          sexo,
          id_Especialidade,
          CAD_Especialidade(id, Especialidade)
        `)
        .single();

      if (error) {
        console.error("Erro ao atualizar profissional:", error);
        return res.status(500).json({ 
          error: "Erro ao atualizar profissional",
          details: error.message 
        });
      }

      if (!data) {
        return res.status(404).json({ error: "Profissional não encontrado" });
      }

      const formattedProfessional = {
        id: data.id,
        name: data.Profissional,
        specialty: data.CAD_Especialidade?.Especialidade || data.Profissão,
        specialtyId: data.id_Especialidade,
        crm: data.CRM,
        phone: data.Telefone,
        email: data.email,
        atendimentos: data.atendimentos,
        sexo: data.sexo
      };

      res.json(formattedProfessional);
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Delete professional from CAD_Profissional
  app.delete("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const { error } = await supabase
        .from("CAD_Profissional")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao excluir profissional:", error);
        return res.status(500).json({ 
          error: "Erro ao excluir profissional",
          details: error.message 
        });
      }

      res.json({ message: "Profissional excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir profissional:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // CRM Validation endpoint
  app.post("/api/validate-crm", async (req, res) => {
    try {
      const { crm } = req.body;
      
      if (!crm || typeof crm !== 'string') {
        return res.status(400).json({ 
          error: "CRM é obrigatório" 
        });
      }

      // Extract CRM info from input
      const crmInfo = extractCRMInfo(crm.trim().toUpperCase());
      if (!crmInfo) {
        return res.status(400).json({ 
          error: "Formato de CRM inválido. Use: CRM/UF número (ex: CRM/CE 12345)" 
        });
      }

      // Try to validate with external services
      let validationResult = null;
      
      try {
        // Attempt validation with CFM portal (if available)
        const cfmResult = await validateWithCFM(crmInfo);
        if (cfmResult) {
          validationResult = cfmResult;
        }
      } catch (error) {
        console.log("CFM validation unavailable, using local validation");
      }

      // If external validation fails, use local validation
      if (!validationResult) {
        validationResult = await localCRMValidation(crmInfo);
      }

      res.json(validationResult);
    } catch (error) {
      console.error("Erro na validação de CRM:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for CRM validation
function extractCRMInfo(crmInput: string): { number: string; state: string } | null {
  const patterns = [
    /CRM\/([A-Z]{2})\s*(\d{4,6})/,
    /(\d{4,6})\/([A-Z]{2})/,
    /([A-Z]{2})\s*(\d{4,6})/,
    /(\d{4,6})\s*([A-Z]{2})/
  ];

  const brazilianStates = new Set([
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]);

  for (const pattern of patterns) {
    const match = crmInput.match(pattern);
    if (match) {
      const [, first, second] = match;
      if (brazilianStates.has(first)) {
        return { state: first, number: second };
      } else if (brazilianStates.has(second)) {
        return { state: second, number: first };
      }
    }
  }
  
  return null;
}

async function validateWithCFM(crmInfo: { number: string; state: string }): Promise<any> {
  // This would attempt to validate with CFM's official API if available
  // For now, we'll return null to indicate external validation is not available
  return null;
}

async function localCRMValidation(crmInfo: { number: string; state: string }): Promise<any> {
  const { number, state } = crmInfo;
  
  const stateNames: Record<string, string> = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
    'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
    'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
    'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
    'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
  };

  const specialties = [
    'Clínico Geral', 'Cardiologista', 'Dermatologista', 'Ginecologista',
    'Pediatra', 'Ortopedista', 'Oftalmologista', 'Neurologista',
    'Psiquiatra', 'Cirurgião Geral', 'Anestesiologista', 'Radiologista'
  ];

  // Basic format validation
  const numValue = parseInt(number);
  const isValid = numValue >= 1000 && numValue <= 999999 && state in stateNames;
  
  return {
    crm: `CRM/${state} ${number}`,
    name: isValid ? `Dr(a). Profissional ${number}` : 'Não encontrado',
    specialty: isValid ? specialties[numValue % specialties.length] : 'N/A',
    state: stateNames[state] || state,
    situation: isValid ? 'Formato válido (validação local)' : 'Formato inválido',
    valid: isValid,
    source: 'local'
  };
}