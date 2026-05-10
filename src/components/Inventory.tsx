import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Product } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Folder,
  History,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Check,
  Camera,
  Lock,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

function ProductModal({ product, isOpen, onClose, onSave }: ProductModalProps) {
  const { suppliers } = useAppStore();
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    barcode: '',
    category: '',
    cost: 0,
    salePrice: 0,
    currentStock: 0,
    unitOfMeasure: 'UNIDAD',
    isSellable: true,
    isProduct: true,
    isRawMaterial: false,
    pricesIncludeTax: false,
    isService: false,
    allowAlternateDescription: false,
    hasSerialNumber: false,
    isActive: true,
    image: '',
  });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({ ...product });
        setPreviewImage(product.image || '');
      } else {
        setFormData({
          name: '',
          barcode: '',
          category: '',
          cost: 0,
          salePrice: 0,
          currentStock: 0,
          unitOfMeasure: 'UNIDAD',
          isSellable: true,
          isProduct: true,
          isRawMaterial: false,
          pricesIncludeTax: false,
          isService: false,
          allowAlternateDescription: false,
          hasSerialNumber: false,
          isActive: true,
          image: '',
        });
        setPreviewImage('');
      }
    }
  }, [product, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, image: previewImage });
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--background-hover)] rounded-lg">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Imagen del Producto</label>
              <div className="flex flex-col items-center">
                <div onClick={() => document.getElementById('inv-product-image')?.click()} className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#ED6823] transition-colors overflow-hidden bg-gray-50 group">
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-500">Click para subir</span>
                    </div>
                  )}
                </div>
                <input id="inv-product-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => document.getElementById('inv-product-image')?.click()} className="text-xs text-[#ED6823] hover:underline">Cambiar</button>
                  {previewImage && <><span className="text-gray-300">|</span><button type="button" onClick={() => setPreviewImage('')} className="text-xs text-red-500 hover:underline">Eliminar</button></>}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Nombre *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="modern-input" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Código de Barras</label>
                  <input type="text" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} className="modern-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Categoría</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="modern-input">
                    <option value="">Seleccione</option>
                    <option value="Electrónicos">Electrónicos</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Líquidos">Líquidos</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Alimentos">Alimentos</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Proveedor</label>
                  <select value={formData.supplier || ''} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} className="modern-input">
                    <option value="">Seleccione proveedor</option>
                    {suppliers.filter(s => s.isActive).map(s => (
                      <option key={s.id} value={s.company}>{s.company}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Unidad</label>
                  <select value={formData.unitOfMeasure} onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })} className="modern-input">
                    <option value="UNIDAD">UNIDAD</option>
                    <option value="CAJA">CAJA</option>
                    <option value="LIBRA">LIBRA</option>
                    <option value="LITRO">LITRO</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Costo</label>
                  <input type="number" value={formData.cost || ''} onChange={(e) => setFormData({ ...formData, cost: e.target.value === '' ? 0 : Number(e.target.value) })} className="modern-input" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Precio Venta</label>
                  <input type="number" value={formData.salePrice || ''} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value === '' ? 0 : Number(e.target.value) })} className="modern-input" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Stock</label>
                  <input type="number" value={formData.currentStock || ''} onChange={(e) => setFormData({ ...formData, currentStock: e.target.value === '' ? 0 : Number(e.target.value) })} className="modern-input stock-input" placeholder="0" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancelar</button>
            <button type="submit" className="btn btn-primary">{product ? 'Guardar Cambios' : 'Crear Producto'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal de Ajuste de Stock
interface StockAdjustmentModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAdjust: (productId: number, newStock: number, reason: string, adminPin?: string) => boolean | Promise<boolean>;
}

