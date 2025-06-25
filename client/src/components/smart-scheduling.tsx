import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, LayoutList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay, parseISO, isValid, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import VerticalTimeRuler from "./vertical-time-ruler";

interface Professional {
  id: number;
  name: string;
  specialty: string;
  atendimentos?: string;
  phone?: string;
  email?: string;
}

interface Appointment {
  id: number;
  fullName: string;
  doctorId: number | null;
  preferredDate: string;
  preferredTime: string;
  status: string;
  specialty: string;
  urgency: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
  isPreferred?: boolean;
  isLunchBreak?: boolean;
}

interface DaySchedule {
  dayName: string;
  date: Date;
  slots: TimeSlot[];
  isAvailable: boolean;
}

interface ScheduleConfig {
  weekDays: {
    [key: string]: {
      isOpen: boolean;
      startTime?: string;
      endTime?: string;
      preferredTimes?: string[];
    }
  };
  consultationDuration: number;
  patientInterval: number;
  lunchBreak?: {
    startTime: string;
    endTime: string;
  };
}

export default function SmartScheduling() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{day: DaySchedule, slot: TimeSlot} | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"week" | "month">("month");
  const [monthDays, setMonthDays] = useState<{date: Date, isCurrentMonth: boolean, schedule?: DaySchedule}[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("Segunda");

  // Fetch professionals data
  const { data: professionals = [], isLoading: isLoadingProfessionals } = useQuery<Professional[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  // Fetch appointments data
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  // Parse the professional's schedule configuration from the atendimentos field
  const parseScheduleConfig = (atendimentos?: string): ScheduleConfig => {
    const defaultConfig: ScheduleConfig = {
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
      patientInterval: 5
    };

    if (!atendimentos) return defaultConfig;

    const lines = atendimentos.split('\n').map(line => line.trim());
    
    // Parse weekdays schedule
    const dayRegex = /^(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo):\s*(❌.*|(\d{1,2})h?:?(\d{2})?\s*às\s*(\d{1,2})h?:?(\d{2})?)$/i;
    
    lines.forEach(line => {
      const dayMatch = line.match(dayRegex);
      if (dayMatch) {
        const day = dayMatch[1];
        const timeInfo = dayMatch[2];
        
        if (timeInfo.includes('❌') || timeInfo.toLowerCase().includes('fechado')) {
          defaultConfig.weekDays[day] = { isOpen: false };
        } else {
          const timeRegex = /(\d{1,2})h?:?(\d{2})?\s*às\s*(\d{1,2})h?:?(\d{2})?/i;
          const timeMatch = timeInfo.match(timeRegex);
          
          if (timeMatch) {
            const startHour = parseInt(timeMatch[1]);
            const startMinute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            const endHour = parseInt(timeMatch[3]);
            const endMinute = timeMatch[4] ? parseInt(timeMatch[4]) : 0;
            
            const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
            const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
            
            defaultConfig.weekDays[day] = {
              isOpen: true,
              startTime,
              endTime,
              // Default preferred times in the morning if not specified
              preferredTimes: startHour < 12 ? [`${(startHour + 1).toString().padStart(2, '0')}:00`] : []
            };
          }
        }
      }
    });
    
    // Parse consultation duration
    const durationRegex = /Duração\s*da\s*Consulta:\s*(\d+)\s*Minutos?/i;
    const durationMatch = atendimentos.match(durationRegex);
    if (durationMatch) {
      defaultConfig.consultationDuration = parseInt(durationMatch[1]);
    }
    
    // Parse patient interval
    const intervalRegex = /Intervalo\s*entre\s*Pacientes[^:]*:\s*(\d+)\s*minutos?/i;
    const intervalMatch = atendimentos.match(intervalRegex);
    if (intervalMatch) {
      defaultConfig.patientInterval = parseInt(intervalMatch[1]);
    }
    
    // Parse lunch break
    const lunchRegex = /[Ii]ntervalo\s*(?:para\s*o)?\s*almoço:\s*(\d{1,2})(?::(\d{2}))?\s*(?:às|a|-)?\s*(\d{1,2})(?::(\d{2}))?/i;
    const lunchMatch = atendimentos.match(lunchRegex);
    if (lunchMatch) {
      const startHour = parseInt(lunchMatch[1]);
      const startMinute = lunchMatch[2] ? parseInt(lunchMatch[2]) : 0;
      const endHour = parseInt(lunchMatch[3]);
      const endMinute = lunchMatch[4] ? parseInt(lunchMatch[4]) : 0;
      
      defaultConfig.lunchBreak = {
        startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
      };
    }
    
    // Try to extract preferred times (usually highlighted in the text)
    const preferredRegex = /Horários\s+preferidos|Horários\s+preferenciais|[Pp]referência|[Pp]rioritário/i;
    let inPreferredSection = false;
    let preferredDay = "";
    
    lines.forEach(line => {
      // Check if we're entering a preferred times section
      if (preferredRegex.test(line)) {
        inPreferredSection = true;
        return;
      }
      
      // If in preferred section, look for times
      if (inPreferredSection) {
        // Check if line specifies a day
        const dayCheck = /^(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo):/i.exec(line);
        if (dayCheck) {
          preferredDay = dayCheck[1];
          return;
        }
        
        // Look for time specifications
        const timeMatches = line.match(/(\d{1,2})[:h](\d{2})/g);
        if (timeMatches && preferredDay && defaultConfig.weekDays[preferredDay]) {
          defaultConfig.weekDays[preferredDay].preferredTimes = timeMatches.map(time => {
            const [h, m] = time.replace('h', ':').split(':').map(Number);
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          });
        }
        
        // End preferred section if we hit another section marker
        if (line.includes(':') && !line.match(/\d{1,2}[:h]\d{2}/)) {
          inPreferredSection = false;
          preferredDay = "";
        }
      }
    });
    
    return defaultConfig;
  };

  // Generate time slots for a specific day based on schedule configuration
  const generateTimeSlots = (date: Date, config: ScheduleConfig, professionalId: number): TimeSlot[] => {
    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const dayName = dayNames[date.getDay()];
    const dayConfig = config.weekDays[dayName];
    
    if (!dayConfig || !dayConfig.isOpen || !dayConfig.startTime || !dayConfig.endTime) {
      return [];
    }
    
    const [startHour, startMinute] = dayConfig.startTime.split(':').map(Number);
    const [endHour, endMinute] = dayConfig.endTime.split(':').map(Number);
    
    const slots: TimeSlot[] = [];
    const totalMinutes = config.consultationDuration + config.patientInterval;
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const professionalAppointments = appointments.filter(apt => 
      apt.doctorId === professionalId && 
      apt.preferredDate === dateStr
    );
    
    // Generate slots until end time
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute <= endMinute - config.consultationDuration)
    ) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check if this time is during lunch break
      let isLunchTime = false;
      if (config.lunchBreak) {
        const [lunchStartHour, lunchStartMinute] = config.lunchBreak.startTime.split(':').map(Number);
        const [lunchEndHour, lunchEndMinute] = config.lunchBreak.endTime.split(':').map(Number);
        
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const lunchStartInMinutes = lunchStartHour * 60 + lunchStartMinute;
        const lunchEndInMinutes = lunchEndHour * 60 + lunchEndMinute;
        
        if (currentTimeInMinutes >= lunchStartInMinutes && currentTimeInMinutes < lunchEndInMinutes) {
          isLunchTime = true;
        }
      }
      
      // Check if slot is already booked
      const existingAppointment = professionalAppointments.find(apt => apt.preferredTime === timeStr);
      
      // Check if this is a preferred time
      const isPreferred = dayConfig.preferredTimes?.includes(timeStr) || false;
      
      slots.push({
        time: timeStr,
        available: !isLunchTime && !existingAppointment,
        appointment: existingAppointment,
        isPreferred,
        isLunchBreak: isLunchTime
      });
      
      // Increment time by slot duration
      currentMinute += totalMinutes;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute %= 60;
      }
    }
    
    return slots;
  };

  // Generate the week schedule
  const generateWeekSchedule = (startDate: Date, professionalId: number, scheduleConfig: ScheduleConfig): DaySchedule[] => {
    const weekSchedule: DaySchedule[] = [];
    // Reordered day names to start with Monday
    const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      // Adjust day index to match our reordered array (Monday = 0, Sunday = 6)
      const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Sunday=6
      const dayName = dayNames[dayIndex];
      const dayConfig = scheduleConfig.weekDays[dayName];
      const isAvailable = dayConfig?.isOpen || false;
      
      const slots = generateTimeSlots(date, scheduleConfig, professionalId);
      
      weekSchedule.push({
        dayName,
        date,
        slots,
        isAvailable
      });
    }
    
    return weekSchedule;
  };

  // Generate the month view
  const generateMonthView = (date: Date, professionalId: number, scheduleConfig: ScheduleConfig) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = addDays(startOfWeek(addDays(monthEnd, 1), { weekStartsOn: 1 }), 6);
    
    const daysInMonthView = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Generate day schedules for each day in the month view
    return daysInMonthView.map(day => {
      const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
      const dayName = dayNames[day.getDay()];
      const dayConfig = scheduleConfig.weekDays[dayName];
      const isAvailable = dayConfig?.isOpen || false;
      
      const slots = isAvailable ? generateTimeSlots(day, scheduleConfig, professionalId) : [];
      
      const daySchedule: DaySchedule = {
        dayName,
        date: day,
        slots,
        isAvailable
      };
      
      return {
        date: day,
        isCurrentMonth: isSameMonth(day, date),
        schedule: daySchedule
      };
    });
  };

  // Update the week schedule when the selected professional or date changes
  useEffect(() => {
    if (!selectedProfessional) return;
    
    const professionalId = parseInt(selectedProfessional);
    const professional = professionals.find(p => p.id === professionalId);
    
    if (!professional) return;
    
    const scheduleConfig = parseScheduleConfig(professional.atendimentos);
    
    // Week view
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const schedule = generateWeekSchedule(weekStart, professionalId, scheduleConfig);
    setWeekSchedule(schedule);
    
    // Month view
    const monthView = generateMonthView(currentDate, professionalId, scheduleConfig);
    setMonthDays(monthView);
    
  }, [selectedProfessional, currentDate, professionals, appointments]);

  // Navigate to previous period
  const goToPrevious = () => {
    setCurrentDate(prevDate => {
      if (viewMode === "week") {
        return addDays(prevDate, -7);
      } else {
        return subMonths(prevDate, 1);
      }
    });
  };

  // Navigate to next period
  const goToNext = () => {
    setCurrentDate(prevDate => {
      if (viewMode === "week") {
        return addDays(prevDate, 7);
      } else {
        return addMonths(prevDate, 1);
      }
    });
  };

  // Handle slot selection
  const handleSlotSelect = (day: DaySchedule, slot: TimeSlot) => {
    if (!slot.available) return;
    
    setSelectedSlot({ day, slot });
    setIsBookingDialogOpen(true);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Get day availability status for month view
  const getDayAvailabilityStatus = (day: {date: Date, isCurrentMonth: boolean, schedule?: DaySchedule}) => {
    if (!day.isCurrentMonth) return "outside-month";
    if (!day.schedule?.isAvailable) return "unavailable";
    
    const availableSlots = day.schedule.slots.filter(slot => slot.available).length;
    const bookedSlots = day.schedule.slots.filter(slot => !slot.available).length;
    
    if (availableSlots === 0 && bookedSlots > 0) return "fully-booked";
    if (bookedSlots > 0) return "partially-booked";
    if (availableSlots > 0) return "available";
    
    return "unavailable";
  };

  // Get color class based on day availability
  const getDayColorClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800";
      case "partially-booked":
        return "bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "fully-booked":
        return "bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800";
      case "unavailable":
        return "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
      case "outside-month":
        return "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800";
      default:
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date, professionalId: number) => {
    if (!professionalId) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => 
      apt.doctorId === professionalId && 
      apt.preferredDate === dateStr
    );
  };

  // Get the selected professional's atendimentos
  const getSelectedProfessionalAtendimentos = () => {
    if (!selectedProfessional) return undefined;
    
    const professionalId = parseInt(selectedProfessional);
    const professional = professionals.find(p => p.id === professionalId);
    
    return professional?.atendimentos;
  };

  // Get booked slots for the selected day
  const getBookedSlotsForSelectedDay = () => {
    if (!selectedProfessional || !weekSchedule.length) return [];
    
    const professionalId = parseInt(selectedProfessional);
    const selectedDayObj = weekSchedule.find(day => day.dayName === selectedDay);
    
    if (!selectedDayObj) return [];
    
    const dateStr = format(selectedDayObj.date, 'yyyy-MM-dd');
    const dayAppointments = appointments.filter(apt => 
      apt.doctorId === professionalId && 
      apt.preferredDate === dateStr
    );
    
    return dayAppointments.map(apt => ({
      time: apt.preferredTime,
      patientName: apt.fullName
    }));
  };

  if (isLoadingProfessionals || isLoadingAppointments) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando agenda...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Agenda Semanal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualização completa dos agendamentos da semana
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {viewMode === "week" ? "Semana Anterior" : "Mês Anterior"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
          >
            {viewMode === "week" ? "Próxima Semana" : "Próximo Mês"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Professional Selector and View Mode */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Selecione o Profissional</label>
              <Select
                value={selectedProfessional || ""}
                onValueChange={setSelectedProfessional}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id.toString()}>
                      {professional.name} - {professional.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md text-sm">
                {viewMode === "week" ? (
                  <>
                    {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "dd/MM/yyyy", { locale: ptBR })} - 
                    {format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), " dd/MM/yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(currentDate, "MMMM yyyy", { locale: ptBR })
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Visualização</label>
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
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Display */}
        <div className="lg:col-span-2">
          {!selectedProfessional ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Selecione um Profissional
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Escolha um profissional para visualizar sua agenda
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {viewMode === "week" ? "Agenda Semanal" : "Calendário Mensal"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === "week" ? (
                  // Week View
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {weekSchedule.map((day) => (
                      <div 
                        key={day.dayName} 
                        className="text-center cursor-pointer"
                        onClick={() => setSelectedDay(day.dayName)}
                      >
                        <div className={cn(
                          "font-medium mb-1 p-1 rounded",
                          selectedDay === day.dayName && "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                        )}>
                          {day.dayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(day.date, "dd/MM", { locale: ptBR })}
                        </div>
                      </div>
                    ))}
                    
                    {/* Day Columns */}
                    {weekSchedule.map((day) => (
                      <div 
                        key={`col-${day.dayName}`} 
                        className={cn(
                          "border rounded-md overflow-hidden",
                          day.isAvailable ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-900"
                        )}
                      >
                        {!day.isAvailable ? (
                          <div className="h-full flex items-center justify-center p-4 text-center">
                            <div className="text-gray-500 dark:text-gray-400">
                              <div className="text-2xl mb-2">❌</div>
                              <p className="text-sm">Não há atendimento</p>
                            </div>
                          </div>
                        ) : (
                          <div className="max-h-[500px] overflow-y-auto p-1">
                            {day.slots.map((slot, index) => (
                              <div
                                key={`${day.dayName}-${slot.time}-${index}`}
                                className={cn(
                                  "p-2 mb-1 rounded-md text-sm cursor-pointer transition-colors",
                                  slot.isLunchBreak 
                                    ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 cursor-not-allowed"
                                    : slot.available 
                                      ? slot.isPreferred
                                        ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-300" 
                                        : "bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:hover:bg-green-900/20 text-green-800 dark:text-green-300" 
                                      : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 cursor-not-allowed"
                                )}
                                onClick={() => slot.available && !slot.isLunchBreak && handleSlotSelect(day, slot)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{slot.time}</span>
                                  {slot.appointment && (
                                    <Badge className={getStatusColor(slot.appointment.status)}>
                                      {slot.appointment.status === 'pending' ? 'Pendente' :
                                      slot.appointment.status === 'confirmed' ? 'Confirmado' :
                                      slot.appointment.status === 'completed' ? 'Concluído' :
                                      slot.appointment.status === 'cancelled' ? 'Cancelado' : slot.appointment.status}
                                    </Badge>
                                  )}
                                  {slot.isPreferred && !slot.appointment && (
                                    <Badge variant="outline" className="text-xs bg-green-50 border-green-300 text-green-700">
                                      Preferencial
                                    </Badge>
                                  )}
                                  {slot.isLunchBreak && (
                                    <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300 text-yellow-700">
                                      Almoço
                                    </Badge>
                                  )}
                                </div>
                                
                                {slot.appointment && (
                                  <div className="mt-1 text-xs">
                                    <div className="font-medium truncate">{slot.appointment.fullName}</div>
                                    <div className="text-gray-500 dark:text-gray-400 truncate">{slot.appointment.specialty}</div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Month View
                  <div className="space-y-4">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(day => (
                        <div key={day} className="p-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {monthDays.map((day, index) => {
                        const status = getDayAvailabilityStatus(day);
                        const colorClass = getDayColorClass(status);
                        const isToday = isSameDay(day.date, new Date());
                        const dayAppointments = day.schedule ? 
                          day.schedule.slots.filter(slot => !slot.available && slot.appointment).length : 0;
                        const availableSlots = day.schedule ? 
                          day.schedule.slots.filter(slot => slot.available).length : 0;
                        
                        return (
                          <div
                            key={index}
                            className={cn(
                              "min-h-[100px] p-1 border rounded-md transition-colors cursor-pointer",
                              colorClass,
                              isToday && "ring-2 ring-blue-500 dark:ring-blue-400"
                            )}
                            onClick={() => {
                              if (day.schedule && day.isCurrentMonth) {
                                setCurrentDate(day.date);
                                setViewMode("week");
                                // Set selected day based on the day of week
                                const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                                setSelectedDay(dayNames[day.date.getDay()]);
                              }
                            }}
                          >
                            <div className="p-1">
                              <div className={cn(
                                "text-right text-sm font-medium",
                                !day.isCurrentMonth && "text-gray-400 dark:text-gray-600",
                                isToday && "text-blue-600 dark:text-blue-400"
                              )}>
                                {format(day.date, "d")}
                              </div>
                              
                              {day.isCurrentMonth && day.schedule?.isAvailable && (
                                <div className="mt-1 space-y-1">
                                  {dayAppointments > 0 && (
                                    <div className="text-xs p-1 rounded bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                                      {dayAppointments} agendamento{dayAppointments !== 1 ? 's' : ''}
                                    </div>
                                  )}
                                  {availableSlots > 0 && (
                                    <div className="text-xs p-1 rounded bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                                      {availableSlots} horário{availableSlots !== 1 ? 's' : ''} livre{availableSlots !== 1 ? 's' : ''}
                                    </div>
                                  )}
                                  {dayAppointments === 0 && availableSlots === 0 && (
                                    <div className="text-xs p-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                      Sem horários
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {day.isCurrentMonth && !day.schedule?.isAvailable && (
                                <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                                  <span>Fechado</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Time Ruler */}
        <div className="lg:col-span-1">
          <VerticalTimeRuler 
            atendimentos={getSelectedProfessionalAtendimentos()} 
            selectedDay={selectedDay}
            bookedSlots={getBookedSlotsForSelectedDay()}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-50 dark:bg-green-900/10 rounded-sm mr-2"></div>
          <span className="text-sm">Disponível</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-sm mr-2 border border-green-300"></div>
          <span className="text-sm">Horário Preferencial</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-50 dark:bg-red-900/20 rounded-sm mr-2"></div>
          <span className="text-sm">Ocupado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-sm mr-2"></div>
          <span className="text-sm">Intervalo/Almoço</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm mr-2"></div>
          <span className="text-sm">Indisponível/Fechado</span>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Consulta</DialogTitle>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">
                    {format(selectedSlot.day.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">{selectedSlot.slot.time}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Profissional</label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {professionals.find(p => p.id.toString() === selectedProfessional)?.name}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button>
                  Continuar Agendamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}