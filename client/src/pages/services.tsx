import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Stethoscope, 
  Activity, 
  UserCheck, 
  Microscope,
  Shield,
  Clock,
  Check,
  Calendar,
  Phone
} from "lucide-react";

export default function Services() {
  const mainServices = [
    {
      icon: Stethoscope,
      title: "Consultas Médicas",
      description: "Atendimento clínico geral e especializado com profissionais experientes e dedicados ao seu bem-estar.",
      features: [
        "Consultas de urgência e rotina",
        "Avaliação médica completa", 
        "Acompanhamento contínuo",
        "Atendimento personalizado"
      ],
      price: "A partir de R$ 150"
    },
    {
      icon: Activity,
      title: "Exames Diagnósticos",
      description: "Tecnologia de ponta para diagnósticos precisos e rápidos, garantindo o melhor tratamento para você.",
      features: [
        "Exames laboratoriais completos",
        "Ultrassonografia e radiologia", 
        "Resultados em até 24h",
        "Laudos digitais"
      ],
      price: "Valores variados"
    },
    {
      icon: UserCheck,
      title: "Tratamentos Especializados",
      description: "Tratamentos personalizados com foco na recuperação completa e prevenção de doenças.",
      features: [
        "Planos de tratamento individualizados",
        "Acompanhamento multidisciplinar",
        "Medicina preventiva",
        "Reabilitação completa"
      ],
      price: "Consulte valores"
    }
  ];

  const additionalServices = [
    {
      icon: Microscope,
      title: "Laboratório Próprio",
      description: "Exames laboratoriais com qualidade e agilidade"
    },
    {
      icon: Shield,
      title: "Medicina Preventiva",
      description: "Programas de prevenção e check-ups completos"
    },
    {
      icon: Clock,
      title: "Atendimento 24h",
      description: "Plantão médico para emergências"
    }
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Nossos Serviços</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Oferecemos uma ampla gama de serviços médicos com tecnologia avançada, 
            atendimento humanizado e foco na excelência em saúde.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {mainServices.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="border-t pt-6">
                  <div className="text-lg font-semibold text-blue-600 mb-4">{service.price}</div>
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Agendar Consulta
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Serviços Adicionais</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <service.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Process */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Como Funciona Nosso Atendimento</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white font-bold">1</div>
              <h3 className="font-semibold text-gray-800 mb-2">Agendamento</h3>
              <p className="text-sm text-gray-600">Agende online, por telefone ou WhatsApp</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white font-bold">2</div>
              <h3 className="font-semibold text-gray-800 mb-2">Chegada</h3>
              <p className="text-sm text-gray-600">Recepção acolhedora e check-in rápido</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white font-bold">3</div>
              <h3 className="font-semibold text-gray-800 mb-2">Consulta</h3>
              <p className="text-sm text-gray-600">Atendimento personalizado e humanizado</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white font-bold">4</div>
              <h3 className="font-semibold text-gray-800 mb-2">Acompanhamento</h3>
              <p className="text-sm text-gray-600">Seguimento do tratamento e cuidado contínuo</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-2xl p-8 lg:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Precisa de Atendimento Médico?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para oferecer o melhor cuidado para sua saúde. 
            Agende sua consulta e experimente a excelência em atendimento médico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Phone className="w-5 h-5 mr-2" />
              (11) 3456-7890
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
