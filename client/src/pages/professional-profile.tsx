import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Phone, Mail, Award, Clock, MapPin } from "lucide-react";

export default function ProfessionalProfile() {
  const [match, params] = useRoute("/professional/:id");
  const professionalId = params?.id;

  const { data: supabaseProfessionals, isLoading } = useQuery<any[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const professional = supabaseProfessionals?.find(
    (prof) => prof.id.toString() === professionalId
  );

  if (!professional) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Profissional não encontrado
          </h1>
          <Link href="/doctors">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Profissionais
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Array de fotos fictícias para médicos
  const doctorPhotos = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1594824949799-9d95d2a82c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  ];

  const photoIndex = (professional.id - 1) % doctorPhotos.length;

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/doctors">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Profissionais
            </Button>
          </Link>
        </div>

        {/* Professional Profile */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Photo and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="h-80 overflow-hidden">
                <img
                  src={doctorPhotos[photoIndex]}
                  alt={`Dr(a). ${professional.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Dr(a). {professional.name}
                </h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-4">
                  {professional.specialty}
                </Badge>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Award className="w-4 h-4 mr-3" />
                    <span>CRM: {professional.crm}</span>
                  </div>
                  
                  {professional.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 mr-3" />
                      <span>{professional.phone}</span>
                    </div>
                  )}
                  
                  {professional.email && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-3" />
                      <span>{professional.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span>San Mathews Clínica - Baturité, CE</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Consulta
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Sobre o Profissional
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {professional.description || 
                    `Dr(a). ${professional.name} é um(a) profissional altamente qualificado(a) em ${professional.specialty}, comprometido(a) com a excelência no atendimento médico. Com anos de experiência na área, oferece cuidados especializados e personalizados para cada paciente, sempre utilizando as mais modernas técnicas e equipamentos disponíveis.`
                  }
                </p>
              </CardContent>
            </Card>

            {/* Schedule */}
            {professional.experience && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Horários de Atendimento
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {professional.experience}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specialization Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Especialização
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Área de Atuação
                    </h3>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                      {professional.specialty}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      Local de Atendimento
                    </h3>
                    <p className="text-green-700 dark:text-green-400 text-sm">
                      San Mathews Clínica e Laboratório
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Entre em Contato
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/contact">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Consulta
                    </Button>
                  </Link>
                  <Link href="/booking">
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Agendamento Online
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}