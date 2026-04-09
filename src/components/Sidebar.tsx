import { useAppStore } from '@/store';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  Truck,
  BarChart3,
  ShoppingCart,
  Store,
  DollarSign,
  UserCircle,
  Gift,
  FileText,
  History,
  Building2,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Grid3X3,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'products', label: 'Productos', icon: Grid3X3 },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'inventory', label: 'Inventario', icon: Package },
  { id: 'kits', label: 'Kits', icon: Boxes },
  { id: 'suppliers', label: 'Proveedores', icon: Truck },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'purchases', label: 'Compras', icon: ShoppingCart },
  { id: 'sales', label: 'Ventas', icon: Store },
  { id: 'expenses', label: 'Gastos', icon: DollarSign },
  { id: 'employees', label: 'Empleados', icon: UserCircle },
  { id: 'giftcards', label: 'Tarjeta de Regalo', icon: Gift },
  { id: 'vouchers', label: 'Comprobante', icon: FileText },
  { id: 'history', label: 'Historial', icon: History },
  { id: 'stores', label: 'Tiendas', icon: Building2 },
  { id: 'settings', label: 'Configuración', icon: Settings },
  { id: 'help', label: 'Ayuda', icon: HelpCircle },
];

export function Sidebar() {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    currentPage, 
    setCurrentPage, 
    logout,
    currentUser 
  } = useAppStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className="sidebar"
      style={{ width: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Store className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && <span>POS Pro</span>}
        </div>
      </div>

      {/* Toggle Button */}
      <div 
        className="sidebar-toggle"
        onClick={toggleSidebar}
        title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
              style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
            >
              <Icon className="w-5 h-5" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                <UserCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white truncate max-w-[100px]">
                  {currentUser?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {currentUser?.role || 'Usuario'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
