import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Calendar,
  Building2,
  Users,
  Stethoscope,
  UserCheck,
  Clock,
  Settings,
  CalendarDays,
  Star, 
  MessageSquare, 
  TrendingUp, 
  Phone, 
  Mail,
  Activity,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import type { Doctor, Appointment, Testimonial, ContactMessage } from "@shared/schema";

export default function Dashboard() {
  const params = useParams();
  const [location] = useLocation();
  const activeSection = params.section || "overview";
  
  // State for agenda section
  const [selectedDoctor, setSelectedDoctor] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const { data: doctors, isLoading: doctorsLoading } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"],
  });

  const sidebarItems = [
    { 
      id: "overview", 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      href: "/dashboard" 
    },
    { 
      id: "agenda", 
      label: "Agenda Semanal", 
      icon: CalendarDays, 
      href: "/dashboard/agenda",
      highlight: true 
    },
    { 
      id: "clinicas", 
      label: "Clínicas", 
      icon: Building2, 
      href: "/dashboard/clinicas" 
    },
    { 
      id: "profissionais", 
      label: "Profissionais", 
      icon: Users, 
      href: "/dashboard/profissionais" 
    },
    { 
      id: "especialidades", 
      label: "Especialidades", 
      icon: Stethoscope, 
      href: "/dashboard/especialidades" 
    },
    { 
      id: "servicos", 
      label: "Serviços", 
      icon: UserCheck, 
      href: "/dashboard/servicos" 
    },
    { 
      id: "pacientes", 
      label: "Pacientes", 
      icon: Users, 
      href: "/dashboard/pacientes" 
    },
    { 
      id: "agendamentos", 
      label: "Agendamentos", 
      icon: Clock, 
      href: "/dashboard/agendamentos" 
    },
    { 
      id: "configuracoes", 
      label: "Configurações", 
      icon: Settings, 
      href: "/dashboard/configuracoes" 
    }
  ];

  const stats = {
    totalDoctors: doctors?.length || 0,
    totalAppointments: appointments?.length || 0,
    pendingAppointments: appointments?.filter(a => a.status === "pending").length || 0,
    totalTestimonials: testimonials?.length || 0,
    averageRating: testimonials?.length ? 
      testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length : 0,
    totalContacts: contacts?.length || 0,
    recentContacts: contacts?.filter(c => 
      c.createdAt && new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0
  };

  if (doctorsLoading || appointmentsLoading || testimonialsLoading || contactsLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 bg-gray-50 border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800">Navegação</h2>
          </div>
          <div className="space-y-1 px-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600">Visão geral e gerenciamento da San Mathews Clínica e Laboratório</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1 truncate">Total de Médicos</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.totalDoctors}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1 truncate">Agendamentos</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.totalAppointments}</p>
                <p className="text-xs text-gray-500 truncate">{stats.pendingAppointments} pendentes</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1 truncate">Avaliação Média</p>
                <p className="text-2xl lg:text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500 truncate">{stats.totalTestimonials} depoimentos</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Star className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1 truncate">Mensagens</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-600">{stats.totalContacts}</p>
                <p className="text-xs text-gray-500 truncate">{stats.recentContacts} esta semana</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {appointments?.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors space-y-3 lg:space-y-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{appointment.fullName}</h3>
                    <p className="text-sm text-gray-600 truncate">{appointment.specialty}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{appointment.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{appointment.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-start lg:text-right space-x-2 lg:space-x-0 lg:space-y-2">
                    <p className="text-sm font-medium text-gray-700 truncate">{appointment.preferredDate}</p>
                    <Badge 
                      variant={appointment.status === "pending" ? "secondary" : "default"}
                      className={
                        appointment.status === "pending" 
                          ? "bg-yellow-100 text-yellow-800 flex-shrink-0" 
                          : "bg-green-100 text-green-800 flex-shrink-0"
                      }
                    >
                      {appointment.status === "pending" ? "Pendente" : "Confirmado"}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!appointments || appointments.length === 0) && (
                <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipe Médica ({stats.totalDoctors} profissionais)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {doctors?.map((doctor) => (
                <div key={doctor.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{doctor.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{doctor.specialty}</p>
                      <p className="text-xs text-gray-500 truncate">{doctor.crm} • {doctor.experience}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="self-start sm:self-center">{doctor.specialty}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "agenda":
        return renderAgendaSection();
      case "clinicas":
        return renderClinicasSection();
      case "profissionais":
        return renderProfissionaisSection();
      case "especialidades":
        return renderEspecialidadesSection();
      case "servicos":
        return renderServicosSection();
      case "pacientes":
        return renderPacientesSection();
      case "agendamentos":
        return renderAgendamentosSection();
      case "configuracoes":
        return renderConfiguracoesSection();
      default:
        return renderOverview();
    }
  };

  const renderAgendaSection = () => {
    
    // Get current week dates
    const getWeekDates = (date: Date) => {
      const week = [];
      const startOfWeek = new Date(date);
      const dayOfWeek = startOfWeek.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Make Monday the start
      startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
      }
      return week;
    };

    const weekDates = getWeekDates(currentWeek);
    const weekDays = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
    
    // Time slots from 08:00 to 18:00 with 30-minute intervals
    const timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }

    const navigateWeek = (direction: 'prev' | 'next') => {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeek(newWeek);
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    };

    const selectedDoctorData = doctors?.find(d => d.id === selectedDoctor);

    // Sample appointment data for demonstration
    const sampleAppointments = [
      { 
        id: 1, 
        day: 'quinta', 
        time: '12:00', 
        patient: 'Carlos de Oliveira', 
        type: 'Consulta', 
        status: 'confirmed' 
      },
      { 
        id: 2, 
        day: 'quinta', 
        time: '14:30', 
        patient: 'Maria Silva', 
        type: 'Retorno', 
        status: 'pending' 
      },
      { 
        id: 3, 
        day: 'sexta', 
        time: '09:00', 
        patient: 'João Santos', 
        type: 'Consulta', 
        status: 'confirmed' 
      }
    ];

    const getAppointmentForSlot = (day: string, time: string) => {
      return sampleAppointments.find(apt => apt.day === day && apt.time === time);
    };

    const isDayBlocked = (day: string) => {
      // Sample blocked days - quinta, sexta, domingo
      return ['quinta', 'sexta', 'domingo'].includes(day);
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Doctor Selection */}
            <div className="flex items-center space-x-3 bg-white border border-gray-300 rounded-lg px-4 py-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <select 
                  value={selectedDoctor} 
                  onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                  className="font-medium text-gray-800 bg-transparent border-none outline-none"
                >
                  {doctors?.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500">{selectedDoctorData?.specialty}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {sampleAppointments.length} horários disponíveis
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">Hoje</div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateWeek('prev')}
              >
                <span>‹</span>
              </Button>
              <div className="text-lg font-semibold px-4">
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateWeek('next')}
              >
                <span>›</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 text-sm font-medium text-gray-600 bg-gray-50 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Horários
            </div>
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const dayBlocked = isDayBlocked(weekDays[index]);
              
              return (
                <div 
                  key={index} 
                  className={`p-4 text-center border-l border-gray-200 ${
                    isToday ? 'bg-blue-50' : dayBlocked ? 'bg-red-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`font-medium text-lg ${
                    isToday ? 'text-blue-600' : dayBlocked ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className={`text-sm capitalize ${
                    isToday ? 'text-blue-600' : dayBlocked ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {weekDays[index]}
                  </div>
                  {dayBlocked && (
                    <div className="text-xs text-red-500 mt-1 flex items-center justify-center">
                      <span className="mr-1">✖</span>
                      Fechada
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="max-h-96 overflow-y-auto">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b border-gray-100">
                {/* Time Column */}
                <div className="p-3 text-sm text-gray-600 bg-gray-50 border-r border-gray-200 font-medium">
                  {time}
                </div>
                
                {/* Day Columns */}
                {weekDays.map((day, dayIndex) => {
                  const appointment = getAppointmentForSlot(day, time);
                  const dayBlocked = isDayBlocked(day);
                  
                  return (
                    <div 
                      key={`${day}-${time}`}
                      className={`p-2 border-l border-gray-100 min-h-[60px] ${
                        dayBlocked ? 'bg-red-50' : 'hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      {dayBlocked ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-red-400 text-2xl">✖</div>
                        </div>
                      ) : appointment ? (
                        <div className={`rounded-lg p-2 text-xs border-l-4 h-full ${
                          appointment.status === 'confirmed' 
                            ? 'bg-orange-100 border-orange-400 text-orange-800' 
                            : 'bg-yellow-100 border-yellow-400 text-yellow-800'
                        }`}>
                          <div className="font-semibold truncate">{appointment.patient}</div>
                          <div className="text-xs opacity-75">{appointment.type}</div>
                          <div className="flex items-center mt-1">
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                              appointment.status === 'confirmed' ? 'bg-green-400' : 'bg-yellow-400'
                            }`}></div>
                            <span className="text-xs">
                              {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      
                      {dayBlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-red-400 text-lg">
                            <span className="block text-center">Agenda</span>
                            <span className="block text-center">Fechada</span>
                            <div className="text-xs mt-1 text-center">
                              Não é possível<br/>agendar neste dia
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Configurar Disponibilidade
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Gerenciar Horários
          </Button>
        </div>
      </div>
    );
  };

  const renderClinicasSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clínicas</h1>
          <p className="text-gray-600">Gerencie unidades e filiais</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Clínica
        </Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">San Mathews - Sede</h3>
                <p className="text-gray-600">R Vereador Francisco Francilino, 1431 - Centro, Baturité, CE</p>
                <p className="text-gray-500">CEP: 62.760-000</p>
                <p className="text-gray-500">Telefone: 55(85)99408-6263</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProfissionaisSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Profissionais</h1>
          <p className="text-gray-600">Gerencie médicos e equipe</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Profissional
        </Button>
      </div>
      
      <div className="grid gap-4">
        {doctors?.map((doctor) => (
          <Card key={doctor.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.specialty}</p>
                    <p className="text-gray-500">{doctor.crm} • {doctor.experience}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEspecialidadesSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Especialidades</h1>
          <p className="text-gray-600">Gerencie especialidades médicas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Especialidade
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Cardiologia', 'Ortopedia', 'Dermatologia', 'Neurologia', 'Pediatria', 'Ginecologia'].map((specialty) => (
          <Card key={specialty}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{specialty}</h3>
                  <p className="text-gray-600">2 profissionais</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderServicosSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Serviços</h1>
          <p className="text-gray-600">Gerencie serviços oferecidos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>
      
      <div className="grid gap-4">
        {['Consultas Médicas', 'Exames Laboratoriais', 'Ultrassonografia', 'Eletrocardiograma'].map((service) => (
          <Card key={service}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{service}</h3>
                  <p className="text-gray-600">Serviço ativo</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPacientesSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
          <p className="text-gray-600">Gerencie cadastro de pacientes</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center py-8">
            Sistema de gerenciamento de pacientes em desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderAgendamentosSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-gray-600">Gerencie todos os agendamentos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>
      
      <div className="space-y-4">
        {appointments?.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{appointment.fullName}</h3>
                  <p className="text-gray-600">{appointment.specialty}</p>
                  <p className="text-gray-500">{appointment.phone} • {appointment.email}</p>
                  <p className="text-gray-500">Data preferida: {appointment.preferredDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={appointment.status === "pending" ? "secondary" : "default"}
                    className={
                      appointment.status === "pending" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {appointment.status === "pending" ? "Pendente" : "Confirmado"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!appointments || appointments.length === 0) && (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderConfiguracoesSection = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-600">Configurações gerais do sistema</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Clínica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome da Clínica</label>
              <p className="text-gray-600">San Mathews Clínica e Laboratório Ltda</p>
            </div>
            <div>
              <label className="text-sm font-medium">Endereço</label>
              <p className="text-gray-600">R Vereador Francisco Francilino, 1431 - Centro, Baturité, CE - CEP: 62.760-000</p>
            </div>
            <div>
              <label className="text-sm font-medium">Telefone</label>
              <p className="text-gray-600">55(85)99408-6263</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-gray-600">georgelucasamaro@hotmail.com</p>
            </div>
            <Button>Editar Informações</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Horário de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Segunda a Sexta</label>
                <p className="text-gray-600">7h às 19h</p>
              </div>
              <div>
                <label className="text-sm font-medium">Sábado</label>
                <p className="text-gray-600">8h às 14h</p>
              </div>
            </div>
            <Button>Editar Horários</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Navegação</h2>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              (item.id === "overview" && activeSection === "overview") ||
              (item.id !== "overview" && activeSection === item.id);
            
            return (
              <Link key={item.id} href={item.href}>
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? item.highlight
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                      : item.highlight
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}