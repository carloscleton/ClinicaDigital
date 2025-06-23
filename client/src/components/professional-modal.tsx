import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calendar, Phone, Mail, Award, Clock, MapPin, X } from "lucide-react";

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
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Photo and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <div className="h-64 overflow-hidden rounded-t-lg relative group">
                <img
                  src={professional.photo || doctorPhotos[photoIndex % doctorPhotos.length]}
                  alt={`Dr(a). ${professional.name}`}
                  className="w-full h-full object-cover"
                />
                {!professional.photo && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Foto fictícia
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Dr(a). {professional.name}
                </h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-4">
                  {professional.specialty}
                </Badge>
                
                <div className="space-y-2">
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

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-4">
            {/* About */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Sobre o Profissional
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {professional.description || 
                    `Dr(a). ${professional.name} é um(a) profissional altamente qualificado(a) em ${professional.specialty}, comprometido(a) com a excelência no atendimento médico. Com experiência na área, oferece cuidados especializados e personalizados para cada paciente.`
                  }
                </p>
              </CardContent>
            </Card>

            {/* Schedule */}
            {professional.experience && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Horários de Atendimento
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {professional.experience}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specialization */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Informações da Especialidade
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-1">
                      Área de Atuação
                    </h4>
                    <p className="text-blue-700 dark:text-blue-400 text-xs">
                      {professional.specialty}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">
                      Local de Atendimento
                    </h4>
                    <p className="text-green-700 dark:text-green-400 text-xs">
                      San Mathews Clínica e Laboratório
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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