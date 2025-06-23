import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Star,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Building2,
  UserCheck,
  Heart,
  Settings,
  CalendarDays,
  LayoutDashboard,
  Menu
} from "lucide-react";
import type { Doctor, Appointment, Testimonial, ContactMessage } from "@shared/schema";
import ProfessionalsManagement from "@/components/professionals-management";
import AppointmentsManagement from "@/components/appointments-management";
import SystemConfiguration from "@/components/system-configuration";
import AppointmentCalendar from "@/components/appointment-calendar";
import MedicalReports from "@/components/medical-reports";
import PatientManagement from "@/components/patient-management";
import ProfessionalsManagementWithSupabase from "@/components/specialties-management";
import SpecialtiesCRUD from "@/components/specialties-crud";
import ServicesManagement from "@/components/services-management";
import PatientsManagement from "@/components/patients-management";
import ReportsDashboard from "@/components/reports-dashboard";
import ServicesRegistration from "@/components/services-registration";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("agenda");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sidebar navigation items
  const sidebarItems = [
    { id: "agenda", label: "Agenda Semanal", icon: CalendarDays, highlight: true },
    { id: "relatorios", label: "Relatórios", icon: TrendingUp },
    { id: "clinicas", label: "Clínicas", icon: Building2 },
    { id: "profissionais", label: "Profissionais", icon: UserCheck },
    { id: "especialidades", label: "Especialidades", icon: Heart },
    { id: "servicos", label: "Serviços", icon: Activity },
    { id: "cadastro-servicos", label: "Cadastro de Serviços", icon: Stethoscope },
    { id: "pacientes", label: "Pacientes", icon: Users },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

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

  // Calculate statistics
  const stats = {
    totalDoctors: doctors?.length || 0,
    totalAppointments: appointments?.length || 0,
    totalTestimonials: testimonials?.length || 0,
    totalContacts: contacts?.length || 0,
    pendingAppointments: appointments?.filter(apt => apt.status === "pending")?.length || 0,
    confirmedAppointments: appointments?.filter(apt => apt.status === "confirmed")?.length || 0,
    recentContacts: contacts?.filter(contact => {
      if (!contact.createdAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(contact.createdAt) > weekAgo;
    })?.length || 0,
    averageRating: testimonials?.length 
      ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
      : "0"
  };

  const SidebarContent = ({ onItemSelect }: { onItemSelect?: () => void }) => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Dashboard San Mathews
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Sistema de gerenciamento clínico
        </p>
      </div>
      
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSidebarItem(item.id);
                onItemSelect?.();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                selectedSidebarItem === item.id
                  ? item.highlight
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${selectedSidebarItem === item.id && item.highlight ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">San Mathews Clínica</p>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white dark:bg-gray-950">
              <SidebarContent onItemSelect={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block w-80 bg-white dark:bg-gray-950 shadow-lg border-r border-gray-200 dark:border-gray-800 min-h-screen">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Dashboard Administrativo</h1>
            <p className="text-gray-600 dark:text-gray-400">Visão geral e gerenciamento da San Mathews Clínica e Laboratório</p>
          </div>

          {/* Content based on sidebar selection */}
          {selectedSidebarItem === "agenda" ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Agenda Semanal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Visualização completa dos agendamentos da semana
                </p>
              </div>
              <AppointmentCalendar />
            </>
          ) : selectedSidebarItem === "relatorios" ? (
            <ReportsDashboard />
          ) : selectedSidebarItem === "profissionais" ? (
            <ProfessionalsManagementWithSupabase />
          ) : selectedSidebarItem === "pacientes" ? (
            <PatientsManagement />
          ) : selectedSidebarItem === "servicos" ? (
            <ServicesManagement />
          ) : selectedSidebarItem === "cadastro-servicos" ? (
            <ServicesRegistration />
          ) : selectedSidebarItem === "especialidades" ? (
            <SpecialtiesCRUD />
          ) : selectedSidebarItem === "configuracoes" ? (
            <SystemConfiguration />
          ) : selectedSidebarItem === "clinicas" ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Clínicas
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerenciamento das unidades e informações das clínicas
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>San Mathews Clínica e Laboratório Ltda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">R Vereador Francisco Francilino, 1431 - Centro</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Baturité, CE - CEP: 62.760-000</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">55(85)99408-6263</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">georgelucasamaro@hotmail.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline">Ativa</Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
        {/* Default Dashboard Overview */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="doctors">Médicos</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Statistics Cards */}
              <Card>
                <CardContent className="flex flex-row items-center justify-between space-y-0 p-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Total de Médicos
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalDoctors}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stats.totalDoctors} profissionais ativos
                    </p>
                  </div>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-row items-center justify-between space-y-0 p-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Agendamentos
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalAppointments}
                    </p>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {stats.confirmedAppointments} confirmados
                      </Badge>
                      {stats.pendingAppointments > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {stats.pendingAppointments} pendentes
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-row items-center justify-between space-y-0 p-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Depoimentos
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalTestimonials}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <p className="text-xs text-gray-500">{stats.averageRating} média</p>
                    </div>
                  </div>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-row items-center justify-between space-y-0 p-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Contatos
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalContacts}
                    </p>
                    <p className="text-xs text-gray-500">{stats.recentContacts} mensagens esta semana</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-6">
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
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Depoimentos ({stats.totalTestimonials})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {testimonials?.slice(0, 5).map((testimonial) => (
                      <div key={testimonial.id} className="border-l-4 border-yellow-200 pl-4 pr-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                          <h4 className="font-semibold text-gray-800 truncate">{testimonial.authorName}</h4>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (testimonial.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 leading-relaxed line-clamp-3">{testimonial.content}</p>
                        <p className="text-xs text-gray-500 truncate">{testimonial.location}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Mensagens de Contato ({stats.totalContacts})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {contacts?.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="border-l-4 border-green-200 pl-4 pr-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                          <h4 className="font-semibold text-gray-800 truncate">{contact.subject}</h4>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {contact.createdAt && new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 leading-relaxed line-clamp-3">{contact.message}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.name} - {contact.email}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}