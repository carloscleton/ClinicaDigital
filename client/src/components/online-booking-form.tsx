import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertAppointmentSchema, type InsertAppointment, type Doctor } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, FileText, AlertCircle, Stethoscope } from "lucide-react";

const appointmentTypes = [
  { value: "consultation", label: "Consulta", icon: Stethoscope },
  { value: "exam", label: "Exame", icon: FileText },
  { value: "followup", label: "Retorno", icon: User },
  { value: "urgent", label: "Urgente", icon: AlertCircle },
];

const urgencyLevels = [
  { value: "normal", label: "Normal", color: "bg-green-100 text-green-800" },
  { value: "high", label: "Alta", color: "bg-yellow-100 text-yellow-800" },
  { value: "emergency", label: "Emergência", color: "bg-red-100 text-red-800" },
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export default function OnlineBookingForm() {
  const [selectedType, setSelectedType] = useState<string>("consultation");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available doctors
  const { data: doctors = [] } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const form = useForm<InsertAppointment>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      cpf: "",
      dateOfBirth: "",
      specialty: "",
      doctorId: undefined,
      preferredDate: "",
      preferredTime: "",
      appointmentType: "consultation",
      message: "",
      urgency: "normal",
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Agendamento realizado com sucesso!",
        description: "Entraremos em contato em breve para confirmar seu horário.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro no agendamento",
        description: error.message || "Tente novamente mais tarde.",
      });
    },
  });

  const onSubmit = (data: InsertAppointment) => {
    createAppointmentMutation.mutate(data);
  };

  const selectedDoctor = doctors.find(doctor => doctor.id === form.watch("doctorId"));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Agendamento Online
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Agende sua consulta ou exame de forma rápida e segura
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Type Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Tipo de Atendimento
            </CardTitle>
            <CardDescription>
              Selecione o tipo de agendamento desejado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointmentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.value);
                    form.setValue("appointmentType", type.value as any);
                  }}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    selectedType === type.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">{type.label}</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Dados do Paciente
            </CardTitle>
            <CardDescription>
              Preencha suas informações para o agendamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Telefone *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="(85) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Appointment Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Detalhes do Agendamento</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidade *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a especialidade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Ultrassonografia">Ultrassonografia</SelectItem>
                              <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                              <SelectItem value="Clínica Geral">Clínica Geral</SelectItem>
                              <SelectItem value="Ginecologia">Ginecologia</SelectItem>
                              <SelectItem value="Pediatria">Pediatria</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doctorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Médico (Opcional)</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um médico" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                  {doctor.name} - {doctor.specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Data Preferencial *
                          </FormLabel>
                          <FormControl>
                            <Input type="date" min={new Date().toISOString().split('T')[0]} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Horário Preferencial *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o horário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Urgência</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Nível de urgência" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {urgencyLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center gap-2">
                                  <Badge className={level.color}>{level.label}</Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva seus sintomas ou motivo da consulta..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Selected Doctor Info */}
                {selectedDoctor && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Médico Selecionado
                    </h4>
                    <div className="text-sm">
                      <p className="font-medium">{selectedDoctor.name}</p>
                      <p className="text-gray-600 dark:text-gray-300">{selectedDoctor.specialty}</p>
                      <p className="text-gray-600 dark:text-gray-300">CRM: {selectedDoctor.crm}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={createAppointmentMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {createAppointmentMutation.isPending
                    ? "Agendando..."
                    : "Confirmar Agendamento"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Horário de Funcionamento</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Segunda a Sexta: 8h às 18h<br />
              Sábado: 8h às 12h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Phone className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Contato Direto</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              (85) 99408-6263<br />
              georgelucasamaro@hotmail.com
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Emergências</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Para emergências, ligue<br />
              diretamente para a clínica
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}