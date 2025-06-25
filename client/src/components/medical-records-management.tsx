import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  User, 
  Stethoscope, 
  Activity, 
  Heart, 
  Edit, 
  Trash2, 
  Clock, 
  Download, 
  Printer, 
  Eye, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Loader2 
} from "lucide-react";

// Interface for medical record
interface MedicalRecord {
  id: string;
  id_paciente: number;
  id_profissional: number;
  data_consulta: string;
  queixa_principal: string;
  historia_doenca: string | null;
  sinais_vitais: {
    pressao_arterial?: string;
    frequencia_cardiaca?: number;
    temperatura?: number;
    saturacao?: number;
    peso?: number;
    altura?: number;
    imc?: number;
  } | null;
  exame_fisico: string | null;
  diagnostico: string;
  plano_tratamento: string | null;
  medicamentos: Array<{
    nome: string;
    dosagem: string;
    posologia: string;
    duracao: string;
  }> | null;
  exames_solicitados: string[] | null;
  retorno: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
  paciente?: {
    id: number;
    nomeCliente: string;
    telefoneCliente: string | null;
    emailCliente: string | null;
    nascimentoCliente: string | null;
  };
  profissional?: {
    id: number;
    Profissional: string;
    Profissao: string;
  };
}

// Interface for patient
interface Patient {
  id: number;
  nomeCliente: string;
  telefoneCliente: string | null;
  emailCliente: string | null;
  nascimentoCliente: string | null;
  CPF: string | null;
}

// Interface for professional
interface Professional {
  id: number;
  name: string;
  specialty: string;
}

