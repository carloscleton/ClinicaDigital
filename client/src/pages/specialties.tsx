import { useQuery } from "@tanstack/react-query";
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
  const { data: specialtiesData, isLoading: specialtiesLoading } = useQuery<any[]>({
    queryKey: ["/api/supabase/especialidades"],
  });

  // Function to get icon, color, and details for each specialty
  const getSpecialtyProps = (specialtyName: string) => {
    const specialtyMap: Record<string, { icon: any; color: string; description: string; details: string; treatments: string[] }> = {
      "Ultrassonografia": {
        icon: Activity,
        color: "bg-blue-100 text-blue-600 border-blue-200",
        description: "Exames de imagem para diagnóstico preciso e não invasivo",
        details: "Nossa equipe de ultrassonografistas realiza exames diagnósticos com equipamentos de alta resolução, oferecendo imagens precisas para auxílio médico.",
        treatments: [
          "Ultrassom abdominal total",
          "Ultrassom pélvico e transvaginal", 
          "Ultrassom obstétrico",
          "Ultrassom de tireoide",
          "Doppler vascular"
        ]
      },
      "Clinico Geral": {
        icon: Stethoscope,
        color: "bg-green-100 text-green-600 border-green-200",
        description: "Atendimento clínico geral abrangente e humanizado",
        details: "Nossos clínicos gerais oferecem consultas completas, diagnóstico de doenças comuns, acompanhamento de pacientes crônicos e medicina preventiva.",
        treatments: [
          "Consultas clínicas gerais",
          "Check-up médico completo",
          "Acompanhamento de hipertensão",
          "Controle de diabetes",
          "Avaliação geriátrica"
        ]
      },
      "Ginecologista": {
        icon: Baby,
        color: "bg-pink-100 text-pink-600 border-pink-200",
        description: "Saúde integral da mulher em todas as fases",
        details: "Especialistas dedicados à saúde feminina, oferecendo cuidados preventivos, diagnósticos e tratamentos específicos para mulheres.",
        treatments: [
          "Consultas ginecológicas",
          "Exames preventivos",
          "Acompanhamento pré-natal",
          "Planejamento familiar",
          "Tratamento de infecções"
        ]
      },
      "Dermatologista": {
        icon: Eye,
        color: "bg-purple-100 text-purple-600 border-purple-200",
        description: "Cuidados especializados da pele e anexos",
        details: "Profissionais especializados no diagnóstico e tratamento de doenças da pele, cabelos e unhas.",
        treatments: [
          "Consultas dermatológicas",
          "Tratamento de acne",
          "Remoção de lesões",
          "Dermatoscopia",
          "Procedimentos estéticos"
        ]
      },
      "Neurologista": {
        icon: Brain,
        color: "bg-indigo-100 text-indigo-600 border-indigo-200",
        description: "Diagnóstico e tratamento neurológico especializado",
        details: "Especialistas em doenças do sistema nervoso, oferecendo diagnósticos precisos e tratamentos eficazes.",
        treatments: [
          "Consultas neurológicas",
          "Eletroencefalograma",
          "Tratamento de enxaquecas",
          "Acompanhamento de epilepsia",
          "Avaliação de memória"
        ]
      },
      "Cirurgião": {
        icon: UserCheck,
        color: "bg-red-100 text-red-600 border-red-200",
        description: "Procedimentos cirúrgicos especializados",
        details: "Cirurgiões experientes realizando procedimentos com técnicas modernas e seguras.",
        treatments: [
          "Pequenas cirurgias",
          "Cirurgias ambulatoriais",
          "Remoção de cistos",
          "Suturas especializadas",
          "Procedimentos minimamente invasivos"
        ]
      },
      "Nutrólogo": {
        icon: Heart,
        color: "bg-orange-100 text-orange-600 border-orange-200",
        description: "Nutrição clínica e metabólica",
        details: "Especialistas em nutrição médica para tratamento e prevenção de doenças relacionadas à alimentação.",
        treatments: [
          "Avaliação nutricional",
          "Planos alimentares",
          "Tratamento de obesidade",
          "Suplementação",
          "Acompanhamento metabólico"
        ]
      },
      "Psicoanalista": {
        icon: Brain,
        color: "bg-teal-100 text-teal-600 border-teal-200",
        description: "Saúde mental e análise psicológica",
        details: "Profissionais especializados em saúde mental oferecendo terapia e acompanhamento psicológico.",
        treatments: [
          "Sessões de terapia",
          "Análise psicológica",
          "Tratamento de ansiedade",
          "Acompanhamento de depressão",
          "Terapia familiar"
        ]
      },
      "Ortopedia": {
        icon: Bone,
        color: "bg-gray-100 text-gray-600 border-gray-200",
        description: "Tratamento do sistema músculo-esquelético",
        details: "Especialistas em lesões e doenças dos ossos, músculos, articulações e ligamentos.",
        treatments: [
          "Consultas ortopédicas",
          "Tratamento de fraturas",
          "Infiltrações",
          "Fisioterapia orientada",
          "Cirurgias ortopédicas"
        ]
      },
      "Pediatria": {
        icon: Baby,
        color: "bg-yellow-100 text-yellow-600 border-yellow-200",
        description: "Cuidados médicos especializados para crianças",
        details: "Pediatras dedicados ao cuidado integral da saúde infantil desde o nascimento até a adolescência.",
        treatments: [
          "Consultas pediátricas",
          "Vacinação infantil",
          "Acompanhamento do crescimento",
          "Tratamento de doenças infantis",
          "Orientação aos pais"
        ]
      }
    };
    
    return specialtyMap[specialtyName] || {
      icon: UserCheck,
      color: "bg-gray-100 text-gray-600 border-gray-200",
      description: "Atendimento médico especializado",
      details: "Profissionais qualificados oferecendo atendimento médico especializado com foco na excelência e cuidado humanizado.",
      treatments: [
        "Consultas especializadas",
        "Diagnósticos precisos",
        "Tratamentos personalizados",
        "Acompanhamento médico",
        "Orientações preventivas"
      ]
    };
  };

  // Transform database specialties data
  const specialties = (specialtiesData || []).map((specialty: any) => {
    const props = getSpecialtyProps(specialty.name);
    return {
      icon: props.icon,
      name: specialty.name,
      description: props.description,
      details: props.details,
      treatments: props.treatments,
      color: props.color
    };
  });

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">Especialidades Médicas</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Contamos com profissionais altamente qualificados em diversas especialidades médicas, 
            oferecendo atendimento especializado e tratamentos de última geração.
          </p>
        </div>

        {/* Loading State */}
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
          <>
            {/* Compact Specialties Grid */}
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

            {/* Detailed Specialties Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-20">
              {specialties.map((specialty, index) => (
                <Card key={index} className={`hover:shadow-xl transition-shadow border-2 ${specialty.color}`}>
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${specialty.color}`}>
                          <specialty.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{specialty.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 font-medium">{specialty.description}</p>
                        </div>
                      </div>
                      <Link href="/contact">
                        <Button className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
                          <Calendar className="w-4 h-4 mr-2" />
                          Agendar
                        </Button>
                      </Link>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{specialty.details}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Exames e Tratamentos:</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {specialty.treatments.map((treatment, idx) => (
                          <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Why Choose Us */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 lg:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">Por Que Escolher Nossa Clínica?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Profissionais Qualificados</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Médicos especialistas com formação em renomadas instituições e vasta experiência clínica.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Tecnologia Avançada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Equipamentos de última geração para diagnósticos precisos e tratamentos eficazes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Atendimento Humanizado</h3>
              <p className="text-gray-600 dark:text-gray-400">
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