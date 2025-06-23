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
  idEmpresa: number | null;
  createdAt: string;
}

// Form validation schema for specialties
const specialtySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
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
      console.log("Mutation started with data:", data);
      const response = await fetch("/api/supabase/especialidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        throw new Error(errorData.message || "Erro ao criar especialidade");
      }
      const result = await response.json();
      console.log("Success response:", result);
      return result;
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
      idEmpresa: 1,
    },
  });

  const onSubmit = (data: SpecialtyFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Editing specialty:", editingSpecialty);
    
    if (editingSpecialty) {
      console.log("Updating specialty with ID:", editingSpecialty.id);
      updateSpecialty.mutate({ id: editingSpecialty.id, data });
    } else {
      console.log("Creating new specialty");
      createSpecialty.mutate(data);
    }
  };

  const handleEdit = (specialty: SupabaseSpecialty) => {
    setEditingSpecialty(specialty);
    form.reset({
      name: specialty.name,
      idEmpresa: specialty.idEmpresa || 1,
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log("Closing dialog");
    setIsAddDialogOpen(false);
    setEditingSpecialty(null);
    form.reset({
      name: "",
      idEmpresa: 1,
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setEditingSpecialty(null);
      form.reset({
        name: "",
        idEmpresa: 1,
      });
    }
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
          <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
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
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Especialidade *</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Ex: Cardiologia, Dermatologia, Ginecologia, etc."
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                    )}
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
                    <TableHead>Nome da Especialidade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specialties.map((specialty) => (
                    <TableRow key={specialty.id}>
                      <TableCell className="font-medium">{specialty.id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{specialty.name}</Badge>
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