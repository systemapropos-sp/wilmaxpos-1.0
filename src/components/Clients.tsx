import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Client } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  Users,
  CreditCard,
  MessageCircle,
  Send,
  Building2,
  Camera,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';
import { DocumentsManager } from './DocumentsManager';

interface ClientModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Partial<Client>) => void;
}

function ClientModal({ client, isOpen, onClose, onSave }: ClientModalProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zipCode: '',
    country: '',
    creditLimit: 0,
    birthDate: '',
    taxId: '',
    isActive: true,
  });
  const [previewImage, setPreviewImage] = useState('');

  // Cargar datos del cliente cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (client) {
        setFormData({ ...client });
        setPreviewImage(client.avatar || '');
      } else {
        // Resetear para nuevo cliente
        setFormData({
          name: '',
          lastName: '',
          company: '',
          email: '',
          phone: '',
          address1: '',
          address2: '',
          city: '',
          province: '',
          zipCode: '',
          country: '',
          creditLimit: 0,
          birthDate: '',
          taxId: '',
          isActive: true,
        });
        setPreviewImage('');
      }
    }
  }, [client, isOpen]);

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
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                Foto del Cliente
              </label>
              <div className="flex flex-col items-center">
                {/* Preview Container - Circular */}
                <div 
                  onClick={() => document.getElementById('client-image-input')?.click()}
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
                  id="client-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {/* Controles debajo */}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('client-image-input')?.click()}
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

            {/* Client Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="modern-input"
                    required
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

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Compañía</label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="modern-input"
                />
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
                  value={formData.address1 || ''}
                  onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Límite de Crédito</label>
                <input
                  type="number"
                  value={formData.creditLimit || ''}
                  onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                  className="modern-input"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {client ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// WhatsApp Modal
interface WhatsAppModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

function WhatsAppModal({ client, isOpen, onClose }: WhatsAppModalProps) {
  const [message, setMessage] = useState('');
  if (!isOpen || !client) return null;

  const defaultMessage = `Hola ${client.name},\n\nLe informamos que su balance actual con nosotros es de RD$${client.creditBalance.toLocaleString()}.\n\nGracias por su preferencia.`;

  const handleSend = () => {
    const phone = client.phone?.replace(/\D/g, '');
    if (!phone) {
      toast.error('El cliente no tiene número de teléfono');
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
            <p className="text-sm text-gray-500 mb-1">Cliente: <span className="font-medium text-gray-800">{client.name}</span></p>
            <p className="text-sm text-gray-500 mb-1">Teléfono: <span className="font-medium text-gray-800">{client.phone || 'No disponible'}</span></p>
            <p className="text-sm text-gray-500">Balance: <span className="font-medium text-red-500">RD${client.creditBalance.toLocaleString()}</span></p>
          </div>
          <textarea
            value={message || defaultMessage}
            onChange={(e) => setMessage(e.target.value)}
            className="modern-input mb-4"
            rows={6}
          />
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 btn btn-outline">Cancelar</button>
            <button onClick={handleSend} disabled={!client.phone} className="flex-1 btn btn-primary">
              <Send className="w-4 h-4" />Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Client Card
interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onWhatsApp: () => void;
}

function ClientCard({ client, onEdit, onDelete, onView, onWhatsApp }: ClientCardProps) {
  const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
      {/* Header */}
      <div className="p-4 flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
          {client.avatar ? (
            <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-lg font-bold">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{client.name}</h3>
          {client.company && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />{client.company}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-green-100 rounded text-green-600">Activo</span>
            {client.creditBalance > 0 && (
              <span className="text-xs px-2 py-0.5 bg-red-100 rounded text-red-600">Con deuda</span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-4 pb-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-3 text-sm">
          {client.phone && (
            <div className="flex items-center gap-1 text-gray-500">
              <Phone className="w-3.5 h-3.5" /><span>{client.phone}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-1 text-gray-500">
              <Mail className="w-3.5 h-3.5" /><span className="truncate max-w-[150px]">{client.email}</span>
            </div>
          )}
          {client.address1 && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3.5 h-3.5" /><span className="truncate max-w-[200px]">{client.address1}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Balance</p>
              <p className={`font-semibold ${client.creditBalance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                RD${client.creditBalance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Compras</p>
              <p className="font-semibold text-blue-500">RD${(client.totalPurchases || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 flex gap-2 flex-wrap">
        <button onClick={onView} className="flex-1 btn btn-outline text-xs py-2"><Eye className="w-3.5 h-3.5" />Ver</button>
        <button onClick={onWhatsApp} className="flex-1 btn btn-outline text-xs py-2 border-green-500 text-green-600 hover:bg-green-50">
          <MessageCircle className="w-3.5 h-3.5" />WhatsApp
        </button>
        <DocumentsManager entityType="client" entityId={client.id} entityName={client.name} />
        <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-lg text-[#ED6823]"><Edit2 className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

// View Modal
function ViewClientModal({ client, isOpen, onClose }: { client: Client | null; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !client) return null;
  const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center overflow-hidden">
                {client.avatar ? (
                  <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">{initials}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{client.name} {client.lastName}</h2>
                {client.company && <p className="text-gray-500">{client.company}</p>}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          <div className="space-y-4">
            {client.phone && <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-400" /><span>{client.phone}</span></div>}
            {client.email && <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-400" /><span>{client.email}</span></div>}
            {client.address1 && <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-400" /><span>{client.address1}</span></div>}
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span>Saldo: <span className={client.creditBalance > 0 ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold'}>
                RD${client.creditBalance.toLocaleString()}
              </span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
  );

  const handleSaveClient = (clientData: Partial<Client>) => {
    if (selectedClient) {
      updateClient(selectedClient.id, clientData);
      toast.success('Cliente actualizado');
    } else {
      addClient(clientData as Omit<Client, 'id' | 'createdAt'>);
      toast.success('Cliente creado');
    }
  };
  
  const handleDeleteClient = (client: Client) => {
    if (confirm(`¿Eliminar a ${client.name}?`)) {
      deleteClient(client.id);
      toast.success('Cliente eliminado');
    }
  };

  const openEditModal = (client: Client) => { setSelectedClient(client); setIsModalOpen(true); };
  const openViewModal = (client: Client) => { setSelectedClient(client); setIsViewModalOpen(true); };
  const openWhatsAppModal = (client: Client) => { setSelectedClient(client); setIsWhatsAppModalOpen(true); };
  const openAddModal = () => { setSelectedClient(null); setIsModalOpen(true); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-500 mt-1">Gestione sus clientes y envíe balances por WhatsApp</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary"><Plus className="w-4 h-4" />Nuevo Cliente</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={() => openEditModal(client)}
            onDelete={() => handleDeleteClient(client)}
            onView={() => openViewModal(client)}
            onWhatsApp={() => openWhatsAppModal(client)}
          />
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No se encontraron clientes</p>
        </div>
      )}

      <ClientModal client={selectedClient} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveClient} />
      <ViewClientModal client={selectedClient} isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
      <WhatsAppModal client={selectedClient} isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} />
    </div>
  );
}
