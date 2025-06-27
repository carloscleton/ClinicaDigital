import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  UserCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Filter,
  Phone,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/image-upload";

// Professional interface
interface Professional {
  id: number;
  name: string;
  specialty: string;
  specialtyId?: number | null;
  crm: string;
  phone: string;
  email: string;
  sexo: string;
  atendimentos?: string;
  photo?: string;
}

// Specialty interface
interface Specialty {
  id: number;
  name: string;
}

// Form validation schema
const professionalSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  specialtyId: z.number().optional(),
  crm: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  sexo: z.string().min(1, "Sexo é obrigatório"),
  atendimentos: z.string().optional(),
  photo: z.string().optional(),
});

type ProfessionalFormData = z.infer<typeof professionalSchema>;

export default function ProfessionalsCrudGrid() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch professionals
  const { data: professionals = [], isLoading, error, refetch } = useQuery<Professional[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  // Fetch specialties
  const { data: specialties = [] } = useQuery<Specialty[]>({
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
      }
    },
  });

  // Create professional mutation
  const createProfessional = useMutation({
    mutationFn: async (data: ProfessionalFormData) => {
      const response = await fetch("/api/supabase/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao criar profissional");
      return response.json();
    },
    onSuccess: () => {
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
      const response = await fetch(`/api/supabase/professionals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar profissional");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/professionals"] });
      setIsAddDialogOpen(false);
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
      const response = await fetch(`/api/supabase/professionals/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao deletar profissional");
      return response.json();
    },
    onSuccess: () => {
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
      phone: "",
      email: "",
      atendimentos: "",
      photo: "",
      sexo: "",
      specialtyId: undefined,
    },
  });

  // Filter professionals
  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.crm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = 
      filterSpecialty === "all" || 
      professional.specialty === filterSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  // Handle form submission
  const onSubmit = (data: ProfessionalFormData) => {
    if (editingProfessional) {
      updateProfessional.mutate({ id: editingProfessional.id, data });
    } else {
      createProfessional.mutate(data);
    }
  };

  // Handle edit professional
  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    
    // Find the specialty ID
    const specialtyItem = specialties.find(s => s.name === professional.specialty);
    
    form.reset({
      name: professional.name,
      specialty: professional.specialty,
      specialtyId: professional.specialtyId || specialtyItem?.id,
      crm: professional.crm || "",
      phone: professional.phone || "",
      email: professional.email || "",
      atendimentos: professional.atendimentos || "",
      photo: professional.photo || "",
      sexo: professional.sexo || "",
    });
    setIsAddDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingProfessional(null);
    form.reset({
      name: "",
      specialty: "",
      crm: "",
      phone: "",
      email: "",
      atendimentos: "",
      photo: "",
      sexo: "",
      specialtyId: undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Profissionais
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cadastro e gerenciamento de médicos e especialistas
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <div>
                  <ImageUpload
                    label="Foto do Profissional"
                    value={form.watch("photo") || ""}
                    onChange={(value) => form.setValue("photo", value)}
                    placeholder="Adicione uma foto profissional (PNG, JPG até 5MB)"
                  />
                </div>

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
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Select 
                      onValueChange={(value) => form.setValue("sexo", value)}
                      defaultValue={form.watch("sexo")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.sexo && (
                      <p className="text-sm text-red-600">{form.formState.errors.sexo.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="specialty">Especialidade *</Label>
                    <Select 
                      onValueChange={(value) => {
                        // Atualiza o campo de especialidade com o nome
                        const specialty = specialties.find(s => s.id.toString() === value);
                        if (specialty) {
                          form.setValue("specialty", specialty.name);
                          form.setValue("specialtyId", specialty.id);
                        }
                      }}
                      defaultValue={
                        editingProfessional && form.watch("specialtyId") 
                          ? form.watch("specialtyId").toString() 
                          : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties
                          .filter(specialty => specialty.name && specialty.name.trim() !== "")
                          .map((specialty) => (
                            <SelectItem key={specialty.id} value={specialty.id.toString()}>
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
                      placeholder="Ex: 12345-SP"
                    />
                    {form.formState.errors.crm && (
                      <p className="text-sm text-red-600">{form.formState.errors.crm.message}</p>
                    )}
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
                </div>

                <div>
                  <Label htmlFor="atendimentos">Horários de Atendimento</Label>
                  <textarea
                    id="atendimentos"
                    {...form.register("atendimentos")}
                    placeholder="🕒 Dias e Horários de Atendimento - para uso interno do sistema de marcação
Segunda: 8h:00 às 13h00
Terça: 14h:00 às 18h00
Quarta: ❌ Agenda Fechada
Quinta: ❌ Agenda Fechada
Sexta: ❌ Agenda Fechada
Sábado: 9h00 às 13h00
Domingo: ❌ Fechado
Duração da Consulta: 60 Minutos (Obrigatório)
Intervalo entre Pacientes para atendimento: 5 minutos
intervalo para o almoço: 12 às 13h00"
                    className="w-full h-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
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

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Buscar Profissional</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome, especialidade ou CRM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Filtrar por Especialidade</Label>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as especialidades</SelectItem>
                  {Array.from(new Set(professionals.map(p => p.specialty)))
                    .filter(specialty => specialty && specialty.trim() !== "")
                    .sort()
                    .map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professionals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Profissionais Cadastrados ({filteredProfessionals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-red-600">
              <XCircle className="h-12 w-12 mx-auto mb-2" />
              <p>Erro ao carregar profissionais. Verifique a conexão.</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 mx-auto mb-2 animate-spin text-blue-600" />
              <p>Carregando profissionais...</p>
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum profissional encontrado</p>
              {searchTerm || filterSpecialty !== "all" ? (
                <p className="text-sm mt-2">Tente ajustar os filtros de busca</p>
              ) : (
                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Profissional
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessionals.map((professional) => {
                    // Fotos fictícias para usar na tabela
                    const doctorPhotos = [
                      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=40&h=40&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=40&h=40&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1594824475720-aabd8effc566?w=40&h=40&fit=crop&crop=face"
                    ];
                    const photoIndex = professional.id % doctorPhotos.length;
                    
                    return (
                      <TableRow key={professional.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <img
                                src={professional.photo || doctorPhotos[photoIndex]}
                                alt={`Foto de ${professional.name}`}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                              />
                              {!professional.photo && (
                                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                                  <span className="text-white text-[8px] font-medium">F</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{professional.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{professional.specialty}</Badge>
                        </TableCell>
                        <TableCell>{professional.crm || "—"}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {professional.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <span>{professional.phone}</span>
                              </div>
                            )}
                            {professional.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-500" />
                                <span>{professional.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{professional.sexo || "—"}</TableCell>
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}