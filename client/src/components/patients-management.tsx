import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Plus, Edit, Trash2, Phone, Mail, Calendar, CreditCard, RefreshCw, Loader2, CheckCircle, XCircle, AlertCircle, DollarSign, Clock, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Patient interface for Supabase CAD_Clientes data
interface SupabasePatient {
  id: number;
  nomeCliente: string | null;
  telefoneCliente: string | null;
  emailCliente: string | null;
  nascimentoCliente: string | null;
  CPF: string | null;
  statusAgendamento: boolean | null;
  statusPagamento: boolean | null;
  valor: number | null;
  ultimo_pagamento: string | null;
  cancelado: boolean | null;
  ultimaMensagem: string | null;
  etapa: number | null;
  desejo: string | null;
  created_at: string;
  id_Empresa: number | null;
}

// Form validation schema for patients
const patientSchema = z.object({
  nomeCliente: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefoneCliente: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").optional(),
  emailCliente: z.string().email("Email inválido").optional().or(z.literal("")),
  nascimentoCliente: z.string().optional(),
  CPF: z.string().min(11, "CPF deve ter 11 dígitos").optional(),
  statusAgendamento: z.boolean().optional(),
  statusPagamento: z.boolean().optional(),
  valor: z.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
  desejo: z.string().optional(),
  id_Empresa: z.number().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientsManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<SupabasePatient | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch patients from CAD_Clientes table
  const { data: patients = [], isLoading, error, refetch } = useQuery<SupabasePatient[]>({
    queryKey: ["/api/supabase/patients"],
  });

  // Test connection mutation
  const testConnection = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/supabase/test');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.connected) {
        toast({
          title: "Conexão bem-sucedida",
          description: "Sistema conectado ao cadastro de pacientes",
        });
        refetch();
      }
    },
  });

  // Create patient mutation
  const createPatient = useMutation({
    mutationFn: async (data: PatientFormData) => {
      const response = await fetch("/api/supabase/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar paciente");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/patients"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Paciente cadastrado",
        description: "Novo paciente adicionado ao sistema",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cadastrar paciente",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Update patient mutation
  const updatePatient = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PatientFormData }) => {
      const response = await fetch(`/api/supabase/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar paciente");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/patients"] });
      setEditingPatient(null);
      setIsAddDialogOpen(false);
      toast({
        title: "Paciente atualizado",
        description: "Dados do paciente atualizados com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar paciente",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Delete patient mutation
  const deletePatient = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/supabase/patients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar paciente");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/patients"] });
      toast({
        title: "Paciente removido",
        description: "Paciente removido do sistema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover paciente",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Form setup
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      nomeCliente: "",
      telefoneCliente: "",
      emailCliente: "",
      nascimentoCliente: "",
      CPF: "",
      statusAgendamento: false,
      statusPagamento: false,
      valor: 0,
      desejo: "",
      id_Empresa: 1,
    },
  });

  // Calculate statistics
  const stats = {
    totalPatients: patients.length,
    withAppointments: patients.filter(p => p.statusAgendamento).length,
    withPayments: patients.filter(p => p.statusPagamento).length,
    totalRevenue: patients.reduce((sum, patient) => sum + (patient.valor || 0), 0),
    recentPatients: patients.filter(p => {
      const createdDate = new Date(p.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length,
  };

  // Filter patients based on selected criteria
  const getFilteredPatients = () => {
    let filtered = patients;

    if (selectedTab === "appointments") {
      filtered = filtered.filter(p => p.statusAgendamento);
    } else if (selectedTab === "payments") {
      filtered = filtered.filter(p => p.statusPagamento);
    } else if (selectedTab === "recent") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(p => new Date(p.created_at) >= weekAgo);
    }

    return filtered;
  };

  const filteredPatients = getFilteredPatients();

  const onSubmit = (data: PatientFormData) => {
    if (editingPatient) {
      updatePatient.mutate({ id: editingPatient.id, data });
    } else {
      createPatient.mutate(data);
    }
  };

  const handleEdit = (patient: SupabasePatient) => {
    setEditingPatient(patient);
    form.reset({
      nomeCliente: patient.nomeCliente || "",
      telefoneCliente: patient.telefoneCliente || "",
      emailCliente: patient.emailCliente || "",
      nascimentoCliente: patient.nascimentoCliente ? patient.nascimentoCliente.split('T')[0] : "",
      CPF: patient.CPF || "",
      statusAgendamento: patient.statusAgendamento || false,
      statusPagamento: patient.statusPagamento || false,
      valor: patient.valor || 0,
      desejo: patient.desejo || "",
      id_Empresa: patient.id_Empresa || 1,
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingPatient(null);
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Carregando pacientes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao conectar com o sistema de pacientes. Tente novamente.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Pacientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administração do cadastro de pacientes e clientes da clínica
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => testConnection.mutate()} 
            variant="outline"
            disabled={testConnection.isPending}
          >
            {testConnection.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sincronizar
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPatient ? "Editar Paciente" : "Novo Paciente"}
                </DialogTitle>
                <DialogDescription>
                  {editingPatient ? "Atualize as informações do paciente" : "Cadastre um novo paciente no sistema"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="nomeCliente">Nome Completo *</Label>
                    <Input
                      id="nomeCliente"
                      {...form.register("nomeCliente")}
                      placeholder="Nome completo do paciente"
                    />
                    {form.formState.errors.nomeCliente && (
                      <p className="text-sm text-red-600">{form.formState.errors.nomeCliente.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="telefoneCliente">Telefone</Label>
                    <Input
                      id="telefoneCliente"
                      {...form.register("telefoneCliente")}
                      placeholder="(85) 99999-9999"
                    />
                    {form.formState.errors.telefoneCliente && (
                      <p className="text-sm text-red-600">{form.formState.errors.telefoneCliente.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="emailCliente">Email</Label>
                    <Input
                      id="emailCliente"
                      type="email"
                      {...form.register("emailCliente")}
                      placeholder="paciente@exemplo.com"
                    />
                    {form.formState.errors.emailCliente && (
                      <p className="text-sm text-red-600">{form.formState.errors.emailCliente.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nascimentoCliente">Data de Nascimento</Label>
                    <Input
                      id="nascimentoCliente"
                      type="date"
                      {...form.register("nascimentoCliente")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="CPF">CPF</Label>
                    <Input
                      id="CPF"
                      {...form.register("CPF")}
                      placeholder="123.456.789-00"
                    />
                    {form.formState.errors.CPF && (
                      <p className="text-sm text-red-600">{form.formState.errors.CPF.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      {...form.register("valor", { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="desejo">Observações</Label>
                    <Textarea
                      id="desejo"
                      {...form.register("desejo")}
                      placeholder="Observações ou desejos específicos do paciente"
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="statusAgendamento"
                      {...form.register("statusAgendamento")}
                      className="rounded"
                    />
                    <Label htmlFor="statusAgendamento">Tem agendamento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="statusPagamento"
                      {...form.register("statusPagamento")}
                      className="rounded"
                    />
                    <Label htmlFor="statusPagamento">Pagamento realizado</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createPatient.isPending || updatePatient.isPending}
                  >
                    {(createPatient.isPending || updatePatient.isPending) ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {editingPatient ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-800 dark:text-green-200">
              Sistema conectado ao cadastro de pacientes
            </span>
            <Badge variant="secondary" className="ml-auto">
              {patients.length} pacientes
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Pacientes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Com Agendamento</p>
                <p className="text-2xl font-bold text-green-600">{stats.withAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pagamentos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.withPayments}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Novos (7 dias)</p>
                <p className="text-2xl font-bold text-red-600">{stats.recentPatients}</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pacientes Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos ({patients.length})</TabsTrigger>
              <TabsTrigger value="appointments">Com Agendamento ({stats.withAppointments})</TabsTrigger>
              <TabsTrigger value="payments">Com Pagamento ({stats.withPayments})</TabsTrigger>
              <TabsTrigger value="recent">Recentes ({stats.recentPatients})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum paciente encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium">{patient.nomeCliente || "Nome não informado"}</div>
                              {patient.nascimentoCliente && (
                                <div className="text-sm text-gray-500">
                                  Nascimento: {new Date(patient.nascimentoCliente).toLocaleDateString('pt-BR')}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {patient.telefoneCliente && (
                                <div className="flex items-center text-sm">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {patient.telefoneCliente}
                                </div>
                              )}
                              {patient.emailCliente && (
                                <div className="flex items-center text-sm">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {patient.emailCliente}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {patient.CPF ? (
                              <Badge variant="outline">{patient.CPF}</Badge>
                            ) : (
                              <span className="text-gray-500">Não informado</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {patient.statusAgendamento && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Agendado
                                </Badge>
                              )}
                              {patient.statusPagamento && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Pago
                                </Badge>
                              )}
                              {patient.cancelado && (
                                <Badge variant="destructive">Cancelado</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(patient)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja remover <strong>{patient.nomeCliente}</strong> 
                                      do sistema? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deletePatient.mutate(patient.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Confirmar Exclusão
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}