import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { Doctor, Appointment, Testimonial } from "@shared/schema";

export default function MedicalReports() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");

  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"]
  });

  const { data: doctors = [] } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"]
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"]
  });

  // Filtrar dados por período e critérios
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.preferredDate);
    const dateInRange = aptDate >= dateRange.from && aptDate <= dateRange.to;
    const doctorMatch = selectedDoctor === "all" || apt.doctorId?.toString() === selectedDoctor;
    const specialtyMatch = selectedSpecialty === "all" || apt.specialty === selectedSpecialty;
    return dateInRange && doctorMatch && specialtyMatch;
  });

  // Calcular estatísticas
  const totalAppointments = filteredAppointments.length;
  const completedAppointments = filteredAppointments.filter(a => a.status === "completed").length;
  const pendingAppointments = filteredAppointments.filter(a => a.status === "pending").length;
  const confirmedAppointments = filteredAppointments.filter(a => a.status === "confirmed").length;
  const emergencyAppointments = filteredAppointments.filter(a => a.urgency === "emergency").length;

  const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
    : 0;

  // Agrupar por especialidade
  const appointmentsBySpecialty = filteredAppointments.reduce((acc, apt) => {
    acc[apt.specialty] = (acc[apt.specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Agrupar por médico
  const appointmentsByDoctor = filteredAppointments.reduce((acc, apt) => {
    if (apt.doctorId) {
      const doctor = doctors.find(d => d.id === apt.doctorId);
      const doctorName = doctor ? doctor.name : "Não atribuído";
      acc[doctorName] = (acc[doctorName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Agrupar por status
  const appointmentsByStatus = filteredAppointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Agrupar por mês
  const appointmentsByMonth = filteredAppointments.reduce((acc, apt) => {
    const month = new Date(apt.preferredDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportReport = () => {
    const reportData = {
      periodo: `${dateRange.from.toLocaleDateString('pt-BR')} - ${dateRange.to.toLocaleDateString('pt-BR')}`,
      totalAgendamentos: totalAppointments,
      agendamentosConcluidos: completedAppointments,
      agendamentosPendentes: pendingAppointments,
      agendamentosConfirmados: confirmedAppointments,
      emergencias: emergencyAppointments,
      taxaConclusao: completionRate.toFixed(1) + '%',
      avaliacaoMedia: averageRating.toFixed(1),
      porEspecialidade: appointmentsBySpecialty,
      porMedico: appointmentsByDoctor,
      porStatus: appointmentsByStatus,
      porMes: appointmentsByMonth
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-medico-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const specialties = Array.from(new Set(appointments.map(a => a.specialty)));

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatórios Médicos
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Análise completa de dados clínicos e estatísticas
              </p>
            </div>
            <Button onClick={exportReport} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <div className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                {dateRange.from.toLocaleDateString('pt-BR')} - {dateRange.to.toLocaleDateString('pt-BR')}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Médico</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os médicos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os médicos</SelectItem>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Especialidade</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as especialidades</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
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

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Agendamentos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avaliação Média</p>
                <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}/5</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map(star => (
                <div
                  key={star}
                  className={`w-3 h-3 rounded-full mr-1 ${
                    star <= averageRating ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emergências</p>
                <p className="text-2xl font-bold text-red-600">{emergencyAppointments}</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="specialty" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="specialty">Por Especialidade</TabsTrigger>
          <TabsTrigger value="doctor">Por Médico</TabsTrigger>
          <TabsTrigger value="status">Por Status</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
        </TabsList>

        <TabsContent value="specialty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuição por Especialidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(appointmentsBySpecialty)
                  .sort(([,a], [,b]) => b - a)
                  .map(([specialty, count]) => {
                    const percentage = totalAppointments > 0 ? (count / totalAppointments) * 100 : 0;
                    return (
                      <div key={specialty} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{specialty}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{count}</span>
                            <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance por Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(appointmentsByDoctor)
                  .sort(([,a], [,b]) => b - a)
                  .map(([doctorName, count]) => {
                    const percentage = totalAppointments > 0 ? (count / totalAppointments) * 100 : 0;
                    return (
                      <div key={doctorName} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{doctorName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{count}</span>
                            <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Status dos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{pendingAppointments}</div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400">Pendentes</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{confirmedAppointments}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">Confirmados</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completedAppointments}</div>
                  <div className="text-sm text-green-700 dark:text-green-400">Concluídos</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{emergencyAppointments}</div>
                  <div className="text-sm text-red-700 dark:text-red-400">Emergências</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolução Temporal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(appointmentsByMonth)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([month, count]) => {
                    const maxCount = Math.max(...Object.values(appointmentsByMonth));
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={month} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{month}</span>
                          <Badge variant="outline">{count} agendamentos</Badge>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}