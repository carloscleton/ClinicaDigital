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

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
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

  const specialties = [
    { icon: Heart, name: "Cardiologia", description: "Cuidados especializados para o coração e sistema cardiovascular", color: "bg-red-100 text-red-600" },
    { icon: Brain, name: "Neurologia", description: "Diagnóstico e tratamento de doenças neurológicas", color: "bg-purple-100 text-purple-600" },
    { icon: Bone, name: "Ortopedia", description: "Tratamento de lesões e doenças do sistema músculo-esquelético", color: "bg-blue-100 text-blue-600" },
    { icon: Eye, name: "Oftalmologia", description: "Cuidados especializados para a saúde dos olhos", color: "bg-green-100 text-green-600" },
    { icon: Baby, name: "Pediatria", description: "Atendimento especializado para crianças e adolescentes", color: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div>
      <HeroSection />
      <StatsSection />
      
      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos uma ampla gama de serviços médicos com tecnologia avançada e atendimento humanizado
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Especialidades Médicas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contamos com profissionais altamente qualificados em diversas especialidades médicas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {specialties.map((specialty, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto ${specialty.color}`}>
                    <specialty.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{specialty.name}</h3>
                  <p className="text-sm text-gray-600">{specialty.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nossa Equipe Médica</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais experientes e dedicados, comprometidos com a excelência no atendimento
            </p>
          </div>
          
          {doctorsLoading ? (
            <div className="text-center">Carregando médicos...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors?.slice(0, 3).map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <UserCheck className="w-20 h-20 text-blue-600" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{doctor.specialty}</p>
                    <p className="text-gray-600 text-sm mb-4">{doctor.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span>{doctor.crm}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver perfil completo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">O Que Nossos Pacientes Dizem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
