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
import { Heart, Plus, Edit, Trash2, RefreshCw, Loader2, CheckCircle, XCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Specialty interface for Supabase CAD_Especialidade data
interface SupabaseSpecialty {
  id: number;
  name: string;
  descricao?: string;
  codigo?: string;
  area_medica?: string;
  requisitos?: string;
  duracao_media_consulta?: number;
  valor_consulta?: number;
  ativo?: boolean;
  idEmpresa: number | null;
  createdAt: string;
}

// Form validation schema for specialties
const specialtySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().optional(),
  codigo: z.string().optional(),
  area_medica: z.string().min(1, "Área médica é obrigatória"),
  requisitos: z.string().optional(),
  duracao_media_consulta: z.number().min(15, "Duração mínima de 15 minutos").max(300, "Duração máxima de 300 minutos").optional(),
  valor_consulta: z.number().min(0, "Valor deve ser positivo").optional(),
  ativo: z.boolean().default(true),
  idEmpresa: z.number().optional(),
});

type SpecialtyFormData = z.infer<typeof specialtySchema>;

export default function SpecialtiesCRUD() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<SupabaseSpecialty | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch specialties from CAD_Especialidade table
  const { data: specialties = [], isLoading, error, refetch } = useQuery<SupabaseSpecialty[]>({
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
          description: "Sistema conectado ao banco de especialidades",
        });
        refetch();
      }
    },
  });

  // Create specialty mutation
  const createSpecialty = useMutation({
    mutationFn: async (data: SpecialtyFormData) => {
      const response = await fetch("/api/supabase/especialidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar especialidade");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/especialidades"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Especialidade criada",
        description: "Nova especialidade cadastrada com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar especialidade",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Update specialty mutation
  const updateSpecialty = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SpecialtyFormData }) => {
      const response = await fetch(`/api/supabase/especialidades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar especialidade");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/especialidades"] });
      setEditingSpecialty(null);
      toast({
        title: "Especialidade atualizada",
        description: "Dados da especialidade atualizados com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar especialidade",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Delete specialty mutation
  const deleteSpecialty = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/supabase/especialidades/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar especialidade");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supabase/especialidades"] });
      toast({
        title: "Especialidade removida",
        description: "Especialidade removida do sistema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover especialidade",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Form setup
  const form = useForm<SpecialtyFormData>({
    resolver: zodResolver(specialtySchema),
    defaultValues: {
      name: "",
      descricao: "",
      codigo: "",
      area_medica: "",
      requisitos: "",
      duracao_media_consulta: 30,
      valor_consulta: 150,
      ativo: true,
      idEmpresa: 1,
    },
  });

  const onSubmit = (data: SpecialtyFormData) => {
    if (editingSpecialty) {
      updateSpecialty.mutate({ id: editingSpecialty.id, data });
    } else {
      createSpecialty.mutate(data);
    }
  };

  const handleEdit = (specialty: SupabaseSpecialty) => {
    setEditingSpecialty(specialty);
    form.reset({
      name: specialty.name,
      descricao: specialty.descricao || "",
      codigo: specialty.codigo || "",
      area_medica: specialty.area_medica || "",
      requisitos: specialty.requisitos || "",
      duracao_media_consulta: specialty.duracao_media_consulta || 30,
      valor_consulta: specialty.valor_consulta || 150,
      ativo: specialty.ativo !== false,
      idEmpresa: specialty.idEmpresa || 1,
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingSpecialty(null);
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
            Especialidades Médicas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerenciamento das especialidades médicas oferecidas pela clínica
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
                Nova Especialidade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSpecialty ? "Editar Especialidade" : "Nova Especialidade"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Nome da Especialidade *</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Ex: Cardiologia, Dermatologia, etc."
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="codigo">Código da Especialidade</Label>
                    <Input
                      id="codigo"
                      {...form.register("codigo")}
                      placeholder="Ex: CARD, DERMA, GINE"
                    />
                  </div>

                  <div>
                    <Label htmlFor="area_medica">Área Médica *</Label>
                    <Input
                      id="area_medica"
                      {...form.register("area_medica")}
                      placeholder="Ex: Clínica Médica, Área Cirúrgica"
                      list="areas-medicas"
                    />
                    <datalist id="areas-medicas">
                      <option value="Clínica Médica" />
                      <option value="Área Cirúrgica" />
                      <option value="Medicina Diagnóstica" />
                      <option value="Medicina Terapêutica" />
                      <option value="Medicina Preventiva" />
                      <option value="Medicina Especializada" />
                      <option value="Medicina de Emergência" />
                    </datalist>
                    {form.formState.errors.area_medica && (
                      <p className="text-sm text-red-600">{form.formState.errors.area_medica.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="duracao_media_consulta">Duração Média (minutos)</Label>
                    <Input
                      id="duracao_media_consulta"
                      type="number"
                      {...form.register("duracao_media_consulta", { valueAsNumber: true })}
                      placeholder="30"
                      min="15"
                      max="300"
                    />
                    {form.formState.errors.duracao_media_consulta && (
                      <p className="text-sm text-red-600">{form.formState.errors.duracao_media_consulta.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="valor_consulta">Valor Padrão (R$)</Label>
                    <Input
                      id="valor_consulta"
                      type="number"
                      step="0.01"
                      {...form.register("valor_consulta", { valueAsNumber: true })}
                      placeholder="150.00"
                      min="0"
                    />
                    {form.formState.errors.valor_consulta && (
                      <p className="text-sm text-red-600">{form.formState.errors.valor_consulta.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      {...form.register("descricao")}
                      placeholder="Descrição detalhada da especialidade médica..."
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="requisitos">Requisitos e Preparos</Label>
                    <Textarea
                      id="requisitos"
                      {...form.register("requisitos")}
                      placeholder="Requisitos específicos para consultas desta especialidade..."
                      rows={2}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ativo"
                        {...form.register("ativo")}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="ativo">Especialidade ativa</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createSpecialty.isPending || updateSpecialty.isPending}
                  >
                    {(createSpecialty.isPending || updateSpecialty.isPending) ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {editingSpecialty ? "Atualizar" : "Cadastrar"}
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
              Sistema conectado ao cadastro de especialidades
            </span>
            <Badge variant="secondary" className="ml-auto">
              {specialties.length} especialidades
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Especialidades</p>
              <p className="text-2xl font-bold text-blue-600">{specialties.length}</p>
            </div>
            <Heart className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* Specialties Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Especialidades Cadastradas ({specialties.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                Erro ao carregar especialidades. Verifique a conexão.
              </AlertDescription>
            </Alert>
          ) : specialties.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma especialidade cadastrada</p>
              <p className="text-sm">Clique em "Nova Especialidade" para começar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Área Médica</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specialties.map((specialty) => (
                    <TableRow key={specialty.id}>
                      <TableCell className="font-medium">{specialty.id}</TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="secondary">{specialty.name}</Badge>
                          {specialty.descricao && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {specialty.descricao}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {specialty.codigo ? (
                          <Badge variant="outline">{specialty.codigo}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {specialty.area_medica ? (
                          <span className="text-sm">{specialty.area_medica}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {specialty.duracao_media_consulta ? (
                          <span className="text-sm">{specialty.duracao_media_consulta} min</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {specialty.valor_consulta ? (
                          <span className="text-sm font-medium text-green-600">
                            R$ {specialty.valor_consulta.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={specialty.ativo !== false ? "default" : "secondary"}>
                          {specialty.ativo !== false ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(specialty)}
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
                                  Tem certeza que deseja excluir a especialidade <strong>{specialty.name}</strong>? 
                                  Esta ação não pode ser desfeita e pode afetar profissionais vinculados a esta especialidade.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteSpecialty.mutate(specialty.id)}
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