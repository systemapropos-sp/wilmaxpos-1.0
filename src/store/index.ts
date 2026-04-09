import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, Client, Product, Kit, Supplier, Employee, 
  Sale, PausedSale, Purchase, Expense, GiftCard, Voucher, Store, 
  CashRegister, ActivityLog, CartItem, DashboardStats, InventoryMovement, Document 
} from '@/types';

// Datos de ejemplo para el sistema
const demoUsers: User[] = [
  { id: 1, name: 'Administrador', email: 'admin@sistema.com', pin: '1234', role: 'admin', isActive: true },
  { id: 2, name: 'Carolina Moreno', email: 'carolina@tienda.com', pin: '5678', role: 'cashier', isActive: true },
  { id: 3, name: 'Jose Yepez', email: 'jose@tienda.com', pin: '9012', role: 'manager', isActive: true },
];

const demoClients: Client[] = [
  { id: 1, name: 'JOSE YEPEZ', phone: '+123456789', address1: 'SANTIAGO DE LOS CABALLEROS', creditBalance: 2000, isActive: true, createdAt: '2024-01-15' },
  { id: 2, name: 'Francisco Polonia', creditBalance: 0, isActive: true, createdAt: '2024-02-20' },
  { id: 3, name: 'CHACHO', company: 'SDH', phone: '+829-970-7313', creditBalance: 0, isActive: true, createdAt: '2024-03-10' },
  { id: 4, name: 'ANA LOPEZ', creditBalance: 0, isActive: true, createdAt: '2024-01-25' },
  { id: 5, name: 'TEXACO LUPERON', company: 'TEXACO LUPERON', phone: '+123213231', creditBalance: 0, isActive: true, createdAt: '2024-02-05' },
  { id: 6, name: 'EUGENIO BATISTA', email: 'NEUMATICOSBATISTA@SALES.COM', phone: '+18097549822', creditBalance: 0, isActive: true, createdAt: '2024-03-15' },
  { id: 7, name: 'CLIENTE GENÉRICO D', creditBalance: 0, isActive: true, createdAt: '2024-01-01' },
  { id: 8, name: 'CLIENTE GENERICO M', creditBalance: 136032, isActive: true, createdAt: '2024-02-28' },
  { id: 9, name: 'ANA MENDOZA', creditBalance: 0, isActive: true, createdAt: '2024-03-20' },
  { id: 10, name: 'PEDRO PALACIOS', creditBalance: 0, isActive: true, createdAt: '2024-01-30' },
];

