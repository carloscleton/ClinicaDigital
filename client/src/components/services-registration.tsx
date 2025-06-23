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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope, Plus, Edit, Trash2, DollarSign, RefreshCw, Loader2, CheckCircle, XCircle, Database, Clock, User, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Service interface for Supabase data
interface SupabaseService {
  id: number;
  nome: string;
  descricao: string | null;
  valor: number;
  duracao: number | null;
  categoria: string;
  ativo: boolean;
  requisitos: string | null;
  id_Profissional: number | null;
  created_at: string;
  updated_at: string;
  // Professional relationship
  professional?: {
    id: number;
    nome: string;
    especialidade: string;
  };
}

// Professional interface for dropdown
interface Professional {
  id: number;
  nome: string;
  especialidade: string;
}

// Form validation schema
const serviceSchema = z.object({
  nome: z.string().min(2, "Nome do serviço deve ter pelo menos 2 caracteres"),
  descricao: z.string().optional(),
  valor: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  duracao: z.number().min(15, "Duração deve ser pelo menos 15 minutos").optional(),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  requisitos: z.string().optional(),
  id_Profissional: z.number().optional(),
  ativo: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

// Service categories
const serviceCategories = [
  "Consulta",
  "Exame",
  "Procedimento",
  "Cirurgia",
  "Terapia",
  "Diagnóstico",
  "Prevenção",
  "Emergência"
];

export default function ServicesRegistration() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<SupabaseService | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Form setup
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      valor: 0,
      duracao: 30,
      categoria: "",
      requisitos: "",
      ativo: true,
    },
  });

  // Fetch services
  const { data: services = [], isLoading, error, refetch } = useQuery<SupabaseService[]>({
    queryKey: ["/api/supabase/services"],
  });

  // Fetch professionals for dropdown
  const { data: professionals = [] } = useQuery<Professional[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  // Test connection mutation
  const testConnection = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/supabase/test');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.connected) {
        toast({
          title: "Conexão bem-sucedida",
          description: "Sistema conectado ao cadastro de serviços",
        });
        refetch();
      }
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar serviço");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/services"] });
      toast({
        title: "Serviço criado",
        description: "Serviço cadastrado com sucesso",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar serviço");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/services"] });
      toast({
        title: "Serviço atualizado",
        description: "Serviço atualizado com sucesso",
      });
      setEditingService(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao excluir serviço");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/services"] });
      toast({
        title: "Serviço excluído",
        description: "Serviço removido com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
      nome: service.nome,
      descricao: service.descricao || "",
      valor: service.valor,
      duracao: service.duracao || 30,
      categoria: service.categoria,
      requisitos: service.requisitos || "",
      id_Profissional: service.id_Profissional || undefined,
      ativo: service.ativo,
    });
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingService(null);
    form.reset();
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const categoryMatch = selectedCategory === "all" || service.categoria === selectedCategory;
    const professionalMatch = selectedProfessional === "all" || 
      (selectedProfessional === "unassigned" && !service.id_Profissional) ||
      service.id_Profissional?.toString() === selectedProfessional;
    return categoryMatch && professionalMatch;
  });

  // Statistics
  const stats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.ativo).length,
    categories: new Set(services.map(s => s.categoria)).size,
    assignedServices: services.filter(s => s.id_Profissional).length,
    totalRevenue: services.reduce((sum, s) => sum + s.valor, 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando serviços...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700 dark:text-red-400">
          Erro ao carregar serviços. Verifique a conexão.
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => testConnection.mutate()}
            disabled={testConnection.isPending}
          >
            {testConnection.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Testar Conexão
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cadastro de Serviços</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os serviços médicos da clínica
          </p>
        </div>
        <Dialog open={isAddDialogOpen || !!editingService} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Serviço" : "Novo Serviço"}
              </DialogTitle>
              <DialogDescription>
                {editingService ? "Atualize as informações do serviço" : "Cadastre um novo serviço médico"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nome">Nome do Serviço</Label>
                  <Input
                    id="nome"
                    {...form.register("nome")}
                    placeholder="Ex: Consulta Cardiológica"
                  />
                  {form.formState.errors.nome && (
                    <p className="text-sm text-red-600">{form.formState.errors.nome.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={form.watch("categoria")}
                    onValueChange={(value) => form.setValue("categoria", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoria && (
                    <p className="text-sm text-red-600">{form.formState.errors.categoria.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    {...form.register("valor", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.valor && (
                    <p className="text-sm text-red-600">{form.formState.errors.valor.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="duracao">Duração (minutos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    {...form.register("duracao", { valueAsNumber: true })}
                    placeholder="30"
                  />
                  {form.formState.errors.duracao && (
                    <p className="text-sm text-red-600">{form.formState.errors.duracao.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="id_Profissional">Profissional Responsável</Label>
                  <Select
                    value={form.watch("id_Profissional")?.toString() || ""}
                    onValueChange={(value) => form.setValue("id_Profissional", value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum profissional</SelectItem>
                      {professionals.map((professional) => (
                        <SelectItem key={professional.id} value={professional.id.toString()}>
                          {professional.nome} - {professional.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    {...form.register("descricao")}
                    placeholder="Descrição detalhada do serviço..."
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="requisitos">Requisitos/Preparos</Label>
                  <Textarea
                    id="requisitos"
                    {...form.register("requisitos")}
                    placeholder="Instruções de preparo ou requisitos especiais..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createService.isPending || updateService.isPending}
                >
                  {(createService.isPending || updateService.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingService ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{stats.totalServices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ativos</p>
                <p className="text-2xl font-bold">{stats.activeServices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categorias</p>
                <p className="text-2xl font-bold">{stats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Atribuídos</p>
                <p className="text-2xl font-bold">{stats.assignedServices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receita</p>
                <p className="text-xl font-bold">R$ {stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <Label>Categoria</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Profissional</Label>
          <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="unassigned">Não atribuídos</SelectItem>
              {professionals.map((professional) => (
                <SelectItem key={professional.id} value={professional.id.toString()}>
                  {professional.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Cadastrados ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.categoria}</Badge>
                  </TableCell>
                  <TableCell>R$ {service.valor.toLocaleString()}</TableCell>
                  <TableCell>{service.duracao || "N/A"} min</TableCell>
                  <TableCell>
                    {service.professional ? (
                      <span className="text-sm">
                        {service.professional.nome}
                        <br />
                        <span className="text-gray-500">{service.professional.especialidade}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.ativo ? "default" : "secondary"}>
                      {service.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o serviço "{service.nome}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteService.mutate(service.id)}
                            >
                              Confirmar
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
        </CardContent>
      </Card>
    </div>
  );
}