import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Purchase, PurchaseItem } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Check,
  Grid3X3,
  X,
  FileText,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Box,
} from 'lucide-react';
import { toast } from 'sonner';
import { DocumentsManager } from './DocumentsManager';

type ViewMode = 'orders' | 'receive';

// Modal para crear/editar orden de compra
interface PurchaseOrderModalProps {
  purchase: Purchase | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchase: Partial<Purchase>) => void;
}

function PurchaseOrderModal({ purchase, isOpen, onClose, onSave }: PurchaseOrderModalProps) {
  const { suppliers, products } = useAppStore();
  const [formData, setFormData] = useState<Partial<Purchase>>({
    purchaseId: `OC-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    expectedDate: '',
    supplierId: undefined,
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    status: 'pending',
    notes: '',
  });
  const [showProductSelector, setShowProductSelector] = useState(false);

  // Cargar datos de la orden cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (purchase) {
        setFormData({ ...purchase });
      } else {
        // Resetear para nueva orden
        setFormData({
          purchaseId: `OC-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString().split('T')[0],
          expectedDate: '',
          supplierId: undefined,
          items: [],
          subtotal: 0,
          tax: 0,
          discount: 0,
          total: 0,
          status: 'pending',
          notes: '',
        });
      }
    }
  }, [purchase, isOpen]);

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

  const handleAddItem = (product: typeof products[0]) => {
    const currentItems = formData.items || [];
    const existingIndex = currentItems.findIndex(i => i.productId === product.id);
    
    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].unitCost;
      updateItems(updated);
    } else {
      const newItem: PurchaseItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitCost: product.cost,
        discount: 0,
        total: product.cost,
      };
      updateItems([...currentItems, newItem]);
    }
    toast.success(`${product.name} agregado`);
  };

  const handleRemoveItem = (productId?: number) => {
    const currentItems = formData.items || [];
    updateItems(currentItems.filter(i => i.productId !== productId));
  };

  const handleUpdateQuantity = (productId: number | undefined, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const currentItems = formData.items || [];
    updateItems(
      currentItems.map(i =>
        i.productId === productId
          ? { ...i, quantity, total: quantity * i.unitCost - i.discount }
          : i
      )
    );
  };

  const handleUpdateCost = (productId: number | undefined, unitCost: number) => {
    const currentItems = formData.items || [];
    updateItems(
      currentItems.map(i =>
        i.productId === productId
          ? { ...i, unitCost, total: i.quantity * unitCost - i.discount }
          : i
      )
    );
  };

  const updateItems = (items: PurchaseItem[]) => {
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const tax = subtotal * 0.18; // 18% ITBIS
    const total = subtotal + tax - (formData.discount || 0);
    setFormData({ ...formData, items, subtotal, tax, total });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierId) {
      toast.error('Seleccione un proveedor');
      return;
    }
    if (!formData.items || formData.items.length === 0) {
      toast.error('Agregue al menos un producto');
      return;
    }
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
            {purchase ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Número de Orden</label>
              <input
                type="text"
                value={formData.purchaseId}
                onChange={(e) => setFormData({ ...formData, purchaseId: e.target.value })}
                className="modern-input"
                readOnly={!!purchase}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Proveedor *</label>
              <select
                value={formData.supplierId || ''}
                onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
                className="modern-input"
                required
              >
                <option value="">Seleccionar proveedor</option>
                {suppliers.filter(s => s.isActive).map(s => (
                  <option key={s.id} value={s.id}>{s.company}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="modern-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Esperada</label>
              <input
                type="date"
                value={formData.expectedDate || ''}
                onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                className="modern-input"
              />
            </div>
          </div>

          {/* Productos */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
            <div className="bg-gray-50 p-3 flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Productos</h3>
              <button
                type="button"
                onClick={() => setShowProductSelector(!showProductSelector)}
                className="text-sm text-[#ED6823] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Agregar Producto
              </button>
            </div>

            {showProductSelector && (
              <div className="p-3 bg-white border-b border-gray-200 max-h-48 overflow-y-auto">
                <p className="text-xs text-gray-500 mb-2">Click para agregar</p>
                <div className="grid grid-cols-3 gap-2">
                  {products.filter(p => p.isActive).map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleAddItem(product)}
                      className="text-left p-2 bg-gray-50 rounded-lg hover:bg-[#ED6823] hover:text-white transition-colors text-sm"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Producto</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Cantidad</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Costo Unit.</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items?.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <input
                        type="number"
                        value={item.unitCost}
                        onChange={(e) => handleUpdateCost(item.productId, Number(e.target.value))}
                        className="w-24 text-right modern-input py-1"
                      />
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      RD${item.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-1 hover:bg-red-50 rounded text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {(!formData.items || formData.items.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No hay productos agregados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="flex justify-end mb-6">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>RD${(formData.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ITBIS (18%):</span>
                <span>RD${(formData.tax || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Descuento:</span>
                <input
                  type="number"
                  value={formData.discount || 0}
                  onChange={(e) => {
                    const discount = Number(e.target.value);
                    const total = (formData.subtotal || 0) + (formData.tax || 0) - discount;
                    setFormData({ ...formData, discount, total });
                  }}
                  className="w-24 text-right modern-input py-1"
                />
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-[#ED6823]">RD${(formData.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">Notas</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="modern-input"
              rows={2}
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {purchase ? 'Guardar Cambios' : 'Crear Orden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tarjeta de Orden de Compra
interface PurchaseOrderCardProps {
  purchase: Purchase;
  suppliers: { id: number; company: string }[];
  onEdit: () => void;
  onDelete: () => void;
  onReceive: () => void;
  onView: () => void;
}

function PurchaseOrderCard({ purchase, suppliers, onEdit, onDelete, onReceive, onView }: PurchaseOrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const supplier = suppliers.find(s => s.id === purchase.supplierId);

  const statusConfig = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    received: { label: 'Recibida', color: 'bg-green-100 text-green-700', icon: Check },
    cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700', icon: X },
  };

  const status = statusConfig[purchase.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-[#ED6823]">{purchase.purchaseId}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${status.color}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">{supplier?.company || 'Sin proveedor'}</h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[var(--text-primary)]">
              RD${purchase.total.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {purchase.items?.length || 0} productos
            </p>
          </div>
        </div>

        {/* Fechas */}
        <div className="flex gap-4 text-sm text-[var(--text-secondary)] mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Creada: {purchase.date}</span>
          </div>
          {purchase.expectedDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Esperada: {purchase.expectedDate}</span>
            </div>
          )}
        </div>

        {/* Productos expandibles */}
        {purchase.items && purchase.items.length > 0 && (
          <div className="border-t border-[var(--border)] pt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-sm text-[var(--text-secondary)] hover:text-[#ED6823] transition-colors"
            >
              <span>Ver productos ({purchase.items.length})</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expanded && (
              <div className="mt-2 space-y-1">
                {purchase.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm py-1">
                    <div className="flex items-center gap-2">
                      <Box className="w-3 h-3 text-gray-400" />
                      <span className="text-[var(--text-secondary)]">{item.productName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">x{item.quantity}</span>
                      <span className="font-medium">RD${item.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--border)] flex-wrap">
          {purchase.status === 'pending' && (
            <button
              onClick={onReceive}
              className="flex-1 btn btn-primary text-xs py-2"
            >
              <Check className="w-3.5 h-3.5" />
              Recibir
            </button>
          )}
          <button
            onClick={onView}
            className="flex-1 btn btn-outline text-xs py-2"
          >
            <FileText className="w-3.5 h-3.5" />
            Ver
          </button>
          <DocumentsManager 
            entityType="purchase" 
            entityId={purchase.id} 
            entityName={`Orden ${purchase.purchaseId}`} 
          />
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-lg text-[var(--primary)]"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
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

// Vista de Recepción de Compras
function PurchaseReceiveView() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showGrid, setShowGrid] = useState(false);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.includes(searchTerm)
  );

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.cost,
      discount: 0,
      total: product.cost,
    });
  };

  const handleReceive = () => {
    if (cart.length === 0) {
      toast.error('No hay artículos para recibir');
      return;
    }
    toast.success('Compra registrada exitosamente');
    clearCart();
  };

  const subtotal = getCartTotal();

  return (
    <div className="flex gap-6">
      {/* Products Section */}
      <div className="flex-1">
        {/* Search */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Ingrese un artículo o el código de barras escaneado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input pl-12"
              />
            </div>
            <button
              onClick={handleReceive}
              disabled={cart.length === 0}
              className="btn btn-secondary"
            >
              <Check className="w-4 h-4" />
              Recibir
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`btn ${showGrid ? 'btn-primary' : 'btn-outline'}`}
            >
              <Grid3X3 className="w-4 h-4" />
              Cuadrícula
            </button>
          </div>
        </div>

        {/* Products */}
        {searchTerm && (
          <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="border border-[var(--border)] rounded-xl p-4 text-left hover:border-[var(--primary)] hover:shadow-md transition-all"
                >
                  <p className="font-medium text-[var(--text-primary)] line-clamp-2">{product.name}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{product.category}</p>
                  <p className="text-lg font-bold text-[var(--secondary)] mt-2">
                    RD${product.cost.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[var(--text-primary)]">Artículos a recibir</h2>
          </div>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="w-12 h-12 text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-secondary)]">No hay artículos en el carrito</p>
            </div>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Nombre Artículo</th>
                  <th>Costo</th>
                  <th>Cantidad</th>
                  <th>Descuento %</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>RD${item.unitPrice.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item.productId, Number(e.target.value))}
                        className="modern-input w-20"
                        min="1"
                      />
                    </td>
                    <td>0%</td>
                    <td>RD${item.total.toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 hover:bg-[var(--background-hover)] rounded-lg text-[var(--danger)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="w-80">
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Resumen</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Subtotal</span>
              <span className="font-medium">RD${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Impuesto</span>
              <span className="font-medium">RD$0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Descuento</span>
              <span className="font-medium">RD$0.00</span>
            </div>
            <div className="pt-3 border-t border-[var(--border)] flex justify-between">
              <span className="font-semibold text-[var(--text-primary)]">Total</span>
              <span className="text-xl font-bold text-[var(--primary)]">
                RD${subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">En la cesta</span>
              <span className="font-medium">{cart.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal
export function Purchases() {
  const { suppliers, purchases } = useAppStore();
  const [viewMode, setViewMode] = useState<ViewMode>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'received' | 'cancelled'>('all');

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = 
      p.purchaseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suppliers.find(s => s.id === p.supplierId)?.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: filteredPurchases.length,
    pending: filteredPurchases.filter(p => p.status === 'pending').length,
    received: filteredPurchases.filter(p => p.status === 'received').length,
    totalValue: filteredPurchases.reduce((sum, p) => sum + p.total, 0),
  };

  const handleSave = (purchaseData: Partial<Purchase>) => {
    toast.success(purchaseData.id ? 'Orden actualizada' : 'Orden creada exitosamente');
    setIsModalOpen(false);
  };

  const handleReceive = (purchase: Purchase) => {
    if (confirm(`¿Confirmar recepción de la orden ${purchase.purchaseId}?`)) {
      toast.success(`Orden ${purchase.purchaseId} marcada como recibida`);
    }
  };

  const handleDelete = (purchase: Purchase) => {
    if (confirm(`¿Está seguro de eliminar la orden ${purchase.purchaseId}?`)) {
      toast.success('Orden eliminada');
    }
  };

  if (viewMode === 'receive') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Recepción de Compra</h1>
            <p className="page-subtitle">Registre nuevas recepciones de inventario</p>
          </div>
          <button onClick={() => setViewMode('orders')} className="btn btn-outline">
            <X className="w-4 h-4" />
            Cancelar
          </button>
        </div>
        <PurchaseReceiveView />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Órdenes de Compra</h1>
          <p className="page-subtitle">Gestione sus órdenes de compra y recepciones</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setViewMode('receive')} className="btn btn-secondary">
            <ShoppingCart className="w-4 h-4" />
            Recepción Rápida
          </button>
          <button 
            onClick={() => {
              setSelectedPurchase(null);
              setIsModalOpen(true);
            }} 
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Nueva Orden
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Total Órdenes</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Recibidas</p>
          <p className="text-2xl font-bold text-green-500">{stats.received}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--text-muted)]">Valor Total</p>
          <p className="text-2xl font-bold text-[#ED6823]">RD${stats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar por número de orden o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input pl-12"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="modern-input w-40"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="received">Recibidas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Orders Grid - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPurchases.map((purchase) => (
          <PurchaseOrderCard
            key={purchase.id}
            purchase={purchase}
            suppliers={suppliers}
            onEdit={() => {
              setSelectedPurchase(purchase);
              setIsModalOpen(true);
            }}
            onDelete={() => handleDelete(purchase)}
            onReceive={() => handleReceive(purchase)}
            onView={() => {
              setSelectedPurchase(purchase);
              // TODO: Implement view modal
            }}
          />
        ))}
      </div>

      {filteredPurchases.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-[var(--border)]">
          <FileText className="w-12 h-12 text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-secondary)]">No se encontraron órdenes de compra</p>
        </div>
      )}

      {/* Modal */}
      <PurchaseOrderModal
        purchase={selectedPurchase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
