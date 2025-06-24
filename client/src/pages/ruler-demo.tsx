import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VerticalTimeRuler from "@/components/vertical-time-ruler";

export default function RulerDemo() {
  const [selectedDay, setSelectedDay] = useState("Segunda");
  const [selectedExample, setSelectedExample] = useState("example1");
  
  const examples = {
    example1: `🕒 Dias e Horários de Atendimento - para uso interno do sistema de marcação
Segunda: 8h:00 às 13h00
Terça: 14h:00 às 18h00
Quarta: ❌ Agenda Fechada
Quinta: ❌ Agenda Fechada
Sexta: ❌ Agenda Fechada
Sábado: 9h00 às 13h00
Domingo: ❌ Fechado
Duração da Consulta: 60 Minutos (Obrigatório)
Intervalo entre Pacientes para atendimento: 5 minutos
intervalo para o almoço: 12 às 13h00`,
    
    example2: `🕒 Dias e Horários de Atendimento - para uso interno do sistema de marcação
Segunda: 08:00 às 18:00
Terça: 08:00 às 18:00
Quarta: 08:00 às 18:00
Quinta: 08:00 às 18:00
Sexta: 08:00 às 18:00
Sábado: ❌ Fechado
Domingo: ❌ Fechado
Duração da Consulta: 30 Minutos (Obrigatório)
Intervalo entre Pacientes para atendimento: 10 minutos
intervalo para o almoço: 12:00 às 14:00`,
    
    example3: `🕒 Dias e Horários de Atendimento - para uso interno do sistema de marcação
Segunda: 07:00 às 12:00
Terça: 13:00 às 19:00
Quarta: 07:00 às 19:00
Quinta: ❌ Agenda Fechada
Sexta: ❌ Agenda Fechada
Sábado: 08:00 às 12:00
Domingo: ❌ Fechado
Duração da Consulta: 45 Minutos (Obrigatório)
Intervalo entre Pacientes para atendimento: 15 minutos
intervalo para o almoço: 12:00 às 13:00`
  };
  
  const bookedSlots = [
    { time: "09:00", patientName: "Maria Silva" },
    { time: "10:05", patientName: "João Santos" },
    { time: "11:10", patientName: "Ana Oliveira" }
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Demonstração da Régua de Horários</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Dia da Semana</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Segunda">Segunda-feira</SelectItem>
                    <SelectItem value="Terça">Terça-feira</SelectItem>
                    <SelectItem value="Quarta">Quarta-feira</SelectItem>
                    <SelectItem value="Quinta">Quinta-feira</SelectItem>
                    <SelectItem value="Sexta">Sexta-feira</SelectItem>
                    <SelectItem value="Sábado">Sábado</SelectItem>
                    <SelectItem value="Domingo">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Exemplo de Configuração</label>
                <Select value={selectedExample} onValueChange={setSelectedExample}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="example1">Exemplo 1 - Padrão</SelectItem>
                    <SelectItem value="example2">Exemplo 2 - Horário Comercial</SelectItem>
                    <SelectItem value="example3">Exemplo 3 - Horário Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Configuração Atual:</h3>
                <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-auto max-h-[300px]">
                  {examples[selectedExample as keyof typeof examples]}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="ruler">
            <TabsList className="mb-4">
              <TabsTrigger value="ruler">Régua de Horários</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ruler">
              <VerticalTimeRuler 
                atendimentos={examples[selectedExample as keyof typeof examples]} 
                selectedDay={selectedDay}
                bookedSlots={bookedSlots}
              />
            </TabsContent>
            
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre a Régua de Horários</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    A régua vertical de horários exibe todos os horários disponíveis para atendimento de um profissional em um determinado dia da semana.
                  </p>
                  
                  <h3 className="font-semibold">Características:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Exibe apenas os horários dentro do expediente do profissional</li>
                    <li>Destaca visualmente os horários já ocupados/agendados</li>
                    <li>Permite scroll vertical para navegar entre os horários</li>
                    <li>Exibe intervalos conforme a duração configurada para cada consulta</li>
                    <li>Indica claramente o período (manhã/tarde/noite)</li>
                    <li>Respeita os intervalos e pausas cadastrados para o profissional</li>
                    <li>Desabilita horários que não podem ser agendados</li>
                  </ul>
                  
                  <h3 className="font-semibold">Legenda:</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded-sm mr-2"></div>
                      <span className="text-sm">Disponível</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 rounded-sm mr-2"></div>
                      <span className="text-sm">Agendado</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-sm mr-2"></div>
                      <span className="text-sm">Intervalo/Almoço</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm mr-2"></div>
                      <span className="text-sm">Indisponível/Fechado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}