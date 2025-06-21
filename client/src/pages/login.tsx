import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield, Stethoscope } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulação de autenticação - aqui seria feita a chamada real para a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em caso de sucesso, redirecionar para dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Credenciais inválidas. Verifique seu usuário e senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 w-20 h-20 bg-blue-600 dark:bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            San Mathews
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema de Gestão Clínica
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Entre com suas credenciais para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        Usuário
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Digite seu usuário"
                            className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        Senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            className="pl-10 pr-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          Manter-me conectado
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Entrando...
                    </div>
                  ) : (
                    "Entrar no Sistema"
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center space-y-4">
              <Button
                variant="link"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                Esqueceu sua senha?
              </Button>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Site
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              Conexão Segura SSL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}