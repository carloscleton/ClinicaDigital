import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "appointment" | "reminder" | "system" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  urgent?: boolean;
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "appointment",
      title: "Novo Agendamento",
      message: "Maria Silva agendou consulta de Ultrassonografia para amanhã às 14:00",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      urgent: true
    },
    {
      id: "2",
      type: "reminder",
      title: "Lembrete de Consulta",
      message: "Consulta com Dr. Epitácio em 30 minutos - João Santos",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      urgent: true
    },
    {
      id: "3",
      type: "system",
      title: "Sistema Atualizado",
      message: "Nova versão do sistema foi instalada com melhorias de performance",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    },
    {
      id: "4",
      type: "success",
      title: "Exame Concluído",
      message: "Resultado do exame de Carlos Eduardo foi processado com sucesso",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "reminder":
        return <Clock className="h-4 w-4" />;
      case "system":
        return <AlertCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "reminder":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
      case "system":
        return "text-purple-600 bg-purple-50 dark:bg-purple-900/20";
      case "success":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  // Simular novas notificações
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: "appointment",
          title: "Novo Agendamento",
          message: "Paciente agendou consulta online"
        },
        {
          type: "reminder",
          title: "Lembrete",
          message: "Consulta iniciando em breve"
        },
        {
          type: "success",
          title: "Exame Processado",
          message: "Resultado disponível para visualização"
        }
      ];

      if (Math.random() > 0.7) { // 30% de chance
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomNotification.type as any,
          title: randomNotification.title,
          message: randomNotification.message,
          timestamp: new Date(),
          read: false,
          urgent: Math.random() > 0.5
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notificações
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer",
                      !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-full flex-shrink-0",
                        getNotificationColor(notification.type)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            !notification.read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
                          )}>
                            {notification.title}
                            {notification.urgent && (
                              <Badge variant="destructive" className="ml-2 text-xs">
                                Urgente
                              </Badge>
                            )}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="p-1 h-auto opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}