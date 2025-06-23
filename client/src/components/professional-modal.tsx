import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calendar, Phone, Mail, Award, Clock, MapPin, X, Camera } from "lucide-react";

interface ProfessionalModalProps {
  professional: any;
  isOpen: boolean;
  onClose: () => void;
  photoIndex: number;
}

export default function ProfessionalModal({ professional, isOpen, onClose, photoIndex }: ProfessionalModalProps) {
  if (!professional) return null;

  // Array de fotos fictícias para médicos
  const doctorPhotos = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1594824949799-9d95d2a82c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1584467735871-8dd4827d4864?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Perfil Profissional
          </DialogTitle>
        </DialogHeader>
        
        {/* Foto do Profissional no topo */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
              <img
                src={professional.photo || doctorPhotos[photoIndex % doctorPhotos.length]}
                alt={`Dr(a). ${professional.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            {!professional.photo && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                Foto fictícia
              </div>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              onClick={() => {
                // TODO: Implementar edição de foto
                console.log("Editar foto do profissional");
              }}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-xl font-semibold mt-3">{professional.name}</h3>
          <p className="text-gray-600 dark:text-gray-400">{professional.specialty}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Informações de Contato
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Award className="w-4 h-4 mr-2" />
                    <span>CRM: {professional.crm}</span>
                  </div>
                  
                  {professional.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{professional.phone}</span>
                    </div>
                  )}
                  
                  {professional.email && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{professional.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>San Mathews Clínica</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onClose}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Consulta
                    </Button>
                  </Link>
                  <Link href="/booking">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                      Agendamento Online
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Horários de Atendimento */}
          <div className="lg:col-span-1">
            {(professional.atendimentos || professional.experience) && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <Clock className="w-4 w-4 mr-2 text-green-600" />
                    Horários de Atendimento
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {professional.atendimentos || professional.experience}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Actions */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Agendar Atendimento
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <Link href="/contact">
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onClose}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Contato Direto
                    </Button>
                  </Link>
                  <Link href="/booking">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                      <Phone className="w-4 h-4 mr-2" />
                      Sistema Online
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}