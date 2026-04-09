import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Kit } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Boxes,
  X,
  Package,
  DollarSign,
  ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface KitModalProps {
  kit: Kit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (kit: Partial<Kit>) => void;
}

function KitModal({ kit, isOpen, onClose, onSave }: KitModalProps) {
  const { products } = useAppStore();
  const [formData, setFormData] = useState<Partial<Kit>>({
    kitId: '',
    name: '',
    description: '',
    cost: 0,
    salePrice: 0,
    isActive: true,
    products: [],
  });
  const [previewImage, setPreviewImage] = useState<string | undefined>('');
  const [showProductSelector, setShowProductSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos del kit cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (kit) {
        setFormData({ ...kit });
        setPreviewImage(kit.image || '');
      } else {
        // Resetear para nuevo kit
        setFormData({
          kitId: '',
          name: '',
          description: '',
          cost: 0,
          salePrice: 0,
          isActive: true,
          products: [],
        });
        setPreviewImage('');
      }
    }
  }, [kit, isOpen]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (productId: number, productName: string) => {
    const currentProducts = formData.products || [];
    const existingIndex = currentProducts.findIndex(p => p.productId === productId);
    
    if (existingIndex >= 0) {
      const updated = [...currentProducts];
      updated[existingIndex].quantity += 1;
      setFormData({ ...formData, products: updated });
    } else {
      setFormData({
        ...formData,
        products: [...currentProducts, { productId, quantity: 1, name: productName }],
      });
    }
    toast.success('Producto agregado al kit');
  };

  const handleRemoveProduct = (productId: number) => {
    const currentProducts = formData.products || [];
    setFormData({
      ...formData,
      products: currentProducts.filter(p => p.productId !== productId),
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    const currentProducts = formData.products || [];
    setFormData({
      ...formData,
      products: currentProducts.map(p =>
        p.productId === productId ? { ...p, quantity } : p
      ),
    });
  };

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
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {kit ? 'Editar Kit' : 'Nuevo Kit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Imagen del Kit */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Imagen del Kit
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#ED6823] cursor-pointer flex items-center justify-center overflow-hidden group transition-all"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <span className="text-sm text-gray-400">Click para subir imagen</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Cambiar imagen</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Código del Kit
                </label>
                <input
                  type="text"
                  value={formData.kitId}
                  onChange={(e) => setFormData({ ...formData, kitId: e.target.value })}
                  className="modern-input"
                  placeholder="KIT-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="modern-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="modern-input"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Costo
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="modern-input pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Precio de venta
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="modern-input pl-12"
                  />
                </div>
              </div>
            </div>

            {/* Productos del Kit */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Productos en el Kit
                </label>
                <button
                  type="button"
                  onClick={() => setShowProductSelector(!showProductSelector)}
                  className="text-sm text-[#ED6823] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Producto
                  {showProductSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showProductSelector && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
                  <p className="text-xs text-gray-500 mb-2">Click en un producto para agregarlo</p>
                  <div className="grid grid-cols-2 gap-2">
                    {products.filter(p => p.isActive).map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleAddProduct(product.id, product.name)}
                        className="text-left p-2 bg-white rounded-lg hover:bg-[#ED6823] hover:text-white transition-colors text-sm"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.products && formData.products.length > 0 ? (
                <div className="space-y-2">
                  {formData.products.map((product) => (
                    <div key={product.productId} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="flex-1 text-sm">{product.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(product.productId, (product.quantity || 1) - 1)}
                          className="w-6 h-6 bg-white rounded hover:bg-gray-200 flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{product.quantity || 1}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(product.productId, (product.quantity || 1) + 1)}
                          className="w-6 h-6 bg-white rounded hover:bg-gray-200 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.productId)}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">
                  No hay productos en este kit
                </p>
              )}
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
              {kit ? 'Guardar cambios' : 'Crear kit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tarjeta de Kit
interface KitCardProps {
  kit: Kit;
  onEdit: () => void;
  onDelete: () => void;
}

function KitCard({ kit, onEdit, onDelete }: KitCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all">
      {/* Imagen */}
      <div className="relative h-40 bg-gray-50 flex items-center justify-center">
        {kit.image ? (
          <img
            src={kit.image}
            alt={kit.name}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="text-center">
            <Boxes className="w-12 h-12 text-gray-300 mx-auto" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="badge badge-primary text-xs">
            {kit.products?.length || 0} productos
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-[var(--text-muted)]">{kit.kitId}</p>
            <h3 className="font-semibold text-[var(--text-primary)]">{kit.name}</h3>
          </div>
        </div>

        {kit.description && (
          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
            {kit.description}
          </p>
        )}

        {/* Precios */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-[var(--text-muted)]">Costo</p>
            <p className="font-medium text-[var(--text-primary)]">
              RD${kit.cost.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#ED6823]/10 rounded-lg p-2">
            <p className="text-xs text-[#ED6823]">Venta</p>
            <p className="font-medium text-[#ED6823]">
              RD${kit.salePrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Ganancia */}
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-[var(--text-muted)]">Ganancia:</span>
          <span className={`font-medium ${kit.salePrice > kit.cost ? 'text-green-500' : 'text-red-500'}`}>
            RD${(kit.salePrice - kit.cost).toLocaleString()}
            {kit.cost > 0 && (
              <span className="text-xs ml-1">
                ({Math.round(((kit.salePrice - kit.cost) / kit.cost) * 100)}%)
              </span>
            )}
          </span>
        </div>

        {/* Productos expandibles */}
        {kit.products && kit.products.length > 0 && (
          <div className="border-t border-[var(--border)] pt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-sm text-[var(--text-secondary)] hover:text-[#ED6823] transition-colors"
            >
              <span>Ver productos ({kit.products.length})</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expanded && (
              <div className="mt-2 space-y-1">
                {kit.products.map((product, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Package className="w-3 h-3" />
                    <span className="flex-1">{product.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">x{product.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--border)]">
          <button
            onClick={onEdit}
            className="flex-1 btn btn-outline text-xs py-2"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-lg text-red-500"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Kits() {
  const { kits, addKit, updateKit, deleteKit } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);

  const filteredKits = kits.filter(
    (kit) =>
      kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kit.kitId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (kitData: Partial<Kit>) => {
    if (selectedKit) {
      updateKit(selectedKit.id, kitData);
      toast.success('Kit actualizado');
    } else {
      addKit(kitData as Omit<Kit, 'id'>);
      toast.success('Kit creado');
    }
  };

  const openEditModal = (kit: Kit) => {
    setSelectedKit(kit);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedKit(null);
    setIsModalOpen(true);
  };

  const handleDelete = (kit: Kit) => {
    if (confirm(`¿Está seguro de eliminar el kit "${kit.name}"?`)) {
      deleteKit(kit.id);
      toast.success('Kit eliminado');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Kits</h1>
          <p className="page-subtitle">Gestione sus paquetes de productos</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nuevo Kit
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar kits por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Total Kits</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{filteredKits.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Valor Total</p>
          <p className="text-2xl font-bold text-[#ED6823]">
            RD${filteredKits.reduce((sum, k) => sum + k.salePrice, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Ganancia Potencial</p>
          <p className="text-2xl font-bold text-green-500">
            RD${filteredKits.reduce((sum, k) => sum + (k.salePrice - k.cost), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Kits Grid - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredKits.map((kit) => (
          <KitCard
            key={kit.id}
            kit={kit}
            onEdit={() => openEditModal(kit)}
            onDelete={() => handleDelete(kit)}
          />
        ))}
      </div>

      {filteredKits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-[var(--border)]">
          <Boxes className="w-12 h-12 text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-secondary)]">No se encontraron kits</p>
        </div>
      )}

      {/* Modal */}
      <KitModal
        kit={selectedKit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
