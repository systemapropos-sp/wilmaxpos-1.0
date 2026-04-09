import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store';
import {
  Plus,
  ShoppingCart,
  Users,
  Package,
  Truck,
  Boxes,
  X,
  TrendingUp,
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

export function QuickActionsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentPage } = useAppStore();
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const quickActions: QuickAction[] = [
    {
      id: 'new-sale',
      label: 'Nueva Venta',
      icon: ShoppingCart,
      color: 'bg-[#ED6823]',
      onClick: () => {
        setCurrentPage('sales');
        setIsOpen(false);
      },
    },
    {
      id: 'new-client',
      label: 'Nuevo Cliente',
      icon: Users,
      color: 'bg-blue-500',
      onClick: () => {
        setCurrentPage('clients');
        setIsOpen(false);
      },
    },
    {
      id: 'new-product',
      label: 'Nuevo Producto',
      icon: Package,
      color: 'bg-emerald-500',
      onClick: () => {
        setCurrentPage('inventory');
        setIsOpen(false);
      },
    },
    {
      id: 'new-supplier',
      label: 'Nuevo Proveedor',
      icon: Truck,
      color: 'bg-purple-500',
      onClick: () => {
        setCurrentPage('suppliers');
        setIsOpen(false);
      },
    },
    {
      id: 'new-kit',
      label: 'Nuevo Kit',
      icon: Boxes,
      color: 'bg-pink-500',
      onClick: () => {
        setCurrentPage('kits');
        setIsOpen(false);
      },
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: TrendingUp,
      color: 'bg-cyan-500',
      onClick: () => {
        setCurrentPage('reports');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
      {/* Menú de acciones */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className="flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-2 hover:shadow-xl transition-all duration-200 group animate-slide-up"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {action.label}
                </span>
                <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:shadow-xl hover:scale-105 ${
          isOpen ? 'bg-red-500 rotate-45' : 'bg-[#ED6823]'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
