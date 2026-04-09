import { useState } from 'react';
import { useAppStore } from '@/store';
import type { GiftCard } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Gift,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface GiftCardModalProps {
  giftCard: GiftCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (giftCard: Partial<GiftCard>) => void;
}

function GiftCardModal({ giftCard, isOpen, onClose, onSave }: GiftCardModalProps) {
  const [formData, setFormData] = useState<Partial<GiftCard>>(
    giftCard || {
      cardNumber: '',
      value: 0,
      balance: 0,
      description: '',
      clientName: '',
      isActive: true,
      issueDate: new Date().toISOString().split('T')[0],
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
            {giftCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
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
                Número de Tarjeta *
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                className="modern-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Valor *
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value), balance: Number(e.target.value) })}
                  className="modern-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Balance
                </label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                  className="modern-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="modern-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Nombre del cliente
              </label>
              <input
                type="text"
                value={formData.clientName || ''}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="modern-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Fecha de emisión
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
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
              {giftCard ? 'Guardar cambios' : 'Crear tarjeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GiftCards() {
  const { giftCards } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);

  const filteredGiftCards = giftCards.filter(
    (card) =>
      card.cardNumber.includes(searchTerm) ||
      card.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (giftCardData: Partial<GiftCard>) => {
    toast.success(giftCardData.id ? 'Tarjeta actualizada' : 'Tarjeta creada');
  };

  const openEditModal = (card: GiftCard) => {
    setSelectedGiftCard(card);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedGiftCard(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Tarjetas de Regalo</h1>
          <p className="page-subtitle">Gestione sus tarjetas de regalo</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nueva Tarjeta
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar tarjetas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-primary)]">Lista de Tarjetas</h2>
          <span className="badge badge-primary">{filteredGiftCards.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th>Número de Tarjeta</th>
                <th>Valor</th>
                <th>Balance</th>
                <th>Descripción</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredGiftCards.map((card) => (
                <tr key={card.id}>
                  <td>
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="font-medium text-[var(--text-primary)]">{card.cardNumber}</td>
                  <td>RD${card.value.toLocaleString()}</td>
                  <td>RD${card.balance.toLocaleString()}</td>
                  <td>{card.description || '-'}</td>
                  <td>{card.clientName || '-'}</td>
                  <td>
                    <span className={`badge ${card.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {card.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(card)}
                        className="p-2 hover:bg-[var(--background-hover)] rounded-lg text-[var(--primary)]"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
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

        {filteredGiftCards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Gift className="w-12 h-12 text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-secondary)]">No se encontraron tarjetas</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <GiftCardModal
        giftCard={selectedGiftCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
