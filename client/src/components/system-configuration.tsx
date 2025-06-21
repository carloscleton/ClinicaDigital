import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Settings, 
  Monitor, 
  Sun, 
  Moon, 
  Brush,
  Eye,
  RefreshCw,
  Save,
  Download,
  Upload
} from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

interface ColorScheme {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  preview: string[];
}

const colorSchemes: ColorScheme[] = [
  {
    id: "medical-blue",
    name: "Azul Médico",
    description: "Esquema profissional em tons de azul",
    primary: "#2563eb",
    secondary: "#1e40af", 
    accent: "#3b82f6",
    background: "#f8fafc",
    preview: ["#2563eb", "#1e40af", "#3b82f6", "#f8fafc"]
  },
  {
    id: "healthcare-green",
    name: "Verde Saúde",
    description: "Cores inspiradas em saúde e bem-estar",
    primary: "#059669",
    secondary: "#047857",
    accent: "#10b981",
    background: "#f0fdf4",
    preview: ["#059669", "#047857", "#10b981", "#f0fdf4"]
  },
  {
    id: "clinic-purple",
    name: "Roxo Clínica",
    description: "Elegante esquema em tons de roxo",
    primary: "#7c3aed",
    secondary: "#6d28d9",
    accent: "#8b5cf6",
    background: "#faf5ff",
    preview: ["#7c3aed", "#6d28d9", "#8b5cf6", "#faf5ff"]
  },
  {
    id: "warm-orange",
    name: "Laranja Acolhedor",
    description: "Cores quentes e acolhedoras",
    primary: "#ea580c",
    secondary: "#c2410c",
    accent: "#f97316",
    background: "#fff7ed",
    preview: ["#ea580c", "#c2410c", "#f97316", "#fff7ed"]
  }
];

const customColors = [
  { name: "Azul Corporativo", value: "#1e40af", category: "Primárias" },
  { name: "Verde Clínico", value: "#059669", category: "Primárias" },
  { name: "Roxo Elegante", value: "#7c3aed", category: "Primárias" },
  { name: "Laranja Vibrante", value: "#ea580c", category: "Primárias" },
  { name: "Cinza Neutro", value: "#6b7280", category: "Neutras" },
  { name: "Azul Claro", value: "#3b82f6", category: "Secundárias" },
  { name: "Verde Suave", value: "#10b981", category: "Secundárias" },
  { name: "Roxo Suave", value: "#8b5cf6", category: "Secundárias" },
];

export default function SystemConfiguration() {
  const { theme, setTheme } = useTheme();
  const [selectedScheme, setSelectedScheme] = useState("medical-blue");
  const [customColor, setCustomColor] = useState("#2563eb");
  const [previewMode, setPreviewMode] = useState(false);

  const applyColorScheme = (scheme: ColorScheme) => {
    // Simula aplicação do esquema de cores
    console.log(`Aplicando esquema: ${scheme.name}`);
    setSelectedScheme(scheme.id);
  };

  const exportSettings = () => {
    const settings = {
      theme,
      colorScheme: selectedScheme,
      customColor,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'san-mathews-theme-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Settings className="w-6 h-6 mr-3 text-blue-600" />
            Configurações do Sistema
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Personalize as cores e aparência da plataforma
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Sair do Preview" : "Preview"}
          </Button>
          
          <Button
            onClick={exportSettings}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes" className="flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Temas
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center">
            <Brush className="w-4 h-4 mr-2" />
            Cores
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <Monitor className="w-4 h-4 mr-2" />
            Avançado
          </TabsTrigger>
        </TabsList>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          {/* Theme Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Modo de Aparência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTheme('light')}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Sun className="w-8 h-8 text-yellow-500" />
                    <span className="font-medium">Claro</span>
                    <div className="w-full h-2 bg-gradient-to-r from-white to-gray-100 rounded"></div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    theme === 'dark' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Moon className="w-8 h-8 text-blue-500" />
                    <span className="font-medium">Escuro</span>
                    <div className="w-full h-2 bg-gradient-to-r from-gray-800 to-gray-600 rounded"></div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    theme === 'system' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTheme('system')}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Monitor className="w-8 h-8 text-gray-600" />
                    <span className="font-medium">Sistema</span>
                    <div className="w-full h-2 bg-gradient-to-r from-white via-gray-400 to-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Schemes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Esquemas de Cor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colorSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedScheme === scheme.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => applyColorScheme(scheme)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{scheme.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.description}</p>
                      </div>
                      {selectedScheme === scheme.id && (
                        <Badge variant="default" className="bg-blue-600">Ativo</Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {scheme.preview.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brush className="w-5 h-5 mr-2" />
                Cores Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Color Picker */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Cor Principal Personalizada</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#000000"
                      />
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Predefined Colors */}
                <div>
                  <label className="block text-sm font-medium mb-3">Cores Predefinidas</label>
                  <div className="space-y-4">
                    {["Primárias", "Secundárias", "Neutras"].map((category) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{category}</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {customColors
                            .filter((color) => color.category === category)
                            .map((color) => (
                              <div
                                key={color.name}
                                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer"
                                onClick={() => setCustomColor(color.value)}
                              >
                                <div
                                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                  style={{ backgroundColor: color.value }}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{color.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Import/Export */}
              <div>
                <h3 className="text-lg font-medium mb-4">Backup e Restauração</h3>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Configuração
                  </Button>
                  <Button onClick={exportSettings} className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Configuração
                  </Button>
                </div>
              </div>

              {/* Reset Options */}
              <div>
                <h3 className="text-lg font-medium mb-4">Restaurar Padrões</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setTheme('system');
                      setSelectedScheme('medical-blue');
                      setCustomColor('#2563eb');
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restaurar Configurações Padrão
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Completo (Limpar Cache)
                  </Button>
                </div>
              </div>

              {/* System Info */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informações do Sistema</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tema Atual:</span>
                    <span className="text-sm font-medium">{theme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Esquema de Cores:</span>
                    <span className="text-sm font-medium">{colorSchemes.find(s => s.id === selectedScheme)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cor Personalizada:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: customColor }}
                      />
                      <span className="text-sm font-medium">{customColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline">
          Cancelar
        </Button>
        <Button className="flex items-center bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}