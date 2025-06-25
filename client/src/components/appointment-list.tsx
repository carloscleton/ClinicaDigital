import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Clock, User, DollarSign, Trash2, Edit, CheckCircle, XCircle, Filter, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Appointment {
  id: number;
  professionalId: number;
  professionalName: string;
  specialty: string;
  serviceId: number;
  serviceName: string;
  serviceValue: number;
  appointmentDate: string;
  description: string;
  paymentStatus: boolean;
  companyId: number;
}

export default function AppointmentList() {
  const [filterProfessional, setFilterProfessional] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('CAD_Agenda')
        .select(`
          *,
          CAD_Profissional(id, Profissional, Profissão),
          CAD_Servicos(id, servicos, valorServicos)
        `)
        .order('dt_Agendamento', { ascending: false });

      if (error) throw error;

      // Transform data to match frontend expectations
      return (data || []).map(appointment => ({
        id: appointment.id,
        professionalId: appointment.idProfissional,
        professionalName: appointment.CAD_Profissional?.Profissional || "Não especificado",
        specialty: appointment.CAD_Profissional?.Profissão || "Não especificada",
        serviceId: appointment.idServico,
        serviceName: appointment.CAD_Servicos?.servicos || "Não especificado",
        serviceValue: appointment.CAD_Servicos?.valorServicos || 0,
        appointmentDate: appointment.dt_Agendamento,
        description: appointment.descricao || "",
        paymentStatus: appointment.statusPagamento,
        companyId: appointment.id_Empresa
      }));
    }
  });

  // Fetch professionals for filter
  const { data: professionals = [] } = useQuery({
    queryKey: ["/api/supabase/professionals"],
  });

  // Delete appointment mutation
  const deleteAppointment = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('CAD_Agenda')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi removido com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Ocorreu um erro ao excluir o agendamento.",
        variant: "destructive",
      });
    }
  });

  // Update payment status mutation
  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: boolean }) => {
      const { error } = await supabase
        .from('CAD_Agenda')
        .update({ statusPagamento: status })
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Status atualizado",
        description: "O status de pagamento foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Ocorreu um erro ao atualizar o status.",
        variant: "destructive",
      });
    }
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "HH:mm", { locale: ptBR });
    } catch (e) {
      return "";
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesProfessional = filterProfessional === "all" || 
      appointment.professionalId.toString() === filterProfessional;
    
    const matchesSearch = 
      appointment.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesProfessional && matchesSearch;
  });

  // Handle delete
  const handleDelete = (id: number) => {
    deleteAppointment.mutate(id);
  };

  // Handle payment status update
  const handlePaymentStatusUpdate = (id: number, status: boolean) => {
    updatePaymentStatus.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando agendamentos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Agendamentos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerenciamento de consultas e procedimentos agendados
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por profissional, serviço ou descrição..."
                className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                value={filterProfessional}
                onChange={(e) => setFilterProfessional(e.target.value)}
              >
                <option value="all">Todos os profissionais</option>
                {professionals.map((prof) => (
                  <option key={prof.id} value={prof.id.toString()}>
                    {prof.name} - {prof.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendamentos ({filteredAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Não há agendamentos que correspondam aos filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">{formatDate(appointment.appointmentDate)}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(appointment.appointmentDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{appointment.professionalName}</div>
                        <div className="text-xs text-gray-500">{appointment.specialty}</div>
                      </TableCell>
                      <TableCell>
                        <div>{appointment.serviceName}</div>
                        {appointment.description && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            {appointment.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-300">
                          R$ {appointment.serviceValue.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {appointment.paymentStatus ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Pago
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-300 flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Pendente
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePaymentStatusUpdate(appointment.id, !appointment.paymentStatus)}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDelete(appointment.id)}
                                >
                                  Excluir
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
        </CardContent>
      </Card>
    </div>
  );
}