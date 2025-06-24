import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, Coffee, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerticalTimeRulerProps {
  atendimentos?: string;
  selectedDay?: string;
  selectedDate?: Date;
  bookedSlots?: {
    time: string;
    patientName: string;
  }[];
  className?: string;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isLunchBreak?: boolean;
  isBooked?: boolean;
  patientName?: string;
}

interface DaySchedule {
  day: string;
  isOpen: boolean;
  startTime?: string;
  endTime?: string;
  slots: TimeSlot[];
}

export default function VerticalTimeRuler({ 
  atendimentos, 
  selectedDay = "Segunda", 
  selectedDate,
  bookedSlots = [],
  className 
}: VerticalTimeRulerProps) {
  const [schedule, setSchedule] = useState<{[key: string]: DaySchedule}>({});
  const [error, setError] = useState<string | null>(null);
  const [consultationDuration, setConsultationDuration] = useState(30);

  // Parse the atendimentos field to extract schedule information
  useEffect(() => {
    if (!atendimentos) {
      setError("Não há informações de horário disponíveis");
      return;
    }

    try {
      const scheduleConfig = parseAtendimentos(atendimentos);
      
      // Mark booked slots
      if (bookedSlots.length > 0 && scheduleConfig[selectedDay]) {
        const updatedSlots = scheduleConfig[selectedDay].slots.map(slot => {
          const bookedSlot = bookedSlots.find(bs => bs.time === slot.time);
          if (bookedSlot) {
            return {
              ...slot,
              isAvailable: false,
              isBooked: true,
              patientName: bookedSlot.patientName
            };
          }
          return slot;
        });
        
        scheduleConfig[selectedDay].slots = updatedSlots;
      }
      
      setSchedule(scheduleConfig);
      setError(null);
    } catch (err) {
      setError("Erro ao processar horários de atendimento");
      console.error("Error parsing atendimentos:", err);
    }
  }, [atendimentos, selectedDay, bookedSlots]);

  // Parse the atendimentos field
  const parseAtendimentos = (text: string): {[key: string]: DaySchedule} => {
    const result: {[key: string]: DaySchedule} = {
      "Segunda": { day: "Segunda", isOpen: false, slots: [] },
      "Terça": { day: "Terça", isOpen: false, slots: [] },
      "Quarta": { day: "Quarta", isOpen: false, slots: [] },
      "Quinta": { day: "Quinta", isOpen: false, slots: [] },
      "Sexta": { day: "Sexta", isOpen: false, slots: [] },
      "Sábado": { day: "Sábado", isOpen: false, slots: [] },
      "Domingo": { day: "Domingo", isOpen: false, slots: [] }
    };
    
    // Default values
    let consultationDuration = 30; // minutes
    let patientInterval = 5; // minutes
    let lunchBreak: { start: string; end: string } | null = null;
    
    const lines = text.split('\n');
    
    // Extract consultation duration
    const durationLine = lines.find(line => 
      line.toLowerCase().includes('duração da consulta') || 
      line.toLowerCase().includes('duração de consulta')
    );
    if (durationLine) {
      const durationMatch = durationLine.match(/(\d+)\s*minutos?/i);
      if (durationMatch) {
        consultationDuration = parseInt(durationMatch[1]);
        setConsultationDuration(consultationDuration);
      }
    }
    
    // Extract patient interval
    const intervalLine = lines.find(line => 
      line.toLowerCase().includes('intervalo entre pacientes')
    );
    if (intervalLine) {
      const intervalMatch = intervalLine.match(/(\d+)\s*minutos?/i);
      if (intervalMatch) {
        patientInterval = parseInt(intervalMatch[1]);
      }
    }
    
    // Extract lunch break
    const lunchLine = lines.find(line => 
      line.toLowerCase().includes('intervalo para o almoço') || 
      line.toLowerCase().includes('intervalo almoço')
    );
    if (lunchLine) {
      const lunchMatch = lunchLine.match(/(\d{1,2})(?::(\d{2}))?\s*(?:às|a|-)\s*(\d{1,2})(?::(\d{2}))?/);
      if (lunchMatch) {
        const startHour = parseInt(lunchMatch[1]);
        const startMinute = lunchMatch[2] ? parseInt(lunchMatch[2]) : 0;
        const endHour = parseInt(lunchMatch[3]);
        const endMinute = lunchMatch[4] ? parseInt(lunchMatch[4]) : 0;
        
        lunchBreak = {
          start: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
          end: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
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
      if (!result[day]) continue;
      
      // Check if day is closed
      if (timePart.includes('❌') || 
          timePart.toLowerCase().includes('fechado') || 
          timePart.toLowerCase().includes('agenda fechada')) {
        result[day].isOpen = false;
        continue;
      }
      
      // Parse time range
      const timeMatch = timePart.match(/(\d{1,2})h?:?(\d{2})?\s*às\s*(\d{1,2})h?:?(\d{2})?/i);
      if (timeMatch) {
        const startHour = parseInt(timeMatch[1]);
        const startMinute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const endHour = parseInt(timeMatch[3]);
        const endMinute = timeMatch[4] ? parseInt(timeMatch[4]) : 0;
        
        const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        result[day].isOpen = true;
        result[day].startTime = startTime;
        result[day].endTime = endTime;
        
        // Generate time slots
        result[day].slots = generateTimeSlots(
          startHour, startMinute, 
          endHour, endMinute, 
          consultationDuration, 
          patientInterval,
          lunchBreak
        );
      }
    }
    
    return result;
  };

  // Generate time slots for a day
  const generateTimeSlots = (
    startHour: number, 
    startMinute: number, 
    endHour: number, 
    endMinute: number, 
    duration: number, 
    interval: number,
    lunchBreak: { start: string; end: string } | null
  ): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const totalSlotDuration = duration + interval;
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    // Convert lunch break times to minutes for easier comparison
    const lunchStartMinutes = lunchBreak ? 
      parseInt(lunchBreak.start.split(':')[0]) * 60 + parseInt(lunchBreak.start.split(':')[1]) : null;
    const lunchEndMinutes = lunchBreak ? 
      parseInt(lunchBreak.end.split(':')[0]) * 60 + parseInt(lunchBreak.end.split(':')[1]) : null;
    
    // Generate slots until end time
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute <= endMinute - duration)
    ) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      // Check if this time is during lunch break
      const isLunchBreak = lunchBreak && lunchStartMinutes && lunchEndMinutes ? 
        (currentTimeInMinutes >= lunchStartMinutes && currentTimeInMinutes < lunchEndMinutes) : false;
      
      slots.push({
        time: timeStr,
        isAvailable: !isLunchBreak,
        isLunchBreak
      });
      
      // Increment time by slot duration
      currentMinute += totalSlotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute %= 60;
      }
    }
    
    return slots;
  };

  // Get the selected day's schedule
  const selectedDaySchedule = schedule[selectedDay];

  // Get the earliest and latest hours for the day
  const getTimeRange = () => {
    if (!selectedDaySchedule || !selectedDaySchedule.isOpen) {
      return { startHour: 8, endHour: 18 }; // Default range
    }
    
    const startTime = selectedDaySchedule.startTime || "08:00";
    const endTime = selectedDaySchedule.endTime || "18:00";
    
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]) + 1; // Add 1 to include the end hour
    
    return { startHour, endHour };
  };

  const { startHour, endHour } = getTimeRange();
  const totalHours = endHour - startHour;
  const hourHeight = 60; // Height in pixels for each hour

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-blue-600" />
          Horários - {selectedDay}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center justify-center p-6 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : !selectedDaySchedule ? (
          <div className="flex items-center justify-center p-6 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <p>Selecione um dia da semana</p>
            </div>
          </div>
        ) : !selectedDaySchedule.isOpen ? (
          <div className="flex items-center justify-center p-6 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Não há atendimento neste dia</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {selectedDaySchedule.startTime} - {selectedDaySchedule.endTime}
                </Badge>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedDaySchedule.slots.filter(s => s.isAvailable && !s.isBooked).length} disponíveis
              </div>
            </div>
            
            {/* Vertical Time Ruler */}
            <div className="relative flex h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              {/* Left column with hours */}
              <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 relative bg-gray-50 dark:bg-gray-800">
                {/* Hour markers */}
                {Array.from({ length: totalHours + 1 }).map((_, i) => {
                  const hour = startHour + i;
                  return (
                    <div 
                      key={`hour-${hour}`} 
                      className="absolute left-0 right-0 flex items-center justify-end pr-2"
                      style={{ top: `${i * hourHeight}px` }}
                    >
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      <div className="absolute right-0 w-2 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                  );
                })}
                
                {/* Half-hour markers */}
                {Array.from({ length: totalHours }).map((_, i) => {
                  const hour = startHour + i;
                  return (
                    <div 
                      key={`half-hour-${hour}`} 
                      className="absolute left-0 right-0 flex items-center justify-end pr-2"
                      style={{ top: `${i * hourHeight + hourHeight/2}px` }}
                    >
                      <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
                        {hour.toString().padStart(2, '0')}:30
                      </div>
                      <div className="absolute right-0 w-1 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  );
                })}
              </div>
              
              {/* Right column with slots */}
              <div className="flex-grow relative">
                {/* Background grid lines */}
                {Array.from({ length: totalHours + 1 }).map((_, i) => (
                  <div 
                    key={`grid-${i}`} 
                    className="absolute left-0 right-0 border-t border-gray-100 dark:border-gray-800"
                    style={{ top: `${i * hourHeight}px` }}
                  ></div>
                ))}
                
                {/* Half-hour grid lines */}
                {Array.from({ length: totalHours }).map((_, i) => (
                  <div 
                    key={`grid-half-${i}`} 
                    className="absolute left-0 right-0 border-t border-dashed border-gray-100 dark:border-gray-800"
                    style={{ top: `${i * hourHeight + hourHeight/2}px` }}
                  ></div>
                ))}
                
                {/* Time slots */}
                {selectedDaySchedule.slots.map((slot, index) => {
                  // Convert time to position
                  const [hours, minutes] = slot.time.split(':').map(Number);
                  const relativeHour = hours - startHour;
                  const topPosition = relativeHour * hourHeight + (minutes / 60) * hourHeight;
                  
                  return (
                    <div 
                      key={`slot-${index}`}
                      className={cn(
                        "absolute left-2 right-2 rounded-md border px-3 py-2",
                        slot.isLunchBreak 
                          ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800" 
                          : slot.isBooked
                            ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                            : "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                      )}
                      style={{ 
                        top: `${topPosition}px`,
                        height: `${(consultationDuration / 60) * hourHeight}px`
                      }}
                    >
                      <div className="flex items-center h-full">
                        <div className="mr-2 font-medium text-xs">
                          {slot.time}
                        </div>
                        
                        {slot.isLunchBreak ? (
                          <div className="flex items-center gap-1 text-yellow-800 dark:text-yellow-300">
                            <Coffee className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs font-medium truncate">Almoço</span>
                          </div>
                        ) : slot.isBooked ? (
                          <div className="flex items-center gap-1 text-blue-800 dark:text-blue-300">
                            <User className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs font-medium truncate">{slot.patientName}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-800 dark:text-green-300">
                            <CheckCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs font-medium truncate">Disponível</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}