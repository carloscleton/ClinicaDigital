import { Express } from "express";
import { supabaseProfessionals } from "../client/src/lib/supabase-professionals";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zdqcyemiwglybvpfczya.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMjcxMjMsImV4cCI6MjA0NzcwMzEyM30.e7_Ywf7hjUQI7TmKrGJayEWlQCNMwksE_N1W9ZwjSQE";

const supabase = createClient(supabaseUrl, supabaseKey);

// Server-side interface for CAD_Profissional with atendimentos field
interface CAD_Profissional {
  id: number;
  nome: string;
  especialidade: string;
  crm: string;
  descricao?: string;
  experiencia?: string;
  telefone?: string;
  email?: string;
  atendimentos?: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CAD_Servicos {
  id: number;
  nome: string;
  descricao?: string;
  valor: number;
  duracao?: number;
  categoria: string;
  ativo: boolean;
  requisitos?: string;
  id_Profissional?: number;
  created_at?: string;
  updated_at?: string;
}

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
        email: prof.email || "",
        atendimentos: prof.atendimentos || ""
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

  // Endpoint para criar novo profissional no Supabase
  app.post("/api/supabase/professionals", async (req, res) => {
    try {
      const { name, specialty, crm, phone, email, atendimentos } = req.body;
      
      // Validar campos obrigatórios
      if (!name || !specialty) {
        return res.status(400).json({ 
          error: "Nome e especialidade são obrigatórios" 
        });
      }

      // Inserir novo profissional na tabela CAD_Profissional
      const { data, error } = await supabase
        .from("CAD_Profissional")
        .insert([{
          nome: name,
          especialidade: specialty,
          crm: crm || "",
          Telefone: phone || "",
          email: email || "",
          atendimentos: atendimentos || "",
          ativo: true
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
        name: data.nome,
        specialty: data.especialidade,
        crm: data.crm,
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
        email: professional.email || "",
        atendimentos: professional.atendimentos || ""
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

  // Endpoint para atualizar profissional no Supabase
  app.put("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, specialty, crm, phone, email, atendimentos } = req.body;
      
      // Atualizar profissional na tabela CAD_Profissional
      const { data, error } = await supabase
        .from("CAD_Profissional")
        .update({
          nome: name,
          especialidade: specialty,
          crm: crm || "",
          Telefone: phone || "",
          email: email || "",
          atendimentos: atendimentos || ""
        })
        .eq("id", id)
        .select()
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

      // Retornar profissional atualizado no formato esperado
      const formattedProfessional = {
        id: data.id,
        name: data.nome,
        specialty: data.especialidade,
        crm: data.crm,
        phone: data.Telefone,
        email: data.email,
        atendimentos: data.atendimentos
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

  // Endpoint para excluir profissional no Supabase
  app.delete("/api/supabase/professionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Excluir profissional da tabela CAD_Profissional
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
        email: prof.email || "",
        atendimentos: prof.atendimentos || ""
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
      const { name, specialty, crm, description, experience, phone, email, atendimentos } = req.body;
      
      const updatedProfessional = await supabaseProfessionals.updateProfessional(id, {
        nome: name,
        especialidade: specialty,
        crm: crm,
        descricao: description,
        experiencia: experience,
        telefone: phone,
        email: email,
        atendimentos: atendimentos
      });
      
      const formattedProfessional = {
        id: updatedProfessional.id,
        name: updatedProfessional.nome,
        specialty: updatedProfessional.especialidade,
        crm: updatedProfessional.crm,
        description: updatedProfessional.descricao || "",
        experience: updatedProfessional.experiencia || "",
        phone: updatedProfessional.telefone || "",
        email: updatedProfessional.email || "",
        atendimentos: updatedProfessional.atendimentos || ""
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

  // Patients endpoints for reports
  app.get("/api/supabase/patients", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("CAD_Clientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(data || []);
    } catch (error) {
      console.error("Error in /api/supabase/patients:", error);
      res.status(500).json({ error: "Internal server error" });
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

  // SERVICES ENDPOINTS - CAD_Servicos Management
  
  // Get all services with professional relationship
  app.get("/api/supabase/services", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('CAD_Servicos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar serviços:", error);
        return res.status(500).json({ 
          message: "Erro ao buscar serviços",
          error: error.message 
        });
      }

      // Get professionals data to match with services
      const { data: professionals } = await supabase
        .from('CAD_Profissional')
        .select('id, Profissional, Profissao');

      // Transform data to match frontend interface using actual column names
      const transformedData = data?.map(service => {
        const professional = professionals?.find(p => p.id === service.idProfissional);
        return {
          id: service.id,
          nome: service.servicos, // Map servicos column to nome
          descricao: service.descricao || null,
          valor: service.valorServicos, // Map valorServicos to valor
          duracao: service.duracao || 30,
          categoria: service.categoria || "Consulta",
          ativo: service.ativo !== false,
          requisitos: service.requisitos || null,
          id_Profissional: service.idProfissional, // Map idProfissional
          created_at: service.created_at,
          updated_at: service.updated_at,
          professional: professional ? {
            id: professional.id,
            nome: professional.Profissional,
            especialidade: professional.Profissao
          } : null
        };
      });

      res.json(transformedData || []);
    } catch (error) {
      console.error("Erro interno:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Create new service
  app.post("/api/supabase/services", async (req, res) => {
    try {
      const { nome, descricao, valor, duracao, categoria, requisitos, id_Profissional, ativo } = req.body;

      if (!nome || valor === undefined) {
        return res.status(400).json({ 
          message: "Nome e valor são obrigatórios" 
        });
      }

      // Map frontend fields to actual table columns
      const serviceData = {
        servicos: nome, // Map nome to servicos column
        descricao: descricao || null,
        valorServicos: parseFloat(valor), // Map valor to valorServicos
        duracao: duracao ? parseInt(duracao) : null,
        categoria: categoria || "Consulta",
        requisitos: requisitos || null,
        idProfissional: id_Profissional || null, // Map to idProfissional
        ativo: ativo !== undefined ? ativo : true,
        id_Empresa: 1, // Default empresa ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('CAD_Servicos')
        .insert([serviceData])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar serviço:", error);
        return res.status(500).json({ 
          message: "Erro ao criar serviço",
          error: error.message 
        });
      }

      // Transform response to match frontend expectations
      const transformedResponse = {
        id: data.id,
        nome: data.servicos,
        valor: data.valorServicos,
        created_at: data.created_at
      };

      res.status(201).json(transformedResponse);
    } catch (error) {
      console.error("Erro interno:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Update service
  app.put("/api/supabase/services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao, valor, duracao, categoria, requisitos, id_Profissional, ativo } = req.body;

      if (!nome || valor === undefined) {
        return res.status(400).json({ 
          message: "Nome e valor são obrigatórios" 
        });
      }

      // Map frontend fields to actual table columns
      const updateData = {
        servicos: nome, // Map nome to servicos column
        descricao: descricao || null,
        valorServicos: parseFloat(valor), // Map valor to valorServicos
        duracao: duracao ? parseInt(duracao) : null,
        categoria: categoria || "Consulta",
        requisitos: requisitos || null,
        idProfissional: id_Profissional || null, // Map to idProfissional
        ativo: ativo !== undefined ? ativo : true,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('CAD_Servicos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar serviço:", error);
        return res.status(500).json({ 
          message: "Erro ao atualizar serviço",
          error: error.message 
        });
      }

      if (!data) {
        return res.status(404).json({ 
          message: "Serviço não encontrado" 
        });
      }

      // Transform response to match frontend expectations
      const transformedResponse = {
        id: data.id,
        nome: data.servicos,
        valor: data.valorServicos,
        updated_at: data.updated_at
      };

      res.json(transformedResponse);
    } catch (error) {
      console.error("Erro interno:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Delete service
  app.delete("/api/supabase/services/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('CAD_Servicos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erro ao excluir serviço:", error);
        return res.status(500).json({ 
          message: "Erro ao excluir serviço",
          error: error.message 
        });
      }

      res.json({ message: "Serviço excluído com sucesso" });
    } catch (error) {
      console.error("Erro interno:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}