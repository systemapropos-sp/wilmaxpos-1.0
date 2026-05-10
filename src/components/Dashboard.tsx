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
  AlertTriangle,
  ShoppingBag,
  ArrowUpRight,
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
  subtext?: string;
}

function StatCard({ title, value, icon: Icon, color, subtext }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3 hover:shadow-md transition-all">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}

const actionIconMap: Record<string, string> = {
  'Ventas': '🛒',
  'Inventario': '📦',
  'Clientes': '👥',
  'Compras': '🏪',
  'Gastos': '💸',
  'Empleados': '👤',
};

const actionColorMap: Record<string, string> = {
  'Agregar': 'bg-green-100 text-green-700',
  'Actualizar': 'bg-blue-100 text-blue-700',
  'Eliminar': 'bg-red-100 text-red-700',
};

export function Dashboard() {
  const { clients, products, kits, setCurrentPage, getDashboardStats, activityLogs, sales } = useAppStore();
  const stats = getDashboardStats();

  // Recent sales (last 5)
  const recentSales = [...sales]
    .filter(s => s.status !== 'cancelled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Low stock products
  const lowStockProducts = products.filter(p => p.isActive && p.currentStock <= 5 && p.currentStock > 0).slice(0, 4);
  const outOfStockCount = products.filter(p => p.isActive && p.currentStock === 0).length;

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
          subtext={`${outOfStockCount} sin stock`}
        />
        <StatCard
          title="Total Clientes"
          value={clients.length.toString()}
          icon={Users}
          color="bg-green-500"
          subtext={`${clients.filter(c => c.creditBalance > 0).length} con balance`}
        />
        <StatCard
          title="Total Kits"
          value={kits.length.toString()}
          icon={Boxes}
          color="bg-purple-500"
        />
        <StatCard
          title="Ventas del Mes"
          value={`RD$${stats.monthSales.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-orange-500"
          subtext={`${stats.totalSales} transacciones`}
        />
      </div>

      {/* Summary + Low Stock Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Today's Summary */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#ED6823]" />
            Resumen de Hoy
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600">Ventas</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{stats.todaySales}</p>
              <p className="text-xs text-gray-500 mt-0.5">transacciones</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-600">Ingresos</span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {stats.todayRevenue > 0
                  ? `RD$${stats.todayRevenue.toLocaleString()}`
                  : '$0.00'}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Esta semana</span>
              <span className="font-semibold text-[#ED6823]">{stats.weekSales} ventas</span>
            </div>
          </div>
        </div>

        {/* Cash Register */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#ED6823]" />
            Caja Registradora
          </h2>
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-gray-600">Efectivo Esperado</span>
            </div>
            <span className="font-semibold text-sm text-gray-800">
              RD${stats.todayRevenue > 0 ? stats.todayRevenue.toLocaleString() : '0.00'}
            </span>
          </div>
          <button
            onClick={() => setCurrentPage('sales')}
            className="w-full btn btn-primary text-xs py-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Ir a Ventas
          </button>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Stock Bajo
          </h2>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-4">
              <Package className="w-8 h-8 text-gray-200 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Sin alertas de stock</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate max-w-[140px]">{p.name}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.currentStock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {p.currentStock} uds.
                  </span>
                </div>
              ))}
              <button
                onClick={() => setCurrentPage('inventory')}
                className="w-full text-xs text-[#ED6823] hover:underline flex items-center gap-1 mt-1"
              >
                Ver inventario completo
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Sales + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#ED6823]" />
              Ventas Recientes
            </h2>
            <button
              onClick={() => setCurrentPage('sales')}
              className="text-[#ED6823] text-xs hover:underline flex items-center gap-0.5"
            >
              Ver todo <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentSales.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingCart className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No hay ventas registradas</p>
              <button
                onClick={() => setCurrentPage('sales')}
                className="mt-2 text-xs text-[#ED6823] hover:underline"
              >
                Crear primera venta
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSales.map(sale => (
                <div key={sale.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{sale.saleId}</p>
                    <p className="text-xs text-gray-500">
                      {sale.clientName} · {new Date(sale.date).toLocaleDateString('es-DO')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#ED6823]">RD${sale.total.toLocaleString()}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      sale.status === 'completed' ? 'bg-green-100 text-green-600' :
                      sale.status === 'credit' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {sale.status === 'completed' ? 'Completada' :
                       sale.status === 'credit' ? 'Crédito' : sale.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Actividad Reciente</h2>
            <button
              onClick={() => setCurrentPage('history')}
              className="text-[#ED6823] text-xs hover:underline flex items-center gap-0.5"
            >
              Ver todo <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {activityLogs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400">No hay actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activityLogs.slice(0, 6).map(log => (
                <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-lg leading-none mt-0.5">
                    {actionIconMap[log.controller] || '🔧'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{log.details}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${actionColorMap[log.action] || 'bg-gray-100 text-gray-500'}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-gray-400">{log.user}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {log.date.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
