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
      icon: Heart,
      name: "Cardiologia",
      description: "Cuidados especializados para o coração e sistema cardiovascular",
      details: "Nossos cardiologistas oferecem diagnóstico e tratamento completo para doenças cardíacas, incluindo hipertensão, arritmias, insuficiência cardíaca e prevenção de infartos.",
      treatments: [
        "Eletrocardiograma (ECG)",
        "Ecocardiograma",
        "Teste ergométrico",
        "Holter 24h",
        "Cateterismo cardíaco"
      ],
      color: "bg-red-100 text-red-600 border-red-200"
    },
    {
      icon: Brain,
      name: "Neurologia",
      description: "Diagnóstico e tratamento de doenças neurológicas",
      details: "Especialistas em doenças do sistema nervoso, oferecendo tratamento para enxaquecas, epilepsia, AVC, Parkinson, Alzheimer e outras condições neurológicas.",
      treatments: [
        "Eletroencefalograma (EEG)",
        "Ressonância magnética",
        "Tomografia computadorizada",
        "Punção lombar",
        "Eletromiografia"
      ],
      color: "bg-purple-100 text-purple-600 border-purple-200"
    },
    {
      icon: Bone,
      name: "Ortopedia",
      description: "Tratamento de lesões e doenças do sistema músculo-esquelético",
      details: "Cuidamos de fraturas, lesões esportivas, problemas na coluna, artrose, artrite e realizamos cirurgias ortopédicas com técnicas minimamente invasivas.",
      treatments: [
        "Raio-X digital",
        "Ressonância magnética",
        "Artroscopia",
        "Infiltrações",
        "Fisioterapia especializada"
      ],
      color: "bg-blue-100 text-blue-600 border-blue-200"
    },
    {
      icon: Eye,
      name: "Oftalmologia",
      description: "Cuidados especializados para a saúde dos olhos",
      details: "Tratamento completo para problemas de visão, glaucoma, catarata, retinopatia diabética e cirurgias oftalmológicas de alta precisão.",
      treatments: [
        "Exame de fundo de olho",
        "Tonometria",
        "Campimetria",
        "OCT de retina",
        "Cirurgia de catarata"
      ],
      color: "bg-green-100 text-green-600 border-green-200"
    },
    {
      icon: Baby,
      name: "Pediatria",
      description: "Atendimento especializado para crianças e adolescentes",
      details: "Cuidados médicos completos desde o nascimento até a adolescência, incluindo puericultura, vacinação e tratamento de doenças infantis.",
      treatments: [
        "Consultas de puericultura",
        "Vacinação completa",
        "Teste do pezinho",
        "Avaliação do desenvolvimento",
        "Atendimento de urgências pediátricas"
      ],
      color: "bg-pink-100 text-pink-600 border-pink-200"
    },
    {
      icon: Users,
      name: "Ginecologia",
      description: "Saúde integral da mulher em todas as fases da vida",
      details: "Acompanhamento ginecológico, pré-natal, planejamento familiar, menopausa e tratamento de patologias ginecológicas.",
      treatments: [
        "Papanicolau",
        "Ultrassom pélvico",
        "Colposcopia",
        "Densitometria óssea",
        "Acompanhamento pré-natal"
      ],
      color: "bg-rose-100 text-rose-600 border-rose-200"
    },
    {
      icon: Activity,
      name: "Pneumologia",
      description: "Especialistas em doenças respiratórias e pulmonares",
      details: "Tratamento de asma, bronquite, pneumonia, DPOC, apneia do sono e outras doenças do sistema respiratório.",
      treatments: [
        "Espirometria",
        "Gasometria arterial",
        "Tomografia de tórax",
        "Broncoscopia",
        "Polissonografia"
      ],
      color: "bg-cyan-100 text-cyan-600 border-cyan-200"
    },
    {
      icon: Pill,
      name: "Endocrinologia",
      description: "Tratamento de distúrbios hormonais e metabólicos",
      details: "Especialistas em diabetes, tireoide, obesidade, distúrbios hormonais e síndrome metabólica.",
      treatments: [
        "Glicemia e hemoglobina glicada",
        "Perfil hormonal completo",
        "Ultrassom de tireoide",
        "Densitometria óssea",
        "Bioimpedância"
      ],
      color: "bg-amber-100 text-amber-600 border-amber-200"
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
