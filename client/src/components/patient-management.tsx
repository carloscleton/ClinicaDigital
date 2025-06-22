import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Phone,
  Mail,
  Calendar,
  MapPin,
  User,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Appointment } from "@shared/schema";

export default function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"]
  });

  // Extrair pacientes únicos dos agendamentos
  const patients = appointments.reduce((acc, apt) => {
    const patientKey = apt.email;
    if (!acc[patientKey]) {
      acc[patientKey] = {
        id: apt.id,
        fullName: apt.fullName,
        email: apt.email,
        phone: apt.phone,
        cpf: apt.cpf,
        dateOfBirth: apt.dateOfBirth,
        appointments: [],
        lastAppointment: apt.preferredDate,
        totalAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0
      };
    }
    
    acc[patientKey].appointments.push(apt);
    acc[patientKey].totalAppointments++;
    
    if (apt.status === "pending") acc[patientKey].pendingAppointments++;
    if (apt.status === "completed") acc[patientKey].completedAppointments++;
    
    // Atualizar último agendamento
    if (new Date(apt.preferredDate) > new Date(acc[patientKey].lastAppointment)) {
      acc[patientKey].lastAppointment = apt.preferredDate;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const patientsList = Object.values(patients);

  // Filtrar e ordenar pacientes
  const filteredPatients = patientsList
    .filter(patient => {
      const matchesSearch = patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.phone.includes(searchTerm);
      
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "active" && patient.pendingAppointments > 0) ||
                           (filterStatus === "completed" && patient.completedAppointments > 0);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "lastAppointment":
          return new Date(b.lastAppointment).getTime() - new Date(a.lastAppointment).getTime();
        case "totalAppointments":
          return b.totalAppointments - a.totalAppointments;
        default:
          return 0;
      }
    });

  const exportPatients = () => {
    const exportData = filteredPatients.map(patient => ({
      nome: patient.fullName,
      email: patient.email,
      telefone: patient.phone,
      cpf: patient.cpf,
      nascimento: patient.dateOfBirth,
      totalAgendamentos: patient.totalAppointments,
      agendamentosPendentes: patient.pendingAppointments,
      agendamentosConcluidos: patient.completedAppointments,
      ultimoAgendamento: patient.lastAppointment
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pacientes-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Pacientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize e gerencie informações dos pacientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportPatients} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Paciente
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Pacientes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{patientsList.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pacientes Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {patientsList.filter(p => p.pendingAppointments > 0).length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Média de Agendamentos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {patientsList.length > 0 
                    ? (patientsList.reduce((sum, p) => sum + p.totalAppointments, 0) / patientsList.length).toFixed(1)
                    : "0"
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Novos este Mês</p>
                <p className="text-2xl font-bold text-orange-600">
                  {patientsList.filter(p => {
                    const lastAppointment = new Date(p.lastAppointment);
                    const thisMonth = new Date();
                    return lastAppointment.getMonth() === thisMonth.getMonth() &&
                           lastAppointment.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </p>
              </div>
              <Plus className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar Paciente</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pacientes</SelectItem>
                  <SelectItem value="active">Pacientes ativos</SelectItem>
                  <SelectItem value="completed">Com consultas concluídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="lastAppointment">Último agendamento</SelectItem>
                  <SelectItem value="totalAppointments">Total de agendamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Ações</label>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Pacientes ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Agendamentos</TableHead>
                  <TableHead>Último Agendamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.email}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.fullName}</div>
                        {patient.cpf && (
                          <div className="text-sm text-gray-500">CPF: {patient.cpf}</div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {patient.email}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-sm">
                        {calculateAge(patient.dateOfBirth)} anos
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          Total: {patient.totalAppointments}
                        </div>
                        <div className="flex gap-1">
                          {patient.pendingAppointments > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {patient.pendingAppointments} pendente(s)
                            </Badge>
                          )}
                          {patient.completedAppointments > 0 && (
                            <Badge variant="default" className="text-xs">
                              {patient.completedAppointments} concluído(s)
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {new Date(patient.lastAppointment).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={patient.pendingAppointments > 0 ? "default" : "secondary"}
                        className={
                          patient.pendingAppointments > 0 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                        }
                      >
                        {patient.pendingAppointments > 0 ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum paciente encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}