import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="bg-gradient-to-r from-blue-800/90 to-blue-600/90 relative">
        <div 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
          className="absolute inset-0"
        />
        <div className="relative container mx-auto px-3 sm:px-4 py-16 sm:py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Cuidando da Sua <span className="text-green-400">Saúde</span> com Excelência
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed">
              Na San Mathews Clínica e Laboratório, oferecemos atendimento médico de qualidade superior com profissionais especializados e tecnologia de ponta. Sua saúde é nossa prioridade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Consulta
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur text-white border-white/30 hover:bg-white/20"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Entre em Contato
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
