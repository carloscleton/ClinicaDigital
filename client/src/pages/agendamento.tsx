import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, addDays, startOfWeek, isSameDay, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Phone, Mail, CalendarDays, CheckCircle, XCircle } from "lucide-react";
import SmartScheduling from "@/components/smart-scheduling";
import { cn } from "@/lib/utils";

export default function Agendamento() {
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  // Fetch professionals data
  const { data: professionals = [], isLoading: isLoadingProfessionals } = useQuery<any[]>({
    queryKey: ["/api/supabase/professionals"],
  });
  
  // Get the selected professional's details
  const selectedProfessionalDetails = selectedProfessional 
    ? professionals.find(p => p.id.toString() === selectedProfessional) 
    : null;

  const handleNextStep = () => {
    if (step === 1 && selectedProfessional) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedTime) {
      setStep(3);
    } else if (step === 3) {
      // Submit form logic would go here
      alert("Agendamento confirmado! (Implementação simulada)");
      resetForm();
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(prev => (prev - 1) as 1 | 2 | 3);
    }
  };
  
  const resetForm = () => {
    setSelectedProfessional(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setStep(1);
  };

  const isNextButtonDisabled = () => {
    if (step === 1) return !selectedProfessional;
    if (step === 2) return !selectedDate || !selectedTime;
    if (step === 3) return !name || !email || !phone;
    return true;
  };

  const getButtonText = () => {
    if (step === 1) return "Selecionar Horário";
    if (step === 2) return "Inserir Informações";
    return "Confirmar Agendamento";
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Agendamento Online</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Agende sua consulta de forma rápida e segura, escolhendo o profissional e horário de sua preferência.
        </p>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                step >= 1 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              )}>
                1
              </div>
              <div className="ml-3">
                <p className={cn(
                  "font-medium",
                  step >= 1 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                )}>
                  Profissional
                </p>
              </div>
            </div>
            
            <div className={cn(
              "flex-1 h-1 mx-4", 
              step >= 2 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
            )}></div>
            
            <div className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                step >= 2 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              )}>
                2
              </div>
              <div className="ml-3">
                <p className={cn(
                  "font-medium",
                  step >= 2 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                )}>
                  Horário
                </p>
              </div>
            </div>
            
            <div className={cn(
              "flex-1 h-1 mx-4", 
              step >= 3 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
            )}></div>
            
            <div className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                step >= 3 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              )}>
                3
              </div>
              <div className="ml-3">
                <p className={cn(
                  "font-medium",
                  step >= 3 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                )}>
                  Confirmação
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Selecione o Profissional</h2>
              
              <div className="mb-6">
                <Label className="mb-2 block">Profissional</Label>
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
              
              {selectedProfessionalDetails && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300">{selectedProfessionalDetails.name}</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">{selectedProfessionalDetails.specialty}</p>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          {selectedProfessionalDetails.crm && <p>CRM: {selectedProfessionalDetails.crm}</p>}
                          {selectedProfessionalDetails.phone && (
                            <p className="flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" />
                              {selectedProfessionalDetails.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Selecione o Horário</h2>
              
              {selectedProfessionalDetails && (
                <SmartScheduling 
                  professionalId={parseInt(selectedProfessional!)}
                  onDateTimeSelected={(date, time) => {
                    setSelectedDate(date);
                    setSelectedTime(time);
                  }}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                />
              )}
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Complete seu Agendamento</h2>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">{selectedProfessionalDetails?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">
                    {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTime}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Observações (opcional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Informe sintomas, dúvidas ou observações relevantes para o profissional"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            ) : (
              <div></div>
            )}
            <Button 
              onClick={handleNextStep} 
              disabled={isNextButtonDisabled()}
            >
              {getButtonText()}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Precisa de ajuda? Entre em contato pelo telefone (85) 99408-6263</p>
        </div>
      </div>
    </div>
  );
}