import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { UserCheck, Calendar, Award, GraduationCap, Clock, Mail, Phone } from "lucide-react";
import ProfessionalModal from "@/components/professional-modal";
import type { Doctor } from "@shared/schema";

export default function Doctors() {
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: supabaseProfessionals, isLoading } = useQuery<any[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  const openProfessionalModal = (professional: any, index: number) => {
    setSelectedProfessional({ ...professional, photoIndex: index });
    setIsModalOpen(true);
  };

  const closeProfessionalModal = () => {
    setIsModalOpen(false);
    setSelectedProfessional(null);
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-96 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">Nossos Profissionais</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Profissionais experientes e dedicados, comprometidos com a excelência no atendimento. 
            Conheça nossa equipe de especialistas altamente qualificados.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{supabaseProfessionals?.length || 0}</div>
            <div className="text-gray-600">Médicos Especialistas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-gray-600">Anos de Experiência</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
            <div className="text-gray-600">Especialidades</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
            <div className="text-gray-600">Pacientes Atendidos</div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {supabaseProfessionals?.map((professional, index) => {
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
              <Card key={professional.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img
                    src={doctorPhotos[index % doctorPhotos.length]}
                    alt={`Dr(a). ${professional.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">Dr(a). {professional.name}</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {professional.specialty}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                    {professional.description || "Profissional experiente e qualificado em sua especialidade"}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Award className="w-4 h-4 mr-2" />
                      <span>CRM: {professional.crm}</span>
                    </div>
                    {professional.phone && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{professional.phone}</span>
                      </div>
                    )}
                    {professional.email && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{professional.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href="/contact" className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Agendar
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openProfessionalModal(professional, index)}
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Specialties Available */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Especialidades Disponíveis</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Ultrassonografia", "Clínica Médica", "Medicina Preventiva", "Pequenas Cirurgias",
              "Nutrologia", "Endoscopia Digestiva", "Psicanálise", "Ginecologia",
              "Neurologia", "Dermatologia", "Cardiologia", "Ortopedia"
            ].map((specialty, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div className="text-sm font-medium text-gray-800">{specialty}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Doctors */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Por Que Escolher Nossos Médicos?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Formação de Excelência</h3>
              <p className="text-gray-600">
                Médicos formados nas melhores universidades do país e do exterior, 
                com especializações e residências médicas de alto nível.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Experiência Comprovada</h3>
              <p className="text-gray-600">
                Anos de experiência clínica e cirúrgica, com participação em congressos 
                médicos e atualização constante em suas especialidades.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Atendimento Humanizado</h3>
              <p className="text-gray-600">
                Profissionais que priorizam a relação médico-paciente, oferecendo 
                atendimento personalizado e cuidado integral à saúde.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-2xl p-8 lg:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Agende sua Consulta</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nossos médicos especialistas estão prontos para cuidar da sua saúde. 
            Escolha o profissional ideal para suas necessidades e agende sua consulta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
            </Link>
            <Link href="/specialties">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Ver Especialidades
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Professional Modal */}
      <ProfessionalModal
        professional={selectedProfessional}
        isOpen={isModalOpen}
        onClose={closeProfessionalModal}
        photoIndex={selectedProfessional?.photoIndex || 0}
      />
    </div>
  );
}
