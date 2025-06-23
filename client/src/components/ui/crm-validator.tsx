import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface CRMValidatorProps {
  value: string;
  onChange: (value: string) => void;
  onValidationResult?: (isValid: boolean, data?: any) => void;
}

interface CRMData {
  crm: string;
  name: string;
  specialty: string;
  state: string;
  situation: string;
  valid: boolean;
}

export function CRMValidator({ value, onChange, onValidationResult }: CRMValidatorProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CRMData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados brasileiros e seus códigos CRM
  const brazilianStates = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
    'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
    'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
    'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
    'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
  };

  const validateCRMFormat = (crmInput: string): boolean => {
    // Formato esperado: CRM/UF número (ex: CRM/CE 12345, 12345/CE, etc.)
    const patterns = [
      /^CRM\/[A-Z]{2}\s*\d{4,6}$/i,
      /^\d{4,6}\/[A-Z]{2}$/i,
      /^[A-Z]{2}\s*\d{4,6}$/i,
      /^\d{4,6}\s*[A-Z]{2}$/i
    ];
    
    return patterns.some(pattern => pattern.test(crmInput.trim()));
  };



  const validateCRMWithServer = async (crmInput: string): Promise<CRMData> => {
    const response = await fetch('/api/validate-crm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ crm: crmInput }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro na validação');
    }

    const data = await response.json();
    return {
      crm: data.crm,
      name: data.name,
      specialty: data.specialty,
      state: data.state,
      situation: data.situation,
      valid: data.valid
    };
  };

  const handleValidation = async () => {
    if (!value.trim()) {
      setError('Digite um número de CRM para validar');
      return;
    }

    setIsValidating(true);
    setError(null);
    setValidationResult(null);

    try {
      // Validar formato
      if (!validateCRMFormat(value)) {
        throw new Error('Formato de CRM inválido. Use: CRM/UF número (ex: CRM/CE 12345)');
      }

      // Validar CRM através do servidor
      const result = await validateCRMWithServer(value);
      setValidationResult(result);
      
      if (onValidationResult) {
        onValidationResult(result.valid, result);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na validação');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ex: CRM/CE 12345"
            className="font-mono"
          />
        </div>
        <Button
          type="button"
          onClick={handleValidation}
          disabled={isValidating || !value.trim()}
          size="sm"
          variant="outline"
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {validationResult && (
        <Alert className={`${validationResult.valid 
          ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
          : 'border-red-200 bg-red-50 dark:bg-red-900/20'
        }`}>
          {validationResult.valid ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">CRM:</span>
                <span>{validationResult.crm}</span>
                <Badge variant={validationResult.valid ? "default" : "destructive"}>
                  {validationResult.situation}
                </Badge>
              </div>
              {validationResult.valid && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Nome:</span>
                    <span>{validationResult.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Especialidade:</span>
                    <span>{validationResult.specialty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado:</span>
                    <span>{validationResult.state}</span>
                  </div>
                </>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        💡 Digite o CRM no formato: CRM/UF número (ex: CRM/CE 12345)
      </div>
    </div>
  );
}