function StockAdjustmentModal({ product, isOpen, onClose, onAdjust }: StockAdjustmentModalProps) {
  const [newStock, setNewStock] = useState(0);
  const [reason, setReason] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [requiresAuth, setRequiresAuth] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setNewStock(product.currentStock);
      setReason('');
      setAdminPin('');
      setRequiresAuth(false);
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (product) {
      const diff = Math.abs(newStock - product.currentStock);
      setRequiresAuth(diff > 10);
    }
  }, [newStock, product]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAdjust(product.id, newStock, reason, requiresAuth ? adminPin : undefined);
    if (success) {
      toast.success('Stock ajustado correctamente');
      onClose();
    } else if (requiresAuth) {
      toast.error('PIN de administrador incorrecto');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Ajustar Stock</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--background-hover)] rounded-lg">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Producto</p>
            <p className="font-semibold text-lg">{product.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Stock Actual</p>
              <p className="text-2xl font-bold">{product.currentStock}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">Nuevo Stock</p>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="modern-input stock-input text-2xl font-bold"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Motivo del Ajuste *</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="modern-input" required>
              <option value="">Seleccione un motivo</option>
              <option value="Conteo físico">Conteo físico</option>
              <option value="Daño/Merma">Daño/Merma</option>
              <option value="Devolución">Devolución</option>
              <option value="Corrección de error">Corrección de error</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {requiresAuth && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-yellow-700 mb-2">
                <Lock className="w-5 h-5" />
                <span className="font-medium">Requiere Autorización</span>
              </div>
              <p className="text-sm text-yellow-600 mb-2">El ajuste es mayor a 10 unidades. Ingrese el PIN de administrador.</p>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="modern-input"
                placeholder="PIN de administrador"
                maxLength={4}
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Check className="w-4 h-4" />
              Confirmar Ajuste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal de Categorías
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const { products } = useAppStore();
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    setCategories(cats.map(cat => ({
      name: cat,
      count: products.filter(p => p.category === cat).length
    })));
  }, [products]);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (!categories.find(c => c.name === newCategory.trim())) {
        setCategories([...categories, { name: newCategory.trim(), count: 0 }]);
        setNewCategory('');
        toast.success('Categoría agregada');
      } else {
        toast.error('La categoría ya existe');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Gestionar Categorías</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--background-hover)] rounded-lg">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="modern-input flex-1"
              placeholder="Nueva categoría..."
            />
            <button onClick={handleAddCategory} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{cat.name}</span>
                </div>
                <span className="text-sm text-gray-500">{cat.count} productos</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct, inventoryMovements, adjustStock } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  let filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort
  filteredProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
    else if (sortBy === 'stock') comparison = a.currentStock - b.currentStock;
    else if (sortBy === 'price') comparison = a.salePrice - b.salePrice;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleAddProduct = (productData: Partial<Product>) => {
    addProduct(productData as Omit<Product, 'id'>);
    toast.success('Producto creado exitosamente');
  };

  const handleUpdateProduct = (productData: Partial<Product>) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);
      toast.success('Producto actualizado exitosamente');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`¿Está seguro de eliminar "${product.name}"?`)) {
      deleteProduct(product.id);
      toast.success('Producto eliminado exitosamente');
    }
  };

  const handleAdjustStock = (productId: number, newStock: number, reason: string, adminPin?: string) => {
    const currentUser = 'Admin'; // En producción, obtener del usuario logueado
    return adjustStock(productId, newStock, reason, currentUser, adminPin);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openStockModal = (product: Product) => {
    setSelectedProduct(product);
    setIsStockModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const toggleSort = (field: 'name' | 'stock' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Inventario</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión avanzada de inventario y movimientos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMovementsModalOpen(true)} className="btn btn-outline">
            <History className="w-4 h-4" />
            Movimientos
          </button>
          <button onClick={() => setIsCategoryModalOpen(true)} className="btn btn-outline">
            <Folder className="w-4 h-4" />
            Categorías
          </button>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Productos</p>
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Valor Total</p>
          <p className="text-2xl font-bold text-[#ED6823]">RD${products.reduce((sum, p) => sum + (p.cost * p.currentStock), 0).toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-4">
          <p className="text-sm text-red-600">Stock Bajo</p>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.currentStock <= 5 && p.isActive).length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
          <p className="text-sm text-orange-600">Sin Stock</p>
          <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.currentStock === 0 && p.isActive).length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <p className="text-sm text-blue-600">Categorías</p>
          <p className="text-2xl font-bold text-blue-600">{categories.length - 1}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input pl-12 w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="modern-input w-40"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button className="btn btn-outline text-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  Producto
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Código</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Categoría</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Costo</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Precio</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => toggleSort('stock')}>
                <div className="flex items-center gap-1 justify-end">
                  Stock
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Valor</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <span className="font-medium text-gray-800">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{product.barcode || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{product.category || '-'}</td>
                <td className="px-4 py-3 text-right text-sm">RD${product.cost.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm font-medium">RD${product.salePrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${product.currentStock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.currentStock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  RD${(product.cost * product.currentStock).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openStockModal(product)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500" title="Ajustar Stock">
                      <TrendingUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEditModal(product)} className="p-2 hover:bg-gray-100 rounded-lg text-[#ED6823]" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(product)} className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No se encontraron productos</p>
        </div>
      )}

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={selectedProduct ? handleUpdateProduct : handleAddProduct}
      />

      <StockAdjustmentModal
        product={selectedProduct}
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onAdjust={handleAdjustStock}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Movements Modal */}
      {isMovementsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMovementsModalOpen(false)}>
          <div className="modal-content max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Historial de Movimientos</h2>
              <button onClick={() => setIsMovementsModalOpen(false)} className="p-2 hover:bg-[var(--background-hover)] rounded-lg">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {inventoryMovements.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay movimientos registrados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inventoryMovements.slice().reverse().map((movement) => (
                    <div key={movement.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        movement.type === 'entry' ? 'bg-green-100 text-green-600' :
                        movement.type === 'exit' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {movement.type === 'entry' ? <TrendingUp className="w-5 h-5" /> :
                         movement.type === 'exit' ? <TrendingDown className="w-5 h-5" /> :
                         <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{movement.productName}</span>
                          {movement.requiresAuth && <Lock className="w-3 h-3 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-500">
                          {movement.type === 'entry' ? 'Entrada' : movement.type === 'exit' ? 'Salida' : 'Ajuste'} • 
                          {' '}{movement.reason} • 
                          {' '}{new Date(movement.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          movement.type === 'entry' ? 'text-green-600' :
                          movement.type === 'exit' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {movement.type === 'entry' ? '+' : movement.type === 'exit' ? '-' : '±'}
                          {movement.quantity}
                        </p>
                        <p className="text-xs text-gray-400">
                          {movement.previousStock} → {movement.newStock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
