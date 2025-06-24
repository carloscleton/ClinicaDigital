import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar, 
  User, 
  ArrowLeft,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "wouter";

// This would be imported from a shared types file
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

export default function PatientMedicalHistoryPage() {
  const params = useParams<{ id: string }>();
  const patientId = parseInt(params.id);
  
  const [activeRecordIndex, setActiveRecordIndex] = useState(0);
  
  // Fetch patient data
  const { data: patient, isLoading: isLoadingPatient } = useQuery<Patient>({
    queryKey: [`/api/patients/${patientId}`],
    queryFn: async () => {
      // In a real implementation, fetch from API
      // Mock data for demonstration
      return {
        id: patientId,
        nomeCliente: "Maria Silva",
        telefoneCliente: "(85) 99999-9999",
        emailCliente: "maria@email.com",
        nascimentoCliente: "1980-05-15",
        CPF: "123.456.789-00"
      };
    },
    enabled: !!patientId && !isNaN(patientId)
  });
  
  // Fetch medical records for this patient
  const { data: records = [], isLoading: isLoadingRecords } = useQuery<MedicalRecord[]>({
    queryKey: [`/api/medical-records/patient/${patientId}`],
    queryFn: async () => {
      // In a real implementation, fetch from API
      // Mock data for demonstration
      return [
        {
          id: "1",
          id_paciente: patientId,
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
            id: patientId,
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
          id_paciente: patientId,
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
            id: patientId,
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
    enabled: !!patientId && !isNaN(patientId)
  });

  // Get the active record
  const activeRecord = records[activeRecordIndex];

  // Calculate patient's age
  const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format dates
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string): string => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Handle navigation between records
  const goToPreviousRecord = () => {
    if (activeRecordIndex > 0) {
      setActiveRecordIndex(activeRecordIndex - 1);
    }
  };

  const goToNextRecord = () => {
    if (activeRecordIndex < records.length - 1) {
      setActiveRecordIndex(activeRecordIndex + 1);
    }
  };

  if (isLoadingPatient || isLoadingRecords) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Paciente não encontrado</h1>
          <Link href="/dashboard">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with navigation */}
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Histórico Médico</h1>
      </div>

      {/* Patient info card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold">{patient.nomeCliente}</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mt-1">
                  {patient.nascimentoCliente && (
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(patient.nascimentoCliente)}
                      {calculateAge(patient.nascimentoCliente) !== null && (
                        <span>({calculateAge(patient.nascimentoCliente)} anos)</span>
                      )}
                    </p>
                  )}
                  <p className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {patient.CPF || "CPF não informado"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                {records.length} {records.length === 1 ? "consulta" : "consultas"}
              </Badge>
              
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Histórico
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {records.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sem histórico médico</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Este paciente ainda não possui registros médicos no sistema.
            </p>
            <Button>
              Adicionar Primeiro Registro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Record navigation */}
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={goToPreviousRecord}
              disabled={activeRecordIndex <= 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            
            <div className="text-center">
              <h3 className="font-medium">
                Consulta {activeRecordIndex + 1} de {records.length}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDateTime(activeRecord.data_consulta)}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={goToNextRecord}
              disabled={activeRecordIndex >= records.length - 1}
            >
              Próxima
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Medical Record Detail */}
          {activeRecord && (
            <div className="space-y-6" id="medical-record-printable">
              {/* Header Info */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Consulta de {formatDate(activeRecord.data_consulta)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {activeRecord.profissional?.Profissao}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {activeRecord.profissional?.Profissional}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-gray-500">Queixa Principal</h3>
                      <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        {activeRecord.queixa_principal}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-gray-500">Diagnóstico</h3>
                      <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        {activeRecord.diagnostico}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
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
                        {activeRecord.historia_doenca || "Não informada"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Queixa Principal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeRecord.queixa_principal}
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
                        {activeRecord.exame_fisico || "Sem achados clínicos relevantes"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Diagnóstico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeRecord.diagnostico}
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
                        {activeRecord.plano_tratamento || "Não informado"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {activeRecord.medicamentos && activeRecord.medicamentos.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Medicamentos Prescritos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {activeRecord.medicamentos.map((med, index) => (
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
                  
                  {activeRecord.exames_solicitados && activeRecord.exames_solicitados.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Exames Solicitados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {activeRecord.exames_solicitados.map((exame, index) => (
                            <li key={index}>{exame}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {activeRecord.retorno && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Data de Retorno</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          {formatDate(activeRecord.retorno)}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {activeRecord.observacoes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Observações Adicionais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="whitespace-pre-line">
                          {activeRecord.observacoes}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                {/* Sinais Vitais Tab */}
                <TabsContent value="sinais-vitais">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {activeRecord.sinais_vitais.pressao_arterial && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Pressão Arterial</h4>
                          <p className="text-xl font-bold">{activeRecord.sinais_vitais.pressao_arterial}</p>
                          <p className="text-xs text-gray-500 mt-1">mmHg</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {activeRecord.sinais_vitais.frequencia_cardiaca && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Freq. Cardíaca</h4>
                          <p className="text-xl font-bold">{activeRecord.sinais_vitais.frequencia_cardiaca}</p>
                          <p className="text-xs text-gray-500 mt-1">bpm</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {activeRecord.sinais_vitais.temperatura && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Temperatura</h4>
                          <p className="text-xl font-bold">{activeRecord.sinais_vitais.temperatura}</p>
                          <p className="text-xs text-gray-500 mt-1">°C</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {activeRecord.sinais_vitais.saturacao && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Saturação O2</h4>
                          <p className="text-xl font-bold">{activeRecord.sinais_vitais.saturacao}</p>
                          <p className="text-xs text-gray-500 mt-1">%</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {activeRecord.sinais_vitais.peso && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Peso</h4>
                          <p className="text-xl font-bold">{activeRecord.sinais_vitais.peso}</p>
                          <p className="text-xs text-gray-500 mt-1">kg</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {activeRecord.sinais_vitais.altura && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Altura</h4>
                          <p className="text-xl font-bold">{activeRecord.sinais_vitais.altura}</p>
                          <p className="text-xs text-gray-500 mt-1">m</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {activeRecord.sinais_vitais.imc && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">IMC</h4>
                          <p className="text-xl font-bold">{activeRecord.sinais_vitais.imc}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(() => {
                              const imc = activeRecord.sinais_vitais.imc;
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
              
              {/* Record Metadata */}
              <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap justify-between items-center mt-8 pt-4 border-t">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Registro criado em: {formatDateTime(activeRecord.created_at)}</span>
                </div>
                
                {activeRecord.updated_at !== activeRecord.created_at && (
                  <div>
                    Última atualização: {formatDateTime(activeRecord.updated_at)}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}