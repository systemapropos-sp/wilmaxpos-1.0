import { useState } from 'react';
import { useAppStore } from '@/store';
import {
  Search,
  History,
  User,
  ShoppingCart,
  Package,
  Users,
  Trash2,
  Edit3,
  Plus,
  Filter,
  Monitor,
} from 'lucide-react';

const actionIcons: Record<string, React.ElementType> = {
  'Agregar': Plus,
  'Actualizar': Edit3,
  'Eliminar': Trash2,
};

const controllerIcons: Record<string, React.ElementType> = {
  'Ventas': ShoppingCart,
  'Inventario': Package,
  'Clientes': Users,
};

export function HistoryComponent() {
  const { activityLogs } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = activityLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.controller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Historial</h1>
          <p className="page-subtitle">Registro de actividades del sistema</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar en el historial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input pl-12"
            />
          </div>
          <button className="btn btn-outline">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-primary)]">Registro de Actividades</h2>
          <span className="badge badge-primary">{filteredLogs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Controlador</th>
                <th>Acción</th>
                <th>Detalles</th>
                <th>Plataforma</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const ActionIcon = actionIcons[log.action] || Edit3;
                const ControllerIcon = controllerIcons[log.controller] || Package;
                
                return (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap">{log.date}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[var(--primary-light)] rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-[var(--primary)]" />
                        </div>
                        <span>{log.user}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <ControllerIcon className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>{log.controller}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <ActionIcon className={`w-4 h-4 ${
                          log.action === 'Eliminar' ? 'text-[var(--danger)]' :
                          log.action === 'Agregar' ? 'text-[var(--secondary)]' :
                          'text-[var(--primary)]'
                        }`} />
                        <span className={`badge ${
                          log.action === 'Eliminar' ? 'badge-danger' :
                          log.action === 'Agregar' ? 'badge-success' :
                          'badge-primary'
                        }`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="max-w-xs truncate">{log.details}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">{log.platform}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="w-12 h-12 text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-secondary)]">No se encontraron registros</p>
          </div>
        )}
      </div>
    </div>
  );
}
