import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleTimeRulerProps {
  atendimentos?: string;
  selectedDay?: string;
  className?: string;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isLunchBreak?: boolean;
}

interface DaySchedule {
  day: string;
  isOpen: boolean;
  startTime?: string;
  endTime?: string;
  slots: TimeSlot[];
}

export default function ScheduleTimeRuler({ 
  atendimentos, 
  selectedDay = "Segunda", 
  className 
}: ScheduleTimeRulerProps) {
  const [schedule, setSchedule] = useState<{[key: string]: DaySchedule}>({});
  const [error, setError] = useState<string | null>(null);

  // Parse the atendimentos field to extract schedule information
  useEffect(() => {
    if (!atendimentos) {
      setError("Não há informações de horário disponíveis");
      return;
    }

    try {
      const scheduleConfig = parseAtendimentos(atendimentos);
      setSchedule(scheduleConfig);
      setError(null);
    } catch (err) {
      setError("Erro ao processar horários de atendimento");
      console.error("Error parsing atendimentos:", err);
    }
  }, [atendimentos]);

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

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-blue-600" />
          Régua de Horários - {selectedDay}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center justify-center p-6 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
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
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
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
                {selectedDaySchedule.slots.length} horários
              </div>
            </div>
            
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-4 ml-2">
              {selectedDaySchedule.slots.map((slot, index) => (
                <div 
                  key={index}
                  className={cn(
                    "relative mb-3 last:mb-0",
                    slot.isLunchBreak && "opacity-50"
                  )}
                >
                  {/* Time marker */}
                  <div 
                    className={cn(
                      "absolute -left-[22px] w-4 h-4 rounded-full border-2",
                      slot.isLunchBreak 
                        ? "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700" 
                        : "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
                    )}
                  ></div>
                  
                  {/* Time slot */}
                  <div 
                    className={cn(
                      "p-2 rounded-md",
                      slot.isLunchBreak 
                        ? "bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800" 
                        : "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{slot.time}</div>
                      {slot.isLunchBreak && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                          Almoço
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}