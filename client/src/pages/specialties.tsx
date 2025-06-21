import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Heart, 
  Brain, 
  Bone, 
  Eye, 
  Baby,
  Activity,
  Stethoscope,
  Pill,
  UserCheck,
  Users,
  Calendar
} from "lucide-react";

export default function Specialties() {
  const specialties = [
    {
      icon: Activity,
      name: "Ultrassonografia",
      description: "Exames de imagem para diagnóstico preciso e não invasivo",
      details: "Nossa equipe de ultrassonografistas realiza exames diagnósticos com equipamentos de alta resolução, oferecendo imagens precisas para auxílio médico.",
      treatments: [
        "Ultrassom abdominal total",
        "Ultrassom pélvico e transvaginal",
        "Ultrassom obstétrico",
        "Ultrassom de tireoide",
        "Doppler vascular"
      ],
      color: "bg-blue-100 text-blue-600 border-blue-200"
    },
    {
      icon: Stethoscope,
      name: "Clínica Médica",
      description: "Atendimento clínico geral abrangente e humanizado",
      details: "Nossos clínicos gerais oferecem consultas completas, diagnóstico de doenças comuns, acompanhamento de pacientes crônicos e medicina preventiva.",
      treatments: [
        "Consultas clínicas gerais",
        "Check-up médico completo",
        "Acompanhamento de hipertensão",
        "Controle de diabetes",
        "Avaliação geriátrica"
      ],
      color: "bg-green-100 text-green-600 border-green-200"
    },
    {
      icon: Heart,
      name: "Medicina Preventiva",
      description: "Prevenção e promoção da saúde em todas as idades",
      details: "Especialistas em medicina preventiva focados em programas de saúde, check-ups periódicos e orientação para manutenção da qualidade de vida.",
      treatments: [
        "Check-up executivo",
        "Avaliação de risco cardiovascular",
        "Programas de vacinação",
        "Orientação nutricional",
        "Medicina do trabalho"
      ],
      color: "bg-red-100 text-red-600 border-red-200"
    },
    {
      icon: UserCheck,
      name: "Pequenas Cirurgias",
      description: "Procedimentos cirúrgicos ambulatoriais seguros",
      details: "Realizamos pequenos procedimentos cirúrgicos com técnicas minimamente invasivas, garantindo rápida recuperação e máximo conforto.",
      treatments: [
        "Remoção de lipomas",
        "Biópsia de pele",
        "Cauterização de verrugas",
        "Sutura de ferimentos",
        "Drenagem de abscessos"
      ],
      color: "bg-purple-100 text-purple-600 border-purple-200"
    },
    {
      icon: Pill,
      name: "Nutrologia",
      description: "Especialização em nutrição clínica e terapia nutricional",
      details: "Nutrólogos especializados no diagnóstico e tratamento de doenças relacionadas à alimentação, oferecendo planos nutricionais personalizados.",
      treatments: [
        "Avaliação nutricional completa",
        "Bioimpedância corporal",
        "Plano alimentar personalizado",
        "Suplementação nutricional",
        "Tratamento da obesidade"
      ],
      color: "bg-orange-100 text-orange-600 border-orange-200"
    },
    {
      icon: Activity,
      name: "Endoscopia Digestiva",
      description: "Diagnóstico avançado do sistema digestivo",
      details: "Procedimentos endoscópicos para diagnóstico e tratamento de doenças do esôfago, estômago e duodeno com equipamentos de última geração.",
      treatments: [
        "Endoscopia digestiva alta (EDA)",
        "Colonoscopia",
        "Biópsia endoscópica",
        "Remoção de pólipos",
        "pH-metria esofágica"
      ],
      color: "bg-teal-100 text-teal-600 border-teal-200"
    },
    {
      icon: Brain,
      name: "Psicanálise",
      description: "Terapia psicanalítica para bem-estar mental",
      details: "Atendimento psicanalítico individualizado com foco no autoconhecimento, resolução de conflitos internos e melhoria da qualidade de vida emocional.",
      treatments: [
        "Sessões de psicanálise individual",
        "Análise de sonhos",
        "Terapia psicanalítica",
        "Acompanhamento psicológico",
        "Orientação familiar"
      ],
      color: "bg-indigo-100 text-indigo-600 border-indigo-200"
    },
    {
      icon: Users,
      name: "Ginecologia",
      description: "Saúde integral da mulher em todas as fases da vida",
      details: "Cuidados ginecológicos completos incluindo prevenção, diagnóstico e tratamento de doenças, além de acompanhamento da saúde reprodutiva.",
      treatments: [
        "Exame ginecológico completo",
        "Papanicolau",
        "Ultrassom pélvico",
        "Colposcopia",
        "Planejamento familiar"
      ],
      color: "bg-pink-100 text-pink-600 border-pink-200"
    },
    {
      icon: Brain,
      name: "Neurologia",
      description: "Diagnóstico e tratamento especializado de doenças neurológicas",
      details: "Neurologistas experientes no tratamento de doenças do sistema nervoso, oferecendo diagnóstico preciso e terapias avançadas.",
      treatments: [
        "Consulta neurológica completa",
        "Eletroencefalograma (EEG)",
        "Avaliação de cefaleia",
        "Diagnóstico de epilepsia",
        "Acompanhamento neurológico"
      ],
      color: "bg-violet-100 text-violet-600 border-violet-200"
    },
    {
      icon: Eye,
      name: "Dermatologia",
      description: "Cuidados especializados para saúde da pele",
      details: "Dermatologistas dedicados ao diagnóstico e tratamento de doenças da pele, cabelo e unhas, incluindo procedimentos estéticos.",
      treatments: [
        "Consulta dermatológica",
        "Dermatoscopia digital",
        "Biópsia de pele",
        "Tratamento de acne",
        "Remoção de lesões cutâneas"
      ],
      color: "bg-yellow-100 text-yellow-600 border-yellow-200"
    }
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Especialidades Médicas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Contamos com profissionais altamente qualificados em diversas especialidades médicas, 
            oferecendo atendimento especializado e tratamentos de última geração.
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {specialties.map((specialty, index) => (
            <Card key={index} className={`hover:shadow-xl transition-shadow border-2 ${specialty.color}`}>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${specialty.color}`}>
                    <specialty.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{specialty.name}</h3>
                    <p className="text-gray-600 font-medium">{specialty.description}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">{specialty.details}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Exames e Tratamentos:</h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {specialty.treatments.map((treatment, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/contact">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Por Que Escolher Nossa Clínica?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Profissionais Qualificados</h3>
              <p className="text-gray-600">
                Médicos especialistas com formação em renomadas instituições e vasta experiência clínica.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Tecnologia Avançada</h3>
              <p className="text-gray-600">
                Equipamentos de última geração para diagnósticos precisos e tratamentos eficazes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Atendimento Humanizado</h3>
              <p className="text-gray-600">
                Cuidado personalizado e acolhedor, focado no bem-estar e conforto do paciente.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-2xl p-8 lg:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Precisa de um Especialista?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nossa equipe de especialistas está pronta para oferecer o melhor cuidado para sua saúde. 
            Agende sua consulta e receba atendimento de excelência.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
            </Link>
            <Link href="/doctors">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <UserCheck className="w-5 h-5 mr-2" />
                Conhecer Médicos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
