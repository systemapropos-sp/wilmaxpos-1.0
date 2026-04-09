import { useState } from 'react';
import { useAppStore } from '@/store';
import type { Store } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Building2,
  X,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

interface StoreModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (store: Partial<Store>) => void;
}

function StoreModal({ store, isOpen, onClose, onSave }: StoreModalProps) {
  const [formData, setFormData] = useState<Partial<Store>>(
    store || {
      name: '',
      address: '',
      phone: '',
      email: '',
      isActive: true,
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {store ? 'Editar Tienda' : 'Nueva Tienda'}
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
                Nombre de la tienda *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="modern-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Dirección *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="modern-input"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="modern-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="modern-input"
              />
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
              {store ? 'Guardar cambios' : 'Crear tienda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Stores() {
  const { stores } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (storeData: Partial<Store>) => {
    toast.success(storeData.id ? 'Tienda actualizada' : 'Tienda creada');
  };

  const openEditModal = (store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedStore(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Tiendas</h1>
          <p className="page-subtitle">Gestione sus tiendas y sucursales</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nueva Tienda
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar tiendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <span className={`badge ${store.isActive ? 'badge-success' : 'badge-danger'}`}>
                {store.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              {store.name}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <MapPin className="w-4 h-4" />
                <span>{store.address}</span>
              </div>
              {store.phone && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Phone className="w-4 h-4" />
                  <span>{store.phone}</span>
                </div>
              )}
              {store.email && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Mail className="w-4 h-4" />
                  <span>{store.email}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => openEditModal(store)}
                className="flex-1 btn btn-outline text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                className="p-2 hover:bg-[var(--background-hover)] rounded-lg text-[var(--danger)]"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-[var(--border)]">
          <Building2 className="w-12 h-12 text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-secondary)]">No se encontraron tiendas</p>
        </div>
      )}

      {/* Modal */}
      <StoreModal
        store={selectedStore}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
