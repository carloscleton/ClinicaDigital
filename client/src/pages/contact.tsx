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
  Loader2
} from "lucide-react";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactFormSchema = insertContactMessageSchema.extend({
  subject: z.string().min(1, "Assunto é obrigatório"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve. Obrigado!",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Ocorreu um erro. Tente novamente.",
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
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Entre em Contato</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Estamos prontos para atendê-lo. Entre em contato para agendar sua consulta, 
            tirar dúvidas ou obter mais informações sobre nossos serviços.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">Informações de Contato</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Endereço</h3>
                  <p className="text-gray-600">
                    R Vereador Francisco Francilino, 1431 - Centro<br />
                    Baturité, CE - CEP: 62.760-000
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Telefone</h3>
                  <p className="text-gray-600">
                    55(85)99408-6263
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">E-mail</h3>
                  <p className="text-gray-600">
                    georgelucasamaro@hotmail.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Horário de Funcionamento</h3>
                  <p className="text-gray-600">
                    Segunda a Sexta: 7h às 19h<br />
                    Sábado: 8h às 14h<br />
                    Domingo: Emergências
                  </p>
                </div>
              </div>
            </div>
            
            {/* Emergency Info */}
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>Atendimento de Emergência:</strong><br />
                Para emergências médicas, ligue para nosso plantão 24h: <strong>55(85)99408-6263</strong>
              </AlertDescription>
            </Alert>

            {/* Contact Form */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Envie uma Mensagem</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Assunto da mensagem" {...field} />
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
                              rows={4} 
                              placeholder="Escreva sua mensagem..." 
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

        {/* Map and Additional Info */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Google Maps */}
          <div className="rounded-xl overflow-hidden h-80 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.123456789!2d-38.883333!3d-4.316667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMTknMDAuMCJTIDM4wrA1Myc2MC4wIlc!5e0!3m2!1spt-BR!2sbr!4v1640995200000!5m2!1spt-BR!2sbr&q=R.+Vereador+Francisco+Francilino,+1431+-+Centro,+Baturité+-+CE"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da San Mathews Clínica e Laboratório"
            ></iframe>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Como Chegar</h3>
            
            <div className="space-y-4 mb-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Transporte Público</h4>
                <p className="text-gray-600 text-sm">
                  • Terminal Rodoviário de Baturité: 500m da clínica<br />
                  • Ônibus: Linhas municipais com parada próxima
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Estacionamento</h4>
                <p className="text-gray-600 text-sm">
                  Estacionamento na rua disponível. 
                  Localização central de fácil acesso no centro de Baturité.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Acessibilidade</h4>
                <p className="text-gray-600 text-sm">
                  Clínica totalmente acessível com elevadores, rampas e 
                  banheiros adaptados para pessoas com deficiência.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Dicas para sua Consulta</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Chegue 15 minutos antes do horário marcado</li>
                <li>• Traga documentos de identidade e carteirinha do convênio</li>
                <li>• Liste seus medicamentos e exames anteriores</li>
                <li>• Prepare suas dúvidas e sintomas para relatar ao médico</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
