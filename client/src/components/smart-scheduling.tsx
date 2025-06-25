import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO, isValid, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

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
}: SmartSchedulingProps = {}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("month");
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(professionalId?.toString() || null);
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate);
  const [internalSelectedTime, setInternalSelectedTime] = useState<string | null>(selectedTime);
  const [selectedDay, setSelectedDay] = useState<string>("Segunda");
  const [professionalSchedule, setProfessionalSchedule] = useState<any | null>(null);

  // Fetch professionals data
  const { data: professionals = [], isLoading: isLoadingProfessionals } = useQuery<any[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  // Get the selected professional's details
  const selectedProfessionalDetails = selectedProfessional 
    ? professionals.find(p => p.id.toString() === selectedProfessional) 
    : null;

  // Parse the professional's schedule configuration from the atendimentos field
  useEffect(() => {
    if (selectedProfessionalDetails?.atendimentos) {
      const schedule = parseAtendimentos(selectedProfessionalDetails.atendimentos);
      setProfessionalSchedule(schedule);
    } else {
      setProfessionalSchedule(null);
    }
  }, [selectedProfessionalDetails]);

  // Parser for atendimentos field
  const parseAtendimentos = (atendimentosText: string) => {
    const lines = atendimentosText.split('\n');
    const schedule = {
      days: {
        "Segunda": null,
        "Terça": null,
        "Quarta": null,
        "Quinta": null,
        "Sexta": null,
        "Sábado": null,
        "Domingo": null
      },
      duration: 60,
      interval: 5,
      lunch: null
    };

    lines.forEach(line => {
      line = line.trim();
      
      // Parse dias da semana
      const dayMatch = line.match(/^(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo):\s*(.+)$/);
      if (dayMatch) {
        const day = dayMatch[1];
        const hours = dayMatch[2];
        
        if (hours.includes('❌') || hours.toLowerCase().includes('fechad')) {
          schedule.days[day] = null;
        } else {
          const timeMatch = hours.match(/(\d+)h?:?(\d+)?\s*às?\s*(\d+)h?:?(\d+)?/);
          if (timeMatch) {
            const startHour = parseInt(timeMatch[1]);
            const startMin = parseInt(timeMatch[2] || 0);
            const endHour = parseInt(timeMatch[3]);
            const endMin = parseInt(timeMatch[4] || 0);
            
            schedule.days[day] = {
              start: { hour: startHour, minute: startMin },
              end: { hour: endHour, minute: endMin }
            };
          }
        }
      }
      
      // Parse duração da consulta
      if (line.includes('Duração da Consulta')) {
        const durationMatch = line.match(/(\d+)\s*Minutos/);
        if (durationMatch) {
          schedule.duration = parseInt(durationMatch[1]);
        }
      }
      
      // Parse intervalo entre pacientes
      if (line.includes('Intervalo entre Pacientes')) {
        const intervalMatch = line.match(/(\d+)\s*minutos/);
        if (intervalMatch) {
          schedule.interval = parseInt(intervalMatch[1]);
        }
      }
      
      // Parse intervalo de almoço
      if (line.includes('intervalo para o almoço') && !line.includes('❌')) {
        const lunchMatch = line.match(/(\d+)\s*às?\s*(\d+)h?:?(\d+)?/);
        if (lunchMatch) {
          schedule.lunch = {
            start: { hour: parseInt(lunchMatch[1]), minute: 0 },
            end: { hour: parseInt(lunchMatch[2]), minute: parseInt(lunchMatch[3] || 0) }
          };
        }
      }
    });

    return schedule;
  };

  // Check if a day is available based on the professional's schedule
  const isDayAvailable = (date: Date) => {
    if (!professionalSchedule) return false;
    
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayName = dayNames[date.getDay()];
    
    return professionalSchedule.days[dayName] !== null && professionalSchedule.days[dayName] !== undefined;
  };

  // Generate time slots for a specific date
  const generateTimeSlots = (date: Date) => {
    if (!professionalSchedule) return [];
    
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayName = dayNames[date.getDay()];
    
    if (!professionalSchedule.days[dayName]) {
      return [];
    }

    const daySchedule = professionalSchedule.days[dayName];
    const slots = [];
    
    let currentTime = new Date(date);
    currentTime.setHours(daySchedule.start.hour, daySchedule.start.minute, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(daySchedule.end.hour, daySchedule.end.minute, 0, 0);
    
    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + professionalSchedule.duration * 60000);
      
      // Check for lunch break
      let conflictsWithLunch = false;
      if (professionalSchedule.lunch) {
        const lunchStart = new Date(date);
        lunchStart.setHours(professionalSchedule.lunch.start.hour, professionalSchedule.lunch.start.minute, 0, 0);
        const lunchEnd = new Date(date);
        lunchEnd.setHours(professionalSchedule.lunch.end.hour, professionalSchedule.lunch.end.minute, 0, 0);
        
        if (currentTime < lunchEnd && slotEndTime > lunchStart) {
          conflictsWithLunch = true;
        }
      }
      
      if (!conflictsWithLunch && slotEndTime <= endTime) {
        slots.push({
          time: currentTime.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
          available: Math.random() > 0.3 // Simula disponibilidade
        });
      }
      
      currentTime = new Date(currentTime.getTime() + (professionalSchedule.duration + professionalSchedule.interval) * 60000);
    }
    
    return slots;
  };

  // Handle professional selection
  const handleProfessionalChange = (value: string) => {
    setSelectedProfessional(value);
    setInternalSelectedDate(null);
    setInternalSelectedTime(null);
    
    // Reset selected day to match professional's schedule
    const professional = professionals.find(p => p.id.toString() === value);
    if (professional?.atendimentos) {
      const schedule = parseAtendimentos(professional.atendimentos);
      // Find first available day
      const availableDay = Object.entries(schedule.days).find(([day, hours]) => hours !== null);
      if (availableDay) {
        setSelectedDay(availableDay[0]);
      }
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setInternalSelectedDate(date);
    
    // Update selected day based on date
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    setSelectedDay(dayNames[date.getDay()]);
    
    // Clear time selection
    setInternalSelectedTime(null);
    
    // Generate time slots for this date
    const timeSlots = generateTimeSlots(date);
    
    // If there's only one time slot, select it automatically
    if (timeSlots.length === 1 && timeSlots[0].available) {
      handleTimeSelect(timeSlots[0].time);
    }
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setInternalSelectedTime(time);
    
    if (internalSelectedDate && onDateTimeSelected) {
      onDateTimeSelected(internalSelectedDate, time);
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(day => ({
      date: day,
      isCurrentMonth: isSameMonth(day, currentDate),
      isToday: isSameDay(day, new Date()),
      isSelected: internalSelectedDate ? isSameDay(day, internalSelectedDate) : false,
      isAvailable: isDayAvailable(day) && isSameMonth(day, currentDate)
    }));
  };

  // Generate week days
  const generateWeekDays = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(weekStart, index);
      return {
        date,
        isToday: isSameDay(date, new Date()),
        isSelected: internalSelectedDate ? isSameDay(date, internalSelectedDate) : false,
        isAvailable: isDayAvailable(date)
      };
    });
  };

  // Format date for display
  const formatDateForDisplay = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Calendar days
  const calendarDays = viewMode === "month" ? generateCalendarDays() : generateWeekDays();
  
  // Time slots for selected date
  const timeSlots = internalSelectedDate ? generateTimeSlots(internalSelectedDate) : [];

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
            Agendamento de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Professional Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Selecione o Profissional</label>
              <Select value={selectedProfessional || ""} onValueChange={handleProfessionalChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map(professional => (
                    <SelectItem key={professional.id} value={professional.id.toString()}>
                      {professional.name} - {professional.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedProfessionalDetails && (
              <>
                {/* Professional Schedule Info */}
                {selectedProfessionalDetails.atendimentos && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-800 dark:text-blue-300">Horários de Atendimento</h3>
                          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 whitespace-pre-line">
                            {selectedProfessionalDetails.atendimentos}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Calendar View */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentDate(prevDate => viewMode === "month" ? subMonths(prevDate, 1) : addDays(prevDate, -7))}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {viewMode === "month" ? "Mês Anterior" : "Semana Anterior"}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        {viewMode === "month" 
                          ? format(currentDate, "MMMM yyyy", { locale: ptBR }) 
                          : `${format(startOfWeek(currentDate, { weekStartsOn: 0 }), "dd/MM")} - ${format(addDays(startOfWeek(currentDate, { weekStartsOn: 0 }), 6), "dd/MM")}`}
                      </h2>
                      
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
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentDate(prevDate => viewMode === "month" ? addMonths(prevDate, 1) : addDays(prevDate, 7))}
                    >
                      {viewMode === "month" ? "Próximo Mês" : "Próxima Semana"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                  
                  {viewMode === "month" ? (
                    <div className="grid grid-cols-7 gap-1">
                      {/* Days of Week Header */}
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="text-center p-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {day}
                        </div>
                      ))}
                      
                      {/* Calendar Days */}
                      {calendarDays.map((day, index) => (
                        <div
                          key={index}
                          className={cn(
                            "min-h-[60px] p-2 border rounded-md transition-colors",
                            day.isCurrentMonth 
                              ? day.isAvailable 
                                ? day.isSelected
                                  ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800 cursor-pointer"
                                  : "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800 cursor-pointer"
                                : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800"
                          )}
                          onClick={() => day.isCurrentMonth && day.isAvailable && handleDateSelect(day.date)}
                        >
                          <div className="text-right text-sm font-medium">
                            {format(day.date, 'd')}
                          </div>
                          
                          {day.isCurrentMonth && day.isAvailable && (
                            <div className="mt-1 text-xs">
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-300">
                                Disponível
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {/* Week View */}
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {calendarDays.map((day, index) => (
                          <div 
                            key={index}
                            className={cn(
                              "text-center p-2 rounded-md",
                              day.isSelected && "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
                              day.isAvailable 
                                ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" 
                                : "opacity-50"
                            )}
                            onClick={() => day.isAvailable && handleDateSelect(day.date)}
                          >
                            <div className="font-medium">
                              {format(day.date, 'EEE', { locale: ptBR })}
                            </div>
                            <div className="text-sm">
                              {format(day.date, 'dd/MM')}
                            </div>
                            {day.isToday && (
                              <div className="mt-1">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-300">
                                  Hoje
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Time Slots */}
                {internalSelectedDate && (
                  <div>
                    <h3 className="font-medium mb-3">
                      Horários disponíveis para {formatDateForDisplay(internalSelectedDate)}
                    </h3>
                    
                    {timeSlots.length === 0 ? (
                      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Não há horários disponíveis para esta data
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((slot, index) => (
                          <div
                            key={index}
                            className={cn(
                              "p-2 text-center border rounded-md cursor-pointer transition-colors",
                              slot.available
                                ? internalSelectedTime === slot.time
                                  ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                                  : "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                                : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed"
                            )}
                            onClick={() => slot.available && handleTimeSelect(slot.time)}
                          >
                            {slot.time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Selected Date & Time Summary */}
                {internalSelectedDate && internalSelectedTime && (
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800 dark:text-green-300">Horário Selecionado</h3>
                        <p className="text-green-700 dark:text-green-400">
                          {formatDateForDisplay(internalSelectedDate)} às {internalSelectedTime} com {selectedProfessionalDetails.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}