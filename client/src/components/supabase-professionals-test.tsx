import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Database, 
  Users, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  User,
  Phone,
  Mail,
  Badge as BadgeIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SupabaseProfessional {
  id: number;
  name: string;
  specialty: string;
  crm: string;
  description: string;
  experience: string;
}

interface ConnectionTest {
  connected: boolean;
  message: string;
  timestamp?: string;
  error?: string;
}

export default function SupabaseProfessionalsTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionTest | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Test Supabase connection
  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await fetch('/api/supabase/test');
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      setConnectionStatus({
        connected: false,
        message: "Erro na requisição",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Fetch professionals from Supabase
  const { data: professionals = [], isLoading, error, refetch } = useQuery<SupabaseProfessional[]>({
    queryKey: ["/api/supabase/professionals"],
    enabled: true // Auto-fetch on mount to show real data immediately
  });

  // Fetch specialties from Supabase
  const { data: specialties = [], isLoading: isLoadingSpecialties, refetch: refetchSpecialties } = useQuery<string[]>({
    queryKey: ["/api/supabase/specialties"],
    enabled: true
  });

  useEffect(() => {
    // Test connection on component mount
    testConnection();
  }, []);

  const loadProfessionals = () => {
    refetch();
    refetchSpecialties();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Profissionais da Clínica San Mathews
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Dados em tempo real dos profissionais cadastrados no sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={testConnection} 
            variant="outline"
            disabled={isTestingConnection}
          >
            {isTestingConnection ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Testar Conexão
          </Button>
          <Button 
            onClick={loadProfessionals}
            disabled={isLoading}
          >
            {isLoading || isLoadingSpecialties ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Atualizar Dados
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status da Conexão
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectionStatus ? (
            <Alert className={connectionStatus.connected ? "border-green-200 bg-green-50 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:bg-red-900/20"}>
              <div className="flex items-center gap-2">
                {connectionStatus.connected ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={connectionStatus.connected ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                  <div>
                    <strong>{connectionStatus.message}</strong>
                    {connectionStatus.timestamp && (
                      <div className="text-sm mt-1">
                        Testado em: {new Date(connectionStatus.timestamp).toLocaleString('pt-BR')}
                      </div>
                    )}
                    {connectionStatus.error && (
                      <div className="text-sm mt-1 font-mono">
                        Erro: {connectionStatus.error}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Testando conexão...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Profissionais</p>
                <p className="text-2xl font-bold text-blue-600">{professionals.length}</p>
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
                <p className="text-2xl font-bold text-green-600">{specialties.length}</p>
              </div>
              <BadgeIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status Conexão</p>
                <p className={`text-2xl font-bold ${connectionStatus?.connected ? 'text-green-600' : 'text-red-600'}`}>
                  {connectionStatus?.connected ? 'Online' : 'Offline'}
                </p>
              </div>
              {connectionStatus?.connected ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Última Atualização</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {connectionStatus?.timestamp 
                    ? new Date(connectionStatus.timestamp).toLocaleTimeString('pt-BR')
                    : 'N/A'
                  }
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specialties List */}
      {specialties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeIcon className="h-5 w-5" />
              Especialidades Disponíveis ({specialties.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professionals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profissionais CAD_Profissional ({professionals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Carregando profissionais...</span>
            </div>
          ) : error ? (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                Erro ao carregar profissionais: {error.message}
              </AlertDescription>
            </Alert>
          ) : professionals.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum profissional encontrado</p>
              <p className="text-sm">Clique em "Carregar Dados" para buscar os profissionais</p>
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
                    <TableHead>Descrição</TableHead>
                    <TableHead>Experiência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professionals.map((professional) => (
                    <TableRow key={professional.id}>
                      <TableCell className="font-medium">{professional.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {professional.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{professional.specialty}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{professional.crm}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {professional.description || '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {professional.experience || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-400">
            <strong>Erro ao conectar com Supabase:</strong>
            <div className="mt-1 font-mono text-sm">{error.message}</div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}