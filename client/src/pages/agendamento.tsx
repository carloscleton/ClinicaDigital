import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, CheckCircle } from "lucide-react";
import AppointmentScheduler from "@/components/appointment-scheduler";

export default function Agendamento() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [appointmentCreated, setAppointmentCreated] = useState(false);
  
  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
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
    setName("");
    setEmail("");
    setPhone("");
    setStep(1);
    setAppointmentCreated(false);
  };

  const isNextButtonDisabled = () => {
    if (step === 1) return !appointmentCreated;
    if (step === 3) return !name || !email || !phone;
    return false;
  };

  const getButtonText = () => {
    if (step === 1) return "Próximo: Informações Pessoais";
    if (step === 2) return "Revisar Agendamento";
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
                  Agendamento
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
                  Dados Pessoais
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
              <h2 className="text-xl font-semibold mb-4">Selecione o Horário</h2>
              
              <AppointmentScheduler 
                onAppointmentCreated={() => setAppointmentCreated(true)} 
              />
              
              {appointmentCreated && (
                <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-medium text-green-800 dark:text-green-300">
                      Horário agendado com sucesso!
                    </h3>
                  </div>
                  <p className="mt-2 text-green-700 dark:text-green-400 text-sm">
                    Agora, vamos completar seu cadastro para confirmar o agendamento.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Complete seus Dados</h2>
              
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
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Confirme seu Agendamento</h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300">Dados Pessoais</p>
                      <p className="text-blue-700 dark:text-blue-400 text-sm">{name}</p>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-blue-600 dark:text-blue-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300">Detalhes do Agendamento</p>
                      <p className="text-blue-700 dark:text-blue-400 text-sm">
                        Consulta agendada com sucesso! Você receberá uma confirmação por e-mail.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Ao confirmar, você concorda com nossos termos de serviço e política de privacidade.
                </p>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={handlePreviousStep}>
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

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}