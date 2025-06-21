import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">San Mathews</h3>
                <p className="text-gray-400 text-sm">Clínica e Laboratório</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              A San Mathews Clínica e Laboratório está comprometida em oferecer atendimento médico de excelência, 
              combinando tecnologia avançada com o cuidado humanizado que nossos pacientes merecem.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Serviços</Link></li>
              <li><Link href="/specialties" className="text-gray-300 hover:text-white transition-colors">Especialidades</Link></li>
              <li><Link href="/doctors" className="text-gray-300 hover:text-white transition-colors">Nossa Equipe</Link></li>
              <li><Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors">Depoimentos</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Especialidades</h4>
            <ul className="space-y-3">
              <li><Link href="/specialties" className="text-gray-300 hover:text-white transition-colors">Cardiologia</Link></li>
              <li><Link href="/specialties" className="text-gray-300 hover:text-white transition-colors">Neurologia</Link></li>
              <li><Link href="/specialties" className="text-gray-300 hover:text-white transition-colors">Ortopedia</Link></li>
              <li><Link href="/specialties" className="text-gray-300 hover:text-white transition-colors">Pediatria</Link></li>
              <li><Link href="/specialties" className="text-gray-300 hover:text-white transition-colors">Ginecologia</Link></li>
              <li><Link href="/specialties" className="text-gray-300 hover:text-white transition-colors">Ver todas</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Clínica MedCare. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Uso</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">LGPD</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
