import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Appointment {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  cpf: string | null;
  dateOfBirth: string | null;
  specialty: string;
  doctorId: number | null;
  preferredDate: string;
  preferredTime: string;
  appointmentType: string;
  message: string | null;
  status: string;
  urgency: string;
  createdAt: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const urgencyColors = {
  normal: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const typeIcons = {
  consultation: User,
  exam: AlertCircle,
  followup: Calendar,
  urgent: AlertCircle,
};

export default function AppointmentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/appointments/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setSelectedAppointment(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status.",
      });
    },
  });

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = appointment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groupedAppointments = {
    today: filteredAppointments.filter(apt => apt.preferredDate === new Date().toISOString().split('T')[0]),
    upcoming: filteredAppointments.filter(apt => apt.preferredDate > new Date().toISOString().split('T')[0]),
    past: filteredAppointments.filter(apt => apt.preferredDate < new Date().toISOString().split('T')[0]),
  };

  const handleStatusUpdate = (appointmentId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: appointmentId, status: newStatus });
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const TypeIcon = typeIcons[appointment.appointmentType as keyof typeof typeIcons] || User;
    
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => setSelectedAppointment(appointment)}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <TypeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{appointment.fullName}</h3>
                <p className="text-gray-600 dark:text-gray-300">{appointment.specialty}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                {appointment.status === 'pending' ? 'Pendente' :
                 appointment.status === 'confirmed' ? 'Confirmado' :
                 appointment.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
              </Badge>
              {appointment.urgency !== 'normal' && (
                <Badge className={urgencyColors[appointment.urgency as keyof typeof urgencyColors]}>
                  {appointment.urgency === 'high' ? 'Alta' : 'Emergência'}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{appointment.preferredTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{appointment.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="truncate">{appointment.email}</span>
            </div>
          </div>

          {appointment.message && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {appointment.message}
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {appointment.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate(appointment.id, 'confirmed');
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Confirmar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja cancelar o agendamento de <strong>{appointment.fullName}</strong> marcado para{" "}
                        <strong>{new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}</strong> às{" "}
                        <strong>{appointment.preferredTime}</strong>?
                        <br /><br />
                        Esta ação mudará o status do agendamento para "Cancelado" e notificará o paciente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Manter Agendamento</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(appointment.id, 'cancelled');
                        }}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      >
                        Cancelar Agendamento
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(appointment.id, 'completed');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Concluir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Agendamentos</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Total de agendamentos: {appointments.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">
            Hoje ({groupedAppointments.today.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Próximos ({groupedAppointments.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Anteriores ({groupedAppointments.past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {groupedAppointments.today.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum agendamento para hoje
                </p>
              </CardContent>
            </Card>
          ) : (
            groupedAppointments.today.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {groupedAppointments.upcoming.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum agendamento futuro
                </p>
              </CardContent>
            </Card>
          ) : (
            groupedAppointments.upcoming.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {groupedAppointments.past.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum agendamento anterior
                </p>
              </CardContent>
            </Card>
          ) : (
            groupedAppointments.past.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Confirmados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Concluídos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {appointments.filter(a => a.urgency === 'emergency').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Emergências</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}