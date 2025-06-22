import { Express } from "express";
import { supabaseProfessionals } from "../client/src/lib/supabase-professionals";

export async function registerSupabaseRoutes(app: Express) {
  
  // Endpoint para buscar todos os profissionais do Supabase
  app.get("/api/supabase/professionals", async (req, res) => {
    try {
      const professionals = await supabaseProfessionals.getAllProfessionals();
      
      // Converter para formato compatível com o sistema atual
      const formattedProfessionals = professionals.map(prof => ({
        id: prof.id,
        name: prof.nome,
        specialty: prof.especialidade,
        crm: prof.crm,
        description: prof.descricao || "",
        experience: prof.experiencia || "",
        phone: prof.telefone || "",
        email: prof.email || ""
      }));
      
      res.json(formattedProfessionals);
    } catch (error) {
      console.error("Erro ao buscar profissionais do Supabase:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Endpoint para buscar profissional por ID do Supabase
  app.get("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const professional = await supabaseProfessionals.getProfessionalById(id);
      
      if (!professional) {
        return res.status(404).json({ error: "Profissional não encontrado" });
      }
      
      const formattedProfessional = {
        id: professional.id,
        name: professional.nome,
        specialty: professional.especialidade,
        crm: professional.crm,
        description: professional.descricao || "",
        experience: professional.experiencia || "",
        phone: professional.telefone || "",
        email: professional.email || ""
      };
      
      res.json(formattedProfessional);
    } catch (error) {
      console.error("Erro ao buscar profissional do Supabase:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Endpoint para buscar profissionais por especialidade
  app.get("/api/supabase/professionals/specialty/:specialty", async (req, res) => {
    try {
      const specialty = decodeURIComponent(req.params.specialty);
      const professionals = await supabaseProfessionals.getProfessionalsBySpecialty(specialty);
      
      const formattedProfessionals = professionals.map(prof => ({
        id: prof.id,
        name: prof.nome,
        specialty: prof.especialidade,
        crm: prof.crm,
        description: prof.descricao || "",
        experience: prof.experiencia || "",
        phone: prof.telefone || "",
        email: prof.email || ""
      }));
      
      res.json(formattedProfessionals);
    } catch (error) {
      console.error("Erro ao buscar profissionais por especialidade:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Endpoint para buscar especialidades únicas
  app.get("/api/supabase/specialties", async (req, res) => {
    try {
      const specialties = await supabaseProfessionals.getUniqueSpecialties();
      res.json(specialties);
    } catch (error) {
      console.error("Erro ao buscar especialidades:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Endpoint para estatísticas dos profissionais
  app.get("/api/supabase/professionals/stats", async (req, res) => {
    try {
      const stats = await supabaseProfessionals.getProfessionalsStats();
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Endpoint para criar novo profissional
  app.post("/api/supabase/professionals", async (req, res) => {
    try {
      const { name, specialty, crm, description, experience, phone, email } = req.body;
      
      const newProfessional = await supabaseProfessionals.createProfessional({
        nome: name,
        especialidade: specialty,
        crm: crm,
        descricao: description || "",
        experiencia: experience || "",
        telefone: phone || "",
        email: email || "",
        ativo: true
      });
      
      const formattedProfessional = {
        id: newProfessional.id,
        name: newProfessional.nome,
        specialty: newProfessional.especialidade,
        crm: newProfessional.crm,
        description: newProfessional.descricao || "",
        experience: newProfessional.experiencia || "",
        phone: newProfessional.telefone || "",
        email: newProfessional.email || ""
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

  // Endpoint para atualizar profissional
  app.put("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, specialty, crm, description, experience, phone, email } = req.body;
      
      const updatedProfessional = await supabaseProfessionals.updateProfessional(id, {
        nome: name,
        especialidade: specialty,
        crm: crm,
        descricao: description,
        experiencia: experience,
        telefone: phone,
        email: email
      });
      
      const formattedProfessional = {
        id: updatedProfessional.id,
        name: updatedProfessional.nome,
        specialty: updatedProfessional.especialidade,
        crm: updatedProfessional.crm,
        description: updatedProfessional.descricao || "",
        experience: updatedProfessional.experiencia || "",
        phone: updatedProfessional.telefone || "",
        email: updatedProfessional.email || ""
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

  // Endpoint para desativar profissional
  app.delete("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await supabaseProfessionals.deactivateProfessional(id);
      
      if (success) {
        res.json({ message: "Profissional desativado com sucesso" });
      } else {
        res.status(500).json({ error: "Erro ao desativar profissional" });
      }
    } catch (error) {
      console.error("Erro ao desativar profissional:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Endpoint para testar conexão com Supabase
  app.get("/api/supabase/test", async (req, res) => {
    try {
      const isConnected = await supabaseProfessionals.testConnection();
      res.json({ 
        connected: isConnected,
        message: isConnected ? "Conexão com Supabase funcionando" : "Erro na conexão com Supabase"
      });
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      res.status(500).json({ 
        connected: false,
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}