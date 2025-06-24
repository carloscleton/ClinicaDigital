import { useState, useEffect } from "react";
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
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  FileText, Plus, Edit, Trash2, Search, 
  RefreshCw, Loader2, CheckCircle, XCircle, 
  Calendar, Clock, User, Stethoscope, 
  Heart, Activity, PlusCircle, MinusCircle,
  Printer, Download, ExternalLink, FilePlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Interfaces
interface MedicalRecord {
  id: string;
  id_paciente: number;
  id_profissional: number;
  data_consulta: string;
  queixa_principal: string;
  historia_doenca: string;
  sinais_vitais: {
    pressao_arterial?: string;
    frequencia_cardiaca?: number;
    temperatura?: number;
    saturacao?: number;
    peso?: number;
    altura?: number;
    imc?: number;
    outros?: Record<string, any>;
  };
  exame_fisico: string;
  diagnostico: string;
  plano_tratamento: string;
  medicamentos: Array<{
    nome: string;
    dosagem: string;
    posologia: string;
    duracao: string;
  }>;
  exames_solicitados: string[];
  retorno: string | null;
  observacoes: string;
  created_at: string;
  updated_at: string;
  paciente?: {
    id: number;
    nomeCliente: string;
    telefoneCliente: string;
    emailCliente: string;
    nascimentoCliente: string | null;
  };
  profissional?: {
    id: number;
    Profissional: string;
    Profissao: string;
  };
}

interface Patient {
  id: number;
  nomeCliente: string;
  telefoneCliente: string;
  emailCliente: string;
  nascimentoCliente: string | null;
  CPF: string | null;
}

interface Professional {
  id: number;
  name: string;
  specialty: string;
}

// Validation schema for medical record form
const medicationSchema = z.object({
  nome: z.string().min(1, "Nome do medicamento é obrigatório"),
  dosagem: z.string().min(1, "Dosagem é obrigatória"),
  posologia: z.string().min(1, "Posologia é obrigatória"),
  duracao: z.string()
});

const sinaisVitaisSchema = z.object({
  pressao_arterial: z.string().optional(),
  frequencia_cardiaca: z.number().min(0).max(300).optional(),
  temperatura: z.number().min(32).max(45).optional(),
  saturacao: z.number().min(0).max(100).optional(),
  peso: z.number().min(0).max(500).optional(),
  altura: z.number().min(0).max(3).optional(),
  imc: z.number().min(0).max(100).optional()
});

