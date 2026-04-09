import { useState } from 'react';
import { Bell, X, Check, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Notification } from '@/types';

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onClear: (id: number) => void;
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const colorMap = {
  info: 'text-blue-500 bg-blue-50',
  success: 'text-green-500 bg-green-50',
  warning: 'text-yellow-500 bg-yellow-50',
  error: 'text-red-500 bg-red-50',
};

export function Notifications({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClear 
}: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ED6823] text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Notificaciones</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-[#ED6823] hover:underline"
                  >
                    Marcar todas como leídas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay notificaciones</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = iconMap[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[notification.type]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm">{notification.title}</p>
                          <p className="text-gray-500 text-sm mt-0.5">{notification.message}</p>
                          <p className="text-gray-400 text-xs mt-1">{notification.date}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="p-1.5 hover:bg-white rounded text-[#ED6823]"
                              title="Marcar como leída"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onClear(notification.id)}
                            className="p-1.5 hover:bg-white rounded text-gray-400 hover:text-red-500"
                            title="Eliminar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Hook para manejar notificaciones
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Bienvenido al Sistema',
      message: 'Has iniciado sesión correctamente. ¡Bienvenido de vuelta!',
      type: 'success',
      date: new Date().toLocaleString(),
      read: false,
    },
    {
      id: 2,
      title: 'Stock Bajo',
      message: 'El producto "Pantalla Samsung A20" tiene solo 7 unidades en stock.',
      type: 'warning',
      date: new Date(Date.now() - 3600000).toLocaleString(),
      read: false,
    },
    {
      id: 3,
      title: 'Nueva Venta',
      message: 'Se ha registrado una nueva venta por RD$5,400.00',
      type: 'info',
      date: new Date(Date.now() - 7200000).toLocaleString(),
      read: true,
    },
  ]);

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      date: new Date().toLocaleString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    toast[notification.type](notification.message);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
  };
}
