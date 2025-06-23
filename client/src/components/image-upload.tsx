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

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg mx-auto"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="relative"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Processando..." : "Selecionar Foto"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {placeholder || "PNG, JPG até 5MB"}
            </p>
          </div>
        )}
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