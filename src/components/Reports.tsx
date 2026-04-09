import { useState } from 'react';
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
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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
                            onClick={() => setSelectedReport(report)}
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
                    Seleccione el rango de fechas y genere el reporte
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-[var(--background-hover)] rounded-lg"
                >
                  <X className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-[var(--border)] bg-[var(--background)]">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="modern-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="modern-input"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="btn btn-primary">
                      <Search className="w-4 h-4" />
                      Generar
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Preview */}
              <div className="p-8">
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <BarChart3 className="w-16 h-16 text-[var(--text-muted)] mb-4" />
                  <p className="text-[var(--text-secondary)] mb-2">
                    Configure los filtros y genere el reporte
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Los datos se mostrarán aquí
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-[var(--border)] flex justify-end gap-3">
                <button className="btn btn-outline">
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </button>
                <button className="btn btn-outline">
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
              </div>
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
