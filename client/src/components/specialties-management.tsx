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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Plus, Edit, Trash2, Users, RefreshCw, Loader2, CheckCircle, XCircle, Database, UserCheck, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


// Professional interface for Supabase data
interface SupabaseProfessional {
  id: number;
  name: string;
  specialty: string;
  crm: string;
  description: string;
  experience: string;
  phone: string;
  email: string;
}

// Statistics interface
interface SpecialtyStats {
  totalProfessionals: number;
  specialties: string[];
  professionalsBySpecialty: Record<string, SupabaseProfessional[]>;
}

// Form validation schema for adding new professionals
const professionalSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  crm: z.string().optional(),
  description: z.string().optional(),
  experience: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

type ProfessionalFormData = z.infer<typeof professionalSchema>;



export default function ProfessionalsManagementWithSupabase() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<SupabaseProfessional | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch professionals from Supabase
  const { data: professionals = [], isLoading, error, refetch } = useQuery<SupabaseProfessional[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  // Fetch specialties from CAD_Especialidade table
  const { data: supabaseSpecialties = [], refetch: refetchSpecialties } = useQuery<{id: number, name: string}[]>({
    queryKey: ["/api/supabase/especialidades"],
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
          description: "Sistema conectado ao cadastro de profissionais",
        });
        refetch();
        refetchSpecialties();
      }
    },
  });

  // Create professional mutation
  const createProfessional = useMutation({
    mutationFn: async (data: ProfessionalFormData) => {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao criar profissional");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/professionals"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Profissional adicionado",
        description: "Novo profissional cadastrado com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar profissional",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Update professional mutation
  const updateProfessional = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProfessionalFormData }) => {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar profissional");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/professionals"] });
      setEditingProfessional(null);
      toast({
        title: "Profissional atualizado",
        description: "Dados do profissional atualizados com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar profissional",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Delete professional mutation
  const deleteProfessional = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao deletar profissional");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/professionals"] });
      toast({
        title: "Profissional removido",
        description: "Profissional removido do sistema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover profissional",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Form setup
  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: "",
      specialty: "",
      crm: "",
      description: "",
      experience: "",
      phone: "",
      email: "",
    },
  });

  // Calculate statistics
  const stats: SpecialtyStats = {
    totalProfessionals: professionals.length,
    specialties: Array.from(new Set(professionals.map(p => p.specialty))),
    professionalsBySpecialty: professionals.reduce((acc, prof) => {
      if (!acc[prof.specialty]) acc[prof.specialty] = [];
      acc[prof.specialty].push(prof);
      return acc;
    }, {} as Record<string, SupabaseProfessional[]>),
  };

  // Filter professionals by selected specialty
  const filteredProfessionals = selectedSpecialty === "all" 
    ? professionals 
    : professionals.filter(p => p.specialty === selectedSpecialty);

  const onSubmit = (data: ProfessionalFormData) => {
    if (editingProfessional) {
      updateProfessional.mutate({ id: editingProfessional.id, data });
    } else {
      createProfessional.mutate(data);
    }
  };

  const handleEdit = (professional: SupabaseProfessional) => {
    setEditingProfessional(professional);
    form.reset({
      name: professional.name,
      specialty: professional.specialty,
      crm: professional.crm || "",
      description: professional.description || "",
      experience: professional.experience || "",
      phone: professional.phone || "",
      email: professional.email || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingProfessional(null);
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Carregando especialidades...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Profissionais da Clínica
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerenciamento completo dos profissionais e suas especialidades
          </p>
        </div>
        <div className="flex gap-2">
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
          <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Profissional
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProfessional ? "Editar Profissional" : "Novo Profissional"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Ex: Dr. João Silva"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="specialty">Especialidade *</Label>
                    <Select 
                      onValueChange={(value) => form.setValue("specialty", value)}
                      defaultValue={editingProfessional?.specialty || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {supabaseSpecialties.map((specialty) => (
                          <SelectItem key={specialty.id} value={specialty.name}>
                            {specialty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.specialty && (
                      <p className="text-sm text-red-600">{form.formState.errors.specialty.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="crm">CRM</Label>
                    <Input
                      id="crm"
                      {...form.register("crm")}
                      placeholder="Ex: CRM/CE 12345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="profissional@exemplo.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      {...form.register("phone")}
                      placeholder="(85) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experiência</Label>
                    <Input
                      id="experience"
                      {...form.register("experience")}
                      placeholder="Ex: 10 anos"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Informações adicionais sobre o profissional"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createProfessional.isPending || updateProfessional.isPending}
                  >
                    {(createProfessional.isPending || updateProfessional.isPending) ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {editingProfessional ? "Atualizar" : "Cadastrar"}
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
              Sistema conectado ao cadastro de profissionais
            </span>
            <Badge variant="secondary" className="ml-auto">
              {professionals.length} profissionais
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Profissionais</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalProfessionals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Especialidades</p>
                <p className="text-2xl font-bold text-green-600">{stats.specialties.length}</p>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dermatologistas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.professionalsBySpecialty["Dermatologista"]?.length || 0}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cardiologistas</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.professionalsBySpecialty["Cardiologista"]?.length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specialty Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Filtrar por Especialidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSpecialty === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty("all")}
            >
              Todas ({professionals.length})
            </Button>
            {stats.specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty} ({stats.professionalsBySpecialty[specialty]?.length || 0})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professionals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profissionais {selectedSpecialty !== "all" && `- ${selectedSpecialty}`} ({filteredProfessionals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                Erro ao carregar profissionais. Verifique a conexão.
              </AlertDescription>
            </Alert>
          ) : filteredProfessionals.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum profissional encontrado</p>
              {selectedSpecialty !== "all" && (
                <p className="text-sm">para a especialidade {selectedSpecialty}</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessionals.map((professional) => (
                    <TableRow key={professional.id}>
                      <TableCell className="font-medium">{professional.id}</TableCell>
                      <TableCell>{professional.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{professional.specialty}</Badge>
                      </TableCell>
                      <TableCell>{professional.crm || "—"}</TableCell>
                      <TableCell>{professional.email || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(professional)}
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
                                  Tem certeza que deseja remover <strong>{professional.name}</strong> 
                                  ({professional.specialty}) do sistema? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProfessional.mutate(professional.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}