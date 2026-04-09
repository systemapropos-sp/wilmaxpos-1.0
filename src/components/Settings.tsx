import { useState, useRef } from 'react';
import {
  Store,
  Receipt,
  Globe,
  Bell,
  Save,
  Upload,
  ImageIcon,
  Printer,
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Download,
  Database,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { toast } from 'sonner';

type TabType = 'store' | 'receipts' | 'printers' | 'users' | 'data' | 'language' | 'notifications';

type UserRole = 'admin' | 'cashier' | 'seller' | 'manager';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pin: string;
  isActive: boolean;
}

interface Printer {
  id: number;
  name: string;
  type: 'thermal' | 'inkjet' | 'laser';
  connection: 'usb' | 'network' | 'bluetooth';
  address: string;
  isDefault: boolean;
  isActive: boolean;
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('store');
  const [storeSettings, setStoreSettings] = useState({
    name: 'Mi Tienda',
    phone: '',
    address: '',
    email: '',
    taxId: '',
    currency: 'RD$',
    taxRate: 18,
    receiptFooter: '¡Gracias por su compra!',
  });

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showTaxId: true,
    showEmployee: true,
    showClient: true,
    autoPrint: false,
  });

  const [language, setLanguage] = useState('es');

  const [notificationSettings, setNotificationSettings] = useState({
    lowStock: true,
    overduePayments: true,
    newOrders: true,
    dailyReports: false,
  });

  // Printers
  const [printers, setPrinters] = useState<Printer[]>([
    { id: 1, name: 'Impresora Térmica Principal', type: 'thermal', connection: 'usb', address: 'USB001', isDefault: true, isActive: true },
    { id: 2, name: 'Impresora Cocina', type: 'thermal', connection: 'network', address: '192.168.1.100', isDefault: false, isActive: true },
  ]);
  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);
  const [printerForm, setPrinterForm] = useState<Partial<Printer>>({
    name: '',
    type: 'thermal',
    connection: 'usb',
    address: '',
    isDefault: false,
    isActive: true,
  });

  // Users
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Administrador', email: 'admin@tienda.com', phone: '', role: 'admin', pin: '1234', isActive: true },
    { id: 2, name: 'Cajero 1', email: 'cajero1@tienda.com', phone: '', role: 'cashier', pin: '5678', isActive: true },
    { id: 3, name: 'Vendedor 1', email: 'vendedor1@tienda.com', phone: '', role: 'seller', pin: '9012', isActive: true },
  ]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [userForm, setUserForm] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    role: 'cashier',
    pin: '',
    isActive: true,
  });

  const handleSave = () => {
    toast.success('Configuración guardada exitosamente');
  };

  // Import/Export handlers
  const store = useAppStore();

  const exportToCSV = (dataType: string) => {
    let data: any[] = [];
    let headers: string[] = [];
    let filename = '';

    switch (dataType) {
      case 'products':
        data = store.products.map(p => ({
          id: p.id,
          name: p.name,
          barcode: p.barcode,
          category: p.category,
          cost: p.cost,
          salePrice: p.salePrice,
          currentStock: p.currentStock,
          unitOfMeasure: p.unitOfMeasure,
          supplier: p.supplier,
          isActive: p.isActive,
        }));
        headers = ['ID', 'Nombre', 'Código de Barras', 'Categoría', 'Costo', 'Precio Venta', 'Stock', 'Unidad', 'Proveedor', 'Activo'];
        filename = 'productos.csv';
        break;
      case 'clients':
        data = store.clients.map(c => ({
          id: c.id,
          name: c.name,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          company: c.company,
          creditLimit: c.creditLimit,
          isActive: c.isActive,
        }));
        headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Empresa', 'Límite de Crédito', 'Activo'];
        filename = 'clientes.csv';
        break;
      case 'suppliers':
        data = store.suppliers.map(s => ({
          id: s.id,
          company: s.company,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          phone: s.phone,
          balance: s.balance,
          isActive: s.isActive,
        }));
        headers = ['ID', 'Empresa', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Balance', 'Activo'];
        filename = 'proveedores.csv';
        break;
      case 'sales':
        data = store.sales.map(s => ({
          id: s.id,
          saleId: s.saleId,
          date: s.date,
          clientName: s.clientName,
          total: s.total,
          paymentMethod: s.paymentMethod,
          status: s.status,
        }));
        headers = ['ID', 'Número', 'Fecha', 'Cliente', 'Total', 'Método de Pago', 'Estado'];
        filename = 'ventas.csv';
        break;
      case 'purchases':
        data = store.purchases.map(p => ({
          id: p.id,
          purchaseId: p.purchaseId,
          date: p.date,
          supplierName: p.supplierName,
          total: p.total,
          status: p.status,
        }));
        headers = ['ID', 'Número', 'Fecha', 'Proveedor', 'Total', 'Estado'];
        filename = 'compras.csv';
        break;
      case 'employees':
        data = store.employees.map(e => ({
          id: e.id,
          name: e.name,
          email: e.email,
          phone: e.phone,
          position: e.position,
          department: e.department,
          salaryMonthly: e.salaryMonthly,
          isActive: e.isActive,
        }));
        headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Cargo', 'Departamento', 'Sueldo Mensual', 'Activo'];
        filename = 'empleados.csv';
        break;
    }

    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    toast.success(`${filename} descargado`);
  };

  const importFromCSV = (dataType: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      let importedCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
        const row: any = {};
        headers.forEach((h, idx) => row[h] = values[idx]);
        
        // Import based on type
        if (dataType === 'products') {
          store.addProduct({
            name: row.Nombre || row.name || 'Producto sin nombre',
            barcode: row['Código de Barras'] || row.barcode || '',
            category: row.Categoría || row.category || '',
            cost: parseFloat(row.Costo || row.cost) || 0,
            salePrice: parseFloat(row['Precio Venta'] || row.salePrice) || 0,
            currentStock: parseInt(row.Stock || row.currentStock) || 0,
            unitOfMeasure: row.Unidad || row.unitOfMeasure || 'UNIDAD',
            supplier: row.Proveedor || row.supplier || '',
            isSellable: true,
            isProduct: true,
            isRawMaterial: false,
            pricesIncludeTax: false,
            isService: false,
            allowAlternateDescription: false,
            hasSerialNumber: false,
            isActive: row.Activo === 'true' || row.Activo === 'TRUE' || true,
            image: '',
          });
          importedCount++;
        } else if (dataType === 'clients') {
          store.addClient({
            name: row.Nombre || row.name || '',
            lastName: row.Apellido || row.lastName || '',
            email: row.Email || row.email || '',
            phone: row.Teléfono || row.phone || '',
            company: row.Empresa || row.company || '',
            creditLimit: parseFloat(row['Límite de Crédito'] || row.creditLimit) || 0,
            creditBalance: 0,
            isActive: row.Activo === 'true' || row.Activo === 'TRUE' || true,
          });
          importedCount++;
        } else if (dataType === 'suppliers') {
          store.addSupplier({
            company: row.Empresa || row.company || '',
            firstName: row.Nombre || row.firstName || '',
            lastName: row.Apellido || row.lastName || '',
            email: row.Email || row.email || '',
            phone: row.Teléfono || row.phone || '',
            balance: parseFloat(row.Balance || row.balance) || 0,
            isActive: row.Activo === 'true' || row.Activo === 'TRUE' || true,
          });
          importedCount++;
        }
      }
      
      toast.success(`${importedCount} registros importados`);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = (type: string) => {
    let headers = '';
    switch (type) {
      case 'products':
        headers = 'Nombre,Código de Barras,Categoría,Costo,Precio Venta,Stock,Unidad,Proveedor,Activo';
        break;
      case 'clients':
        headers = 'Nombre,Apellido,Email,Teléfono,Empresa,Límite de Crédito,Activo';
        break;
      case 'suppliers':
        headers = 'Empresa,Nombre,Apellido,Email,Teléfono,Balance,Activo';
        break;
    }
    
    const blob = new Blob([headers + '\n'], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `plantilla_${type}.csv`;
    link.click();
  };

  // Printer handlers
  const openPrinterModal = (printer?: Printer) => {
    if (printer) {
      setEditingPrinter(printer);
      setPrinterForm({ ...printer });
    } else {
      setEditingPrinter(null);
      setPrinterForm({
        name: '',
        type: 'thermal',
        connection: 'usb',
        address: '',
        isDefault: false,
        isActive: true,
      });
    }
    setIsPrinterModalOpen(true);
  };

  const savePrinter = () => {
    if (!printerForm.name || !printerForm.address) {
      toast.error('Complete todos los campos');
      return;
    }
    if (editingPrinter) {
      setPrinters(printers.map(p => p.id === editingPrinter.id ? { ...p, ...printerForm } as Printer : p));
      toast.success('Impresora actualizada');
    } else {
      setPrinters([...printers, { ...printerForm, id: Date.now() } as Printer]);
      toast.success('Impresora agregada');
    }
    setIsPrinterModalOpen(false);
  };

  const deletePrinter = (id: number) => {
    if (confirm('¿Eliminar esta impresora?')) {
      setPrinters(printers.filter(p => p.id !== id));
      toast.success('Impresora eliminada');
    }
  };

  // User handlers
  const openUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ ...user });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        phone: '',
        role: 'cashier',
        pin: '',
        isActive: true,
      });
    }
    setShowPin(false);
    setIsUserModalOpen(true);
  };

  const saveUser = () => {
    if (!userForm.name || !userForm.email || !userForm.pin) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userForm } as User : u));
      toast.success('Usuario actualizado');
    } else {
      setUsers([...users, { ...userForm, id: Date.now() } as User]);
      toast.success('Usuario creado');
    }
    setIsUserModalOpen(false);
  };

  const deleteUser = (id: number) => {
    if (confirm('¿Eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
      toast.success('Usuario eliminado');
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      admin: 'Administrador',
      cashier: 'Cajero',
      seller: 'Vendedor',
      manager: 'Gerente',
    };
    return labels[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      admin: 'bg-purple-100 text-purple-700',
      cashier: 'bg-blue-100 text-blue-700',
      seller: 'bg-green-100 text-green-700',
      manager: 'bg-orange-100 text-orange-700',
    };
    return colors[role];
  };

  // Export Button Component
  function ExportButton({ label, dataType }: { label: string; dataType: string }) {
    return (
      <button
        onClick={() => exportToCSV(dataType)}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#ED6823] hover:text-[#ED6823] transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  }

  // Import Button Component
  function ImportButton({ label, dataType }: { label: string; dataType: string }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              importFromCSV(dataType, file);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }
          }}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#ED6823] hover:text-[#ED6823] transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      </>
    );
  }

  const tabs = [
    { id: 'store' as TabType, label: 'Tienda', icon: Store },
    { id: 'receipts' as TabType, label: 'Recibos', icon: Receipt },
    { id: 'printers' as TabType, label: 'Impresoras', icon: Printer },
    { id: 'users' as TabType, label: 'Usuarios', icon: Users },
    { id: 'data' as TabType, label: 'Importar/Exportar', icon: Database },
    { id: 'language' as TabType, label: 'Idioma', icon: Globe },
    { id: 'notifications' as TabType, label: 'Notificaciones', icon: Bell },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Configuración</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure las opciones del sistema</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#ED6823] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Store Settings */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Store className="w-5 h-5 text-[#ED6823]" />
              <h2 className="text-lg font-semibold text-gray-800">Información de la Tienda</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  value={storeSettings.name}
                  onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                  className="modern-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={storeSettings.phone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                  className="modern-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={storeSettings.address}
                onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                className="modern-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                  className="modern-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  RFC/ID Fiscal
                </label>
                <input
                  type="text"
                  value={storeSettings.taxId}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxId: e.target.value })}
                  className="modern-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Moneda
                </label>
                <select
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  className="modern-input"
                >
                  <option value="RD$">RD$ (Peso Dominicano)</option>
                  <option value="$">$ (Dólar)</option>
                  <option value="€">€ (Euro)</option>
                  <option value="MX$">MX$ (Peso Mexicano)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tasa de Impuesto (%)
                </label>
                <input
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: Number(e.target.value) })}
                  className="modern-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Pie de Recibo
              </label>
              <input
                type="text"
                value={storeSettings.receiptFooter}
                onChange={(e) => setStoreSettings({ ...storeSettings, receiptFooter: e.target.value })}
                className="modern-input"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Logo de la Tienda
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <button className="btn btn-outline text-sm">
                    <Upload className="w-4 h-4" />
                    Subir Logo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Tamaño recomendado: 200x200px</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Settings */}
        {activeTab === 'receipts' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Receipt className="w-5 h-5 text-[#ED6823]" />
              <h2 className="text-lg font-semibold text-gray-800">Configuración de Recibos</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'showLogo', label: 'Mostrar Logo', description: 'Incluir logo en los recibos' },
                { key: 'showTaxId', label: 'Mostrar RFC', description: 'Incluir RFC en los recibos' },
                { key: 'showEmployee', label: 'Mostrar Empleado', description: 'Incluir nombre del empleado' },
                { key: 'showClient', label: 'Mostrar Cliente', description: 'Incluir información del cliente' },
                { key: 'autoPrint', label: 'Impresión Automática', description: 'Imprimir recibos automáticamente' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setReceiptSettings({ ...receiptSettings, [item.key]: !receiptSettings[item.key as keyof typeof receiptSettings] })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      receiptSettings[item.key as keyof typeof receiptSettings] ? 'bg-[#ED6823]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        receiptSettings[item.key as keyof typeof receiptSettings] ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Printers */}
        {activeTab === 'printers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-[#ED6823]" />
                <h2 className="text-lg font-semibold text-gray-800">Impresoras</h2>
              </div>
              <button onClick={() => openPrinterModal()} className="btn btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Agregar Impresora
              </button>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Vista Previa del Recibo</h3>
              <div className="bg-white rounded-lg p-4 max-w-xs mx-auto shadow-sm border border-gray-200">
                <div className="text-center border-b border-dashed border-gray-300 pb-3 mb-3">
                  <p className="font-bold text-lg">{storeSettings.name}</p>
                  <p className="text-xs text-gray-500">{storeSettings.phone}</p>
                  <p className="text-xs text-gray-500">{storeSettings.address}</p>
                  {receiptSettings.showTaxId && storeSettings.taxId && (
                    <p className="text-xs text-gray-500">RFC: {storeSettings.taxId}</p>
                  )}
                </div>
                <div className="text-xs space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>Factura: #001</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  {receiptSettings.showEmployee && (
                    <p>Atendió: Cajero 1</p>
                  )}
                  {receiptSettings.showClient && (
                    <p>Cliente: Cliente General</p>
                  )}
                </div>
                <div className="border-t border-dashed border-gray-300 pt-2 mb-2">
                  <div className="flex justify-between text-sm">
                    <span>Producto 1</span>
                    <span>$100.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Producto 2</span>
                    <span>$50.00</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-gray-300 pt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$150.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuesto ({storeSettings.taxRate}%):</span>
                    <span>${(150 * storeSettings.taxRate / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${(150 * (1 + storeSettings.taxRate / 100)).toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-center border-t border-dashed border-gray-300 pt-3 mt-3">
                  <p className="text-xs text-gray-500">{storeSettings.receiptFooter}</p>
                </div>
              </div>
            </div>

            {/* Printers List */}
            <div className="space-y-3">
              {printers.map((printer) => (
                <div key={printer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">{printer.name}</p>
                        {printer.isDefault && (
                          <span className="text-xs bg-[#ED6823] text-white px-2 py-0.5 rounded">Predeterminada</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {printer.type === 'thermal' ? 'Térmica' : printer.type === 'inkjet' ? 'Inyección' : 'Láser'} • 
                        {' '}{printer.connection === 'usb' ? 'USB' : printer.connection === 'network' ? 'Red' : 'Bluetooth'} • 
                        {' '}{printer.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPrinterModal(printer)}
                      className="p-2 hover:bg-white rounded-lg text-[#ED6823]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePrinter(printer.id)}
                      className="p-2 hover:bg-white rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Printer Modal */}
            {isPrinterModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingPrinter ? 'Editar Impresora' : 'Nueva Impresora'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={printerForm.name}
                        onChange={(e) => setPrinterForm({ ...printerForm, name: e.target.value })}
                        className="modern-input"
                        placeholder="Ej: Impresora Principal"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
                        <select
                          value={printerForm.type}
                          onChange={(e) => setPrinterForm({ ...printerForm, type: e.target.value as any })}
                          className="modern-input"
                        >
                          <option value="thermal">Térmica</option>
                          <option value="inkjet">Inyección</option>
                          <option value="laser">Láser</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Conexión</label>
                        <select
                          value={printerForm.connection}
                          onChange={(e) => setPrinterForm({ ...printerForm, connection: e.target.value as any })}
                          className="modern-input"
                        >
                          <option value="usb">USB</option>
                          <option value="network">Red</option>
                          <option value="bluetooth">Bluetooth</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Dirección/IP</label>
                      <input
                        type="text"
                        value={printerForm.address}
                        onChange={(e) => setPrinterForm({ ...printerForm, address: e.target.value })}
                        className="modern-input"
                        placeholder="Ej: 192.168.1.100 o USB001"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={printerForm.isDefault}
                          onChange={(e) => setPrinterForm({ ...printerForm, isDefault: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Predeterminada</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={printerForm.isActive}
                          onChange={(e) => setPrinterForm({ ...printerForm, isActive: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Activa</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setIsPrinterModalOpen(false)} className="btn btn-outline">
                      Cancelar
                    </button>
                    <button onClick={savePrinter} className="btn btn-primary">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#ED6823]" />
                <h2 className="text-lg font-semibold text-gray-800">Usuarios del Sistema</h2>
              </div>
              <button onClick={() => openUserModal()} className="btn btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Nuevo Usuario
              </button>
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ED6823] to-[#D55A1A] flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                        {!user.isActive && (
                          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">Inactivo</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openUserModal(user)}
                      className="p-2 hover:bg-white rounded-lg text-[#ED6823]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 hover:bg-white rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* User Modal */}
            {isUserModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        className="modern-input"
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        className="modern-input"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                        className="modern-input"
                        placeholder="(000) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Rol</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                        className="modern-input"
                      >
                        <option value="admin">Administrador</option>
                        <option value="cashier">Cajero</option>
                        <option value="seller">Vendedor</option>
                        <option value="manager">Gerente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">PIN de Acceso *</label>
                      <div className="relative">
                        <input
                          type={showPin ? 'text' : 'password'}
                          value={userForm.pin}
                          onChange={(e) => setUserForm({ ...userForm, pin: e.target.value })}
                          className="modern-input pr-10"
                          placeholder="4 dígitos"
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">El PIN se usa para iniciar sesión en el sistema</p>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={userForm.isActive}
                        onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Usuario activo</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setIsUserModalOpen(false)} className="btn btn-outline">
                      Cancelar
                    </button>
                    <button onClick={saveUser} className="btn btn-primary">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Import/Export Data */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-[#ED6823]" />
              <h2 className="text-lg font-semibold text-gray-800">Importar / Exportar Datos</h2>
            </div>

            {/* Export Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar Datos
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Descarga tus datos en formato CSV para respaldos o análisis externos.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <ExportButton label="Productos" dataType="products" />
                <ExportButton label="Clientes" dataType="clients" />
                <ExportButton label="Proveedores" dataType="suppliers" />
                <ExportButton label="Ventas" dataType="sales" />
                <ExportButton label="Compras" dataType="purchases" />
                <ExportButton label="Empleados" dataType="employees" />
              </div>
            </div>

            {/* Import Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importar Datos
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Importa datos desde archivos CSV. Asegúrate de que el formato coincida con la plantilla.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <ImportButton label="Productos" dataType="products" />
                <ImportButton label="Clientes" dataType="clients" />
                <ImportButton label="Proveedores" dataType="suppliers" />
              </div>
            </div>

            {/* Templates */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium mb-3 text-blue-800">Plantillas CSV</h3>
              <p className="text-sm text-blue-600 mb-4">
                Descarga las plantillas con el formato correcto para importar datos.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => downloadTemplate('products')}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                >
                  Plantilla Productos
                </button>
                <button
                  onClick={() => downloadTemplate('clients')}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                >
                  Plantilla Clientes
                </button>
                <button
                  onClick={() => downloadTemplate('suppliers')}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                >
                  Plantilla Proveedores
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Language Settings */}
        {activeTab === 'language' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#ED6823]" />
              <h2 className="text-lg font-semibold text-gray-800">Idioma del Sistema</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLanguage('es')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  language === 'es'
                    ? 'border-[#ED6823] bg-[#ED6823]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                    MX
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Español</p>
                    <p className="text-sm text-gray-500">Spanish</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  language === 'en'
                    ? 'border-[#ED6823] bg-[#ED6823]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    US
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">English</p>
                    <p className="text-sm text-gray-500">Inglés</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-[#ED6823]" />
              <h2 className="text-lg font-semibold text-gray-800">Notificaciones</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'lowStock', label: 'Stock Bajo', description: 'Notificar cuando el stock esté bajo' },
                { key: 'overduePayments', label: 'Pagos Vencidos', description: 'Notificar pagos de crédito vencidos' },
                { key: 'newOrders', label: 'Nuevas Órdenes', description: 'Notificar nuevas órdenes' },
                { key: 'dailyReports', label: 'Reportes Diarios', description: 'Enviar reporte diario de ventas' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({ ...notificationSettings, [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings] })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-[#ED6823]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notificationSettings[item.key as keyof typeof notificationSettings] ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
