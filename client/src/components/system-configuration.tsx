import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Palette, 
  Check, 
  RefreshCw, 
  Download, 
  Upload, 
  Eye, 
  Brush,
  Monitor
} from "lucide-react";

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
    description: "Tema clássico e confiável para ambiente hospitalar",
    primary: "#2563eb",
    secondary: "#1e40af",
    accent: "#3b82f6",
    background: "#f8fafc",
    preview: ["#2563eb", "#1e40af", "#3b82f6", "#f8fafc"]
  },
  {
    id: "healthcare-green",
    name: "Verde Saúde",
    description: "Transmite bem-estar e vitalidade",
    primary: "#059669",
    secondary: "#047857",
    accent: "#10b981",
    background: "#f0fdf4",
    preview: ["#059669", "#047857", "#10b981", "#f0fdf4"]
  },
  {
    id: "clinic-purple",
    name: "Roxo Clínico",
    description: "Moderno e inovador para tecnologia médica",
    primary: "#7c3aed",
    secondary: "#6d28d9",
    accent: "#8b5cf6",
    background: "#faf5ff",
    preview: ["#7c3aed", "#6d28d9", "#8b5cf6", "#faf5ff"]
  },
  {
    id: "warm-orange",
    name: "Laranja Acolhedor",
    description: "Caloroso e amigável para atendimento humanizado",
    primary: "#ea580c",
    secondary: "#c2410c",
    accent: "#f97316",
    background: "#fff7ed",
    preview: ["#ea580c", "#c2410c", "#f97316", "#fff7ed"]
  }
];

const professionalColorPalette = [
  // Medical Blues - Professional and trustworthy
  "#0369a1", "#0284c7", "#0ea5e9", "#38bdf8", "#0c4a6e", "#075985", "#0891b2", "#06b6d4",
  
  // Healthcare Greens - Health and vitality
  "#059669", "#10b981", "#34d399", "#6ee7b7", "#064e3b", "#065f46", "#047857", "#0d9488",
  
  // Clinical Purples - Innovation and excellence  
  "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#581c87", "#6b21a8", "#7e22ce", "#9333ea",
  
  // Professional Grays - Modern and clean
  "#374151", "#4b5563", "#6b7280", "#9ca3af", "#1f2937", "#111827", "#030712", "#d1d5db",
  
  // Accent Oranges - Warmth and energy
  "#ea580c", "#f97316", "#fb923c", "#fdba74", "#c2410c", "#9a3412", "#7c2d12", "#fed7aa",
  
  // Deep Teals - Calm and professional
  "#0f766e", "#14b8a6", "#5eead4", "#99f6e4", "#134e4a", "#115e59", "#0891b2", "#ccfbf1",
  
  // Clinical Reds - Emergency and alerts
  "#dc2626", "#ef4444", "#f87171", "#fca5a5", "#991b1b", "#7f1d1d", "#450a0a", "#fecaca",
  
  // Professional Blues - Trust and reliability
  "#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#1e3a8a", "#1d4ed8", "#2563eb", "#dbeafe"
];

