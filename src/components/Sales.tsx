import { useState, useRef } from 'react';
import { useAppStore } from '@/store';
import type { Client } from '@/types';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  Receipt,
  X,
  Calculator,
  User,
  Package,
  Grid3X3,
  List,
  Pause,
  Play,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export function Sales() {
  const { 
    products, 
    clients, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    getCartTotal,
    pausedSales,
    pauseSale,
    resumeSale,
    deletePausedSale,
    addSale,
  } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPausedSalesModal, setShowPausedSalesModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'both'>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const discount = 0;
  const tax = 18;
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode?.includes(searchTerm);
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory && p.isActive;
    })
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });

  const subtotal = getCartTotal();
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount - discount;
  const change = cashReceived - total;

  const handleAddToCart = (product: typeof products[0]) => {
    const success = addToCart({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.salePrice,
      discount: 0,
      total: product.salePrice,
      image: product.image,
    });
    
    if (success) {
      toast.success(`${product.name} agregado al carrito`);
    } else {
      toast.error(`No hay suficiente stock de ${product.name}`);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
    toast.success('Producto eliminado del carrito');
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(i => i.productId === productId);
    
    if (product && cartItem) {
      const qtyDiff = newQuantity - cartItem.quantity;
      
      if (qtyDiff > 0 && product.currentStock < qtyDiff) {
        toast.error(`Solo hay ${product.currentStock} unidades disponibles`);
        return;
      }
      
      // Actualizar stock
      if (qtyDiff !== 0) {
        const updatedProducts = products.map(p => 
          p.id === productId 
            ? { ...p, currentStock: p.currentStock - qtyDiff }
            : p
        );
        useAppStore.setState({ products: updatedProducts });
      }
      
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handlePauseSale = () => {
    if (cart.length === 0) {
      toast.error('No hay productos para pausar');
      return;
    }
    
    pauseSale({
      date: new Date().toISOString(),
      employee: 'Cajero Actual',
      clientId: selectedClient?.id,
      clientName: selectedClient?.name,
      items: [...cart],
      subtotal,
      tax: taxAmount,
      discount,
      total,
    });
    
    clearCart();
    setSelectedClient(null);
    toast.success('Venta pausada correctamente');
  };

  const handleResumeSale = (saleId: string) => {
    const sale = resumeSale(saleId);
    if (sale) {
      setSelectedClient(sale.clientId ? clients.find(c => c.id === sale.clientId) || null : null);
      toast.success('Venta reanudada');
      setShowPausedSalesModal(false);
    }
  };

  const handleDeletePausedSale = (saleId: string) => {
    if (confirm('¿Eliminar esta venta pausada? El stock será devuelto.')) {
      deletePausedSale(saleId);
      toast.success('Venta pausada eliminada');
    }
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error('No hay productos en el carrito');
      return;
    }

    if (paymentMethod === 'cash' && cashReceived < total) {
      toast.error('El efectivo recibido es insuficiente');
      return;
    }

    addSale({
      saleId: `SALE-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      register: 'Caja Principal',
      clientId: selectedClient?.id,
      clientName: selectedClient?.name || 'Cliente General',
      employee: 'Cajero Actual',
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        total: item.total,
        image: item.image,
      })),
      subtotal,
      tax: taxAmount,
      discount,
      total,
      paymentMethod: paymentMethod === 'cash' ? 'cash' : paymentMethod === 'card' ? 'card' : 'transfer',
      paymentAmount: paymentMethod === 'cash' ? cashReceived : total,
      change: paymentMethod === 'cash' ? change : 0,
      status: 'completed',
    });

    toast.success('Venta completada exitosamente');
    clearCart();
    setSelectedClient(null);
    setShowPaymentModal(false);
    setCashReceived(0);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Products Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
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
              className="modern-input w-36"
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

        {/* Products */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.currentStock <= 0}
                  className={`bg-white border border-gray-200 rounded-xl overflow-hidden text-left transition-all hover:shadow-md hover:border-[#ED6823] ${
                    product.currentStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-32 bg-gray-50 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    {product.isFavorite && (
                      <span className="absolute top-2 right-2 text-[#ED6823]">★</span>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-2">
                    <p className="font-medium text-sm text-gray-800 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category || 'Sin categoría'}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-bold text-[#ED6823]">RD${product.salePrice.toLocaleString()}</p>
                      <p className={`text-xs ${product.currentStock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                        Stock: {product.currentStock}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Producto</th>
                    <th className="px-3 py-2 text-right text-sm font-medium text-gray-600">Precio</th>
                    <th className="px-3 py-2 text-right text-sm font-medium text-gray-600">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr 
                      key={product.id} 
                      onClick={() => product.currentStock > 0 && handleAddToCart(product)}
                      className={`border-t border-gray-100 ${product.currentStock > 0 ? 'cursor-pointer hover:bg-gray-50' : 'opacity-50'}`}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <Package className="w-8 h-8 text-gray-300" />
                          )}
                          <span className="font-medium text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right font-medium">RD${product.salePrice.toLocaleString()}</td>
                      <td className={`px-3 py-2 text-right text-sm ${product.currentStock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                        {product.currentStock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-80 bg-white rounded-xl border border-gray-200 flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Carrito
              <span className="bg-[#ED6823] text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
            </h2>
            <div className="flex gap-2">
              {pausedSales.length > 0 && (
                <button 
                  onClick={() => setShowPausedSalesModal(true)}
                  className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 relative"
                  title="Ver ventas pausadas"
                >
                  <Pause className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {pausedSales.length}
                  </span>
                </button>
              )}
              <button 
                onClick={handlePauseSale}
                disabled={cart.length === 0}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                title="Pausar venta"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button 
                onClick={() => clearCart()}
                disabled={cart.length === 0}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Client Selection */}
          <button
            onClick={() => setShowClientModal(true)}
            className="w-full flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{selectedClient?.name || 'Cliente General'}</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-2" />
              <p className="text-sm">Carrito vacío</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  {item.image ? (
                    <img src={item.image} alt={item.productName} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <Package className="w-12 h-12 text-gray-300" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.productName}</p>
                    <p className="text-xs text-gray-500">RD${item.unitPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 bg-white rounded border hover:bg-gray-100 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 bg-white rounded border hover:bg-gray-100 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => handleRemoveFromCart(item.productId)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>RD${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ITBIS ({tax}%)</span>
              <span>RD${taxAmount.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Descuento</span>
                <span className="text-red-500">-RD${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span className="text-[#ED6823]">RD${total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={cart.length === 0}
            className="w-full btn btn-primary py-3"
          >
            <CreditCard className="w-5 h-5" />
            Procesar Pago
          </button>
        </div>
      </div>

      {/* Client Modal */}
      {showClientModal && (
        <div className="modal-overlay" onClick={() => setShowClientModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Seleccionar Cliente</h3>
              <button onClick={() => setShowClientModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <button
                onClick={() => { setSelectedClient(null); setShowClientModal(false); }}
                className="w-full p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 mb-2"
              >
                <span className="font-medium">Cliente General</span>
              </button>
              {clients.filter(c => c.isActive).map((client) => (
                <button
                  key={client.id}
                  onClick={() => { setSelectedClient(client); setShowClientModal(false); }}
                  className="w-full p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 mb-2"
                >
                  <span className="font-medium">{client.name} {client.lastName}</span>
                  <p className="text-sm text-gray-500">{client.phone}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Procesar Pago</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-500">Total a pagar</p>
                <p className="text-4xl font-bold text-[#ED6823]">RD${total.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === 'cash' ? 'border-[#ED6823] bg-[#ED6823]/5' : 'border-gray-200'
                  }`}
                >
                  <Banknote className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Efectivo</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === 'card' ? 'border-[#ED6823] bg-[#ED6823]/5' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Tarjeta</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('both')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === 'both' ? 'border-[#ED6823] bg-[#ED6823]/5' : 'border-gray-200'
                  }`}
                >
                  <Calculator className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Mixto</p>
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Efectivo Recibido</label>
                  <input
                    type="number"
                    value={cashReceived || ''}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                    className="modern-input text-2xl text-center"
                    placeholder="0"
                  />
                  {cashReceived > 0 && (
                    <div className="mt-2 text-center">
                      <p className="text-gray-500">Cambio</p>
                      <p className={`text-xl font-bold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        RD${change.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 btn btn-outline">
                  Cancelar
                </button>
                <button 
                  onClick={handlePayment}
                  disabled={paymentMethod === 'cash' && (cashReceived < total || cashReceived === 0)}
                  className="flex-1 btn btn-primary disabled:opacity-50"
                >
                  <Receipt className="w-4 h-4" />
                  Completar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paused Sales Modal */}
      {showPausedSalesModal && (
        <div className="modal-overlay" onClick={() => setShowPausedSalesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ventas Pausadas</h3>
              <button onClick={() => setShowPausedSalesModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {pausedSales.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay ventas pausadas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pausedSales.map((sale) => (
                    <div key={sale.saleId} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{sale.saleId}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(sale.date).toLocaleString()} • {sale.items.length} productos
                          </p>
                        </div>
                        <p className="font-bold text-[#ED6823]">RD${sale.total.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => handleResumeSale(sale.saleId)}
                          className="flex-1 btn btn-primary text-sm py-2"
                        >
                          <Play className="w-4 h-4" />
                          Reanudar
                        </button>
                        <button 
                          onClick={() => handleDeletePausedSale(sale.saleId)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
