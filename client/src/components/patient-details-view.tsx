import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Edit, 
  Clock,
  MapPin,
  CreditCard
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import PatientHistoryTab from "./patient-history-tab";

interface PatientDetailsViewProps {
  patientId: number;
  onClose: () => void;
  onEdit: (patientId: number) => void;
  onAddMedicalRecord: (patientId: number) => void;
}

// Mock patient interface - this would come from your types
interface Patient {
  id: number;
  nomeCliente: string;
  telefoneCliente: string;
  emailCliente: string;
  nascimentoCliente: string | null;
  CPF: string | null;
}

interface Appointment {
  id: number;
  preferredDate: string;
  preferredTime: string;
  status: string;
  specialty: string;
}

export default function PatientDetailsView({ 
  patientId, 
  onClose, 
  onEdit,
  onAddMedicalRecord
}: PatientDetailsViewProps) {
  // Fetch patient data
  const { data: patient, isLoading } = useQuery<Patient>({
    queryKey: [`/api/patients/${patientId}`],
    queryFn: async () => {
      // In a real implementation, fetch from API
      // Mock data for demonstration
      return {
        id: patientId,
        nomeCliente: "Maria Silva",
        telefoneCliente: "(85) 99999-9999",
        emailCliente: "maria@email.com",
        nascimentoCliente: "1980-05-15",
        CPF: "123.456.789-00"
      };
    }
  });

  // Fetch appointments
  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: [`/api/appointments/patient/${patientId}`],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: 1,
          preferredDate: "2025-07-15",
          preferredTime: "10:00",
          status: "confirmed",
          specialty: "Clínica Geral"
        },
        {
          id: 2,
          preferredDate: "2025-06-20",
          preferredTime: "14:30",
          status: "completed",
          specialty: "Dermatologia"
        }
      ];
    }
  });

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "";
    } catch (e) {
      return "";
    }
  };

  // Calculate age
  const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Get appointment status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'completed':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 'cancelled':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return "Confirmado";
      case 'pending': return "Pendente";
      case 'completed': return "Concluído";
      case 'cancelled': return "Cancelado";
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-500">Paciente não encontrado</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {patient.nomeCliente}
            </h2>
            <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              <span>
                {patient.nascimentoCliente ? (
                  <>
                    {formatDate(patient.nascimentoCliente)}
                    {calculateAge(patient.nascimentoCliente) !== null && (
                      <> • {calculateAge(patient.nascimentoCliente)} anos</>
                    )}
                  </>
                ) : (
                  "Data de nascimento não informada"
                )}
              </span>
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => onEdit(patientId)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar Paciente
        </Button>
      </div>
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="history">Histórico Médico</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>
        
        {/* Patient Info Tab */}
        <TabsContent value="info" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p>{patient.telefoneCliente || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{patient.emailCliente || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">CPF</p>
                    <p>{patient.CPF || "Não informado"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico Resumido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total de consultas</span>
                  <Badge variant="outline">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Última consulta</span>
                  <span className="text-gray-600">15/06/2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Próximo retorno</span>
                  <span className="text-gray-600">30/06/2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Medical History Tab */}
        <TabsContent value="history" className="mt-4">
          <PatientHistoryTab 
            patientId={patientId} 
            onAddRecord={onAddMedicalRecord} 
          />
        </TabsContent>
        
        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Não há agendamentos para este paciente</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map(appointment => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          {formatDate(appointment.preferredDate)}
                        </TableCell>
                        <TableCell>{appointment.preferredTime}</TableCell>
                        <TableCell>{appointment.specialty}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}