// Utility function for hex to HSL conversion
const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export default function SystemConfiguration() {
  const { toast } = useToast();
  const [selectedScheme, setSelectedScheme] = useState("medical-blue");
  const [customColor, setCustomColor] = useState("#2563eb");
  const [previewMode, setPreviewMode] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Apply saved color settings automatically
  const applySavedColors = (scheme: ColorScheme | null, customColor: string) => {
    const root = document.documentElement;
    
    if (scheme) {
      const primaryHsl = hexToHsl(scheme.primary);
      const secondaryHsl = hexToHsl(scheme.secondary);
      const accentHsl = hexToHsl(scheme.accent);

      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--secondary', secondaryHsl);
      root.style.setProperty('--accent', accentHsl);
      root.style.setProperty('--ring', primaryHsl);
    } else if (customColor) {
      const primaryHsl = hexToHsl(customColor);
      const [h, s, l] = primaryHsl.split(' ').map(v => parseInt(v));
      const secondaryHsl = `${h} ${s}% ${Math.max(20, l - 15)}%`;
      const accentHsl = `${h} ${Math.min(100, s + 10)}% ${Math.min(80, l + 10)}%`;

      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--secondary', secondaryHsl);
      root.style.setProperty('--accent', accentHsl);
      root.style.setProperty('--ring', primaryHsl);
    }
  };

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('san-mathews-color-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        const schemeId = settings.colorScheme || "medical-blue";
        const savedCustomColor = settings.customColor || "#2563eb";
        
        setSelectedScheme(schemeId);
        setCustomColor(savedCustomColor);
        
        // Apply the saved colors immediately
        if (schemeId === 'custom') {
          applySavedColors(null, savedCustomColor);
        } else {
          const scheme = colorSchemes.find(s => s.id === schemeId);
          if (scheme) applySavedColors(scheme, savedCustomColor);
        }
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, []);

  const applyColorScheme = async (scheme: ColorScheme) => {
    setIsApplying(true);
    try {
      const root = document.documentElement;
      
      // Apply comprehensive color scheme with Tailwind CSS variables
      const primaryHsl = hexToHsl(scheme.primary);
      const secondaryHsl = hexToHsl(scheme.secondary);
      const accentHsl = hexToHsl(scheme.accent);

      // Apply primary color system
      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      
      // Apply secondary color system
      root.style.setProperty('--secondary', secondaryHsl);
      root.style.setProperty('--secondary-foreground', '0 0% 98%');
      
      // Apply accent color system
      root.style.setProperty('--accent', accentHsl);
      root.style.setProperty('--accent-foreground', '0 0% 9%');
      
      // Apply destructive colors
      root.style.setProperty('--destructive', '0 84.2% 60.2%');
      root.style.setProperty('--destructive-foreground', '0 0% 98%');
      
      // Apply ring and border colors
      root.style.setProperty('--ring', primaryHsl);
      root.style.setProperty('--border', '214.3 31.8% 91.4%');
      
      // Apply muted colors
      root.style.setProperty('--muted', '210 40% 96%');
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
      
      // Apply popover colors
      root.style.setProperty('--popover', '0 0% 100%');
      root.style.setProperty('--popover-foreground', '222.2 84% 4.9%');
      
      // Apply card colors
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
      
      // Save to localStorage
      const settings = { colorScheme: scheme.id, customColor };
      localStorage.setItem('san-mathews-color-settings', JSON.stringify(settings));
      
      setSelectedScheme(scheme.id);
      
      toast({
        title: "Esquema aplicado com sucesso!",
        description: `${scheme.name} está agora ativo em todo o sistema.`,
      });
      
    } catch (error) {
      toast({
        title: "Erro ao aplicar esquema",
        description: "Não foi possível aplicar o esquema de cores.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const applyCustomColor = async () => {
    setIsApplying(true);
    try {
      const root = document.documentElement;
      
      const primaryHsl = hexToHsl(customColor);
      
      // Generate professional color variations
      const [h, s, l] = primaryHsl.split(' ').map(v => parseInt(v));
      const secondaryHsl = `${h} ${s}% ${Math.max(20, l - 15)}%`;
      const accentHsl = `${h} ${Math.min(100, s + 10)}% ${Math.min(80, l + 10)}%`;

      // Apply comprehensive color system
      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      
      root.style.setProperty('--secondary', secondaryHsl);
      root.style.setProperty('--secondary-foreground', '0 0% 98%');
      
      root.style.setProperty('--accent', accentHsl);
      root.style.setProperty('--accent-foreground', '0 0% 9%');
      
      // Update ring and border to match
      root.style.setProperty('--ring', primaryHsl);
      root.style.setProperty('--border', `${h} 30% 91%`);
      
      // Save settings
      const settings = { colorScheme: 'custom', customColor };
      localStorage.setItem('san-mathews-color-settings', JSON.stringify(settings));
      setSelectedScheme('custom');
      
      toast({
        title: "Cor personalizada aplicada!",
        description: "Sistema atualizado com sua cor personalizada.",
      });
      
    } catch (error) {
      toast({
        title: "Erro ao aplicar cor",
        description: "Não foi possível aplicar a cor personalizada.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const exportSettings = () => {
    const settings = { 
      colorScheme: selectedScheme, 
      customColor,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'san-mathews-color-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configurações exportadas!",
      description: "Arquivo baixado com sucesso.",
    });
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          setSelectedScheme(settings.colorScheme || "medical-blue");
          setCustomColor(settings.customColor || "#2563eb");
          
          localStorage.setItem('san-mathews-color-settings', JSON.stringify(settings));
          
          toast({
            title: "Configurações importadas!",
            description: "Suas configurações foram restauradas com sucesso.",
          });
        } catch (error) {
          toast({
            title: "Erro na importação",
            description: "Arquivo inválido ou corrompido.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
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
            Personalize as cores da plataforma médica
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

      <Tabs defaultValue="schemes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schemes" className="flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Esquemas de Cores
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center">
            <Brush className="w-4 h-4 mr-2" />
            Cores Personalizadas
          </TabsTrigger>
        </TabsList>

        {/* Color Schemes Tab */}
        <TabsContent value="schemes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Esquemas Predefinidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colorSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                      selectedScheme === scheme.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => applyColorScheme(scheme)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{scheme.name}</h3>
                      {selectedScheme === scheme.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {scheme.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      {scheme.preview.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
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

        {/* Custom Colors Tab */}
        <TabsContent value="custom" className="space-y-6">
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
                <div className="space-y-4">
                  <div>
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
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="#000000"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={applyCustomColor}
                        disabled={isApplying}
                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                      >
                        {isApplying ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Professional Color Palette Grid */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Paleta de Cores Profissional</label>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-8 gap-2">
                        {professionalColorPalette.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => setCustomColor(color)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                              customColor === color 
                                ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-600' 
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                            style={{ backgroundColor: color }}
                            title={`Cor: ${color}`}
                          />
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 grid grid-cols-4 gap-2">
                        <div>🔵 Azuis Médicos</div>
                        <div>🟢 Verdes Saúde</div>
                        <div>🟣 Roxos Clínicos</div>
                        <div>⚫ Cinzas Profissionais</div>
                        <div>🟠 Laranjas Energia</div>
                        <div>🔷 Azuis-verdes</div>
                        <div>🔴 Vermelhos Alerta</div>
                        <div>🔷 Azuis Confiança</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import/Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Backup e Restauração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                    id="import-settings"
                  />
                  <label htmlFor="import-settings">
                    <Button variant="outline" className="w-full cursor-pointer" asChild>
                      <span className="flex items-center justify-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Importar Configurações
                      </span>
                    </Button>
                  </label>
                </div>
                
                <Button 
                  onClick={exportSettings}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}