import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import { 
  Stethoscope, 
  Activity, 
  UserCheck, 
  Heart, 
  Brain, 
  Bone, 
  Eye, 
  Baby,
  Star,
  Check,
  Calendar
} from "lucide-react";
import type { Doctor, Testimonial } from "@shared/schema";

export default function Home() {
  const { data: doctors, isLoading: doctorsLoading } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const { data: supabaseProfessionals, isLoading: professionalsLoading } = useQuery<any[]>({
    queryKey: ["/api/supabase/professionals"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const { data: specialtiesData, isLoading: specialtiesLoading } = useQuery<any[]>({
    queryKey: ["/api/supabase/especialidades"],
  });

  const services = [
    {
      icon: Stethoscope,
      title: "Consultas Médicas",
      description: "Atendimento clínico geral e especializado com profissionais experientes e dedicados ao seu bem-estar.",
      features: [
        "Consultas de urgência e rotina",
        "Avaliação médica completa",
        "Acompanhamento contínuo"
      ]
    },
    {
      icon: Activity,
      title: "Exames Diagnósticos",
      description: "Tecnologia de ponta para diagnósticos precisos e rápidos, garantindo o melhor tratamento para você.",
      features: [
        "Exames laboratoriais completos",
        "Ultrassonografia e radiologia",
        "Resultados em até 24h"
      ]
    },
    {
      icon: UserCheck,
      title: "Tratamentos Especializados",
      description: "Tratamentos personalizados com foco na recuperação completa e prevenção de doenças.",
      features: [
        "Planos de tratamento individualizados",
        "Acompanhamento multidisciplinar",
        "Medicina preventiva"
      ]
    }
  ];

  // Function to get icon and color for each specialty
  const getSpecialtyProps = (specialtyName: string) => {
    const specialtyMap: Record<string, { icon: any; color: string; description: string }> = {
      "Ultrassonografia": {
        icon: Activity,
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
        description: "Exames de imagem para diagnóstico preciso e não invasivo"
      },
      "Clinico Geral": {
        icon: Stethoscope,
        color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
        description: "Atendimento clínico geral abrangente e humanizado"
      },
      "Clínica Médica": {
        icon: Stethoscope,
        color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
        description: "Atendimento clínico geral abrangente e humanizado"
      },
      "Cardiologista": {
        icon: Heart,
        color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
        description: "Diagnóstico e tratamento de doenças cardiovasculares"
      },
      "Dermatologista": {
        icon: Eye,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
        description: "Cuidados especializados da pele e anexos"
      },
      "Ginecologista": {
        icon: Baby,
        color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400",
        description: "Saúde integral da mulher em todas as fases"
      },
      "Neurologista": {
        icon: Brain,
        color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
        description: "Diagnóstico e tratamento neurológico especializado"
      },
      "Ortopedista": {
        icon: Bone,
        color: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400",
        description: "Tratamento de lesões e doenças do sistema músculo-esquelético"
      },
      "Pediatra": {
        icon: Baby,
        color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
        description: "Cuidados médicos especializados para crianças"
      },
      "Pediatria": {
        icon: Baby,
        color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
        description: "Cuidados médicos especializados para crianças"
      },
      "Cirurgião": {
        icon: UserCheck,
        color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
        description: "Procedimentos cirúrgicos especializados"
      },
      "Dermato": {
        icon: Eye,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
        description: "Tratamento especializado da pele"
      },
      "Nutrólogo": {
        icon: Heart,
        color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
        description: "Nutrição clínica e metabólica"
      },
      "Psicoanalista": {
        icon: Brain,
        color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
        description: "Saúde mental e análise psicológica"
      },
      "Preventivo": {
        icon: Activity,
        color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
        description: "Medicina preventiva e check-ups"
      },
      "Usg": {
        icon: Activity,
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
        description: "Ultrassonografia diagnóstica"
      },
      "Ortopedia": {
        icon: Bone,
        color: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400",
        description: "Tratamento do sistema músculo-esquelético"
      },
      "Teste Cardiologia": {
        icon: Heart,
        color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
        description: "Cardiologia especializada"
      },
      "Teste Funcionamento": {
        icon: UserCheck,
        color: "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400",
        description: "Testes funcionais especializados"
      },
      "Eda": {
        icon: UserCheck,
        color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400",
        description: "Especialidade médica específica"
      }
    };
    
    return specialtyMap[specialtyName] || {
      icon: UserCheck,
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400",
      description: "Atendimento médico especializado"
    };
  };

  // Transform database specialties data
  const specialties = (specialtiesData || []).map((specialty: any) => {
    const props = getSpecialtyProps(specialty.name);
    return {
      icon: props.icon,
      name: specialty.name,
      description: props.description,
      color: props.color
    };
  });

  return (
    <div>
      <HeroSection />
      <StatsSection />
      
      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Oferecemos uma ampla gama de serviços médicos com tecnologia avançada e atendimento humanizado
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Especialidades Médicas</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Contamos com profissionais altamente qualificados em diversas especialidades médicas
            </p>
          </div>
          
          {specialtiesLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando especialidades...</p>
            </div>
          ) : specialties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Nenhuma especialidade encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
              {specialties.map((specialty: any, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer h-32">
                  <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 mx-auto ${specialty.color}`}>
                      <specialty.icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{specialty.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link href="/specialties">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Ver Todas as Especialidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Nossa Equipe Médica</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Profissionais experientes e dedicados, comprometidos com a excelência no atendimento
            </p>
          </div>
          
          {professionalsLoading ? (
            <div className="text-center">Carregando médicos...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {supabaseProfessionals?.slice(0, 3).map((professional, index) => {
                // Array de fotos fictícias para médicos
                const doctorPhotos = [
                  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1594824949799-9d95d2a82c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
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
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Dr(a). {professional.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{professional.specialty}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {professional.experience || "Profissional experiente e qualificado em sua especialidade"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                          <span>CRM: {professional.crm}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/doctors">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Ver toda a equipe médica
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">O Que Nossos Pacientes Dizem</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A satisfação dos nossos pacientes é nossa maior recompensa
            </p>
          </div>
          
          {testimonialsLoading ? (
            <div className="text-center">Carregando depoimentos...</div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {testimonials?.map((testimonial) => (
                <Card key={testimonial.id} className="bg-gray-50">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 text-sm">{testimonial.rating}.0</span>
                    </div>
                    <blockquote className="text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{testimonial.authorName}</div>
                        <div className="text-sm text-gray-600">{testimonial.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button size="lg" variant="outline">
                Ver Mais Depoimentos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Cuidar da Sua Saúde?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Agende sua consulta hoje mesmo e tenha acesso ao melhor atendimento médico da região
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Consulta Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
