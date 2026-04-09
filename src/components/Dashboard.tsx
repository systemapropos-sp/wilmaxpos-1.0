import { useAppStore } from '@/store';
import {
  ShoppingCart,
  Package,
  Users,
  Boxes,
  TrendingUp,
  Plus,
  Receipt,
  DollarSign,
  Wrench,
  Zap,
  ClipboardList,
  UserPlus,
  History,
} from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

function QuickActionCard({ title, icon: Icon, color, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#ED6823] hover:shadow-md transition-all text-left group"
    >
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-medium text-sm text-gray-800 group-hover:text-[#ED6823] transition-colors">
        {title}
      </h3>
    </button>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { clients, products, kits, setCurrentPage } = useAppStore();

  const quickActions = [
    { title: 'Nueva Venta', icon: ShoppingCart, color: 'bg-[#ED6823]', onClick: () => setCurrentPage('sales') },
    { title: 'Nueva Reparación', icon: Wrench, color: 'bg-blue-500', onClick: () => {} },
    { title: 'Nueva Recarga', icon: Zap, color: 'bg-purple-500', onClick: () => {} },
    { title: 'Inventario', icon: Package, color: 'bg-emerald-500', onClick: () => setCurrentPage('inventory') },
    { title: 'Asignar Tarea', icon: ClipboardList, color: 'bg-orange-500', onClick: () => {} },
    { title: 'Agregar Acceso', icon: UserPlus, color: 'bg-pink-500', onClick: () => setCurrentPage('employees') },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bienvenido al sistema de punto de venta</p>
        </div>
        <button 
          onClick={() => setCurrentPage('sales')}
          className="btn btn-primary text-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Venta
        </button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {quickActions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Total Inventario"
          value={products.length.toString()}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Clientes"
          value={clients.length.toString()}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Total Kits"
          value={kits.length.toString()}
          icon={Boxes}
          color="bg-purple-500"
        />
        <StatCard
          title="Ventas del Mes"
          value="$0.00"
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Today's Summary */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Resumen de Hoy</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600">Ventas</span>
              </div>
              <p className="text-lg font-bold text-gray-800">$0.00</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Receipt className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-600">Órdenes</span>
              </div>
              <p className="text-lg font-bold text-gray-800">$0.00</p>
            </div>
          </div>
        </div>

        {/* Cash Register */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Caja Registradora</h2>
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-gray-600">Efectivo Esperado</span>
            </div>
            <span className="font-semibold text-sm text-gray-800">$0.00</span>
          </div>
          <button className="w-full btn btn-primary text-xs py-2">
            Iniciar Sesión de Caja
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Actividad Reciente</h2>
          <button 
            onClick={() => setCurrentPage('history')}
            className="text-[#ED6823] text-xs hover:underline"
          >
            Ver todo
          </button>
        </div>
        <div className="text-center py-6">
          <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No hay actividad reciente</p>
        </div>
      </div>
    </div>
  );
}
