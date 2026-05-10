import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import {
  LayoutGrid,
  X,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingDown,
  UserCircle,
  Package,
  FileText,
  CreditCard,
  Banknote,
  BarChart3,
  Store,
  Percent,
  Search,
  Download,
  Printer,
} from 'lucide-react';

interface ReportCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  reports: ReportItem[];
}

interface ReportItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

const reportCategories: ReportCategory[] = [
  {
    id: 'sales',
    name: 'Ventas',
    icon: ShoppingCart,
    reports: [
      { id: 'sales-summary', name: 'Resumen de Ventas', icon: BarChart3 },
      { id: 'sales-detailed', name: 'Ventas Detalladas', icon: FileText },
      { id: 'sales-by-product', name: 'Ventas por Producto', icon: Package },
      { id: 'sales-by-category', name: 'Ventas por Categoría', icon: LayoutGrid },
      { id: 'sales-by-employee', name: 'Ventas por Empleado', icon: UserCircle },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventario',
    icon: Package,
    reports: [
      { id: 'inventory-list', name: 'Lista de Inventario', icon: FileText },
      { id: 'low-stock', name: 'Stock Bajo', icon: TrendingDown },
      { id: 'inventory-valuation', name: 'Valoración de Inventario', icon: DollarSign },
      { id: 'inventory-movements', name: 'Movimientos de Inventario', icon: BarChart3 },
    ],
  },
  {
    id: 'clients',
    name: 'Clientes',
    icon: Users,
    reports: [
      { id: 'client-list', name: 'Lista de Clientes', icon: FileText },
      { id: 'client-balance', name: 'Saldos de Clientes', icon: CreditCard },
      { id: 'top-clients', name: 'Mejores Clientes', icon: BarChart3 },
    ],
  },
  {
    id: 'financial',
    name: 'Financieros',
    icon: DollarSign,
    reports: [
      { id: 'profit-loss', name: 'Pérdidas y Ganancias', icon: BarChart3 },
      { id: 'cash-flow', name: 'Flujo de Caja', icon: Banknote },
      { id: 'expenses', name: 'Gastos', icon: TrendingDown },
      { id: 'taxes', name: 'Impuestos', icon: Percent },
    ],
  },
  {
    id: 'purchases',
    name: 'Compras',
    icon: Store,
    reports: [
      { id: 'purchase-list', name: 'Lista de Compras', icon: FileText },
      { id: 'purchase-summary', name: 'Resumen de Compras', icon: BarChart3 },
      { id: 'supplier-balance', name: 'Saldos de Proveedores', icon: CreditCard },
    ],
  },
];

export function Reports() {
  const { sales, products, clients, expenses, purchases, suppliers, inventoryMovements } = useAppStore();
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generated, setGenerated] = useState(false);

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const d = s.date.slice(0, 10);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return s.status !== 'cancelled';
    });
  }, [sales, dateFrom, dateTo]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      return true;
    });
  }, [expenses, dateFrom, dateTo]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      if (dateFrom && p.date < dateFrom) return false;
      if (dateTo && p.date > dateTo) return false;
      return p.status !== 'cancelled';
    });
  }, [purchases, dateFrom, dateTo]);

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleClear = () => {
    setSelectedReport(null);
    setGenerated(false);
    setDateFrom('');
    setDateTo('');
  };

  const renderReportContent = () => {
    if (!generated || !selectedReport) return null;

    const id = selectedReport.id;

    // ── SALES SUMMARY ──
    if (id === 'sales-summary') {
      const totalRevenue = filteredSales.reduce((s, sale) => s + sale.total, 0);
      const totalTax = filteredSales.reduce((s, sale) => s + sale.tax, 0);
      const totalDiscount = filteredSales.reduce((s, sale) => s + sale.discount, 0);
      const byMethod: Record<string, number> = {};
      filteredSales.forEach(s => {
        byMethod[s.paymentMethod] = (byMethod[s.paymentMethod] || 0) + s.total;
      });
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Ventas', value: filteredSales.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Ingresos Totales', value: `RD$${totalRevenue.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Total ITBIS', value: `RD$${totalTax.toLocaleString()}`, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Total Descuentos', value: `RD$${totalDiscount.toLocaleString()}`, color: 'text-red-600', bg: 'bg-red-50' },
            ].map(card => (
              <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Por Método de Pago</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>
                <th className="px-4 py-2 text-left">Método</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr></thead>
              <tbody>
                {Object.entries(byMethod).map(([method, total]) => (
                  <tr key={method} className="border-t">
                    <td className="px-4 py-2 capitalize">{method === 'card' ? 'Tarjeta' : method === 'cash' ? 'Efectivo' : method === 'transfer' ? 'Transferencia' : method}</td>
                    <td className="px-4 py-2 text-right font-medium">RD${total.toLocaleString()}</td>
                  </tr>
                ))}
                {Object.keys(byMethod).length === 0 && <tr><td colSpan={2} className="px-4 py-4 text-center text-gray-400">Sin ventas en el período</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // ── SALES DETAILED ──
    if (id === 'sales-detailed') {
      return (
        <div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">ID Venta</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-left">Empleado</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-left">Método</th>
                <th className="px-4 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Sin registros en el período seleccionado</td></tr>
              ) : filteredSales.map(s => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{s.saleId}</td>
                  <td className="px-4 py-2">{new Date(s.date).toLocaleDateString('es-DO')}</td>
                  <td className="px-4 py-2">{s.clientName || 'General'}</td>
                  <td className="px-4 py-2">{s.employee}</td>
                  <td className="px-4 py-2 text-right font-semibold text-green-600">RD${s.total.toLocaleString()}</td>
                  <td className="px-4 py-2 capitalize">{s.paymentMethod}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {s.status === 'completed' ? 'Completada' : s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // ── SALES BY PRODUCT ──
    if (id === 'sales-by-product') {
      const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
      filteredSales.forEach(sale => {
        sale.items.forEach(item => {
          const key = item.productName;
          if (!productMap[key]) productMap[key] = { name: key, qty: 0, revenue: 0 };
          productMap[key].qty += item.quantity;
          productMap[key].revenue += item.total;
        });
      });
      const sorted = Object.values(productMap).sort((a, b) => b.revenue - a.revenue);
      return (
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Producto</th>
            <th className="px-4 py-2 text-right">Cantidad</th>
            <th className="px-4 py-2 text-right">Ingresos</th>
          </tr></thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Sin ventas en el período</td></tr>
            ) : sorted.map((p, i) => (
              <tr key={p.name} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2 text-right">{p.qty}</td>
                <td className="px-4 py-2 text-right font-semibold text-green-600">RD${p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // ── INVENTORY LIST ──
    if (id === 'inventory-list') {
      return (
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-2 text-left">Producto</th>
            <th className="px-4 py-2 text-left">Categoría</th>
            <th className="px-4 py-2 text-right">Costo</th>
            <th className="px-4 py-2 text-right">Precio</th>
            <th className="px-4 py-2 text-right">Stock</th>
            <th className="px-4 py-2 text-right">Valor</th>
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2">{p.category || '-'}</td>
                <td className="px-4 py-2 text-right">RD${p.cost.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">RD${p.salePrice.toLocaleString()}</td>
                <td className={`px-4 py-2 text-right font-medium ${p.currentStock <= 5 ? 'text-red-500' : 'text-green-600'}`}>{p.currentStock}</td>
                <td className="px-4 py-2 text-right">RD${(p.cost * p.currentStock).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-semibold">
            <tr>
              <td colSpan={4} className="px-4 py-2">TOTAL</td>
              <td className="px-4 py-2 text-right">{products.reduce((s, p) => s + p.currentStock, 0).toFixed(0)}</td>
              <td className="px-4 py-2 text-right text-[#ED6823]">RD${products.reduce((s, p) => s + p.cost * p.currentStock, 0).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      );
    }

    // ── LOW STOCK ──
    if (id === 'low-stock') {
      const low = products.filter(p => p.isActive && p.currentStock <= (p.minStock || 5));
      return (
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-2 text-left">Producto</th>
            <th className="px-4 py-2 text-left">Categoría</th>
            <th className="px-4 py-2 text-right">Stock Actual</th>
            <th className="px-4 py-2 text-right">Precio</th>
            <th className="px-4 py-2 text-left">Estado</th>
          </tr></thead>
          <tbody>
            {low.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-green-500">✓ Todo el inventario está en niveles adecuados</td></tr>
            ) : low.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2">{p.category || '-'}</td>
                <td className={`px-4 py-2 text-right font-bold ${p.currentStock === 0 ? 'text-red-600' : 'text-orange-500'}`}>{p.currentStock}</td>
                <td className="px-4 py-2 text-right">RD${p.salePrice.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.currentStock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {p.currentStock === 0 ? 'Sin stock' : 'Stock bajo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // ── CLIENT LIST ──
    if (id === 'client-list') {
      return (
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Teléfono</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-right">Balance</th>
            <th className="px-4 py-2 text-left">Estado</th>
          </tr></thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2">{c.phone || '-'}</td>
                <td className="px-4 py-2">{c.email || '-'}</td>
                <td className={`px-4 py-2 text-right font-medium ${c.creditBalance > 0 ? 'text-red-500' : 'text-green-600'}`}>RD${c.creditBalance.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // ── CLIENT BALANCE ──
    if (id === 'client-balance') {
      const withBalance = clients.filter(c => c.creditBalance > 0);
      const totalBalance = withBalance.reduce((s, c) => s + c.creditBalance, 0);
      return (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-sm text-gray-500">Total Clientes</p>
              <p className="text-xl font-bold text-blue-600">{clients.length}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-sm text-gray-500">Con Balance</p>
              <p className="text-xl font-bold text-red-600">{withBalance.length}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-sm text-gray-500">Balance Total</p>
              <p className="text-xl font-bold text-orange-600">RD${totalBalance.toLocaleString()}</p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-right">Balance</th>
            </tr></thead>
            <tbody>
              {withBalance.sort((a, b) => b.creditBalance - a.creditBalance).map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2">{c.phone || '-'}</td>
                  <td className="px-4 py-2 text-right font-bold text-red-500">RD${c.creditBalance.toLocaleString()}</td>
                </tr>
              ))}
              {withBalance.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">Ningún cliente tiene saldo pendiente</td></tr>}
            </tbody>
          </table>
        </div>
      );
    }

    // ── EXPENSES ──
    if (id === 'expenses') {
      const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
      const byCategory: Record<string, number> = {};
      filteredExpenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Total Gastos</p>
              <p className="text-xl font-bold text-red-600">RD${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Cantidad</p>
              <p className="text-xl font-bold text-gray-700">{filteredExpenses.length} registros</p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Destinatario</th>
              <th className="px-4 py-2 text-right">Monto</th>
            </tr></thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Sin gastos en el período</td></tr>
              ) : filteredExpenses.map(e => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{e.date}</td>
                  <td className="px-4 py-2">{e.category}</td>
                  <td className="px-4 py-2">{e.description}</td>
                  <td className="px-4 py-2">{e.recipient}</td>
                  <td className="px-4 py-2 text-right font-semibold text-red-500">RD${e.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // ── PROFIT & LOSS ──
    if (id === 'profit-loss') {
      const totalRevenue = filteredSales.reduce((s, sale) => s + sale.total, 0);
      const costOfGoods = filteredSales.reduce((s, sale) => {
        return s + sale.items.reduce((itemSum, item) => {
          const prod = products.find(p => p.id === item.productId);
          return itemSum + (prod ? prod.cost * item.quantity : 0);
        }, 0);
      }, 0);
      const totalExp = filteredExpenses.reduce((s, e) => s + e.amount, 0);
      const grossProfit = totalRevenue - costOfGoods;
      const netProfit = grossProfit - totalExp;
      const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
      return (
        <div className="space-y-4">
          {[
            { label: 'Ingresos Totales', value: totalRevenue, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Costo de Ventas', value: -costOfGoods, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Ganancia Bruta', value: grossProfit, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Gastos Operativos', value: -totalExp, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Ganancia Neta', value: netProfit, color: netProfit >= 0 ? 'text-green-700' : 'text-red-700', bg: netProfit >= 0 ? 'bg-green-100' : 'bg-red-100' },
          ].map(row => (
            <div key={row.label} className={`${row.bg} rounded-xl p-4 flex justify-between items-center`}>
              <p className="font-medium text-gray-700">{row.label}</p>
              <p className={`text-xl font-bold ${row.color}`}>
                {row.value < 0 ? '-' : ''}RD${Math.abs(row.value).toLocaleString()}
              </p>
            </div>
          ))}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
            <p className="font-medium text-gray-700">Margen de Ganancia</p>
            <p className={`text-xl font-bold ${margin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {margin.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }

    // ── PURCHASE LIST ──
    if (id === 'purchase-list') {
      return (
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-2 text-left">Orden</th>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Proveedor</th>
            <th className="px-4 py-2 text-right">Total</th>
            <th className="px-4 py-2 text-left">Estado</th>
          </tr></thead>
          <tbody>
            {filteredPurchases.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Sin compras en el período</td></tr>
            ) : filteredPurchases.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{p.purchaseId}</td>
                <td className="px-4 py-2">{new Date(p.date).toLocaleDateString('es-DO')}</td>
                <td className="px-4 py-2">{p.supplierName || '-'}</td>
                <td className="px-4 py-2 text-right font-semibold">RD${p.total.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'received' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {p.status === 'received' ? 'Recibida' : p.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // ── SUPPLIER BALANCE ──
    if (id === 'supplier-balance') {
      const withBalance = suppliers.filter(s => s.balance > 0);
      const totalBalance = suppliers.reduce((sum, s) => sum + s.balance, 0);
      return (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-3"><p className="text-sm text-gray-500">Proveedores</p><p className="text-xl font-bold text-blue-600">{suppliers.length}</p></div>
            <div className="bg-red-50 rounded-xl p-3"><p className="text-sm text-gray-500">Con Saldo</p><p className="text-xl font-bold text-red-600">{withBalance.length}</p></div>
            <div className="bg-orange-50 rounded-xl p-3"><p className="text-sm text-gray-500">Saldo Total</p><p className="text-xl font-bold text-orange-600">RD${totalBalance.toLocaleString()}</p></div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-2 text-left">Proveedor</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-right">Total Compras</th>
              <th className="px-4 py-2 text-right">Saldo</th>
            </tr></thead>
            <tbody>
              {suppliers.sort((a, b) => b.balance - a.balance).map(s => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{s.company}</td>
                  <td className="px-4 py-2">{s.phone || '-'}</td>
                  <td className="px-4 py-2 text-right">RD${(s.totalPurchases || 0).toLocaleString()}</td>
                  <td className={`px-4 py-2 text-right font-bold ${s.balance > 0 ? 'text-red-500' : 'text-green-600'}`}>RD${s.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // ── INVENTORY MOVEMENTS ──
    if (id === 'inventory-movements') {
      return (
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Producto</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-right">Cantidad</th>
            <th className="px-4 py-2 text-left">Motivo</th>
            <th className="px-4 py-2 text-left">Usuario</th>
          </tr></thead>
          <tbody>
            {inventoryMovements.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Sin movimientos de inventario registrados</td></tr>
            ) : [...inventoryMovements].reverse().map(m => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{new Date(m.date).toLocaleDateString('es-DO')}</td>
                <td className="px-4 py-2 font-medium">{m.productName}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.type === 'entry' ? 'bg-green-100 text-green-700' : m.type === 'exit' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {m.type === 'entry' ? 'Entrada' : m.type === 'exit' ? 'Salida' : 'Ajuste'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right font-semibold">{m.quantity}</td>
                <td className="px-4 py-2">{m.reason}</td>
                <td className="px-4 py-2">{m.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Default
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500">Reporte disponible próximamente</p>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Genere informes detallados de su negocio</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Report Categories */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="font-semibold text-[var(--text-primary)]">Categorías</h2>
            </div>
            <div className="divide-y divide-[var(--border-light)]">
              {reportCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id}>
                    <div className="px-4 py-3 bg-[var(--background)]">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[var(--primary)]" />
                        <span className="font-medium text-[var(--text-primary)]">
                          {category.name}
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-[var(--border-light)]">
                      {category.reports.map((report) => {
                        const ReportIcon = report.icon;
                        return (
                          <button
                            key={report.id}
                            onClick={() => { setSelectedReport(report); setGenerated(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--background-hover)] transition-colors text-left ${
                              selectedReport?.id === report.id
                                ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                                : 'text-[var(--text-secondary)]'
                            }`}
                          >
                            <ReportIcon className="w-4 h-4" />
                            <span className="text-sm">{report.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1">
          {selectedReport ? (
            <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
              {/* Report Header */}
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    {selectedReport.name}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {generated ? `Datos del ${dateFrom || 'inicio'} al ${dateTo || 'hoy'}` : 'Seleccione el rango de fechas y genere el reporte'}
                  </p>
                </div>
                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-[var(--background-hover)] rounded-lg"
                >
                  <X className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-[var(--border)] bg-[var(--background)]">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Desde</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => { setDateFrom(e.target.value); setGenerated(false); }}
                      className="modern-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Hasta</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => { setDateTo(e.target.value); setGenerated(false); }}
                      className="modern-input"
                    />
                  </div>
                  <div className="flex items-end">
                    <button onClick={handleGenerate} className="btn btn-primary">
                      <Search className="w-4 h-4" />
                      Generar
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Preview */}
              <div className="p-4 overflow-x-auto">
                {!generated ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <BarChart3 className="w-16 h-16 text-[var(--text-muted)] mb-4" />
                    <p className="text-[var(--text-secondary)] mb-2">Configure los filtros y genere el reporte</p>
                    <p className="text-sm text-[var(--text-muted)]">Los datos se mostrarán aquí</p>
                  </div>
                ) : renderReportContent()}
              </div>

              {/* Actions */}
              {generated && (
                <div className="p-4 border-t border-[var(--border)] flex justify-end gap-3">
                  <button onClick={() => window.print()} className="btn btn-outline">
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
                  <button className="btn btn-outline">
                    <Download className="w-4 h-4" />
                    Exportar CSV
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--border)] p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-16 h-16 text-[var(--text-muted)] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Informes: Haga una selección
                </h3>
                <p className="text-[var(--text-secondary)] max-w-md">
                  Seleccione un tipo de reporte del menú de la izquierda para generar
                  información detallada sobre su negocio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