const medicalRecordSchema = z.object({
  id_paciente: z.number(),
  id_profissional: z.number(),
  data_consulta: z.string().refine(val => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: "Data inválida" }),
  queixa_principal: z.string().min(1, "Queixa principal é obrigatória"),
  historia_doenca: z.string().optional(),
  sinais_vitais: sinaisVitaisSchema,
  exame_fisico: z.string().optional(),
  diagnostico: z.string().min(1, "Diagnóstico é obrigatório"),
  plano_tratamento: z.string(),
  medicamentos: z.array(medicationSchema),
  exames_solicitados: z.array(z.string()),
  retorno: z.string().nullable(),
  observacoes: z.string().optional()
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

export default function MedicalRecordsManagement() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Form setup
  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      id_paciente: 0,
      id_profissional: 0,
      data_consulta: new Date().toISOString().split('T')[0],
      queixa_principal: "",
      historia_doenca: "",
      sinais_vitais: {
        pressao_arterial: "",
        frequencia_cardiaca: 0,
        temperatura: 36.5,
        saturacao: 97,
        peso: 0,
        altura: 0,
        imc: 0
      },
      exame_fisico: "",
      diagnostico: "",
      plano_tratamento: "",
      medicamentos: [],
      exames_solicitados: [],
      retorno: null,
      observacoes: ""
    }
  });

  // Setup field array for medications
  const { fields: medicamentoFields, append: appendMedicamento, remove: removeMedicamento } = 
    useFieldArray({
      control: form.control,
      name: "medicamentos"
    });

  // Setup field array for exam requests
  const { fields: exameFields, append: appendExame, remove: removeExame } = 
    useFieldArray({
      control: form.control,
      name: "exames_solicitados"
    });

  // Fetch patients data
  const { data: patients = [], isLoading: isLoadingPatients, refetch: refetchPatients } = useQuery<Patient[]>({
    queryKey: ["/api/supabase/patients"],
    enabled: true
  });

  // Fetch professionals data
  const { data: professionals = [], isLoading: isLoadingProfessionals } = useQuery<Professional[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  // Fetch medical records data
  const { data: medicalRecords = [], isLoading: isLoadingRecords, refetch: refetchRecords } = useQuery<MedicalRecord[]>({
    queryKey: ["/api/medical-records"],
    queryFn: async () => {
      // Mock data for demonstration - replace with actual API call
      return [
        {
          id: "1",
          id_paciente: 1,
          id_profissional: 1,
          data_consulta: "2025-06-15T10:00:00",
          queixa_principal: "Dor de cabeça e tontura",
          historia_doenca: "Paciente relata dor de cabeça há 3 dias, acompanhada de tontura ao se levantar.",
          sinais_vitais: {
            pressao_arterial: "120/80",
            frequencia_cardiaca: 75,
            temperatura: 36.5,
            saturacao: 98,
            peso: 70,
            altura: 1.70,
            imc: 24.2
          },
          exame_fisico: "Paciente em bom estado geral, lúcido e orientado. Ausculta cardíaca e pulmonar normais.",
          diagnostico: "Enxaqueca tensional",
          plano_tratamento: "Repouso, hidratação e medicação conforme prescrição.",
          medicamentos: [
            {
              nome: "Dipirona",
              dosagem: "500mg",
              posologia: "1 comprimido a cada 6 horas se dor",
              duracao: "5 dias"
            },
            {
              nome: "Metoclopramida",
              dosagem: "10mg",
              posologia: "1 comprimido a cada 8 horas se náusea",
              duracao: "3 dias"
            }
          ],
          exames_solicitados: ["Hemograma completo", "Glicemia em jejum"],
          retorno: "2025-06-30",
          observacoes: "Paciente orientado a retornar se sintomas piorarem.",
          created_at: "2025-06-15T10:30:00",
          updated_at: "2025-06-15T10:30:00",
          paciente: {
            id: 1,
            nomeCliente: "Maria Silva",
            telefoneCliente: "(85) 99999-9999",
            emailCliente: "maria@email.com",
            nascimentoCliente: "1980-05-15"
          },
          profissional: {
            id: 1,
            Profissional: "Dr. Antonio",
            Profissao: "Clínico Geral"
          }
        },
        {
          id: "2",
          id_paciente: 1,
          id_profissional: 14,
          data_consulta: "2025-06-20T14:00:00",
          queixa_principal: "Lesão na pele do braço direito",
          historia_doenca: "Paciente notou lesão há cerca de 2 semanas, sem melhora com hidratante.",
          sinais_vitais: {
            pressao_arterial: "130/85",
            frequencia_cardiaca: 80,
            temperatura: 36.8,
            saturacao: 99,
            peso: 71,
            altura: 1.70,
            imc: 24.5
          },
          exame_fisico: "Lesão eritematosa com bordas definidas no braço direito, medindo aproximadamente 2cm.",
          diagnostico: "Dermatite de contato",
          plano_tratamento: "Evitar contato com possíveis alérgenos e usar medicação prescrita.",
          medicamentos: [
            {
              nome: "Betametasona creme",
              dosagem: "0,05%",
              posologia: "Aplicar na área afetada 2x ao dia",
              duracao: "7 dias"
            }
          ],
          exames_solicitados: [],
          retorno: "2025-07-10",
          observacoes: "Paciente deve evitar sabonetes perfumados e roupas sintéticas na região afetada.",
          created_at: "2025-06-20T14:45:00",
          updated_at: "2025-06-20T14:45:00",
          paciente: {
            id: 1,
            nomeCliente: "Maria Silva",
            telefoneCliente: "(85) 99999-9999",
            emailCliente: "maria@email.com",
            nascimentoCliente: "1980-05-15"
          },
          profissional: {
            id: 14,
            Profissional: "Dra. Renata Almeida",
            Profissao: "Dermatologista"
          }
        }
      ];
    },
    enabled: true
  });

  // Create medical record mutation
  const createMedicalRecord = useMutation({
    mutationFn: async (data: MedicalRecordFormData) => {
      console.log("Submitting medical record:", data);
      
      // Mock API call - in production, replace with real API call
      // const response = await fetch('/api/medical-records', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return response.json();
      
      return {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Registro médico criado",
        description: "O histórico médico foi adicionado com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar registro médico",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Update medical record mutation
  const updateMedicalRecord = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MedicalRecordFormData }) => {
      console.log(`Updating medical record ${id}:`, data);
      
      // Mock API call - in production, replace with real API call
      // const response = await fetch(`/api/medical-records/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return response.json();
      
      return {
        id,
        ...data,
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      setIsAddDialogOpen(false);
      setEditingRecord(null);
      toast({
        title: "Registro médico atualizado",
        description: "O histórico médico foi atualizado com sucesso",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar registro médico",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Delete medical record mutation
  const deleteMedicalRecord = useMutation({
    mutationFn: async (id: string) => {
      console.log(`Deleting medical record ${id}`);
      
      // Mock API call - in production, replace with real API call
      // const response = await fetch(`/api/medical-records/${id}`, {
      //   method: 'DELETE'
      // });
      // return response.json();
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      toast({
        title: "Registro médico excluído",
        description: "O histórico médico foi removido com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir registro médico",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Effect to set form values when editing a record
  useEffect(() => {
    if (editingRecord) {
      form.reset({
        id_paciente: editingRecord.id_paciente,
        id_profissional: editingRecord.id_profissional,
        data_consulta: new Date(editingRecord.data_consulta).toISOString().split('T')[0],
        queixa_principal: editingRecord.queixa_principal,
        historia_doenca: editingRecord.historia_doenca,
        sinais_vitais: {
          pressao_arterial: editingRecord.sinais_vitais.pressao_arterial || "",
          frequencia_cardiaca: editingRecord.sinais_vitais.frequencia_cardiaca || 0,
          temperatura: editingRecord.sinais_vitais.temperatura || 36.5,
          saturacao: editingRecord.sinais_vitais.saturacao || 97,
          peso: editingRecord.sinais_vitais.peso || 0,
          altura: editingRecord.sinais_vitais.altura || 0,
          imc: editingRecord.sinais_vitais.imc || 0
        },
        exame_fisico: editingRecord.exame_fisico,
        diagnostico: editingRecord.diagnostico,
        plano_tratamento: editingRecord.plano_tratamento,
        medicamentos: editingRecord.medicamentos,
        exames_solicitados: editingRecord.exames_solicitados,
        retorno: editingRecord.retorno,
        observacoes: editingRecord.observacoes
      });
    }
  }, [editingRecord, form]);

  // Handle form submission
  const onSubmit = (data: MedicalRecordFormData) => {
    if (editingRecord) {
      updateMedicalRecord.mutate({ id: editingRecord.id, data });
    } else {
      createMedicalRecord.mutate(data);
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
  };

  // Handle adding a new record
  const handleAddRecord = (patientId?: number) => {
    const selectedId = patientId || selectedPatientId;
    if (selectedId) {
      form.reset({
        ...form.getValues(),
        id_paciente: selectedId,
        id_profissional: professionals[0]?.id || 0,
        data_consulta: new Date().toISOString().split('T')[0],
      });
      setIsAddDialogOpen(true);
    } else {
      toast({
        title: "Paciente não selecionado",
        description: "Selecione um paciente antes de adicionar um registro médico",
        variant: "destructive",
      });
    }
  };

  // Handle viewing a record
  const handleViewRecord = (record: MedicalRecord) => {
    setViewingRecord(record);
    setIsViewDialogOpen(true);
  };

  // Handle editing a record
  const handleEditRecord = (record: MedicalRecord) => {
    setEditingRecord(record);
    setIsAddDialogOpen(true);
  };

  // Handle deleting a record
  const handleDeleteRecord = (id: string) => {
    deleteMedicalRecord.mutate(id);
  };

  // Calculate patient's age from birth date
  const calculateAge = (birthDate: string | null): string => {
    if (!birthDate) return "N/A";
    
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    ) {
      age--;
    }
    
    return `${age} anos`;
  };

  // Format date to local format
  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "-"
      : format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  // Format datetime to local format
  const formatDateTime = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "-"
      : format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Calculate BMI when height and weight change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "sinais_vitais.peso" || name === "sinais_vitais.altura") {
        const peso = form.getValues("sinais_vitais.peso");
        const altura = form.getValues("sinais_vitais.altura");
        
        if (peso > 0 && altura > 0) {
          // Calculate BMI: weight(kg) / height(m)²
          const imc = +(peso / (altura * altura)).toFixed(1);
          form.setValue("sinais_vitais.imc", imc);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Filter medical records based on search term and selected patient
  const filteredRecords = medicalRecords.filter(record => {
    const matchesPatient = !selectedPatientId || record.id_paciente === selectedPatientId;
    const matchesSearch = searchTerm === "" || 
      (record.paciente?.nomeCliente && record.paciente.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.diagnostico && record.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.queixa_principal && record.queixa_principal.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesPatient && matchesSearch;
  });

  // Loading state
  if (isLoadingPatients || isLoadingProfessionals || isLoadingRecords) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Carregando histórico médico...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Histórico Médico de Pacientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerenciamento de prontuários e histórico de consultas
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetchRecords()} 
            variant="outline"
            disabled={isLoadingRecords}
          >
            {isLoadingRecords ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </Button>
          <Button onClick={() => handleAddRecord()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Registro Médico
          </Button>
        </div>
      </div>

      {/* Patient Selector and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Selecione o Paciente</Label>
              <Select
                value={selectedPatientId?.toString() || ""}
                onValueChange={(value) => handlePatientSelect(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os pacientes</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.nomeCliente || "Paciente sem nome"} {patient.CPF && `- CPF: ${patient.CPF}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Buscar Registros</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por diagnóstico ou queixa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Info Card (when selected) */}
      {selectedPatientId && (
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            {(() => {
              const patient = patients.find(p => p.id === selectedPatientId);
              if (!patient) return null;
              
              return (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-50">
                        {patient.nomeCliente}
                      </h2>
                      <div className="mt-1 text-sm text-blue-700 dark:text-blue-200 space-y-1">
                        <p>
                          {patient.nascimentoCliente && (
                            <>{calculateAge(patient.nascimentoCliente)} • </>
                          )}
                          {patient.CPF}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {patient.telefoneCliente}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white/50 dark:bg-gray-900/50">
                      {filteredRecords.length} registros médicos
                    </Badge>
                    <Button 
                      size="sm"
                      onClick={() => handleAddRecord(patient.id)}
                    >
                      <FilePlus className="w-4 h-4 mr-2" />
                      Novo Registro
                    </Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Medical Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Consultas e Procedimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum registro médico encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {selectedPatientId 
                  ? "Este paciente ainda não possui registros médicos no sistema." 
                  : "Selecione um paciente para visualizar seu histórico médico."}
              </p>
              {selectedPatientId && (
                <Button onClick={() => handleAddRecord()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Registro
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Queixa Principal</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                      <TableHead>Retorno</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" onClick={() => handleViewRecord(record)}>
                        <TableCell className="font-medium">
                          {formatDateTime(record.data_consulta)}
                        </TableCell>
                        <TableCell>
                          {record.paciente?.nomeCliente || "Paciente não especificado"}
                        </TableCell>
                        <TableCell>
                          {record.profissional?.Profissional || "Profissional não especificado"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {record.queixa_principal}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {record.diagnostico}
                        </TableCell>
                        <TableCell>
                          {record.retorno ? formatDate(record.retorno) : "Não agendado"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewRecord(record);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRecord(record);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este registro médico?
                                    <br /><br />
                                    <strong>Atenção:</strong> Esta ação não pode ser desfeita e todos os
                                    dados do registro serão permanentemente removidos.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRecord(record.id)}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                  >
                                    Excluir Registro
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Record Form Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? "Editar Registro Médico" : "Novo Registro Médico"}
            </DialogTitle>
            <DialogDescription>
              {editingRecord 
                ? "Atualize as informações do registro médico" 
                : "Adicione um novo registro ao histórico médico do paciente"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Info and Vitals */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Informações Básicas</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Paciente*</Label>
                      <Select
                        value={form.watch("id_paciente").toString() || ""}
                        onValueChange={(value) => form.setValue("id_paciente", Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.nomeCliente || "Paciente sem nome"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.id_paciente && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.id_paciente.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Profissional*</Label>
                      <Select
                        value={form.watch("id_profissional").toString() || ""}
                        onValueChange={(value) => form.setValue("id_profissional", Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionals.map((professional) => (
                            <SelectItem key={professional.id} value={professional.id.toString()}>
                              {professional.name} - {professional.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.id_profissional && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.id_profissional.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Data da Consulta*</Label>
                      <Input
                        type="date"
                        {...form.register("data_consulta")}
                      />
                      {form.formState.errors.data_consulta && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.data_consulta.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Data de Retorno</Label>
                      <Input
                        type="date"
                        {...form.register("retorno")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Sinais Vitais</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pressão Arterial</Label>
                      <Input
                        placeholder="Ex: 120/80"
                        {...form.register("sinais_vitais.pressao_arterial")}
                      />
                    </div>
                    
                    <div>
                      <Label>Frequência Cardíaca (bpm)</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 75"
                        {...form.register("sinais_vitais.frequencia_cardiaca", {
                          valueAsNumber: true
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Temperatura (°C)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 36.5"
                        {...form.register("sinais_vitais.temperatura", {
                          valueAsNumber: true
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label>Saturação O2 (%)</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 98"
                        {...form.register("sinais_vitais.saturacao", {
                          valueAsNumber: true
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Peso (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 70.5"
                        {...form.register("sinais_vitais.peso", {
                          valueAsNumber: true
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label>Altura (m)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 1.70"
                        {...form.register("sinais_vitais.altura", {
                          valueAsNumber: true
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label>IMC</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Calculado automaticamente"
                        {...form.register("sinais_vitais.imc", {
                          valueAsNumber: true
                        })}
                        readOnly
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Medicamentos</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => appendMedicamento({ nome: "", dosagem: "", posologia: "", duracao: "" })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {medicamentoFields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-12 gap-3 items-start border rounded-md p-3">
                        <div className="col-span-12 md:col-span-3">
                          <Label className="text-xs">Medicamento</Label>
                          <Input
                            placeholder="Nome do medicamento"
                            {...form.register(`medicamentos.${index}.nome`)}
                          />
                        </div>
                        
                        <div className="col-span-12 md:col-span-2">
                          <Label className="text-xs">Dosagem</Label>
                          <Input
                            placeholder="Ex: 500mg"
                            {...form.register(`medicamentos.${index}.dosagem`)}
                          />
                        </div>
                        
                        <div className="col-span-12 md:col-span-4">
                          <Label className="text-xs">Posologia</Label>
                          <Input
                            placeholder="Ex: 1 comprimido a cada 8h"
                            {...form.register(`medicamentos.${index}.posologia`)}
                          />
                        </div>
                        
                        <div className="col-span-10 md:col-span-2">
                          <Label className="text-xs">Duração</Label>
                          <Input
                            placeholder="Ex: 7 dias"
                            {...form.register(`medicamentos.${index}.duracao`)}
                          />
                        </div>
                        
                        <div className="col-span-2 md:col-span-1 flex justify-end items-end h-full">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMedicamento(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-9 w-9 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {medicamentoFields.length === 0 && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400 border border-dashed rounded-md">
                        Nenhum medicamento adicionado
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Clinical Data */}
              <div className="space-y-6">
                <div>
                  <Label>Queixa Principal*</Label>
                  <Input
                    placeholder="Descrição da queixa principal do paciente"
                    {...form.register("queixa_principal")}
                    className="mb-1"
                  />
                  {form.formState.errors.queixa_principal && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.queixa_principal.message}</p>
                  )}
                </div>
                
                <div>
                  <Label>História da Doença Atual</Label>
                  <Textarea
                    placeholder="Detalhes sobre o histórico da condição atual"
                    rows={3}
                    {...form.register("historia_doenca")}
                  />
                </div>
                
                <div>
                  <Label>Exame Físico</Label>
                  <Textarea
                    placeholder="Achados do exame físico"
                    rows={3}
                    {...form.register("exame_fisico")}
                  />
                </div>
                
                <div>
                  <Label>Diagnóstico*</Label>
                  <Input
                    placeholder="Diagnóstico principal"
                    {...form.register("diagnostico")}
                    className="mb-1"
                  />
                  {form.formState.errors.diagnostico && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.diagnostico.message}</p>
                  )}
                </div>
                
                <div>
                  <Label>Plano de Tratamento</Label>
                  <Textarea
                    placeholder="Plano terapêutico recomendado"
                    rows={3}
                    {...form.register("plano_tratamento")}
                  />
                </div>
                
                {/* Exames */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Exames Solicitados</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => appendExame("")}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                    {exameFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        <Input
                          placeholder="Nome do exame"
                          className="flex-grow"
                          {...form.register(`exames_solicitados.${index}`)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExame(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {exameFields.length === 0 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed rounded-md text-sm">
                        Nenhum exame adicionado
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Observações adicionais, recomendações ou notas"
                    rows={3}
                    {...form.register("observacoes")}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setEditingRecord(null);
              }}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createMedicalRecord.isPending || updateMedicalRecord.isPending}
              >
                {(createMedicalRecord.isPending || updateMedicalRecord.isPending) ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  editingRecord ? "Atualizar" : "Salvar"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Medical Record Detail */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prontuário Médico</DialogTitle>
            <DialogDescription>
              Detalhes completos do registro médico
            </DialogDescription>
          </DialogHeader>
          
          {viewingRecord && (
            <div className="space-y-6">
              {/* Header and Actions */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Consulta de {formatDateTime(viewingRecord.data_consulta)}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID do Registro: {viewingRecord.id}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRecord(viewingRecord)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
              
              {/* Patient and Professional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Paciente</h3>
                        <p>{viewingRecord.paciente?.nomeCliente || "Paciente não especificado"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {viewingRecord.paciente?.nascimentoCliente && (
                            <>{calculateAge(viewingRecord.paciente.nascimentoCliente)} • </>
                          )}
                          {viewingRecord.paciente?.telefoneCliente}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Profissional</h3>
                        <p>{viewingRecord.profissional?.Profissional || "Profissional não especificado"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {viewingRecord.profissional?.Profissao || "Especialidade não especificada"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Medical Details */}
              <div className="space-y-4">
                <Tabs defaultValue="anamnese">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
                    <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
                    <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
                    <TabsTrigger value="prescricoes">Prescrições</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="anamnese" className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Queixa Principal</h4>
                      <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        {viewingRecord.queixa_principal}
                      </p>
                    </div>
                    
                    {viewingRecord.historia_doenca && (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">História da Doença Atual</h4>
                        <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md whitespace-pre-line">
                          {viewingRecord.historia_doenca}
                        </p>
                      </div>
                    )}
                    
                    {viewingRecord.exame_fisico && (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Exame Físico</h4>
                        <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md whitespace-pre-line">
                          {viewingRecord.exame_fisico}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="vitals" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {viewingRecord.sinais_vitais.pressao_arterial && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Activity className="h-6 w-6 text-red-600 mb-2" />
                              <h4 className="text-sm font-medium text-gray-500">Pressão Arterial</h4>
                              <p className="text-xl font-bold">
                                {viewingRecord.sinais_vitais.pressao_arterial} mmHg
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {viewingRecord.sinais_vitais.frequencia_cardiaca && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Heart className="h-6 w-6 text-red-600 mb-2" />
                              <h4 className="text-sm font-medium text-gray-500">Freq. Cardíaca</h4>
                              <p className="text-xl font-bold">
                                {viewingRecord.sinais_vitais.frequencia_cardiaca} bpm
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {viewingRecord.sinais_vitais.temperatura && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Activity className="h-6 w-6 text-orange-600 mb-2" />
                              <h4 className="text-sm font-medium text-gray-500">Temperatura</h4>
                              <p className="text-xl font-bold">
                                {viewingRecord.sinais_vitais.temperatura} °C
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {viewingRecord.sinais_vitais.saturacao && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Activity className="h-6 w-6 text-blue-600 mb-2" />
                              <h4 className="text-sm font-medium text-gray-500">Saturação O2</h4>
                              <p className="text-xl font-bold">
                                {viewingRecord.sinais_vitais.saturacao}%
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {viewingRecord.sinais_vitais.peso && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Activity className="h-6 w-6 text-green-600 mb-2" />
                              <h4 className="text-sm font-medium text-gray-500">Peso</h4>
                              <p className="text-xl font-bold">
                                {viewingRecord.sinais_vitais.peso} kg
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {viewingRecord.sinais_vitais.altura && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Activity className="h-6 w-6 text-green-600 mb-2" />
                              <h4 className="text-sm font-medium text-gray-500">Altura</h4>
                              <p className="text-xl font-bold">
                                {viewingRecord.sinais_vitais.altura} m
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {viewingRecord.sinais_vitais.imc && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center">
                              <Activity className="h-6 w-6 text-purple-600 mb-2" />
                              <h4 className="text-sm font-medium text-gray-500">IMC</h4>
                              <p className="text-xl font-bold">
                                {viewingRecord.sinais_vitais.imc}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(() => {
                                  const imc = viewingRecord.sinais_vitais.imc;
                                  if (imc < 18.5) return "Abaixo do peso";
                                  if (imc < 25) return "Peso normal";
                                  if (imc < 30) return "Sobrepeso";
                                  if (imc < 35) return "Obesidade Grau I";
                                  if (imc < 40) return "Obesidade Grau II";
                                  return "Obesidade Grau III";
                                })()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="diagnostico" className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Diagnóstico</h4>
                      <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        {viewingRecord.diagnostico}
                      </p>
                    </div>
                    
                    {viewingRecord.plano_tratamento && (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Plano de Tratamento</h4>
                        <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md whitespace-pre-line">
                          {viewingRecord.plano_tratamento}
                        </p>
                      </div>
                    )}
                    
                    {viewingRecord.exames_solicitados && viewingRecord.exames_solicitados.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Exames Solicitados</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <ul className="list-disc pl-5 space-y-1">
                            {viewingRecord.exames_solicitados.map((exame, index) => (
                              <li key={index}>{exame}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {viewingRecord.retorno && (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Data de Retorno</h4>
                        <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          {formatDate(viewingRecord.retorno)}
                        </p>
                      </div>
                    )}
                    
                    {viewingRecord.observacoes && (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Observações Adicionais</h4>
                        <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md whitespace-pre-line">
                          {viewingRecord.observacoes}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="prescricoes" className="mt-4">
                    {viewingRecord.medicamentos && viewingRecord.medicamentos.length > 0 ? (
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Medicamentos Prescritos</h4>
                        
                        <div className="space-y-4">
                          {viewingRecord.medicamentos.map((med, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-semibold text-gray-900 dark:text-gray-100">{med.nome}</h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      <span className="font-medium">Dosagem:</span> {med.dosagem}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      <span className="font-medium">Posologia:</span> {med.posologia}
                                    </p>
                                    {med.duracao && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium">Duração:</span> {med.duracao}
                                      </p>
                                    )}
                                  </div>
                                  
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                    Medicamento {index + 1}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <div className="text-2xl mb-2">💊</div>
                        <p>Nenhuma medicação prescrita nesta consulta</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Stamp and Signature */}
              <div className="border-t pt-4 mt-8 text-right text-sm text-gray-500 dark:text-gray-400">
                <p>Criado em: {formatDateTime(viewingRecord.created_at)}</p>
                {viewingRecord.updated_at !== viewingRecord.created_at && (
                  <p>Última atualização: {formatDateTime(viewingRecord.updated_at)}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}