export default function MedicalRecordsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProfessional, setFilterProfessional] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNewRecordDialogOpen, setIsNewRecordDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch medical records
  const { data: records = [], isLoading: isLoadingRecords } = useQuery<MedicalRecord[]>({
    queryKey: ["/api/medical-records"],
    queryFn: async () => {
      try {
        // In a real implementation, fetch from API
        // const response = await fetch("/api/medical-records");
        // if (!response.ok) throw new Error("Failed to fetch records");
        // return response.json();
        
        // Mock data for demonstration
        return [
          {
            id: "1",
            id_paciente: 1,
            id_profissional: 1,
            data_consulta: "2025-06-15T10:00:00",
            queixa_principal: "Dor de cabeça e tontura",
            historia_doenca: "Paciente relata dor de cabeça há 3 dias, acompanhada de tontura ao se levantar. Nega febre ou outros sintomas. Não tem histórico de enxaqueca. Relata estresse recente no trabalho.",
            sinais_vitais: {
              pressao_arterial: "120/80",
              frequencia_cardiaca: 75,
              temperatura: 36.5,
              saturacao: 98,
              peso: 70,
              altura: 1.70,
              imc: 24.2
            },
            exame_fisico: "Paciente em bom estado geral, lúcido e orientado. Ausculta cardíaca e pulmonar normais. Sem alterações neurológicas focais.",
            diagnostico: "Enxaqueca tensional",
            plano_tratamento: "Repouso, hidratação e medicação conforme prescrição. Orientado sobre técnicas de relaxamento e redução de estresse.",
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
            id_paciente: 2,
            id_profissional: 14,
            data_consulta: "2025-06-02T14:00:00",
            queixa_principal: "Lesão na pele do braço direito",
            historia_doenca: "Paciente notou lesão há cerca de 2 semanas, sem melhora com hidratante. Refere leve coceira no local. Nega uso de novos produtos de higiene ou roupas.",
            sinais_vitais: {
              pressao_arterial: "130/85",
              frequencia_cardiaca: 80,
              temperatura: 36.8,
              saturacao: 99,
              peso: 71,
              altura: 1.70,
              imc: 24.5
            },
            exame_fisico: "Lesão eritematosa com bordas definidas no braço direito, medindo aproximadamente 2cm. Sem edema ou calor local.",
            diagnostico: "Dermatite de contato",
            plano_tratamento: "Evitar contato com possíveis alérgenos e usar medicação prescrita.",
            medicamentos: [
              {
                nome: "Betametasona creme",
                dosagem: "0,05%",
                posologia: "Aplicar na área afetada 2x ao dia",
                duracao: "7 dias"
              },
              {
                nome: "Loratadina",
                dosagem: "10mg",
                posologia: "1 comprimido pela manhã",
                duracao: "5 dias"
              }
            ],
            exames_solicitados: [],
            retorno: "2025-07-10",
            observacoes: "Paciente deve evitar sabonetes perfumados e roupas sintéticas na região afetada.",
            created_at: "2025-06-02T14:45:00",
            updated_at: "2025-06-02T14:45:00",
            paciente: {
              id: 2,
              nomeCliente: "João Santos",
              telefoneCliente: "(85) 88888-8888",
              emailCliente: "joao@email.com",
              nascimentoCliente: "1975-10-20"
            },
            profissional: {
              id: 14,
              Profissional: "Dra. Renata Almeida",
              Profissao: "Dermatologista"
            }
          }
        ];
      } catch (error) {
        console.error("Error fetching medical records:", error);
        return [];
      }
    }
  });

  // Fetch patients
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
    queryFn: async () => {
      try {
        // In a real implementation, fetch from API
        // Mock data for demonstration
        return [
          {
            id: 1,
            nomeCliente: "Maria Silva",
            telefoneCliente: "(85) 99999-9999",
            emailCliente: "maria@email.com",
            nascimentoCliente: "1980-05-15",
            CPF: "123.456.789-00"
          },
          {
            id: 2,
            nomeCliente: "João Santos",
            telefoneCliente: "(85) 88888-8888",
            emailCliente: "joao@email.com",
            nascimentoCliente: "1975-10-20",
            CPF: "987.654.321-00"
          },
          {
            id: 3,
            nomeCliente: "Ana Oliveira",
            telefoneCliente: "(85) 77777-7777",
            emailCliente: "ana@email.com",
            nascimentoCliente: "1990-03-25",
            CPF: "456.789.123-00"
          }
        ];
      } catch (error) {
        console.error("Error fetching patients:", error);
        return [];
      }
    }
  });

  // Fetch professionals
  const { data: professionals = [], isLoading: isLoadingProfessionals } = useQuery<Professional[]>({
    queryKey: ["/api/professionals"],
    queryFn: async () => {
      try {
        // In a real implementation, fetch from API
        // Mock data for demonstration
        return [
          {
            id: 1,
            name: "Dr. Antonio",
            specialty: "Clínico Geral"
          },
          {
            id: 14,
            name: "Dra. Renata Almeida",
            specialty: "Dermatologista"
          }
        ];
      } catch (error) {
        console.error("Error fetching professionals:", error);
        return [];
      }
    }
  });

  // Create new medical record mutation
  const createMedicalRecord = useMutation({
    mutationFn: async (data: any) => {
      // In a real implementation, post to API
      // const response = await fetch("/api/medical-records", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data)
      // });
      // if (!response.ok) throw new Error("Failed to create record");
      // return response.json();
      
      // Mock response
      return {
        id: Math.random().toString(36).substring(2, 9),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      setIsNewRecordDialogOpen(false);
      toast({
        title: "Registro criado com sucesso",
        description: "O prontuário foi adicionado ao histórico do paciente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar registro",
        description: error.message || "Ocorreu um erro ao criar o registro médico",
        variant: "destructive",
      });
    }
  });

  // Delete medical record mutation
  const deleteMedicalRecord = useMutation({
    mutationFn: async (id: string) => {
      // In a real implementation, delete from API
      // const response = await fetch(`/api/medical-records/${id}`, {
      //   method: "DELETE"
      // });
      // if (!response.ok) throw new Error("Failed to delete record");
      // return response.json();
      
      // Mock response
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      toast({
        title: "Registro excluído",
        description: "O prontuário foi removido com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir registro",
        description: error.message || "Ocorreu um erro ao excluir o registro médico",
        variant: "destructive",
      });
    }
  });

  // Filter records based on search and filters
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.paciente?.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.queixa_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnostico.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfessional = 
      filterProfessional === "all" || 
      record.id_profissional.toString() === filterProfessional;
    
    let matchesPeriod = true;
    if (filterPeriod !== "all") {
      const recordDate = new Date(record.data_consulta);
      const now = new Date();
      
      if (filterPeriod === "today") {
        matchesPeriod = 
          recordDate.getDate() === now.getDate() &&
          recordDate.getMonth() === now.getMonth() &&
          recordDate.getFullYear() === now.getFullYear();
      } else if (filterPeriod === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesPeriod = recordDate >= weekAgo;
      } else if (filterPeriod === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        matchesPeriod = recordDate >= monthAgo;
      }
    }
    
    return matchesSearch && matchesProfessional && matchesPeriod;
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy", { locale: ptBR }) : dateString;
    } catch (e) {
      return dateString;
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy HH:mm", { locale: ptBR }) : dateString;
    } catch (e) {
      return dateString;
    }
  };

  // View record details
  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  // Create new record
  const handleCreateRecord = () => {
    if (!selectedPatient || !selectedProfessional) {
      toast({
        title: "Dados incompletos",
        description: "Selecione o paciente e o profissional para criar o registro",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, you would collect all the necessary data
    // and call createMedicalRecord.mutate with the complete record
    const newRecord = {
      id_paciente: parseInt(selectedPatient),
      id_profissional: parseInt(selectedProfessional),
      data_consulta: new Date().toISOString(),
      queixa_principal: "Nova consulta",
      diagnostico: "Em avaliação",
      // Add other required fields
    };
    
    createMedicalRecord.mutate(newRecord);
  };

  // Delete record
  const handleDeleteRecord = (id: string) => {
    deleteMedicalRecord.mutate(id);
  };

  // Calculate patient age
  const calculateAge = (birthDate: string | null): string => {
    if (!birthDate) return "N/A";
    
    try {
      const today = new Date();
      const birth = parseISO(birthDate);
      
      if (!isValid(birth)) return "N/A";
      
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return `${age} anos`;
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Histórico Médico
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerenciamento de prontuários e histórico de consultas
          </p>
        </div>
        
        <Button onClick={() => setIsNewRecordDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Registro
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-2 block">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por paciente, queixa ou diagnóstico..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Profissional</Label>
              <Select value={filterProfessional} onValueChange={setFilterProfessional}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os profissionais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os profissionais</SelectItem>
                  {professionals.map(prof => (
                    <SelectItem key={prof.id} value={prof.id.toString()}>
                      {prof.name} - {prof.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Período</Label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros Médicos ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRecords ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3">Carregando registros...</span>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum registro encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Tente ajustar os filtros ou criar um novo registro.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Queixa Principal</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" onClick={() => handleViewRecord(record)}>
                      <TableCell>
                        <div className="font-medium">{formatDate(record.data_consulta)}</div>
                        <div className="text-xs text-gray-500">{format(parseISO(record.data_consulta), "HH:mm", { locale: ptBR })}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.paciente?.nomeCliente}</div>
                        <div className="text-xs text-gray-500">
                          {record.paciente?.nascimentoCliente && (
                            <>{calculateAge(record.paciente.nascimentoCliente)}</>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{record.profissional?.Profissional}</div>
                        <Badge variant="outline" className="mt-1">
                          {record.profissional?.Profissao}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{record.queixa_principal}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{record.diagnostico}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewRecord(record);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit (not implemented in this example)
                              toast({
                                title: "Edição de registro",
                                description: "Funcionalidade em implementação",
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este registro médico? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteRecord(record.id)}
                                >
                                  Excluir
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
      
      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Registro Médico</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              {/* Header with patient and professional info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedRecord.data_consulta)}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{format(parseISO(selectedRecord.data_consulta), "HH:mm", { locale: ptBR })}</span>
                  </div>
                  <h3 className="font-semibold text-xl mt-1">
                    {selectedRecord.paciente?.nomeCliente}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRecord.paciente?.nascimentoCliente && (
                      <>Idade: {calculateAge(selectedRecord.paciente.nascimentoCliente)}</>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium">{selectedRecord.profissional?.Profissional}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedRecord.profissional?.Profissao}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-3 text-center">
                    <Activity className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <h5 className="text-xs text-gray-500 uppercase">Queixa</h5>
                    <p className="font-medium truncate" title={selectedRecord.queixa_principal}>
                      {selectedRecord.queixa_principal.length > 20
                        ? selectedRecord.queixa_principal.substring(0, 20) + "..."
                        : selectedRecord.queixa_principal}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3 text-center">
                    <Heart className="h-5 w-5 mx-auto mb-1 text-red-600" />
                    <h5 className="text-xs text-gray-500 uppercase">Diagnóstico</h5>
                    <p className="font-medium truncate" title={selectedRecord.diagnostico}>
                      {selectedRecord.diagnostico}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3 text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <h5 className="text-xs text-gray-500 uppercase">Retorno</h5>
                    <p className="font-medium">
                      {selectedRecord.retorno ? formatDate(selectedRecord.retorno) : "Não agendado"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3 text-center">
                    <FileText className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <h5 className="text-xs text-gray-500 uppercase">Exames</h5>
                    <p className="font-medium">
                      {selectedRecord.exames_solicitados?.length || 0} solicitados
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Detailed Content Tabs */}
              <Tabs defaultValue="anamnese" className="w-full">
                <TabsList className="w-full justify-start border-b mb-6">
                  <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
                  <TabsTrigger value="exame-fisico">Exame Físico</TabsTrigger>
                  <TabsTrigger value="tratamento">Tratamento</TabsTrigger>
                  <TabsTrigger value="sinais-vitais">Sinais Vitais</TabsTrigger>
                </TabsList>
                
                {/* Anamnese Tab */}
                <TabsContent value="anamnese" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>História da Doença Atual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-line">
                        {selectedRecord.historia_doenca || "Não informada"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Queixa Principal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedRecord.queixa_principal}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Exame Físico Tab */}
                <TabsContent value="exame-fisico" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Exame Físico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-line">
                        {selectedRecord.exame_fisico || "Sem achados clínicos relevantes"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Diagnóstico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedRecord.diagnostico}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Tratamento Tab */}
                <TabsContent value="tratamento" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Plano de Tratamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-line">
                        {selectedRecord.plano_tratamento || "Não informado"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selectedRecord.medicamentos && selectedRecord.medicamentos.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Medicamentos Prescritos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedRecord.medicamentos.map((med, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{med.nome}</h4>
                                <Badge variant="outline">{med.dosagem}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Posologia:</span> {med.posologia}
                              </p>
                              {med.duracao && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Duração:</span> {med.duracao}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {selectedRecord.exames_solicitados && selectedRecord.exames_solicitados.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Exames Solicitados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedRecord.exames_solicitados.map((exame, index) => (
                            <li key={index}>{exame}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {selectedRecord.retorno && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Data de Retorno</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          {formatDate(selectedRecord.retorno)}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {selectedRecord.observacoes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Observações Adicionais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="whitespace-pre-line">
                          {selectedRecord.observacoes}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                {/* Sinais Vitais Tab */}
                <TabsContent value="sinais-vitais">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedRecord.sinais_vitais?.pressao_arterial && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Pressão Arterial</h4>
                          <p className="text-xl font-bold">{selectedRecord.sinais_vitais.pressao_arterial}</p>
                          <p className="text-xs text-gray-500 mt-1">mmHg</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedRecord.sinais_vitais?.frequencia_cardiaca && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Freq. Cardíaca</h4>
                          <p className="text-xl font-bold">{selectedRecord.sinais_vitais.frequencia_cardiaca}</p>
                          <p className="text-xs text-gray-500 mt-1">bpm</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedRecord.sinais_vitais?.temperatura && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Temperatura</h4>
                          <p className="text-xl font-bold">{selectedRecord.sinais_vitais.temperatura}</p>
                          <p className="text-xs text-gray-500 mt-1">°C</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedRecord.sinais_vitais?.saturacao && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Saturação O2</h4>
                          <p className="text-xl font-bold">{selectedRecord.sinais_vitais.saturacao}</p>
                          <p className="text-xs text-gray-500 mt-1">%</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedRecord.sinais_vitais?.peso && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Peso</h4>
                          <p className="text-xl font-bold">{selectedRecord.sinais_vitais.peso}</p>
                          <p className="text-xs text-gray-500 mt-1">kg</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedRecord.sinais_vitais?.altura && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Altura</h4>
                          <p className="text-xl font-bold">{selectedRecord.sinais_vitais.altura}</p>
                          <p className="text-xs text-gray-500 mt-1">m</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {selectedRecord.sinais_vitais?.imc && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">IMC</h4>
                          <p className="text-xl font-bold">{selectedRecord.sinais_vitais.imc}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(() => {
                              const imc = selectedRecord.sinais_vitais.imc;
                              if (imc < 18.5) return "Abaixo do peso";
                              if (imc < 25) return "Peso normal";
                              if (imc < 30) return "Sobrepeso";
                              if (imc < 35) return "Obesidade Grau I";
                              if (imc < 40) return "Obesidade Grau II";
                              return "Obesidade Grau III";
                            })()}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Criado em: {formatDateTime(selectedRecord.created_at)}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* New Record Dialog */}
      <Dialog open={isNewRecordDialogOpen} onOpenChange={setIsNewRecordDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Registro Médico</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Paciente</Label>
              <Select value={selectedPatient || "unassigned"} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Selecione o paciente</SelectItem>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.nomeCliente}
                      {patient.nascimentoCliente && ` - ${calculateAge(patient.nascimentoCliente)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Profissional</Label>
              <Select value={selectedProfessional || "unassigned"} onValueChange={setSelectedProfessional}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Selecione o profissional</SelectItem>
                  {professionals.map(prof => (
                    <SelectItem key={prof.id} value={prof.id.toString()}>
                      {prof.name} - {prof.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Queixa Principal</Label>
              <Textarea placeholder="Descreva a queixa principal do paciente" />
            </div>
            
            <div>
              <Label>Diagnóstico</Label>
              <Input placeholder="Diagnóstico" />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsNewRecordDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateRecord} disabled={createMedicalRecord.isPending}>
                {createMedicalRecord.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Criar Registro
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}