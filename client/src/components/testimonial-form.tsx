import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, MessageSquare, User, MapPin } from "lucide-react";

const testimonialSchema = z.object({
  authorName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  location: z.string().min(2, "Local deve ter pelo menos 2 caracteres"),
  content: z.string().min(10, "Depoimento deve ter pelo menos 10 caracteres").max(500, "Depoimento deve ter no máximo 500 caracteres"),
  rating: z.number().min(1, "Avaliação é obrigatória").max(5),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export default function TestimonialForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      authorName: "",
      location: "",
      content: "",
      rating: 5,
    },
  });

  const createTestimonialMutation = useMutation({
    mutationFn: async (data: TestimonialFormData) => {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create testimonial");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsSubmitted(true);
      toast({
        title: "Depoimento enviado com sucesso!",
        description: "Obrigado por compartilhar sua experiência conosco.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar depoimento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      console.error("Erro ao criar depoimento:", error);
    },
  });

  const onSubmit = (data: TestimonialFormData) => {
    createTestimonialMutation.mutate(data);
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`w-8 h-8 transition-colors ${
              star <= rating 
                ? "text-yellow-400 hover:text-yellow-500" 
                : "text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500"
            }`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Depoimento Enviado!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Obrigado por compartilhar sua experiência. Seu feedback é muito importante para nós.
              </p>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="mt-4"
            >
              Enviar Outro Depoimento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Compartilhe Sua Experiência
        </CardTitle>
        <CardDescription className="text-base">
          Conte-nos sobre sua experiência na San Mathews Clínica e Laboratório. 
          Seu depoimento ajuda outros pacientes e nos motiva a sempre melhorar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome completo" 
                        {...field} 
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Cidade
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Baturité, CE" 
                        {...field} 
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Avaliação Geral
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <StarRating 
                        rating={field.value} 
                        onRatingChange={field.onChange}
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {field.value === 1 && "Muito insatisfeito"}
                        {field.value === 2 && "Insatisfeito"}
                        {field.value === 3 && "Neutro"}
                        {field.value === 4 && "Satisfeito"}
                        {field.value === 5 && "Muito satisfeito"}
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Depoimento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte-nos sobre sua experiência: como foi o atendimento, os profissionais, a qualidade dos serviços, o ambiente da clínica..."
                      className="min-h-[120px] resize-none"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {field.value?.length || 0}/500 caracteres
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={createTestimonialMutation.isPending}
                className="flex-1"
              >
                Limpar Formulário
              </Button>
              <Button
                type="submit"
                disabled={createTestimonialMutation.isPending}
                className="flex-1"
              >
                {createTestimonialMutation.isPending ? "Enviando..." : "Enviar Depoimento"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}