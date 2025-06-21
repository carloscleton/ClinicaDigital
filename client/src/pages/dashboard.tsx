import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Star,
  Activity,
  Clock,
  CheckCircle,
  Stethoscope,
  Phone,
  Mail
} from "lucide-react";
import type { Doctor, Appointment, Testimonial, ContactMessage } from "@shared/schema";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

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
    pendingAppointments: appointments?.filter(apt => apt.status === "pending").length || 0,
    confirmedAppointments: appointments?.filter(apt => apt.status === "confirmed").length || 0,
    totalTestimonials: testimonials?.length || 0,
    averageRating: testimonials?.length 
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
      : 0,
    totalContacts: contacts?.length || 0,
    recentContacts: contacts?.filter(c => {
      if (!c.createdAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(c.createdAt) > weekAgo;
    }).length || 0,
  };

  // Calculate specialty statistics
  const specialtyStats = doctors?.reduce((acc, doctor) => {
    acc[doctor.specialty] = (acc[doctor.specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (doctorsLoading || appointmentsLoading || testimonialsLoading || contactsLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
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

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral e gerenciamento da San Mathews Clínica e Laboratório</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Visão Geral</TabsTrigger>
            <TabsTrigger value="doctors" className="text-xs sm:text-sm">Médicos</TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs sm:text-sm">Agendamentos</TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm">Feedback</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Doctors by Specialty */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Médicos por Especialidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(specialtyStats).map(([specialty, count]) => (
                      <div key={specialty} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{specialty}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stats.confirmedAppointments} consultas confirmadas</p>
                        <p className="text-xs text-gray-500">Hoje</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stats.pendingAppointments} consultas pendentes</p>
                        <p className="text-xs text-gray-500">Aguardando confirmação</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stats.recentContacts} mensagens recebidas</p>
                        <p className="text-xs text-gray-500">Esta semana</p>
                      </div>
                    </div>
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

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appointments?.slice(0, 10).map((appointment) => (
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
                      <div key={testimonial.id} className="border-l-4 border-blue-200 pl-4 pr-2">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{testimonial.rating}.0</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 leading-relaxed">"{testimonial.content}"</p>
                        <p className="text-xs text-gray-500 truncate">
                          {testimonial.authorName} - {testimonial.location}
                        </p>
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
      </div>
    </div>
  );
}