import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, label, placeholder }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        onChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar a imagem');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fotos fictícias para usar como placeholder
  const doctorPhotos = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1594824475720-aabd8effc566?w=150&h=150&fit=crop&crop=face"
  ];

  const randomPhoto = doctorPhotos[Math.floor(Math.random() * doctorPhotos.length)];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
            <img
              src={previewUrl || randomPhoto}
              alt="Foto do profissional"
              className="w-full h-full object-cover"
            />
          </div>
          
          {!previewUrl && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Foto fictícia
            </div>
          )}
          
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          {previewUrl && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          {isUploading ? "Processando..." : (placeholder || "Clique na câmera para alterar")}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}