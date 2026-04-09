import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Supplier } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Truck,
  X,
  Phone,
  Mail,
  MapPin,
  TrendingDown,
  ShoppingCart,
  MessageCircle,
  Send,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import { DocumentsManager } from './DocumentsManager';

interface SupplierModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Partial<Supplier>) => void;
}

function SupplierModal({ supplier, isOpen, onClose, onSave }: SupplierModalProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    taxId: '',
    balance: 0,
    isActive: true,
  });
  const [previewImage, setPreviewImage] = useState('');

  // Cargar datos del proveedor cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        setFormData({ ...supplier });
        setPreviewImage(supplier.avatar || '');
      } else {
        // Resetear para nuevo proveedor
        setFormData({
          company: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          taxId: '',
          balance: 0,
          isActive: true,
        });
        setPreviewImage('');
      }
    }
  }, [supplier, isOpen]);

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
    onSave({ ...formData, avatar: previewImage });
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image Upload */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Logo del Proveedor
              </label>
              <div className="flex flex-col items-center">
                {/* Preview Container - Circular */}
                <div 
                  onClick={() => document.getElementById('supplier-image-input')?.click()}
                  className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-[#ED6823] transition-colors overflow-hidden bg-gray-50 group"
                >
                  {previewImage ? (
                    <>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay para cambiar */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <Camera className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                
                <input
                  id="supplier-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {/* Controles debajo */}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('supplier-image-input')?.click()}
                    className="text-xs text-[#ED6823] hover:underline"
                  >
                    Cambiar
                  </button>
                  {previewImage && (
                    <>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => setPreviewImage('')}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Supplier Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Compañía/Empresa *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="modern-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Apellidos</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="modern-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="modern-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="modern-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="modern-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="modern-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">RNC/Cédula</label>
                  <input
                    type="text"
                    value={formData.taxId || ''}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="modern-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {supplier ? 'Guardar cambios' : 'Crear proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// WhatsApp Modal
interface WhatsAppModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
}

function WhatsAppModal({ supplier, isOpen, onClose }: WhatsAppModalProps) {
  const [message, setMessage] = useState('');
  if (!isOpen || !supplier) return null;

  const defaultMessage = `Hola ${supplier.company},\n\nLe informamos que su balance pendiente con nosotros es de RD$${supplier.balance.toLocaleString()}.\n\nPor favor, contáctenos para coordinar el pago.\n\nGracias.`;

  const handleSend = () => {
    const phone = supplier.phone?.replace(/\D/g, '');
    if (!phone) {
      toast.error('El proveedor no tiene número de teléfono');
      return;
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message || defaultMessage)}`, '_blank');
    toast.success('Abriendo WhatsApp...');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Enviar Balance por WhatsApp</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Proveedor: <span className="font-medium text-gray-800">{supplier.company}</span></p>
            <p className="text-sm text-gray-500 mb-1">Contacto: <span className="font-medium text-gray-800">{supplier.firstName} {supplier.lastName}</span></p>
            <p className="text-sm text-gray-500 mb-1">Teléfono: <span className="font-medium text-gray-800">{supplier.phone || 'No disponible'}</span></p>
            <p className="text-sm text-gray-500">Balance: <span className="font-medium text-red-500">RD${supplier.balance.toLocaleString()}</span></p>
          </div>
          <textarea
            value={message || defaultMessage}
            onChange={(e) => setMessage(e.target.value)}
            className="modern-input mb-4"
            rows={6}
          />
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 btn btn-outline">Cancelar</button>
            <button onClick={handleSend} disabled={!supplier.phone} className="flex-1 btn btn-primary">
              <Send className="w-4 h-4" />Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Supplier Card
interface SupplierCardProps {
  supplier: Supplier;
  onEdit: () => void;
  onDelete: () => void;
  onWhatsApp: () => void;
}

function SupplierCard({ supplier, onEdit, onDelete, onWhatsApp }: SupplierCardProps) {
  const initials = supplier.company.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
      {/* Header */}
      <div className="p-4 flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
          {supplier.avatar ? (
            <img src={supplier.avatar} alt={supplier.company} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-lg font-bold">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{supplier.company}</h3>
          {(supplier.firstName || supplier.lastName) && (
            <p className="text-sm text-gray-500">{supplier.firstName} {supplier.lastName}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-green-100 rounded text-green-600">Activo</span>
            {supplier.balance > 0 && (
              <span className="text-xs px-2 py-0.5 bg-red-100 rounded text-red-600">Con deuda</span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-4 pb-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-3 text-sm">
          {supplier.phone && (
            <div className="flex items-center gap-1 text-gray-500">
              <Phone className="w-3.5 h-3.5" /><span>{supplier.phone}</span>
            </div>
          )}
          {supplier.email && (
            <div className="flex items-center gap-1 text-gray-500">
              <Mail className="w-3.5 h-3.5" /><span className="truncate max-w-[150px]">{supplier.email}</span>
            </div>
          )}
          {supplier.city && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3.5 h-3.5" /><span>{supplier.city}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Balance</p>
              <p className={`font-semibold ${supplier.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                RD${supplier.balance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Compras</p>
              <p className="font-semibold text-blue-500">RD${(supplier.totalPurchases || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 flex gap-2 flex-wrap">
        <button onClick={onWhatsApp} className="flex-1 btn btn-outline text-xs py-2 border-green-500 text-green-600 hover:bg-green-50">
          <MessageCircle className="w-3.5 h-3.5" />WhatsApp
        </button>
        <DocumentsManager entityType="supplier" entityId={supplier.id} entityName={supplier.company} />
        <button onClick={onEdit} className="flex-1 btn btn-outline text-xs py-2">
          <Edit2 className="w-3.5 h-3.5" />Editar
        </button>
        <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone?.includes(searchTerm)
  );

  const handleSave = (supplierData: Partial<Supplier>) => {
    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, supplierData);
      toast.success('Proveedor actualizado');
    } else {
      addSupplier(supplierData as Omit<Supplier, 'id'>);
      toast.success('Proveedor creado');
    }
  };
  const openEditModal = (supplier: Supplier) => { setSelectedSupplier(supplier); setIsModalOpen(true); };
  const openWhatsAppModal = (supplier: Supplier) => { setSelectedSupplier(supplier); setIsWhatsAppModalOpen(true); };
  const openAddModal = () => { setSelectedSupplier(null); setIsModalOpen(true); };
  const handleDelete = (supplier: Supplier) => {
    if (confirm(`¿Eliminar a ${supplier.company}?`)) {
      deleteSupplier(supplier.id);
      toast.success('Proveedor eliminado');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Proveedores</h1>
          <p className="text-gray-500 mt-1">Gestione sus proveedores y envíe balances por WhatsApp</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary"><Plus className="w-4 h-4" />Nuevo Proveedor</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            onEdit={() => openEditModal(supplier)}
            onDelete={() => handleDelete(supplier)}
            onWhatsApp={() => openWhatsAppModal(supplier)}
          />
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-100">
          <Truck className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No se encontraron proveedores</p>
        </div>
      )}

      <SupplierModal supplier={selectedSupplier} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      <WhatsAppModal supplier={selectedSupplier} isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} />
    </div>
  );
}