const demoProducts: Product[] = [
  { id: 1, name: 'pantalla samsung a20', category: 'pieza', cost: 450, salePrice: 500, currentStock: 7, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
  { id: 2, name: 'pantalla samsung a50', category: 'pieza', cost: 500, salePrice: 600, currentStock: 5, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
  { id: 3, name: 'pantalla iphone xs max incell', category: 'pieza', cost: 500, salePrice: 600, currentStock: 1, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
  { id: 4, name: 'pantalla iphone 12 pro max jk', category: 'pieza', cost: 850, salePrice: 1080, currentStock: 5, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
  { id: 5, barcode: '7594003950446', name: 'TEVIA 360ML', category: 'TE FRIO', cost: 100, salePrice: 120, currentStock: 30, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
  { id: 6, barcode: '34567654', name: 'LA 42 100ML BOTELLA', category: 'NOTA 75', size: '100 ML', cost: 100, salePrice: 200, currentStock: 14.95, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
  { id: 7, name: 'SAMSUNG A55 128GB', category: 'TELEFONO', cost: 10000, salePrice: 15000, currentStock: 3, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: true, isActive: true },
  { id: 8, name: 'ANILLO PLATA 9/25', category: 'ANILLOS 9/25', cost: 25000, salePrice: 30000, currentStock: 0, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
  { id: 9, name: 'PRESIDENTE LATA 355ML', category: 'CERVEZA', cost: 10, salePrice: 20, currentStock: 112, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
  { id: 10, name: 'AGUA NEVADA 500ML', category: 'NEVADA', cost: 100, salePrice: 200, currentStock: 15, unitOfMeasure: 'UNIDAD', isSellable: true, isProduct: true, isRawMaterial: false, pricesIncludeTax: false, isService: false, allowAlternateDescription: false, hasSerialNumber: false, isActive: true },
];

const demoKits: Kit[] = [
  { id: 1, kitId: 'KIT 1', name: 'Costilla De Pescado Tambaqui LIBRA', cost: 100, salePrice: 200, products: [], isActive: true },
  { id: 2, kitId: 'KIT 2', name: '2X1', cost: 990, salePrice: 110, products: [], isActive: true },
  { id: 3, kitId: 'KIT 3', name: 'Saco de yukitas 180gr', cost: 5940, salePrice: 7200, products: [], isActive: true },
  { id: 4, kitId: 'KIT 4', name: 'LA 42 POR DETALLE', cost: 1, salePrice: 2, products: [], isActive: true },
  { id: 5, kitId: 'KIT 5', name: 'YUKITAS UNIDAD 180GR', cost: 10, salePrice: 20, products: [], isActive: true },
  { id: 6, kitId: 'KIT 6', name: 'SIX PACK PRESIDENTE LATA', cost: 60, salePrice: 120, products: [], isActive: true },
  { id: 7, kitId: 'KIT 7', name: 'enerlife, agua, pan,termo', cost: 1, salePrice: 2945, products: [], isActive: true },
  { id: 8, kitId: 'KIT 8', name: 'ELLA E+ 5 DURO MAN POP', cost: 1, salePrice: 2500, products: [], isActive: true },
  { id: 9, kitId: 'KIT 9', name: 'COMBO SUBLIMACION 1', cost: 300, salePrice: 400, products: [], isActive: true },
];

const demoSuppliers: Supplier[] = [
  { 
    id: 1, 
    company: 'TUREY', 
    firstName: 'PECADERIA', 
    balance: 2000, 
    isActive: true,
    phone: '+809-555-0101',
    email: 'contacto@turey.com',
    address: 'Av. Principal #123, Santiago',
    city: 'Santiago',
    taxId: 'RNC-123456789',
    totalPurchases: 45000,
    lastPurchaseDate: '2026-03-15'
  },
  { 
    id: 2, 
    company: 'TEXACO', 
    firstName: 'PEÑA', 
    lastName: 'TEXAQITO', 
    email: 'TEXACO@SALES.COM', 
    phone: '+809-632-3201', 
    balance: 0, 
    isActive: true,
    address: 'Calle 27 de Febrero #456',
    city: 'Santo Domingo',
    taxId: 'RNC-987654321',
    totalPurchases: 120000,
    lastPurchaseDate: '2026-03-28'
  },
  { 
    id: 3, 
    company: 'MICHELIN SRL', 
    firstName: 'MICHELIN', 
    lastName: 'NEUMATICOS', 
    balance: 0, 
    isActive: true,
    phone: '+809-555-0202',
    email: 'ventas@michelin.do',
    address: 'Zona Industrial, La Romana',
    city: 'La Romana',
    taxId: 'RNC-456789123',
    totalPurchases: 85000,
    lastPurchaseDate: '2026-03-20'
  },
  { 
    id: 4, 
    company: 'DEPARTAMENTO 1', 
    firstName: 'YEPEZ', 
    lastName: 'JOSE', 
    balance: 0, 
    isActive: true,
    phone: '+809-555-0303',
    email: 'yepez@depto1.com',
    address: 'Av. Independencia #789',
    city: 'Santiago',
    taxId: 'RNC-789123456',
    totalPurchases: 25000,
    lastPurchaseDate: '2026-02-28'
  },
];

const demoEmployees: Employee[] = [
  { 
    id: 1, 
    name: 'SOPORTE TÉCNICO', 
    email: 'soporte@wilmaxsoft.com', 
    phone: '+1(829)741-3096', 
    isActive: true,
    position: 'Soporte Técnico',
    department: 'TI',
    salaryBiweekly: 15000,
    salaryMonthly: 30000,
    hireDate: '2023-01-15',
    loans: [],
    payments: [],
    totalLoans: 0,
    totalPayments: 180000
  },
  { 
    id: 2, 
    name: 'Carolina Moreno', 
    email: 'virginashoesrd@gmail.com', 
    phone: '+8297179746', 
    isActive: true,
    position: 'Cajera',
    department: 'Ventas',
    salaryBiweekly: 12000,
    salaryMonthly: 24000,
    hireDate: '2024-02-01',
    loans: [
      { id: 1, amount: 5000, date: '2026-02-15', description: 'Préstamo personal', status: 'partial', remainingAmount: 2000 }
    ],
    payments: [
      { id: 1, date: '2026-03-01', amount: 24000, type: 'salary', description: 'Salario marzo' }
    ],
    totalLoans: 2000,
    totalPayments: 72000
  },
  { 
    id: 3, 
    name: 'Empleado 1 Chirinos', 
    email: 'chirinos@gmail.com', 
    isActive: true,
    position: 'Vendedor',
    department: 'Ventas',
    salaryBiweekly: 11000,
    salaryMonthly: 22000,
    hireDate: '2024-03-10',
    loans: [],
    payments: [],
    totalLoans: 0,
    totalPayments: 44000
  },
  { 
    id: 4, 
    name: 'Prueba 1', 
    email: 'soporte@wilmaxsoft.com', 
    isActive: true,
    position: 'Auxiliar',
    department: 'Operaciones',
    salaryBiweekly: 10000,
    salaryMonthly: 20000,
    hireDate: '2024-06-01',
    loans: [
      { id: 1, amount: 3000, date: '2026-03-01', description: 'Emergencia médica', status: 'pending', remainingAmount: 3000 }
    ],
    payments: [],
    totalLoans: 3000,
    totalPayments: 20000
  },
  { 
    id: 5, 
    name: 'Jose Yepez', 
    email: 'joseyep@gmail.com', 
    isActive: true,
    position: 'Gerente',
    department: 'Administración',
    salaryBiweekly: 25000,
    salaryMonthly: 50000,
    hireDate: '2023-06-15',
    loans: [],
    payments: [
      { id: 1, date: '2026-03-01', amount: 50000, type: 'salary', description: 'Salario marzo' },
      { id: 2, date: '2026-02-01', amount: 5000, type: 'bonus', description: 'Bono por desempeño' }
    ],
    totalLoans: 0,
    totalPayments: 305000
  },
];

const demoStores: Store[] = [
  { id: 1, name: 'WILMAX POS 1', address: 'JOSE MARTIN CON 27 DE FEBRERO', phone: '8297179746', isActive: true },
  { id: 2, name: 'WILMAX POS 2', address: 'Urb Colinas De Santa Rosa Sur', phone: '1234', isActive: true },
];

const demoRegisters: CashRegister[] = [
  { id: 1, name: 'CAJA 1', storeId: 1, isOpen: false, currentAmount: 0 },
  { id: 2, name: 'CAJA 2', storeId: 1, isOpen: false, currentAmount: 0 },
];

const demoGiftCards: GiftCard[] = [
  { id: 1, cardNumber: '123', value: 2000, balance: 2000, description: '2000.00', isActive: true, issueDate: '2024-01-15' },
  { id: 2, cardNumber: '150', value: 3000, balance: 3000, isActive: true, issueDate: '2024-02-20' },
];

const demoVouchers: Voucher[] = [
  { id: 1, description: 'FACTURA DE CRÉDITO FISCAL', series: 'B', type: '01', from: '00000001', to: '00000020', current: 'B0100000004', isActive: true },
  { id: 2, description: 'FACTURA DE CONSUMO', series: 'B', type: '02', from: '00000001', to: '00000020', current: 'B0200000006', isActive: true },
];

const demoExpenses: Expense[] = [
  { id: 1, category: 'TELEFONO', description: 'reparacion aire', amount: 5000, tax: 0, date: '2026-03-09', recipient: 'Moreno, Carolina', approvedBy: 'Yepez, Jose' },
];

const demoActivityLogs: ActivityLog[] = [
  { id: 1, date: '2026-03-31 10:58:01', user: 'prueba1', controller: 'Ventas', action: 'Agregar', details: 'Se registro una venta', platform: 'Windows 10' },
  { id: 2, date: '2026-03-30 17:06:33', user: 'prueba1', controller: 'Inventario', action: 'Agregar', details: 'Se registro un articulo', platform: 'Windows 10' },
  { id: 3, date: '2026-03-27 15:47:42', user: 'prueba1', controller: 'Ventas', action: 'Actualizar', details: 'La información de la venta fue actualizada', platform: 'Windows 10' },
];

const demoPurchases: Purchase[] = [
  {
    id: 1,
    purchaseId: 'OC-000001',
    date: '2026-03-15',
    expectedDate: '2026-03-20',
    supplierId: 1,
    supplierName: 'TUREY',
    items: [
      { productId: 1, productName: 'pantalla samsung a20', quantity: 5, unitCost: 450, discount: 0, total: 2250 },
      { productId: 2, productName: 'pantalla samsung a50', quantity: 3, unitCost: 500, discount: 0, total: 1500 },
    ],
    subtotal: 3750,
    tax: 675,
    discount: 0,
    total: 4425,
    status: 'received',
    notes: 'Entrega puntual',
  },
  {
    id: 2,
    purchaseId: 'OC-000002',
    date: '2026-03-25',
    expectedDate: '2026-04-05',
    supplierId: 2,
    supplierName: 'TEXACO',
    items: [
      { productId: 5, productName: 'TEVIA 360ML', quantity: 50, unitCost: 100, discount: 500, total: 4500 },
      { productId: 9, productName: 'PRESIDENTE LATA 355ML', quantity: 100, unitCost: 10, discount: 0, total: 1000 },
    ],
    subtotal: 5500,
    tax: 990,
    discount: 500,
    total: 5990,
    status: 'pending',
    notes: 'Pago contra entrega',
  },
  {
    id: 3,
    purchaseId: 'OC-000003',
    date: '2026-03-28',
    expectedDate: '2026-04-10',
    supplierId: 3,
    supplierName: 'MICHELIN SRL',
    items: [
      { productId: 7, productName: 'SAMSUNG A55 128GB', quantity: 2, unitCost: 10000, discount: 1000, total: 19000 },
    ],
    subtotal: 19000,
    tax: 3420,
    discount: 1000,
    total: 21420,
    status: 'pending',
    notes: 'Crédito 30 días',
  },
  {
    id: 4,
    purchaseId: 'OC-000004',
    date: '2026-02-10',
    expectedDate: '2026-02-15',
    supplierId: 4,
    supplierName: 'DEPARTAMENTO 1',
    items: [
      { productId: 6, productName: 'LA 42 100ML BOTELLA', quantity: 20, unitCost: 100, discount: 0, total: 2000 },
    ],
    subtotal: 2000,
    tax: 360,
    discount: 0,
    total: 2360,
    status: 'cancelled',
    notes: 'Cancelado por el proveedor',
  },
];

// Store interface
interface StoreState {
  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (pin: string) => User | null;
  logout: () => void;
  
  // Data
  users: User[];
  clients: Client[];
  products: Product[];
  kits: Kit[];
  suppliers: Supplier[];
  employees: Employee[];
  sales: Sale[];
  purchases: Purchase[];
  expenses: Expense[];
  giftCards: GiftCard[];
  vouchers: Voucher[];
  stores: Store[];
  registers: CashRegister[];
  activityLogs: ActivityLog[];
  inventoryMovements: InventoryMovement[];
  
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => boolean;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Paused Sales
  pausedSales: PausedSale[];
  pauseSale: (sale: Omit<PausedSale, 'id' | 'saleId'>) => void;
  resumeSale: (saleId: string) => PausedSale | null;
  deletePausedSale: (saleId: string) => void;
  getPausedSales: () => PausedSale[];
  
  // CRUD Operations
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  deleteClient: (id: number) => void;
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  toggleFavorite: (id: number) => void;
  
  addSale: (sale: Omit<Sale, 'id'>) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: number, expense: Partial<Expense>) => void;
  deleteExpense: (id: number) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: number, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: number) => void;
  
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  
  addKit: (kit: Omit<Kit, 'id'>) => void;
  updateKit: (id: number, kit: Partial<Kit>) => void;
  deleteKit: (id: number) => void;
  
  addVoucher: (voucher: Omit<Voucher, 'id'>) => void;
  updateVoucher: (id: number, voucher: Partial<Voucher>) => void;
  deleteVoucher: (id: number) => void;
  
  // Inventory Movements
  addInventoryMovement: (movement: Omit<InventoryMovement, 'id'>) => void;
  getProductMovements: (productId: number) => InventoryMovement[];
  adjustStock: (productId: number, newStock: number, reason: string, user: string, adminPin?: string) => boolean;
  
  // Documents
  documents: Document[];
  addDocument: (document: Omit<Document, 'id'>) => void;
  deleteDocument: (id: number) => void;
  getEntityDocuments: (entityType: Document['entityType'], entityId: number) => Document[];
  
  // Stats
  getDashboardStats: () => DashboardStats;
  
  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      currentUser: null,
      
      login: (pin: string) => {
        const user = demoUsers.find(u => u.pin === pin && u.isActive);
        if (user) {
          set({ isAuthenticated: true, currentUser: user });
          return user;
        }
        return null;
      },
      
      logout: () => {
        set({ isAuthenticated: false, currentUser: null, cart: [] });
      },
      
      // Data
      users: demoUsers,
      clients: demoClients,
      products: demoProducts,
      kits: demoKits,
      suppliers: demoSuppliers,
      employees: demoEmployees,
      sales: [],
      purchases: demoPurchases,
      expenses: demoExpenses,
      giftCards: demoGiftCards,
      vouchers: demoVouchers,
      stores: demoStores,
      registers: demoRegisters,
      activityLogs: demoActivityLogs,
      inventoryMovements: [],
      
      // Cart
      cart: [],
      
      // Paused Sales
      pausedSales: [],
      
      addToCart: (item) => {
        const state = get();
        const product = state.products.find(p => p.id === item.productId);
        
        if (!product) return false;
        
        const existingItem = state.cart.find(i => i.productId === item.productId);
        const currentCartQty = existingItem ? existingItem.quantity : 0;
        const totalQty = currentCartQty + item.quantity;
        
        // Verificar si hay suficiente stock
        if (totalQty > product.currentStock) {
          return false;
        }
        
        // Descontar del stock
        set((state) => ({
          products: state.products.map(p => 
            p.id === item.productId 
              ? { ...p, currentStock: p.currentStock - item.quantity }
              : p
          )
        }));
        
        set((state) => {
          if (existingItem) {
            return {
              cart: state.cart.map(i => 
                i.productId === item.productId 
                  ? { ...i, quantity: i.quantity + item.quantity, total: (i.quantity + item.quantity) * i.unitPrice }
                  : i
              )
            };
          }
          return { cart: [...state.cart, item] };
        });
        
        return true;
      },
      
      removeFromCart: (productId) => {
        const state = get();
        const item = state.cart.find(i => i.productId === productId);
        
        if (item) {
          // Devolver el stock
          set((state) => ({
            products: state.products.map(p => 
              p.id === productId 
                ? { ...p, currentStock: p.currentStock + item.quantity }
                : p
            )
          }));
        }
        
        set((state) => ({
          cart: state.cart.filter(i => i.productId !== productId)
        }));
      },
      
      updateCartQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map(i => 
            i.productId === productId 
              ? { ...i, quantity, total: quantity * i.unitPrice }
              : i
          )
        }));
      },
      
      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.total, 0);
      },
      
      // Paused Sales
      pauseSale: (sale) => {
        set((state) => ({
          pausedSales: [...state.pausedSales, { 
            ...sale, 
            id: Date.now(), 
            saleId: `PAUSED-${Date.now().toString().slice(-6)}` 
          }]
        }));
      },
      
      resumeSale: (saleId) => {
        const state = get();
        const pausedSale = state.pausedSales.find(s => s.saleId === saleId);
        if (pausedSale) {
          set({ cart: pausedSale.items });
          set((state) => ({
            pausedSales: state.pausedSales.filter(s => s.saleId !== saleId)
          }));
          return pausedSale;
        }
        return null;
      },
      
      deletePausedSale: (saleId) => {
        const state = get();
        const pausedSale = state.pausedSales.find(s => s.saleId === saleId);
        
        if (pausedSale) {
          pausedSale.items.forEach(item => {
            set((state) => ({
              products: state.products.map(p => 
                p.id === item.productId 
                  ? { ...p, currentStock: p.currentStock + item.quantity }
                  : p
              )
            }));
          });
        }
        
        set((state) => ({
          pausedSales: state.pausedSales.filter(s => s.saleId !== saleId)
        }));
      },
      
      getPausedSales: () => {
        return get().pausedSales;
      },
      
      // CRUD Operations
      addClient: (client) => {
        set((state) => ({
          clients: [...state.clients, { ...client, id: Date.now(), createdAt: new Date().toISOString() }]
        }));
      },
      
      updateClient: (id, client) => {
        set((state) => ({
          clients: state.clients.map(c => c.id === id ? { ...c, ...client } : c)
        }));
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter(c => c.id !== id)
        }));
      },
      
      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now() }]
        }));
      },
      
      updateProduct: (id, product) => {
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
        }));
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        }));
      },
      
      toggleFavorite: (id) => {
        set((state) => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
          )
        }));
      },
      
      addSale: (sale) => {
        set((state) => ({
          sales: [...state.sales, { ...sale, id: Date.now() }]
        }));
      },
      
      addExpense: (expense) => {
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: Date.now() }]
        }));
      },
      
      updateExpense: (id, expense) => {
        set((state) => ({
          expenses: state.expenses.map(e => e.id === id ? { ...e, ...expense } : e)
        }));
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter(e => e.id !== id)
        }));
      },
      
      addSupplier: (supplier) => {
        set((state) => ({
          suppliers: [...state.suppliers, { ...supplier, id: Date.now() }]
        }));
      },
      
      updateSupplier: (id, supplier) => {
        set((state) => ({
          suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...supplier } : s)
        }));
      },
      
      deleteSupplier: (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter(s => s.id !== id)
        }));
      },
      
      addEmployee: (employee) => {
        set((state) => ({
          employees: [...state.employees, { ...employee, id: Date.now() }]
        }));
      },
      
      updateEmployee: (id, employee) => {
        set((state) => ({
          employees: state.employees.map(e => e.id === id ? { ...e, ...employee } : e)
        }));
      },
      
      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter(e => e.id !== id)
        }));
      },
      
      addKit: (kit) => {
        set((state) => ({
          kits: [...state.kits, { ...kit, id: Date.now() }]
        }));
      },
      
      updateKit: (id, kit) => {
        set((state) => ({
          kits: state.kits.map(k => k.id === id ? { ...k, ...kit } : k)
        }));
      },
      
      deleteKit: (id) => {
        set((state) => ({
          kits: state.kits.filter(k => k.id !== id)
        }));
      },
      
      addVoucher: (voucher) => {
        set((state) => ({
          vouchers: [...state.vouchers, { ...voucher, id: Date.now() }]
        }));
      },
      
      updateVoucher: (id, voucher) => {
        set((state) => ({
          vouchers: state.vouchers.map(v => v.id === id ? { ...v, ...voucher } : v)
        }));
      },
      
      deleteVoucher: (id) => {
        set((state) => ({
          vouchers: state.vouchers.filter(v => v.id !== id)
        }));
      },
      
      // Inventory Movements
      addInventoryMovement: (movement) => {
        set((state) => ({
          inventoryMovements: [...state.inventoryMovements, { ...movement, id: Date.now() }]
        }));
      },
      
      getProductMovements: (productId) => {
        return get().inventoryMovements.filter(m => m.productId === productId);
      },
      
      adjustStock: (productId, newStock, reason, user, adminPin) => {
        const state = get();
        const product = state.products.find(p => p.id === productId);
        
        if (!product) return false;
        
        // Verificar si requiere autorización (ajustes significativos)
        const requiresAuth = Math.abs(newStock - product.currentStock) > 10;
        
        if (requiresAuth) {
          // Verificar PIN de admin
          const admin = state.users.find(u => u.pin === adminPin && u.role === 'admin');
          if (!admin) return false;
        }
        
        const previousStock = product.currentStock;
        const movementType = newStock > previousStock ? 'entry' : newStock < previousStock ? 'exit' : 'adjustment';
        
        // Actualizar stock del producto
        set((state) => ({
          products: state.products.map(p => 
            p.id === productId ? { ...p, currentStock: newStock } : p
          )
        }));
        
        // Registrar movimiento
        get().addInventoryMovement({
          productId,
          productName: product.name,
          type: movementType,
          quantity: Math.abs(newStock - previousStock),
          previousStock,
          newStock,
          reason,
          user,
          date: new Date().toISOString(),
          requiresAuth,
          authorizedBy: requiresAuth ? state.users.find(u => u.pin === adminPin)?.name : undefined,
        });
        
        return true;
      },
      
      // Documents
      documents: [],
      
      addDocument: (document) => {
        set((state) => ({
          documents: [...state.documents, { ...document, id: Date.now() }]
        }));
      },
      
      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter(d => d.id !== id)
        }));
      },
      
      getEntityDocuments: (entityType, entityId) => {
        return get().documents.filter(d => d.entityType === entityType && d.entityId === entityId);
      },
      
      // Stats
      getDashboardStats: () => {
        const state = get();
        return {
          totalSales: state.sales.length,
          totalInventory: state.products.length,
          totalClients: state.clients.length,
          totalKits: state.kits.length,
          todaySales: 0,
          todayRevenue: 0,
          weekSales: 0,
          monthSales: 0,
        };
      },
      
      // UI State
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      currentPage: 'dashboard',
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'pos-system-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        currentUser: state.currentUser,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
