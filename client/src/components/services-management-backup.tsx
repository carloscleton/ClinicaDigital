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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope, Plus, Edit, Trash2, DollarSign, RefreshCw, Loader2, CheckCircle, XCircle, Users, TrendingUp, Eye, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Service interface for Supabase CAD_Servicos data
interface SupabaseService {
  id: number;
  servicos: string;
  valorServicos: number | null;
  id_Empresa: number | null;
  idProfissional: number | null;
  created_at: string;
  professionalName?: string;
}

// Professional interface for dropdown
interface Professional {
  id: number;
  name: string;
  specialty: string;
}

// Form validation schema for services
const serviceSchema = z.object({
  servicos: z.string().min(2, "Nome do serviço deve ter pelo menos 2 caracteres"),
  valorServicos: z.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
  idProfissional: z.number().optional(),
  id_Empresa: z.number().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServicesManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<SupabaseService | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [isServicesPopupOpen, setIsServicesPopupOpen] = useState(false);
  const [selectedProfessionalServices, setSelectedProfessionalServices] = useState<SupabaseService[]>([]);
  const [selectedProfessionalName, setSelectedProfessionalName] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grouped" | "detailed">("grouped");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch services from CAD_Servicos table
  const { data: services = [], isLoading, error, refetch } = useQuery<SupabaseService[]>({
    queryKey: ["/api/supabase/services"],
  });

  // Fetch professionals for dropdown
  const { data: professionals = [] } = useQuery<Professional[]>({
    queryKey: ["/api/supabase/professionals"],
    select: (data: any[]) => data.map(p => ({
      id: p.id,
      name: p.name,
      specialty: p.specialty
    }))
  });

  // Test connection mutation
  const testConnection = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/supabase/test");
      if (!response.ok) throw new Error("Falha na conexão");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Conexão bem-sucedida",
        description: "Sistema conectado ao banco de dados",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Erro de conexão",
        description: "Falha ao conectar com o banco de dados",
        variant: "destructive",
      });
    },
  });

  // Create service mutation
  const createService = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const response = await fetch("/api/supabase/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao criar serviço");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/services"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Serviço adicionado",
        description: "Novo serviço cadastrado com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Update service mutation
  const updateService = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ServiceFormData }) => {
      const response = await fetch(`/api/supabase/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar serviço");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/services"] });
      setIsAddDialogOpen(false);
      setEditingService(null);
      toast({
        title: "Serviço atualizado",
        description: "Dados do serviço atualizados com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Delete service mutation
  const deleteService = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/supabase/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao remover serviço");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/services"] });
      toast({
        title: "Serviço removido",
        description: "Serviço removido do sistema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover serviço",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Form setup
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      servicos: "",
      valorServicos: 0,
      idProfissional: undefined,
      id_Empresa: 1,
    },
  });

  // Calculate statistics
  const stats = {
    totalServices: services.length,
    professionalCount: new Set(services.filter(s => s.idProfissional).map(s => s.idProfissional)).size,
  };

  // Group services by professional
  const groupedServices = services.reduce((acc, service) => {
    const professionalId = service.idProfissional;
    if (!professionalId) return acc;
    
    if (!acc[professionalId]) {
      acc[professionalId] = {
        professional: professionals.find(p => p.id === professionalId),
        services: [],
        totalValue: 0,
      };
    }
    
    acc[professionalId].services.push(service);
    acc[professionalId].totalValue += service.valorServicos || 0;
    return acc;
  }, {} as Record<number, { professional?: Professional; services: SupabaseService[]; totalValue: number }>);

  // Filter services by professional
  const filteredServices = selectedProfessional === "all" 
    ? services 
    : services.filter(s => s.idProfissional?.toString() === selectedProfessional);

  const handleViewServices = (professionalId: number, professionalName: string) => {
    const professionalServices = services.filter(s => s.idProfissional === professionalId);
    setSelectedProfessionalServices(professionalServices);
    setSelectedProfessionalName(professionalName);
    setIsServicesPopupOpen(true);
  };

  const onSubmit = (data: ServiceFormData) => {
    if (editingService) {
      updateService.mutate({ id: editingService.id, data });
    } else {
      createService.mutate(data);
    }
  };

  const handleEdit = (service: SupabaseService) => {
    setEditingService(service);
    form.reset({
      servicos: service.servicos,
      valorServicos: service.valorServicos || 0,
      idProfissional: service.idProfissional || undefined,
      id_Empresa: service.id_Empresa || 1,
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingService(null);
    form.reset({
      servicos: "",
      valorServicos: 0,
      idProfissional: undefined,
      id_Empresa: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando serviços...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar serviços. Tente novamente.
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
            Gerenciamento de Serviços
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administração dos serviços médicos oferecidos pela clínica
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
            <Button
              variant={viewMode === "grouped" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grouped")}
              className="rounded-r-none"
            >
              <Users className="h-4 w-4 mr-2" />
              Agrupado
            </Button>
            <Button
              variant={viewMode === "detailed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("detailed")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4 mr-2" />
              Detalhado
            </Button>
          </div>
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Editar Serviço" : "Novo Serviço"}
                </DialogTitle>
                <DialogDescription>
                  {editingService ? "Atualize as informações do serviço" : "Cadastre um novo serviço médico"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="servicos">Nome do Serviço *</Label>
                    <Input
                      id="servicos"
                      {...form.register("servicos")}
                      placeholder="Ex: Consulta Dermatológica"
                    />
                    {form.formState.errors.servicos && (
                      <p className="text-sm text-red-600">{form.formState.errors.servicos.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="valorServicos">Valor (R$)</Label>
                    <Input
                      id="valorServicos"
                      type="number"
                      step="0.01"
                      {...form.register("valorServicos", { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                    {form.formState.errors.valorServicos && (
                      <p className="text-sm text-red-600">{form.formState.errors.valorServicos.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="idProfissional">Profissional</Label>
                    <Select
                      value={form.watch("idProfissional")?.toString() || "none"}
                      onValueChange={(value) => 
                        form.setValue("idProfissional", value === "none" ? undefined : parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum profissional específico</SelectItem>
                        {professionals.map((professional) => (
                          <SelectItem key={professional.id} value={professional.id.toString()}>
                            {professional.name} - {professional.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createService.isPending || updateService.isPending}
                  >
                    {(createService.isPending || updateService.isPending) ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {editingService ? "Atualizar" : "Cadastrar"}
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
              Sistema conectado ao cadastro de serviços
            </span>
            <Badge variant="secondary" className="ml-auto">
              {services.length} serviços
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Serviços</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalServices}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Profissionais</p>
                <p className="text-2xl font-bold text-purple-600">{stats.professionalCount}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Filtrar por Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedProfessional === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProfessional("all")}
            >
              Todos ({services.length})
            </Button>
            {professionals.map((professional) => {
              const count = services.filter(s => s.idProfissional === professional.id).length;
              return (
                <Button
                  key={professional.id}
                  variant={selectedProfessional === professional.id.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProfessional(professional.id.toString())}
                >
                  {professional.name} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Serviços Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(viewMode === "detailed" ? filteredServices : Object.values(groupedServices)).length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum serviço encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profissional</TableHead>
                    {viewMode === "detailed" ? (
                      <>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Ações</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Quantidade de Serviços</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Ações</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewMode === "detailed" ? (
                    // Detailed view - show all services
                    filteredServices.map((service) => {
                      const professional = professionals.find(p => p.id === service.idProfissional);
                      return (
                        <TableRow key={service.id}>
                          <TableCell>
                            {professional ? (
                              <div>
                                <div className="font-medium">{professional.name}</div>
                                <div className="text-sm text-gray-500">{professional.specialty}</div>
                              </div>
                            ) : (
                              <span className="text-gray-500">Não especificado</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{service.servicos}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              R$ {(service.valorServicos || 0).toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(service.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(service)}
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
                                      Tem certeza que deseja remover o serviço <strong>{service.servicos}</strong> 
                                      do sistema? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteService.mutate(service.id)}
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
                      );
                    })
                  ) : (
                    // Grouped view - show one row per professional
                    Object.entries(groupedServices).map(([professionalId, group]) => (
                      <TableRow key={professionalId}>
                        <TableCell>
                          {group.professional ? (
                            <div>
                              <div className="font-medium">{group.professional.name}</div>
                              <div className="text-sm text-gray-500">{group.professional.specialty}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Profissional não encontrado</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {group.services.length} serviço{group.services.length !== 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            R$ {group.totalValue.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewServices(parseInt(professionalId), group.professional?.name || "Profissional")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Serviços
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Popup Dialog */}
      <Dialog open={isServicesPopupOpen} onOpenChange={setIsServicesPopupOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Serviços de {selectedProfessionalName}</DialogTitle>
            <DialogDescription>
              Lista completa dos serviços oferecidos por este profissional
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProfessionalServices.length === 0 ? (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum serviço encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProfessionalServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.servicos}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            R$ {(service.valorServicos || 0).toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(service.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleEdit(service);
                                setIsServicesPopupOpen(false);
                              }}
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
                                    Tem certeza que deseja remover o serviço <strong>{service.servicos}</strong> 
                                    do sistema? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      deleteService.mutate(service.id);
                                      setIsServicesPopupOpen(false);
                                    }}
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}