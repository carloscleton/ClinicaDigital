import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarAppointment {
  id: number;
  fullName: string;
  doctorId: number | null;
  preferredDate: string;
  preferredTime: string;
  status: string;
  specialty: string;
  urgency: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

export default function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  const { data: appointments = [] } = useQuery<CalendarAppointment[]>({
    queryKey: ["/api/appointments"]
  });

  const { data: doctors = [] } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"]
  });

  const getDoctorName = (doctorId: number | null) => {
    if (!doctorId) return "Não atribuído";
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : "Médico não encontrado";
  };

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "border-l-4 border-red-500";
      case "urgent":
        return "border-l-4 border-orange-500";
      case "normal":
        return "border-l-4 border-blue-500";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Completar com dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.preferredDate === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const today = new Date();
  const monthDays = getMonthDays();

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendário de Agendamentos
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                <Button
                  variant={viewMode === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className="rounded-r-none"
                >
                  Mês
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className="rounded-none"
                >
                  Semana
                </Button>
                <Button
                  variant={viewMode === "day" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("day")}
                  className="rounded-l-none"
                >
                  Dia
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleDateString('pt-BR', { 
                  month: 'long', 
                  year: 'numeric' 
                }).replace(/^\w/, c => c.toUpperCase())}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoje
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === "month" && (
            <div className="space-y-4">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map(({ date, isCurrentMonth }, index) => {
                  const dayAppointments = getAppointmentsForDate(date);
                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[100px] p-1 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                        !isCurrentMonth && "text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900",
                        isSelected && "ring-2 ring-blue-500",
                        isToday && "bg-blue-50 dark:bg-blue-900/20"
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1",
                        isToday && "text-blue-600 dark:text-blue-400"
                      )}>
                        {date.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map(apt => (
                          <div
                            key={apt.id}
                            className={cn(
                              "text-xs p-1 rounded truncate",
                              getStatusColor(apt.status),
                              getUrgencyColor(apt.urgency)
                            )}
                            title={`${apt.fullName} - ${formatTime(apt.preferredTime)} - ${getDoctorName(apt.doctorId)}`}
                          >
                            {formatTime(apt.preferredTime)} {apt.fullName}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            +{dayAppointments.length - 2} mais
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

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Agendamentos para {selectedDate.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum agendamento para este dia</p>
                </div>
              ) : (
                getAppointmentsForDate(selectedDate)
                  .sort((a, b) => a.preferredTime.localeCompare(b.preferredTime))
                  .map(apt => (
                    <div
                      key={apt.id}
                      className={cn(
                        "p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2",
                        getUrgencyColor(apt.urgency)
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{formatTime(apt.preferredTime)}</span>
                          </div>
                          <Badge className={getStatusColor(apt.status)}>
                            {apt.status === 'pending' ? 'Pendente' :
                             apt.status === 'confirmed' ? 'Confirmado' :
                             apt.status === 'completed' ? 'Concluído' :
                             apt.status === 'cancelled' ? 'Cancelado' : apt.status}
                          </Badge>
                          {apt.urgency === 'emergency' && (
                            <Badge variant="destructive">Emergência</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{apt.fullName}</span>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Especialidade:</strong> {apt.specialty}</p>
                        <p><strong>Médico:</strong> {getDoctorName(apt.doctorId)}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}