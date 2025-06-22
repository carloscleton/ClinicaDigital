import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from "recharts";
import { 
  FileText, TrendingUp, Users, Stethoscope, Calendar as CalendarIcon, 
  DollarSign, Activity, Clock, Award, Target, Download, Filter,
  UserCheck, CalendarDays, Briefcase, Heart, Building2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Professional {
  id: number;
  name: string;
  specialty: string;
}

interface Service {
  id: number;
  servicos: string;
  valorServicos: number | null;
  idProfissional: number | null;
  created_at: string;
  professionalName?: string;
}

interface Patient {
  id: number;
  nomeCliente: string | null;
  telefoneCliente: string | null;
  emailCliente: string | null;
  nascimentoCliente: string | null;
  statusAgendamento: boolean | null;
  statusPagamento: boolean | null;
  valor: number | null;
  ultimo_pagamento: string | null;
  created_at: string;
}

interface Appointment {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  doctorId: number | null;
  preferredDate: string;
  preferredTime: string;
  status: string;
  urgency: string;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ReportsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // Fetch data from APIs
  const { data: professionals = [] } = useQuery<Professional[]>({
    queryKey: ["/api/supabase/professionals"],
    queryFn: async () => {
      const response = await fetch("/api/supabase/professionals");
      if (!response.ok) throw new Error("Erro ao carregar profissionais");
      return response.json();
    },
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/supabase/services"],
    queryFn: async () => {
      const response = await fetch("/api/supabase/services");
      if (!response.ok) throw new Error("Erro ao carregar serviços");
      return response.json();
    },
  });

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/supabase/patients"],
    queryFn: async () => {
      const response = await fetch("/api/supabase/patients");
      if (!response.ok) throw new Error("Erro ao carregar pacientes");
      return response.json();
    },
  });

  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Erro ao carregar agendamentos");
      return response.json();
    },
  });

  // Calculate metrics
  const totalRevenue = patients.reduce((sum, patient) => sum + (patient.valor || 0), 0);
  const paidPatients = patients.filter(p => p.statusPagamento).length;
  const unpaidPatients = patients.filter(p => !p.statusPagamento).length;
  const scheduledPatients = patients.filter(p => p.statusAgendamento).length;

  // Services by professional chart data
  const servicesByProfessional = professionals.map(prof => {
    const profServices = services.filter(s => s.idProfissional === prof.id);
    const totalValue = profServices.reduce((sum, s) => sum + (s.valorServicos || 0), 0);
    return {
      name: prof.name,
      quantity: profServices.length,
      value: totalValue,
      specialty: prof.specialty
    };
  });

  // Revenue trend data (monthly)
  const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(new Date().getFullYear(), i, 1);
    const monthRevenue = patients
      .filter(p => {
        if (!p.ultimo_pagamento) return false;
        const paymentDate = new Date(p.ultimo_pagamento);
        return paymentDate.getMonth() === i && paymentDate.getFullYear() === new Date().getFullYear();
      })
      .reduce((sum, p) => sum + (p.valor || 0), 0);
    
    return {
      month: format(month, "MMM", { locale: ptBR }),
      revenue: monthRevenue,
      patients: patients.filter(p => {
        if (!p.created_at) return false;
        const createdDate = new Date(p.created_at);
        return createdDate.getMonth() === i && createdDate.getFullYear() === new Date().getFullYear();
      }).length
    };
  });

  // Specialty distribution
  const specialtyDistribution = professionals.reduce((acc, prof) => {
    const existing = acc.find(item => item.specialty === prof.specialty);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ specialty: prof.specialty, count: 1 });
    }
    return acc;
  }, [] as Array<{ specialty: string; count: number }>);

  // Payment status pie chart
  const paymentStatus = [
    { name: 'Pagos', value: paidPatients, color: '#00C49F' },
    { name: 'Pendentes', value: unpaidPatients, color: '#FF8042' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Relatórios e Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Visão completa dos dados da clínica San Mathews</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Profissionais</p>
                <p className="text-2xl font-bold text-blue-600">{professionals.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Serviços</p>
                <p className="text-2xl font-bold text-green-600">{services.length}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pacientes</p>
                <p className="text-2xl font-bold text-purple-600">{patients.length}</p>
              </div>
              <Heart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Agendamentos</p>
                <p className="text-2xl font-bold text-orange-600">{appointments.length}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
                <p className="text-2xl font-bold text-emerald-600">R$ {totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Pagamento</p>
                <p className="text-2xl font-bold text-teal-600">
                  {patients.length > 0 ? Math.round((paidPatients / patients.length) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="professionals">Profissionais</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendência de Receita Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Status de Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professionals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Services by Professional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Serviços por Profissional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={servicesByProfessional}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Specialty Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Distribuição por Especialidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={specialtyDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ specialty, count }) => `${specialty}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {specialtyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Professionals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes dos Profissionais</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Serviços Oferecidos</TableHead>
                    <TableHead>Receita Total</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicesByProfessional.map((prof) => (
                    <TableRow key={prof.name}>
                      <TableCell className="font-medium">{prof.name}</TableCell>
                      <TableCell>{prof.specialty}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{prof.quantity} serviços</Badge>
                      </TableCell>
                      <TableCell>R$ {prof.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={prof.value > 500 ? "default" : "outline"}>
                          {prof.value > 500 ? "Alto" : "Moderado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Relatório de Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.servicos}</TableCell>
                      <TableCell>{service.professionalName || "Não especificado"}</TableCell>
                      <TableCell>R$ {(service.valorServicos || 0).toFixed(2)}</TableCell>
                      <TableCell>{new Date(service.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant="default">Ativo</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pacientes Agendados</p>
                    <p className="text-2xl font-bold text-blue-600">{scheduledPatients}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pagamentos em Dia</p>
                    <p className="text-2xl font-bold text-green-600">{paidPatients}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pendências</p>
                    <p className="text-2xl font-bold text-red-600">{unpaidPatients}</p>
                  </div>
                  <Clock className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Agendamento</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Último Pagamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.nomeCliente || "N/A"}</TableCell>
                      <TableCell>{patient.telefoneCliente || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={patient.statusAgendamento ? "default" : "secondary"}>
                          {patient.statusAgendamento ? "Agendado" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={patient.statusPagamento ? "default" : "destructive"}>
                          {patient.statusPagamento ? "Pago" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>R$ {(patient.valor || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        {patient.ultimo_pagamento 
                          ? new Date(patient.ultimo_pagamento).toLocaleDateString('pt-BR')
                          : "N/A"
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Receita por Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Receita Total:</span>
                  <span className="font-semibold text-lg">R$ {totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Receita Média por Paciente:</span>
                  <span className="font-semibold">
                    R$ {patients.length > 0 ? (totalRevenue / patients.length).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pacientes Pagantes:</span>
                  <span className="font-semibold text-green-600">{paidPatients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pendências:</span>
                  <span className="font-semibold text-red-600">{unpaidPatients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conversão:</span>
                  <span className="font-semibold">
                    {patients.length > 0 ? ((paidPatients / patients.length) * 100).toFixed(1) : "0"}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Indicadores de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profissionais Ativos:</span>
                  <Badge variant="default">{professionals.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Serviços Oferecidos:</span>
                  <Badge variant="secondary">{services.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Especialidades:</span>
                  <Badge variant="outline">{specialtyDistribution.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Agendamentos Ativos:</span>
                  <Badge variant="default">{appointments.length}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas e Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Meta de Pacientes (100):</span>
                    <span className="font-semibold">{patients.length}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((patients.length / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Meta de Receita (R$ 10.000):</span>
                    <span className="font-semibold">R$ {totalRevenue.toFixed(0)}/10.000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((totalRevenue / 10000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}