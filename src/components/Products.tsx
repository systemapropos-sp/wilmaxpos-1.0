import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Product } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Heart,
  Camera,
  Grid3X3,
  List,
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

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || '',
        barcode: product.barcode || '',
        category: product.category || '',
        cost: product.cost || 0,
        salePrice: product.salePrice || 0,
        currentStock: product.currentStock || 0,
        unitOfMeasure: product.unitOfMeasure || 'UNIDAD',
        isSellable: product.isSellable ?? true,
        isProduct: product.isProduct ?? true,
        isRawMaterial: product.isRawMaterial ?? false,
        pricesIncludeTax: product.pricesIncludeTax ?? false,
        isService: product.isService ?? false,
        allowAlternateDescription: product.allowAlternateDescription ?? false,
        hasSerialNumber: product.hasSerialNumber ?? false,
        isActive: product.isActive ?? true,
        supplier: product.supplier || '',
        image: product.image || '',
      });
      setPreviewImage(product.image || '');
    } else if (isOpen && !product) {
      // Resetear para nuevo producto
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
        supplier: '',
        image: '',
      });
      setPreviewImage('');
    }
  }, [product, isOpen]);

  // Cerrar con ESC
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
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
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
            {/* Image Upload */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Imagen del Producto
              </label>
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => document.getElementById('product-image-input')?.click()}
                  className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#ED6823] transition-colors overflow-hidden bg-gray-50 group"
                >
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
                <input id="product-image-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => document.getElementById('product-image-input')?.click()} className="text-xs text-[#ED6823] hover:underline">Cambiar</button>
                  {previewImage && <><span className="text-gray-300">|</span><button type="button" onClick={() => setPreviewImage('')} className="text-xs text-red-500 hover:underline">Eliminar</button></>}
                </div>
              </div>
            </div>

            {/* Form Fields */}
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

// Tarjeta de Producto
interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

function ProductCard({ product, onEdit, onDelete, onToggleFavorite }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
      {/* Image */}
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${product.isFavorite ? 'bg-[#ED6823] text-white' : 'bg-white/80 text-gray-400 hover:text-[#ED6823]'}`}
        >
          <Heart className={`w-4 h-4 ${product.isFavorite ? 'fill-current' : ''}`} />
        </button>
        {product.category && (
          <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
            {product.category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.barcode || 'Sin código'}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400">Precio</p>
            <p className="font-bold text-[#ED6823]">RD${product.salePrice.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Stock</p>
            <p className={`font-medium ${product.currentStock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
              {product.currentStock}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button onClick={onEdit} className="flex-1 btn btn-outline text-xs py-2">
            <Edit2 className="w-3.5 h-3.5" />
            Editar
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const { products, addProduct, updateProduct, deleteProduct, toggleFavorite } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

  const handleToggleFavorite = (product: Product) => {
    toggleFavorite(product.id);
    toast.success(product.isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos');
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Productos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestione su catálogo de productos</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Productos</p>
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Activos</p>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.isActive).length}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-4">
          <p className="text-sm text-red-600">Stock Bajo</p>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.currentStock <= 5 && p.isActive).length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
          <p className="text-sm text-orange-600">Favoritos</p>
          <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.isFavorite).length}</p>
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
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => openEditModal(product)}
              onDelete={() => handleDeleteProduct(product)}
              onToggleFavorite={() => handleToggleFavorite(product)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Producto</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Código</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Categoría</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Precio</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-gray-100">
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
                  <td className="px-4 py-3 text-right font-medium">RD${product.salePrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={product.currentStock <= 5 ? 'text-red-500 font-medium' : 'text-green-600'}>
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleToggleFavorite(product)} className={`p-2 rounded-lg ${product.isFavorite ? 'text-[#ED6823]' : 'text-gray-400 hover:text-[#ED6823]'}`}>
                        <Heart className={`w-4 h-4 ${product.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button onClick={() => openEditModal(product)} className="p-2 hover:bg-gray-100 rounded-lg text-[#ED6823]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No se encontraron productos</p>
        </div>
      )}

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={selectedProduct ? handleUpdateProduct : handleAddProduct}
      />
    </div>
  );
}
