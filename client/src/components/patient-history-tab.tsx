import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  FileText, 
  User, 
  Stethoscope, 
  Activity, 
  Heart, 
  Plus, 
  ChevronRight, 
  ArrowRight,
  Clock,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientHistoryTabProps {
  patientId: number;
  onAddRecord: (patientId: number) => void;
}

// Mock medical record interface - this would be shared with your main component
interface MedicalRecord {
  id: string;
  id_paciente: number;
  id_profissional: number;
  data_consulta: string;
  queixa_principal: string;
  diagnostico: string;
  retorno: string | null;
  created_at: string;
  profissional?: {
    id: number;
    Profissional: string;
    Profissao: string;
  };
}

export default function PatientHistoryTab({ patientId, onAddRecord }: PatientHistoryTabProps) {
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch medical records for this patient
  const { data: records = [], isLoading } = useQuery<MedicalRecord[]>({
    queryKey: [`/api/medical-records/patient/${patientId}`],
    queryFn: async () => {
      // In a real implementation, fetch from API
      // const response = await fetch(`/api/medical-records/patient/${patientId}`);
      // if (!response.ok) throw new Error('Failed to fetch records');
      // return response.json();
      
      // Mock data for demonstration
      return [
        {
          id: "1",
          id_paciente: patientId,
          id_profissional: 1,
          data_consulta: "2025-06-15T10:00:00",
          queixa_principal: "Dor de cabeça e tontura",
          diagnostico: "Enxaqueca tensional",
          retorno: "2025-06-30",
          created_at: "2025-06-15T10:30:00",
          profissional: {
            id: 1,
            Profissional: "Dr. Antonio",
            Profissao: "Clínico Geral"
          }
        },
        {
          id: "2",
          id_paciente: patientId,
          id_profissional: 14,
          data_consulta: "2025-06-02T14:00:00",
          queixa_principal: "Lesão na pele do braço direito",
          diagnostico: "Dermatite de contato",
          retorno: "2025-07-10",
          created_at: "2025-06-02T14:45:00",
          profissional: {
            id: 14,
            Profissional: "Dra. Renata Almeida",
            Profissao: "Dermatologista"
          }
        }
      ].filter(r => r.id_paciente === patientId);
    },
    enabled: !!patientId
  });

  // Format date
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return date;
    }
  };

  // Format time
  const formatTime = (date: string) => {
    try {
      return format(new Date(date), "HH:mm", { locale: ptBR });
    } catch (e) {
      return "";
    }
  };

  // Handle view record
  const handleViewRecord = (record: MedicalRecord) => {
    setViewingRecord(record);
    setIsViewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Carregando histórico médico...</span>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Sem histórico médico
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
          Este paciente ainda não possui registros médicos no sistema.
        </p>
        <Button onClick={() => onAddRecord(patientId)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Primeiro Registro
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timeline of medical records */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Histórico de Consultas</h3>
        <Button variant="outline" size="sm" onClick={() => onAddRecord(patientId)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      </div>

      <div className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-6 space-y-6 ml-2">
        {records.map((record) => (
          <div key={record.id} className="relative">
            {/* Timeline dot */}
            <div className="absolute w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full -left-[26px] border-4 border-white dark:border-gray-900"></div>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewRecord(record)}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(record.data_consulta)}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{formatTime(record.data_consulta)}</span>
                    </div>
                    
                    <h4 className="font-medium text-lg">{record.diagnostico}</h4>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mt-1">
                      {record.queixa_principal}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                      {record.profissional?.Profissao || "Profissional"}
                    </Badge>
                    
                    {record.retorno && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <ArrowRight className="h-3 w-3" />
                        <span>Retorno: {formatDate(record.retorno)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Record Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Consulta</DialogTitle>
          </DialogHeader>
          
          {viewingRecord && (
            <div className="space-y-6">
              {/* Header with date and professional */}
              <div className="flex justify-between items-start pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(viewingRecord.data_consulta)}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{formatTime(viewingRecord.data_consulta)}</span>
                  </div>
                  <h3 className="font-semibold text-xl mt-1">
                    {viewingRecord.diagnostico}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium">{viewingRecord.profissional?.Profissional}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {viewingRecord.profissional?.Profissao}
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
                    <p className="font-medium truncate" title={viewingRecord.queixa_principal}>
                      {viewingRecord.queixa_principal.length > 20
                        ? viewingRecord.queixa_principal.substring(0, 20) + "..."
                        : viewingRecord.queixa_principal}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3 text-center">
                    <Heart className="h-5 w-5 mx-auto mb-1 text-red-600" />
                    <h5 className="text-xs text-gray-500 uppercase">Diagnóstico</h5>
                    <p className="font-medium truncate" title={viewingRecord.diagnostico}>
                      {viewingRecord.diagnostico}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3 text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <h5 className="text-xs text-gray-500 uppercase">Retorno</h5>
                    <p className="font-medium">
                      {viewingRecord.retorno ? formatDate(viewingRecord.retorno) : "Não agendado"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3 text-center">
                    <FileText className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <h5 className="text-xs text-gray-500 uppercase">Completo</h5>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => window.location.href = `/dashboard/historico/${viewingRecord.id}`}
                    >
                      Ver detalhes
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* View full record button */}
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    onAddRecord(patientId);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Prontuário Completo
                </Button>
              </div>
              
              {viewingRecord.retorno && new Date(viewingRecord.retorno) > new Date() && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-300">
                      Retorno Agendado
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      Este paciente tem retorno agendado para {formatDate(viewingRecord.retorno)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}