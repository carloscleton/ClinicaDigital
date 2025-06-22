import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AppointmentForm from "@/components/appointment-form";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  AlertTriangle,
  Calendar,
  MessageCircle,
  Loader2,
  Eye,
  Navigation,
  ExternalLink
} from "lucide-react";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactFormSchema = insertContactMessageSchema.extend({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      setShowSuccess(true);
      form.reset();
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });
      setTimeout(() => setShowSuccess(false), 5000);
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato por telefone.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6">Entre em Contato</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Estamos prontos para atendê-lo. Entre em contato para agendar sua consulta, 
            esclarecer dúvidas ou obter mais informações sobre nossos serviços.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Phone */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Telefone</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Ligue para agendar ou tirar dúvidas</p>
              <a href="tel:+5585994086263" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                (85) 99408-6263
              </a>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Envie sua mensagem</p>
              <a href="mailto:georgelucasamaro@hotmail.com" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                georgelucasamaro@hotmail.com
              </a>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Localização</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Venha nos visitar</p>
              <p className="text-red-600 font-semibold">
                R. Vereador Francisco Francilino, 1431<br />
                Centro, Baturité - CE
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form and Appointment */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Envie uma Mensagem</h2>
                
                {showSuccess && (
                  <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
                    <AlertTriangle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(85) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Assunto da sua mensagem" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Escreva sua mensagem..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <MessageCircle className="w-4 h-4 mr-2" />
                      )}
                      {mutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Appointment Form */}
          <AppointmentForm />
        </div>

        {/* Enhanced Google Maps Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Nossa Localização</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Encontre-nos facilmente no centro de Baturité
            </p>
          </div>

          {/* Map Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Map Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">San Mathews Clínica e Laboratório</h3>
                  <p className="text-blue-100 mt-1">R. Vereador Francisco Francilino, 1431 - Centro, Baturité, CE</p>
                </div>
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div className="relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.745!2d-38.8832!3d-4.3167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMTknMDAuMCJTIDM4wrA1Myc2MC4wIlc!5e0!3m2!1spt-BR!2sbr!4v1672531200000!5m2!1spt-BR!2sbr&q=R.+Vereador+Francisco+Francilino,+1431+-+Centro,+Baturité+-+CE"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da San Mathews Clínica e Laboratório"
                className="w-full"
              />
            </div>

            {/* Map Info Panel */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Address Info */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Endereço Completo</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        R. Vereador Francisco Francilino, 1431<br />
                        Centro, Baturité - CE<br />
                        CEP: 62.760-000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Contato</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        (85) 99408-6263<br />
                        georgelucasamaro@hotmail.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Ações Rápidas</h4>
                  
                  <a 
                    href="https://www.google.com/maps/dir//R.+Vereador+Francisco+Francilino,+1431+-+Centro,+Baturité+-+CE,+62760-000" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Como Chegar
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  
                  <a 
                    href="https://www.google.com/maps/place/R.+Vereador+Francisco+Francilino,+1431+-+Centro,+Baturité+-+CE,+62760-000" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver no Google Maps
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  
                  <button 
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                          const lat = position.coords.latitude;
                          const lng = position.coords.longitude;
                          window.open(`https://www.google.com/maps/dir/${lat},${lng}/R.+Vereador+Francisco+Francilino,+1431+-+Centro,+Baturité+-+CE,+62760-000`, '_blank');
                        });
                      } else {
                        alert('Geolocalização não suportada pelo seu navegador');
                      }
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Navegar da Minha Localização
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Informações de Acesso</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Horário de Funcionamento</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Segunda à Sexta: 7:00 - 18:00<br />
                    Sábado: 7:00 - 12:00<br />
                    Domingo: Fechado
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Facilidades</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    • Estacionamento gratuito<br />
                    • Acessibilidade para cadeirantes<br />
                    • Localização central<br />
                    • Fácil acesso por transporte público
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Agendamento Rápido</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-400">Agende sua Consulta</h4>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                Oferecemos agendamento online 24h ou por telefone durante horário comercial.
              </p>
              <div className="space-y-2">
                <a 
                  href="tel:+5585994086263" 
                  className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar: (85) 99408-6263
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}