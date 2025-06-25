import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, LayoutList, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay, parseISO, isValid, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SmartSchedulingProps {
  professionalId?: number;
  onDateTimeSelected?: (date: Date, time: string) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

export default function SmartScheduling({ 
  professionalId,
  onDateTimeSelected,
  selectedDate = null,
  selectedTime = null
}: SmartSchedulingProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("month");
  const [selectedDay, setSelectedDay] = useState<string>("Segunda");
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate);
  const [internalSelectedTime, setInternalSelectedTime] = useState<string | null>(selectedTime);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(professionalId || null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState<string>("");
  
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

  // Fetch existing appointments from CAD_Agenda
  const { data: existingAppointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('CAD_Agenda')
        .select(`
          id,
          idProfissional,
          dt_Agendamento,
          descricao,
          idServico,
          statusPagamento
        `);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (appointmentData: any) => {
      const { data, error } = await supabase
        .from('CAD_Agenda')
        .insert([appointmentData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Agendamento confirmado!",
        description: "Sua consulta foi agendada com sucesso.",
      });
      // Reset form
      setInternalSelectedDate(null);
      setInternalSelectedTime(null);
      setDescription("");
      setSelectedService(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao agendar",
        description: error.message || "Ocorreu um erro ao agendar sua consulta.",
        variant: "destructive",
      });
    },
  });

  // Effect to update internal state when props change
  useEffect(() => {
    if (selectedDate) {
      setInternalSelectedDate(selectedDate);
      // Also update selected day
      const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
      setSelectedDay(dayNames[selectedDate.getDay()]);
    }
    
    if (selectedTime) {
      setInternalSelectedTime(selectedTime);
    }

    if (professionalId) {
      setSelectedProfessional(professionalId);
    }
  }, [selectedDate, selectedTime, professionalId]);

  // Get the selected professional's data
  const selectedProfessionalData = professionals.find(p => p.id === selectedProfessional);

  // Parse the professional's schedule configuration from the atendimentos field
  const parseScheduleConfig = (atendimentos?: string) => {
    if (!atendimentos) {
      return {
        weekDays: {
          "Segunda": { isOpen: false },
          "Terça": { isOpen: false },
          "Quarta": { isOpen: false },
          "Quinta": { isOpen: false },
          "Sexta": { isOpen: false },
          "Sábado": { isOpen: false },
          "Domingo": { isOpen: false }
        },
        consultationDuration: 30,
        patientInterval: 5,
        lunchBreak: null
      };
    }

    const lines = atendimentos.split('\n');
    const schedule = {
      weekDays: {
        "Segunda": { isOpen: false, startTime: "", endTime: "" },
        "Terça": { isOpen: false, startTime: "", endTime: "" },
        "Quarta": { isOpen: false, startTime: "", endTime: "" },
        "Quinta": { isOpen: false, startTime: "", endTime: "" },
        "Sexta": { isOpen: false, startTime: "", endTime: "" },
        "Sábado": { isOpen: false, startTime: "", endTime: "" },
        "Domingo": { isOpen: false, startTime: "", endTime: "" }
      },
      consultationDuration: 30,
      patientInterval: 5,
      lunchBreak: null
    };

    // Extract consultation duration
    const durationLine = lines.find(line => 
      line.toLowerCase().includes('duração da consulta') || 
      line.toLowerCase().includes('duração de consulta')
    );
    if (durationLine) {
      const durationMatch = durationLine.match(/(\d+)\s*minutos?/i);
      if (durationMatch) {
        schedule.consultationDuration = parseInt(durationMatch[1]);
      }
    }
    
    // Extract patient interval
    const intervalLine = lines.find(line => 
      line.toLowerCase().includes('intervalo entre pacientes')
    );
    if (intervalLine) {
      const intervalMatch = intervalLine.match(/(\d+)\s*minutos?/i);
      if (intervalMatch) {
        schedule.patientInterval = parseInt(intervalMatch[1]);
      }
    }
    
    // Extract lunch break
    const lunchLine = lines.find(line => 
      line.toLowerCase().includes('intervalo para o almoço') || 
      line.toLowerCase().includes('intervalo almoço')
    );
    if (lunchLine && !lunchLine.includes('❌')) {
      const lunchMatch = lunchLine.match(/(\d{1,2})(?::(\d{2}))?\s*(?:às|a|-)\s*(\d{1,2})(?::(\d{2}))?/);
      if (lunchMatch) {
        const startHour = parseInt(lunchMatch[1]);
        const startMin = parseInt(lunchMatch[2] || "0");
        const endHour = parseInt(lunchMatch[3]);
        const endMin = parseInt(lunchMatch[4] || "0");
        
        schedule.lunchBreak = {
          startTime: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
          endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
        };
      }
    }

    // Parse day schedules
    for (const line of lines) {
      // Skip non-day lines
      if (!line.includes(':')) continue;
      
      const [dayPart, timePart] = line.split(':', 2).map(part => part.trim());
      const day = dayPart.trim();
      
      // Check if this is a day we recognize
      if (!schedule.weekDays[day]) continue;
      
      // Check if day is closed
      if (timePart.includes('❌') || 
          timePart.toLowerCase().includes('fechado') || 
          timePart.toLowerCase().includes('agenda fechada')) {
        schedule.weekDays[day].isOpen = false;
        continue;
      }
      
      // Parse time range
      const timeMatch = timePart.match(/(\d{1,2})h?:?(\d{2})?\s*às\s*(\d{1,2})h?:?(\d{2})?/i);
      if (timeMatch) {
        const startHour = parseInt(timeMatch[1]);
        const startMin = parseInt(timeMatch[2] || "0");
        const endHour = parseInt(timeMatch[3]);
        const endMin = parseInt(timeMatch[4] || "0");
        
        const startTime = `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        
        schedule.weekDays[day].isOpen = true;
        schedule.weekDays[day].startTime = startTime;
        schedule.weekDays[day].endTime = endTime;
      }
    }

    return schedule;
  };

  const scheduleConfig = parseScheduleConfig(selectedProfessionalData?.atendimentos);

  // Generate time slots for a specific day
  const generateTimeSlots = (date: Date, schedule: any) => {
    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const dayName = dayNames[date.getDay()];
    
    if (!schedule.weekDays[dayName].isOpen) {
      return [];
    }

    const daySchedule = schedule.weekDays[dayName];
    const slots = [];
    
    // Convert start and end times to minutes for easier calculation
    const [startHour, startMinute] = daySchedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = daySchedule.endTime.split(':').map(Number);
    
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    // Duration of each slot (consultation + interval)
    const slotDuration = schedule.consultationDuration + schedule.patientInterval;
    
    // Calculate lunch break in minutes if exists
    let lunchStartMinutes = -1;
    let lunchEndMinutes = -1;
    
    if (schedule.lunchBreak) {
      const [lunchStartHour, lunchStartMin] = schedule.lunchBreak.startTime.split(':').map(Number);
      const [lunchEndHour, lunchEndMin] = schedule.lunchBreak.endTime.split(':').map(Number);
      
      lunchStartMinutes = lunchStartHour * 60 + lunchStartMin;
      lunchEndMinutes = lunchEndHour * 60 + lunchEndMin;
    }
    
    // Generate slots
    // The last slot can start at most (endTimeInMinutes - consultationDuration) minutes
    const maxStartTime = endTimeInMinutes - schedule.consultationDuration;
    
    for (let currentMinute = startTimeInMinutes; currentMinute <= maxStartTime; currentMinute += slotDuration) {
      // Check if this slot conflicts with lunch break
      const slotEndMinute = currentMinute + schedule.consultationDuration;
      const conflictsWithLunch = 
        lunchStartMinutes >= 0 && 
        lunchEndMinutes >= 0 && 
        currentMinute < lunchEndMinutes && 
        slotEndMinute > lunchStartMinutes;
      
      if (!conflictsWithLunch) {
        const hours = Math.floor(currentMinute / 60);
        const minutes = currentMinute % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Check if this slot is already booked
        const dateStr = format(date, 'yyyy-MM-dd');
        const dateTimeStr = `${dateStr}T${timeString}:00`;
        
        const isBooked = existingAppointments.some(apt => {
          const aptDate = new Date(apt.dt_Agendamento);
          const slotDate = new Date(dateTimeStr);
          
          // Check if this appointment is for the same professional and overlaps with the slot
          return apt.idProfissional === selectedProfessional && 
                 Math.abs(aptDate.getTime() - slotDate.getTime()) < (schedule.consultationDuration * 60 * 1000);
        });
        
        slots.push({
          time: timeString,
          available: !isBooked
        });
      }
    }
    
    return slots;
  };

  // Check if a day is available based on professional's schedule
  const isDayAvailable = (date: Date) => {
    if (!selectedProfessionalData) return false;
    
    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const dayName = dayNames[date.getDay()];
    
    return scheduleConfig.weekDays[dayName].isOpen;
  };

  // Handle slot selection
  const handleSlotSelect = (date: Date, time: string) => {
    setInternalSelectedDate(date);
    setInternalSelectedTime(time);
    
    if (onDateTimeSelected) {
      onDateTimeSelected(date, time);
    }
  };

  // Format date for display
  const formatDateForDisplay = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedProfessional || !internalSelectedDate || !internalSelectedTime || !selectedService) {
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
      const appointmentDateTime = new Date(internalSelectedDate);
      const [hours, minutes] = internalSelectedTime.split(':').map(Number);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      // Create appointment data for CAD_Agenda
      const appointmentData = {
        id_Empresa: 1, // Default empresa ID
        idProfissional: selectedProfessional,
        dt_Agendamento: appointmentDateTime.toISOString(),
        descricao: description || "Agendamento via sistema",
        idServico: selectedService,
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

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!internalSelectedDate || !selectedProfessionalData) return [];
    
    return generateTimeSlots(internalSelectedDate, scheduleConfig);
  };

  // Filter services by selected professional
  const filteredServices = selectedProfessional 
    ? services.filter(service => service.idProfissional === selectedProfessional)
    : [];

  if (isLoadingProfessionals) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando profissionais...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Agenda Semanal
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualização completa dos agendamentos da semana
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendar Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Selection Form */}
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Profissional</Label>
                <Select 
                  value={selectedProfessional?.toString() || ""}
                  onValueChange={(value) => setSelectedProfessional(value ? parseInt(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Selecione um profissional</SelectItem>
                    {professionals.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id.toString()}>
                        {prof.name} - {prof.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProfessionalData && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Informações do Profissional
                  </h3>
                  <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <p><strong>Nome:</strong> {selectedProfessionalData.name}</p>
                    <p><strong>Especialidade:</strong> {selectedProfessionalData.specialty}</p>
                    {selectedProfessionalData.crm && (
                      <p><strong>CRM:</strong> {selectedProfessionalData.crm}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedProfessionalData && (
                <div>
                  <Label className="block text-sm font-medium mb-2">Serviço</Label>
                  <Select 
                    value={selectedService?.toString() || ""}
                    onValueChange={(value) => setSelectedService(value ? parseInt(value) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Selecione um serviço</SelectItem>
                      {filteredServices.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.servicos} - R$ {service.valorServicos?.toFixed(2) || "0.00"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {internalSelectedDate && internalSelectedTime && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Horário Selecionado
                  </h3>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    <p><strong>Data:</strong> {formatDateForDisplay(internalSelectedDate)}</p>
                    <p><strong>Horário:</strong> {internalSelectedTime}</p>
                  </div>
                </div>
              )}

              <div>
                <Label className="block text-sm font-medium mb-2">Descrição (opcional)</Label>
                <Textarea 
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                  rows={3}
                  placeholder="Descreva o motivo da consulta ou observações importantes"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button 
                className="w-full" 
                disabled={!selectedProfessional || !internalSelectedDate || !internalSelectedTime || !selectedService || isSubmitting}
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

            {/* Right Column - Calendar */}
            <div className="lg:col-span-2">
              {selectedProfessionalData ? (
                <>
                  {/* Calendar Navigation */}
                  <div className="mb-4 flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(prevDate => viewMode === "month" ? subMonths(prevDate, 1) : addDays(prevDate, -7))}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {viewMode === "month" ? "Mês Anterior" : "Semana Anterior"}
                    </Button>
                    <h2 className="text-lg font-semibold">
                      {viewMode === "month" 
                        ? format(currentDate, "MMMM yyyy", { locale: ptBR }) 
                        : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "dd/MM/yyyy")} - ${format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), "dd/MM/yyyy")}`}
                    </h2>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(prevDate => viewMode === "month" ? addMonths(prevDate, 1) : addDays(prevDate, 7))}>
                      {viewMode === "month" ? "Próximo Mês" : "Próxima Semana"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex justify-center mb-4">
                    <div className="flex rounded-md border border-gray-200 dark:border-gray-700">
                      <Button
                        variant={viewMode === "month" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("month")}
                        className="rounded-r-none"
                      >
                        <Grid className="h-4 w-4 mr-2" />
                        Mês
                      </Button>
                      <Button
                        variant={viewMode === "week" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("week")}
                        className="rounded-l-none"
                      >
                        <LayoutList className="h-4 w-4 mr-2" />
                        Semana
                      </Button>
                    </div>
                  </div>
                  
                  {/* Calendar View */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    {viewMode === "month" ? (
                      <div className="space-y-2">
                        {/* Days of Week Header */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(day => (
                            <div key={day} className="p-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-1">
                          {/* Generate days for the month view */}
                          {(() => {
                            const monthStart = startOfMonth(currentDate);
                            const monthEnd = endOfMonth(currentDate);
                            const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
                            const endDate = addDays(startOfWeek(addDays(monthEnd, 1), { weekStartsOn: 1 }), 6);
                            
                            const days = eachDayOfInterval({ start: startDate, end: endDate });
                            
                            return days.map((day, i) => {
                              const isCurrentMonth = isSameMonth(day, currentDate);
                              const isToday = isSameDay(day, new Date());
                              const isSelected = internalSelectedDate ? isSameDay(day, internalSelectedDate) : false;
                              const isAvailable = isCurrentMonth && isDayAvailable(day);
                              
                              return (
                                <div
                                  key={i}
                                  className={cn(
                                    "min-h-[60px] p-2 border rounded-md transition-colors",
                                    isCurrentMonth 
                                      ? isAvailable 
                                        ? isSelected
                                          ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800 cursor-pointer"
                                          : "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800 cursor-pointer"
                                        : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                      : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800"
                                  )}
                                  onClick={() => {
                                    if (isCurrentMonth && isAvailable) {
                                      setInternalSelectedDate(day);
                                      
                                      // Update selected day
                                      const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                                      setSelectedDay(dayNames[day.getDay()]);
                                      
                                      // Switch to week view to show time slots
                                      setViewMode("week");
                                    }
                                  }}
                                >
                                  <div className={cn(
                                    "text-right text-sm font-medium",
                                    isToday && "text-blue-600 dark:text-blue-400"
                                  )}>
                                    {format(day, "d")}
                                  </div>
                                  
                                  {isCurrentMonth && isAvailable && (
                                    <div className="mt-1 text-xs">
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-300">
                                        Disponível
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Week View - Days Header */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day, index) => {
                            const isAvailable = scheduleConfig.weekDays[day].isOpen;
                            const date = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), index);
                            
                            return (
                              <div 
                                key={day}
                                className={cn(
                                  "text-center p-2 rounded-md cursor-pointer",
                                  selectedDay === day && "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
                                  !isAvailable && "opacity-50"
                                )}
                                onClick={() => {
                                  if (isAvailable) {
                                    setSelectedDay(day);
                                    setInternalSelectedDate(date);
                                  }
                                }}
                              >
                                <div className="font-medium">{day.substring(0, 3)}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(date, "dd/MM")}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Time Slots */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4 max-h-[300px] overflow-y-auto p-2">
                          {(() => {
                            if (!internalSelectedDate) return null;
                            
                            const slots = getAvailableTimeSlots();
                            
                            if (slots.length === 0) {
                              return (
                                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>Nenhum horário disponível para este dia</p>
                                </div>
                              );
                            }
                            
                            return slots.map((slot, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "p-3 rounded-md cursor-pointer text-center border",
                                  !slot.available 
                                    ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 cursor-not-allowed"
                                    : internalSelectedTime === slot.time
                                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                                      : "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                                )}
                                onClick={() => {
                                  if (slot.available) {
                                    setInternalSelectedTime(slot.time);
                                    
                                    if (onDateTimeSelected && internalSelectedDate) {
                                      onDateTimeSelected(internalSelectedDate, slot.time);
                                    }
                                  }
                                }}
                              >
                                <div className="font-medium">
                                  {slot.time}
                                </div>
                                {!slot.available && (
                                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    Ocupado
                                  </div>
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <User className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Selecione um Profissional
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Para visualizar a agenda e horários disponíveis, primeiro selecione um profissional no painel à esquerda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-50 dark:bg-green-900/10 rounded-sm mr-2"></div>
          <span className="text-sm">Disponível</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded-sm mr-2"></div>
          <span className="text-sm">Selecionado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-50 dark:bg-red-900/10 rounded-sm mr-2"></div>
          <span className="text-sm">Ocupado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-sm mr-2"></div>
          <span className="text-sm">Intervalo/Almoço</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm mr-2"></div>
          <span className="text-sm">Indisponível</span>
        </div>
      </div>
    </div>
  );
}