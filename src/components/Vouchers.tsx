import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Voucher } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Receipt,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface VoucherModalProps {
  voucher: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (voucher: Partial<Voucher>) => void;
}

function VoucherModal({ voucher, isOpen, onClose, onSave }: VoucherModalProps) {
  const [formData, setFormData] = useState<Partial<Voucher>>({
    description: '',
    series: '',
    type: '',
    from: '',
    to: '',
    current: '',
    isActive: true,
  });

  // Cargar datos del comprobante cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (voucher) {
        setFormData({ ...voucher });
      } else {
        setFormData({
          description: '',
          series: '',
          type: '',
          from: '',
          to: '',
          current: '',
          isActive: true,
        });
      }
    }
  }, [voucher, isOpen]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {voucher ? 'Editar Comprobante' : 'Nuevo Comprobante'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Descripción *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="modern-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Serie *
                </label>
                <input
                  type="text"
                  value={formData.series}
                  onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Tipo *
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Desde *
                </label>
                <input
                  type="text"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Hasta *
                </label>
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Actual *
                </label>
                <input
                  type="text"
                  value={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {voucher ? 'Guardar cambios' : 'Crear comprobante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Vouchers() {
  const { vouchers, addVoucher, updateVoucher, deleteVoucher } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.series.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (voucherData: Partial<Voucher>) => {
    if (selectedVoucher) {
      updateVoucher(selectedVoucher.id, voucherData);
      toast.success('Comprobante actualizado');
    } else {
      addVoucher(voucherData as Omit<Voucher, 'id'>);
      toast.success('Comprobante creado');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (voucher: Voucher) => {
    if (confirm(`¿Está seguro de eliminar el comprobante "${voucher.description}"?`)) {
      deleteVoucher(voucher.id);
      toast.success('Comprobante eliminado');
    }
  };

  const openEditModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedVoucher(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Comprobantes Fiscales</h1>
          <p className="page-subtitle">Gestione sus comprobantes fiscales</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nuevo Comprobante
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar comprobantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-primary)]">Lista de Comprobantes</h2>
          <span className="badge badge-primary">{filteredVouchers.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th>Descripción</th>
                <th>Serie</th>
                <th>Tipo</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Actual</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.id}>
                  <td>
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="font-medium text-[var(--text-primary)]">{voucher.description}</td>
                  <td>{voucher.series}</td>
                  <td>{voucher.type}</td>
                  <td>{voucher.from}</td>
                  <td>{voucher.to}</td>
                  <td>{voucher.current}</td>
                  <td>
                    <span className={`badge ${voucher.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {voucher.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(voucher)}
                        className="p-2 hover:bg-[var(--background-hover)] rounded-lg text-[var(--primary)]"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(voucher)}
                        className="p-2 hover:bg-[var(--background-hover)] rounded-lg text-[var(--danger)]"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVouchers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Receipt className="w-12 h-12 text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-secondary)]">No se encontraron comprobantes</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <VoucherModal
        voucher={selectedVoucher}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
