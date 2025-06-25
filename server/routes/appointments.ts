import { Router } from "express";
import { supabase } from "../supabase-client";
import { z } from "zod";

const router = Router();

// Schema for appointment creation
const createAppointmentSchema = z.object({
  id_Empresa: z.number().default(1),
  idProfissional: z.number(),
  dt_Agendamento: z.string().datetime(),
  descricao: z.string().optional(),
  idServico: z.number(),
  statusPagamento: z.boolean().default(false)
});

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('CAD_Agenda')
      .select(`
        *,
        CAD_Profissional(id, Profissional, Profissão),
        CAD_Servicos(id, servicos, valorServicos)
      `)
      .order('dt_Agendamento', { ascending: false });

    if (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }

    // Transform data to match frontend expectations
    const formattedAppointments = data.map(appointment => ({
      id: appointment.id,
      professionalId: appointment.idProfissional,
      professionalName: appointment.CAD_Profissional?.Profissional || "Não especificado",
      specialty: appointment.CAD_Profissional?.Profissão || "Não especificada",
      serviceId: appointment.idServico,
      serviceName: appointment.CAD_Servicos?.servicos || "Não especificado",
      serviceValue: appointment.CAD_Servicos?.valorServicos || 0,
      appointmentDate: appointment.dt_Agendamento,
      description: appointment.descricao || "",
      paymentStatus: appointment.statusPagamento,
      companyId: appointment.id_Empresa
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get appointments for a specific professional
router.get("/professional/:id", async (req, res) => {
  try {
    const professionalId = parseInt(req.params.id);
    
    const { data, error } = await supabase
      .from('CAD_Agenda')
      .select(`
        *,
        CAD_Profissional(id, Profissional, Profissão),
        CAD_Servicos(id, servicos, valorServicos)
      `)
      .eq('idProfissional', professionalId)
      .order('dt_Agendamento', { ascending: false });

    if (error) {
      console.error("Error fetching professional appointments:", error);
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }

    // Transform data to match frontend expectations
    const formattedAppointments = data.map(appointment => ({
      id: appointment.id,
      professionalId: appointment.idProfissional,
      professionalName: appointment.CAD_Profissional?.Profissional || "Não especificado",
      specialty: appointment.CAD_Profissional?.Profissão || "Não especificada",
      serviceId: appointment.idServico,
      serviceName: appointment.CAD_Servicos?.servicos || "Não especificado",
      serviceValue: appointment.CAD_Servicos?.valorServicos || 0,
      appointmentDate: appointment.dt_Agendamento,
      description: appointment.descricao || "",
      paymentStatus: appointment.statusPagamento,
      companyId: appointment.id_Empresa
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new appointment
router.post("/", async (req, res) => {
  try {
    // Validate request body
    const validationResult = createAppointmentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid appointment data", 
        details: validationResult.error.format() 
      });
    }

    const appointmentData = validationResult.data;
    
    // Insert into CAD_Agenda
    const { data, error } = await supabase
      .from('CAD_Agenda')
      .insert([appointmentData])
      .select();

    if (error) {
      console.error("Error creating appointment:", error);
      return res.status(500).json({ error: "Failed to create appointment" });
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update appointment payment status
router.patch("/:id/payment", async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    const { statusPagamento } = req.body;
    
    if (typeof statusPagamento !== 'boolean') {
      return res.status(400).json({ error: "Payment status must be a boolean" });
    }

    const { data, error } = await supabase
      .from('CAD_Agenda')
      .update({ statusPagamento })
      .eq('id', appointmentId)
      .select();

    if (error) {
      console.error("Error updating appointment payment status:", error);
      return res.status(500).json({ error: "Failed to update payment status" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(data[0]);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an appointment
router.delete("/:id", async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    
    const { error } = await supabase
      .from('CAD_Agenda')
      .delete()
      .eq('id', appointmentId);

    if (error) {
      console.error("Error deleting appointment:", error);
      return res.status(500).json({ error: "Failed to delete appointment" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;