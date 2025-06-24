import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, LayoutList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay, parseISO, isValid, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import VerticalTimeRuler from "./vertical-time-ruler";

interface SmartSchedulingProps {
  professionalId: number;
  onDateTimeSelected?: (date: Date, time: string) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

export default function SmartSchedulingV2({ 
  professionalId,
  onDateTimeSelected,
  selectedDate = null,
  selectedTime = null
}: SmartSchedulingProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekSchedule, setWeekSchedule] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"week" | "month">("month");
  const [monthDays, setMonthDays] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("Segunda");
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate);
  const [internalSelectedTime, setInternalSelectedTime] = useState<string | null>(selectedTime);

  // Fetch professional data
  const { data: professionals = [], isLoading: isLoadingProfessionals } = useQuery<any[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  // Fetch appointments data
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery<any[]>({
    queryKey: ["/api/appointments"],
  });

  // Get the professional's data
  const professional = professionals.find(p => p.id === professionalId);

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
  }, [selectedDate, selectedTime]);

  // Parse the professional's schedule configuration from the atendimentos field
  const parseScheduleConfig = (atendimentos?: string) => {
    // This function would parse the atendimentos text to extract
    // scheduling information, similar to your existing implementation
    
    // Return a schedule config object
    return {
      weekDays: {
        "Segunda": { isOpen: true, startTime: "08:00", endTime: "13:00" },
        "Terça": { isOpen: true, startTime: "14:00", endTime: "18:00" },
        "Quarta": { isOpen: false },
        "Quinta": { isOpen: false },
        "Sexta": { isOpen: false },
        "Sábado": { isOpen: true, startTime: "09:00", endTime: "13:00" },
        "Domingo": { isOpen: false }
      },
      consultationDuration: 60,
      patientInterval: 5,
      lunchBreak: {
        startTime: "12:00",
        endTime: "13:00"
      }
    };
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

  if (isLoadingProfessionals || isLoadingAppointments || !professional) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando horários disponíveis...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Schedule Display */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Horários Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {/* Calendar View */}
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
              
              {/* Calendar Grid */}
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
                    
                    {/* Placeholder for Calendar Days - in a real implementation, this would show actual days */}
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(35)].map((_, index) => {
                        // This is simplified - in a real implementation you would calculate actual dates
                        const isCurrentMonth = index >= 3 && index < 31;
                        const isAvailable = isCurrentMonth && [0, 7, 14, 21, 28, 5, 12, 19, 26].includes(index);
                        const isSelected = internalSelectedDate ? index === 15 : false;
                        
                        return (
                          <div
                            key={index}
                            className={cn(
                              "min-h-[60px] p-2 border rounded-md transition-colors cursor-pointer",
                              isCurrentMonth 
                                ? isAvailable 
                                  ? isSelected
                                    ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800"
                                    : "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                                  : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800"
                            )}
                            onClick={() => {
                              if (isCurrentMonth && isAvailable) {
                                // In a real implementation, you would create a real date here
                                const mockDate = new Date();
                                mockDate.setDate(index);
                                setInternalSelectedDate(mockDate);
                                setViewMode("week");
                              }
                            }}
                          >
                            <div className="text-right text-sm font-medium">
                              {index - 2}
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
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Week View - Days Header */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day, index) => {
                        const isAvailable = ["Segunda", "Terça", "Sábado"].includes(day);
                        return (
                          <div 
                            key={day}
                            className={cn(
                              "text-center p-2 rounded-md cursor-pointer",
                              selectedDay === day && "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
                              !isAvailable && "opacity-50"
                            )}
                            onClick={() => isAvailable && setSelectedDay(day)}
                          >
                            <div className="font-medium">{day.substring(0, 3)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), index), "dd/MM")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Time Slots */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4 max-h-[300px] overflow-y-auto p-2">
                      {["08:00", "09:05", "10:10", "11:15", "14:00", "15:05", "16:10", "17:15"].map((time, index) => {
                        // In a real implementation, you would filter based on selected day
                        const isAvailable = (
                          (selectedDay === "Segunda" && index < 4) || 
                          (selectedDay === "Terça" && index >= 4) || 
                          (selectedDay === "Sábado" && index < 4)
                        );
                        const isLunchBreak = time === "12:00";
                        const isSelected = internalSelectedTime === time;
                        
                        return (
                          <div
                            key={time}
                            className={cn(
                              "p-3 rounded-md cursor-pointer text-center border",
                              isLunchBreak
                                ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800 cursor-not-allowed"
                                : isAvailable
                                  ? isSelected
                                    ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                                    : "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed"
                            )}
                            onClick={() => {
                              if (isAvailable && !isLunchBreak) {
                                setInternalSelectedTime(time);
                                
                                // Create a proper date object based on selected day
                                const dayIndex = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
                                  .indexOf(selectedDay);
                                const dateToUse = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), dayIndex);
                                
                                if (onDateTimeSelected) {
                                  onDateTimeSelected(dateToUse, time);
                                }
                              }
                            }}
                          >
                            <div className="font-medium">
                              {time}
                            </div>
                            
                            {isLunchBreak && (
                              <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                Intervalo de Almoço
                              </div>
                            )}
                            
                            {!isAvailable && !isLunchBreak && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Indisponível
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Time Ruler */}
              <VerticalTimeRuler 
                atendimentos={professional.atendimentos} 
                selectedDay={selectedDay}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Date & Time Display */}
      {internalSelectedDate && internalSelectedTime && (
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">Horário Selecionado</h3>
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    {formatDateForDisplay(internalSelectedDate)} às {internalSelectedTime}
                  </p>
                </div>
              </div>
              
              <div>
                <Badge className="bg-green-600 hover:bg-green-700">
                  Horário Confirmado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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