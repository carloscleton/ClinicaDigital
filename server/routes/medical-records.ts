import { Router } from "express";
import { supabase } from "../supabase-client";
import { z } from "zod";

const router = Router();

// Schema validations
const medicationSchema = z.object({
  nome: z.string().min(1),
  dosagem: z.string().min(1),
  posologia: z.string().min(1),
  duracao: z.string()
});

const sinaisVitaisSchema = z.object({
  pressao_arterial: z.string().optional(),
  frequencia_cardiaca: z.number().min(0).max(300).optional(),
  temperatura: z.number().min(32).max(45).optional(),
  saturacao: z.number().min(0).max(100).optional(),
  peso: z.number().min(0).max(500).optional(),
  altura: z.number().min(0).max(3).optional(),
  imc: z.number().min(0).max(100).optional()
});

const medicalRecordSchema = z.object({
  id_paciente: z.number(),
  id_profissional: z.number(),
  data_consulta: z.string(),
  queixa_principal: z.string().min(1),
  historia_doenca: z.string().optional(),
  sinais_vitais: sinaisVitaisSchema,
  exame_fisico: z.string().optional(),
  diagnostico: z.string().min(1),
  plano_tratamento: z.string(),
  medicamentos: z.array(medicationSchema),
  exames_solicitados: z.array(z.string()),
  retorno: z.string().nullable(),
  observacoes: z.string().optional()
});

// Get all medical records
router.get("/", async (req, res) => {
  try {
    // Optional query params for filtering
    const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
    const professionalId = req.query.professionalId ? parseInt(req.query.professionalId as string) : undefined;
    
    // Build the query
    let query = supabase
      .from("CAD_Historico")
      .select(`
        *,
        paciente:id_paciente(id, nomeCliente, telefoneCliente, emailCliente, nascimentoCliente),
        profissional:id_profissional(id, Profissional, Profissao)
      `)
      .order('data_consulta', { ascending: false });
      
    // Apply filters if provided
    if (patientId) {
      query = query.eq('id_paciente', patientId);
    }
    
    if (professionalId) {
      query = query.eq('id_profissional', professionalId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching medical records:", error);
      return res.status(500).json({ error: "Erro ao buscar histórico médico" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Get medical records for a specific patient
router.get("/patient/:id", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    
    const { data, error } = await supabase
      .from("CAD_Historico")
      .select(`
        *,
        paciente:id_paciente(id, nomeCliente, telefoneCliente, emailCliente, nascimentoCliente),
        profissional:id_profissional(id, Profissional, Profissao)
      `)
      .eq('id_paciente', patientId)
      .order('data_consulta', { ascending: false });

    if (error) {
      console.error("Error fetching patient medical records:", error);
      return res.status(500).json({ error: "Erro ao buscar histórico do paciente" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Get a single medical record by ID
router.get("/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    
    const { data, error } = await supabase
      .from("CAD_Historico")
      .select(`
        *,
        paciente:id_paciente(id, nomeCliente, telefoneCliente, emailCliente, nascimentoCliente),
        profissional:id_profissional(id, Profissional, Profissao)
      `)
      .eq('id', recordId)
      .single();

    if (error) {
      console.error("Error fetching medical record:", error);
      return res.status(404).json({ error: "Registro médico não encontrado" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Create a new medical record
router.post("/", async (req, res) => {
  try {
    // Validate request body
    const validationResult = medicalRecordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Dados inválidos", 
        details: validationResult.error.format() 
      });
    }

    const record = validationResult.data;
    
    // Format the data_consulta if it's just a date string
    if (record.data_consulta && !record.data_consulta.includes('T')) {
      record.data_consulta = `${record.data_consulta}T00:00:00`;
    }

    const { data, error } = await supabase
      .from("CAD_Historico")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Error creating medical record:", error);
      return res.status(500).json({ error: "Erro ao criar registro médico" });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Update a medical record
router.put("/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    
    // Validate request body
    const validationResult = medicalRecordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Dados inválidos", 
        details: validationResult.error.format() 
      });
    }

    const record = validationResult.data;
    
    // Format the data_consulta if it's just a date string
    if (record.data_consulta && !record.data_consulta.includes('T')) {
      record.data_consulta = `${record.data_consulta}T00:00:00`;
    }

    const { data, error } = await supabase
      .from("CAD_Historico")
      .update(record)
      .eq('id', recordId)
      .select()
      .single();

    if (error) {
      console.error("Error updating medical record:", error);
      return res.status(500).json({ error: "Erro ao atualizar registro médico" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Delete a medical record
router.delete("/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    
    const { error } = await supabase
      .from("CAD_Historico")
      .delete()
      .eq('id', recordId);

    if (error) {
      console.error("Error deleting medical record:", error);
      return res.status(500).json({ error: "Erro ao excluir registro médico" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;