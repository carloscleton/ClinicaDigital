import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Star, UserCheck, Quote, Calendar, TrendingUp, MessageSquare } from "lucide-react";
import type { Testimonial } from "@shared/schema";
import TestimonialForm from "@/components/testimonial-form";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const stats = [
    { icon: Star, value: "4.9/5", label: "Avaliação Média", color: "text-yellow-500" },
    { icon: UserCheck, value: "98%", label: "Satisfação dos Pacientes", color: "text-green-600" },
    { icon: TrendingUp, value: "10k+", label: "Avaliações Positivas", color: "text-blue-600" },
    { icon: Calendar, value: "15+", label: "Anos de Excelência", color: "text-purple-600" },
  ];

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
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
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Depoimentos dos Pacientes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A satisfação dos nossos pacientes é nossa maior recompensa. 
            Veja o que eles têm a dizer sobre nossa clínica e atendimento.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-6 shadow-lg">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto bg-gray-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="bg-gray-50 hover:shadow-lg transition-shadow relative">
              <CardContent className="p-8">
                <Quote className="w-8 h-8 text-blue-600 mb-4 opacity-50" />
                
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm font-medium">{testimonial.rating}.0</span>
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
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

        {/* Patient Experience */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">O Que Nossos Pacientes Mais Valorizam</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Atendimento Humanizado</h3>
              <p className="text-gray-600">
                Cuidado personalizado e acolhedor, com médicos que dedicam tempo para ouvir e entender cada paciente.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Qualidade do Atendimento</h3>
              <p className="text-gray-600">
                Excelência médica com diagnósticos precisos, tratamentos eficazes e acompanhamento contínuo da saúde.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Facilidade de Agendamento</h3>
              <p className="text-gray-600">
                Sistema de agendamento prático e eficiente, com horários flexíveis que respeitam a rotina dos pacientes.
              </p>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Avaliações Detalhadas</h2>
          <div className="max-w-2xl mx-auto">
            {[5, 4, 3, 2, 1].map((stars) => {
              const percentage = stars === 5 ? 85 : stars === 4 ? 13 : stars === 3 ? 2 : 0;
              return (
                <div key={stars} className="flex items-center mb-3">
                  <div className="flex items-center w-20">
                    <span className="text-sm font-medium mr-2">{stars}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonial Form Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Compartilhe Sua Experiência
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Seu depoimento é muito importante para nós e ajuda outros pacientes a conhecer nosso trabalho.
            </p>
          </div>
          <TestimonialForm />
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 lg:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Faça Parte dos Nossos Pacientes Satisfeitos</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experimente o atendimento de excelência que nossos pacientes tanto elogiam. 
            Agende sua consulta e descubra por que somos tão bem avaliados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Minha Consulta
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Conhecer Nossos Serviços
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
