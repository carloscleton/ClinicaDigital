import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AgendaIntegrationProps {
  onAppointmentCreated?: () => void;
}

export default function AgendaIntegration({ onAppointmentCreated }: AgendaIntegrationProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch professionals data
  const { data: professionals = [], isLoading: isLoadingProfessionals } = useQuery({
    queryKey: ["/api/supabase/professionals"],
  });

  // Fetch services data
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ["/api/supabase/services"],
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (appointmentData: any) => {
      // Insert into CAD_Agenda table
      const { data, error } = await supabase
        .from('CAD_Agenda')
        .insert([appointmentData])
        .select();

      if (error) throw new Error(error.message);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Agendamento confirmado!",
        description: "Sua consulta foi agendada com sucesso.",
      });
      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setDescription("");
      setSelectedService(null);
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao agendar",
        description: error.message || "Ocorreu um erro ao agendar sua consulta.",
        variant: "destructive",
      });
    },
  });

  // Get the selected professional's data
  const selectedProfessionalData = professionals.find(p => p.id.toString() === selectedProfessional);

  // Filter services by selected professional
  const filteredServices = selectedProfessional 
    ? services.filter(service => service.idProfissional === parseInt(selectedProfessional))
    : [];

  // Parse the professional's schedule from atendimentos field
  const parseSchedule = (atendimentos?: string) => {
    if (!atendimentos) return {};
    
    const lines = atendimentos.split('\n');
    const schedule: Record<string, { isOpen: boolean, hours?: string }> = {};
    
    // Extract day schedules
    for (const line of lines) {
      if (!line.includes(':')) continue;
      
      const [dayPart, timePart] = line.split(':', 2).map(part => part.trim());
      const day = dayPart.trim();
      
      // Skip non-day lines
      if (!['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].includes(day)) {
        continue;
      }
      
      // Check if day is closed
      if (timePart.includes('❌') || timePart.toLowerCase().includes('fechado')) {
        schedule[day] = { isOpen: false };
      } else {
        schedule[day] = { isOpen: true, hours: timePart };
      }
    }
    
    return schedule;
  };

  // Generate available dates based on professional's schedule
  const getAvailableDates = () => {
    if (!selectedProfessionalData?.atendimentos) return [];
    
    const schedule = parseSchedule(selectedProfessionalData.atendimentos);
    const availableDates = [];
    const dayMap: Record<string, number> = {
      'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sábado': 6, 'Domingo': 0
    };
    
    // Generate dates for the next 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Get day of week
      const dayOfWeek = date.getDay();
      const dayName = Object.keys(dayMap).find(key => dayMap[key] === dayOfWeek);
      
      if (dayName && schedule[dayName]?.isOpen) {
        availableDates.push({
          date,
          dayName,
          hours: schedule[dayName].hours
        });
      }
    }
    
    return availableDates;
  };

  // Generate time slots for a specific day
  const generateTimeSlots = () => {
    if (!selectedProfessionalData?.atendimentos || !selectedDate) return [];
    
    const schedule = parseSchedule(selectedProfessionalData.atendimentos);
    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const dayName = dayNames[selectedDate.getDay()];
    
    if (!schedule[dayName]?.isOpen) return [];
    
    // Parse hours from schedule
    const hoursText = schedule[dayName].hours || "";
    const timeMatch = hoursText.match(/(\d{1,2})h?:?(\d{2})?\s*às\s*(\d{1,2})h?:?(\d{2})?/i);
    if (!timeMatch) return [];
    
    const startHour = parseInt(timeMatch[1]);
    const startMin = parseInt(timeMatch[2] || "0");
    const endHour = parseInt(timeMatch[3]);
    const endMin = parseInt(timeMatch[4] || "0");
    
    // Get consultation duration from atendimentos
    const durationMatch = selectedProfessionalData.atendimentos.match(/Duração da Consulta:\s*(\d+)\s*Minutos/i);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 30;
    
    // Get interval between patients
    const intervalMatch = selectedProfessionalData.atendimentos.match(/Intervalo entre Pacientes[^:]*:\s*(\d+)\s*minutos/i);
    const interval = intervalMatch ? parseInt(intervalMatch[1]) : 5;
    
    // Generate time slots
    const slots = [];
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      
      // Check for lunch break
      const lunchMatch = selectedProfessionalData.atendimentos.match(/intervalo para o almoço:\s*(\d{1,2})\s*às\s*(\d{1,2})/i);
      let isLunchTime = false;
      
      if (lunchMatch) {
        const lunchStart = parseInt(lunchMatch[1]);
        const lunchEnd = parseInt(lunchMatch[2]);
        if (currentHour >= lunchStart && currentHour < lunchEnd) {
          isLunchTime = true;
        }
      }
      
      if (!isLunchTime) {
        // In a real implementation, check against existing appointments
        const isAvailable = Math.random() > 0.3; // Simulate some slots being booked
        
        slots.push({
          time: timeString,
          available: isAvailable
        });
      }
      
      // Increment time by duration + interval
      currentMin += duration + interval;
      while (currentMin >= 60) {
        currentHour++;
        currentMin -= 60;
      }
    }
    
    return slots;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedProfessional || !selectedDate || !selectedTime || !selectedService) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, selecione todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format date and time for database
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      // Create appointment data for CAD_Agenda
      const appointmentData = {
        id_Empresa: 1, // Default empresa ID
        idProfissional: parseInt(selectedProfessional),
        dt_Agendamento: appointmentDateTime.toISOString(),
        descricao: description || "Agendamento via sistema",
        idServico: parseInt(selectedService),
        statusPagamento: false // Default to unpaid
      };

      // Submit to database
      await createAppointment.mutateAsync(appointmentData);

    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao salvar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Available dates and time slots
  const availableDates = getAvailableDates();
  const timeSlots = generateTimeSlots();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agendar Consulta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Professional Selection */}
          <div>
            <Label className="block text-sm font-medium mb-2">Profissional</Label>
            <Select 
              value={selectedProfessional || "none"}
              onValueChange={(value) => {
                setSelectedProfessional(value !== "none" ? value : null);
                setSelectedDate(null);
                setSelectedTime(null);
                setSelectedService(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Selecione um profissional</SelectItem>
                {professionals.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id.toString()}>
                    {prof.name} - {prof.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Selection */}
          {selectedProfessionalData && (
            <div>
              <Label className="block text-sm font-medium mb-2">Serviço</Label>
              <Select 
                value={selectedService || "none"}
                onValueChange={(value) => setSelectedService(value !== "none" ? value : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione um serviço</SelectItem>
                  {filteredServices.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.servicos} - R$ {service.valorServicos?.toFixed(2) || "0.00"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Selection */}
          {selectedProfessionalData && (
            <div>
              <Label className="block text-sm font-medium mb-2">Data</Label>
              <Select 
                value={selectedDate ? selectedDate.toISOString() : "none"}
                onValueChange={(value) => {
                  setSelectedDate(value !== "none" ? new Date(value) : null);
                  setSelectedTime(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione uma data</SelectItem>
                  {availableDates.map((dateInfo, index) => (
                    <SelectItem key={index} value={dateInfo.date.toISOString()}>
                      {format(dateInfo.date, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <Label className="block text-sm font-medium mb-2">Horário</Label>
              {timeSlots.length === 0 ? (
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Não há horários disponíveis para esta data.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`
                        p-2 text-center rounded-md border cursor-pointer
                        ${!slot.available 
                          ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 cursor-not-allowed" 
                          : selectedTime === slot.time
                            ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                            : "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                        }
                      `}
                      onClick={() => {
                        if (slot.available) {
                          setSelectedTime(slot.time);
                        }
                      }}
                    >
                      {slot.time}
                      {!slot.available && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Ocupado
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {selectedTime && (
            <div>
              <Label className="block text-sm font-medium mb-2">Descrição (opcional)</Label>
              <Textarea 
                placeholder="Descreva o motivo da consulta ou observações importantes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Appointment Summary */}
          {selectedProfessionalData && selectedDate && selectedTime && selectedService && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Resumo do Agendamento
              </h3>
              <div className="space-y-2 text-green-700 dark:text-green-400 text-sm">
                <p><strong>Profissional:</strong> {selectedProfessionalData.name}</p>
                <p><strong>Serviço:</strong> {filteredServices.find(s => s.id.toString() === selectedService)?.servicos}</p>
                <p><strong>Data:</strong> {format(selectedDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            className="w-full" 
            disabled={!selectedProfessional || !selectedDate || !selectedTime || !selectedService || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Agendando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}