import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type {
  User, Client, Product, Kit, Supplier, Employee,
  Sale, PausedSale, Purchase, Expense, GiftCard, Voucher, Store,
  CashRegister, ActivityLog, CartItem, DashboardStats, InventoryMovement, Document
} from '@/types';
import {
  fetchAllData,
  dbAddClient, dbUpdateClient, dbDeleteClient,
  dbAddProduct, dbUpdateProduct, dbDeleteProduct,
  dbAddSale,
  dbAddPurchase, dbUpdatePurchase, dbDeletePurchase,
  dbAddExpense, dbUpdateExpense, dbDeleteExpense,
  dbAddSupplier, dbUpdateSupplier, dbDeleteSupplier,
  dbAddEmployee, dbUpdateEmployee, dbDeleteEmployee,
  dbAddKit, dbUpdateKit, dbDeleteKit,
  dbAddVoucher, dbUpdateVoucher, dbDeleteVoucher,
  dbAddGiftCard, dbUpdateGiftCard,
  dbAddLog, dbAddMovement,
  dbAddDocument, dbDeleteDocument,
} from '@/lib/db';

/* ─────────────────────────────────────────────────────────
   DEMO USERS  (login is PIN-based, users come from Supabase)
   ─────────────────────────────────────────────────────────  */
const demoUsers: User[] = [
  { id: 1, name: 'Administrador', email: 'admin@sistema.com', pin: '1234', role: 'admin', isActive: true },
  { id: 2, name: 'Carolina Moreno', email: 'carolina@tienda.com', pin: '5678', role: 'cashier', isActive: true },
  { id: 3, name: 'Jose Yepez', email: 'jose@tienda.com', pin: '9012', role: 'manager', isActive: true },
];

/* ─────────────────────────────────────────────────────────
   STORE INTERFACE
   ───────────────────────────────────────────────────────── */
interface StoreState {
  // Init
  initialized: boolean;
  loading: boolean;
  initializeApp: () => Promise<void>;

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
  documents: Document[];

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

  // CRUD
  addClient:    (c: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: number, c: Partial<Client>)       => Promise<void>;
  deleteClient: (id: number)                           => Promise<void>;

  addProduct:    (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  toggleFavorite:(id: number) => Promise<void>;

  addSale: (s: Omit<Sale, 'id'>) => Promise<void>;

  addPurchase:    (p: Omit<Purchase, 'id'>) => Promise<void>;
  updatePurchase: (id: number, p: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: number) => Promise<void>;

  addExpense:    (e: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: number, e: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;

  addSupplier:    (s: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: number, s: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: number) => Promise<void>;

  addEmployee:    (e: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: number, e: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;

  addKit:    (k: Omit<Kit, 'id'>) => Promise<void>;
  updateKit: (id: number, k: Partial<Kit>) => Promise<void>;
  deleteKit: (id: number) => Promise<void>;

  addVoucher:    (v: Omit<Voucher, 'id'>) => Promise<void>;
  updateVoucher: (id: number, v: Partial<Voucher>) => Promise<void>;
  deleteVoucher: (id: number) => Promise<void>;

  addGiftCard:    (g: Omit<GiftCard, 'id'>) => Promise<void>;
  updateGiftCard: (id: number, g: Partial<GiftCard>) => Promise<void>;

  addInventoryMovement: (mv: Omit<InventoryMovement, 'id'>) => void;
  getProductMovements:  (productId: number) => InventoryMovement[];
  adjustStock: (productId: number, newStock: number, reason: string, user: string, adminPin?: string) => Promise<boolean>;

  addDocument:    (d: Omit<Document, 'id'>) => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;
  getEntityDocuments: (entityType: Document['entityType'], entityId: number) => Document[];

  getDashboardStats: () => DashboardStats;

  // UI
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

/* ─────────────────────────────────────────────────────────
   STORE
   ───────────────────────────────────────────────────────── */
export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── Init ──────────────────
      initialized: false,
      loading: false,

      initializeApp: async () => {
        if (get().initialized) return;
        set({ loading: true });
        try {
          const data = await fetchAllData();
          // If Supabase users exist, use them; otherwise fall back to demo users
          const users = data.users.length > 0 ? data.users : demoUsers;
          set({ ...data, users, initialized: true });
        } catch (err) {
          console.error('initializeApp error:', err);
          toast.error('Error cargando datos. Usando modo sin conexión.');
          set({ initialized: true });
        } finally {
          set({ loading: false });
        }
      },

      // ── Auth ──────────────────
      isAuthenticated: false,
      currentUser: null,

      login: (pin) => {
        const users = get().users.length > 0 ? get().users : demoUsers;
        const user = users.find(u => u.pin === pin && u.isActive);
        if (user) {
          set({ isAuthenticated: true, currentUser: user });
          return user;
        }
        return null;
      },
      logout: () => set({ isAuthenticated: false, currentUser: null, cart: [] }),

      // ── Data (start empty — loaded from Supabase) ──
      users: demoUsers,
      clients: [],
      products: [],
      kits: [],
      suppliers: [],
      employees: [],
      sales: [],
      purchases: [],
      expenses: [],
      giftCards: [],
      vouchers: [],
      stores: [],
      registers: [],
      activityLogs: [],
      inventoryMovements: [],
      documents: [],

      // ── Cart ──────────────────
      cart: [],
      pausedSales: [],

      addToCart: (item) => {
        const state = get();
        const product = state.products.find(p => p.id === item.productId);
        if (!product) return false;
        const existingItem = state.cart.find(i => i.productId === item.productId);
        const currentQty = existingItem ? existingItem.quantity : 0;
        if (currentQty + item.quantity > product.currentStock) return false;

        set((s) => ({
          products: s.products.map(p =>
            p.id === item.productId ? { ...p, currentStock: p.currentStock - item.quantity } : p
          ),
        }));
        set((s) => {
          if (existingItem) {
            return { cart: s.cart.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity, total: (i.quantity + item.quantity) * i.unitPrice } : i) };
          }
          return { cart: [...s.cart, item] };
        });
        return true;
      },

      removeFromCart: (productId) => {
        const item = get().cart.find(i => i.productId === productId);
        if (item) {
          set((s) => ({ products: s.products.map(p => p.id === productId ? { ...p, currentStock: p.currentStock + item.quantity } : p) }));
        }
        set((s) => ({ cart: s.cart.filter(i => i.productId !== productId) }));
      },

      updateCartQuantity: (productId, quantity) => {
        set((s) => ({ cart: s.cart.map(i => i.productId === productId ? { ...i, quantity, total: quantity * i.unitPrice } : i) }));
      },

      clearCart: () => set({ cart: [] }),
      getCartTotal: () => get().cart.reduce((total, i) => total + i.total, 0),

      // ── Paused Sales ──────────
      pauseSale: (sale) => {
        set((s) => ({ pausedSales: [...s.pausedSales, { ...sale, id: Date.now(), saleId: `PAUSED-${Date.now().toString().slice(-6)}` }] }));
      },
      resumeSale: (saleId) => {
        const ps = get().pausedSales.find(s => s.saleId === saleId);
        if (ps) {
          set({ cart: ps.items });
          set((s) => ({ pausedSales: s.pausedSales.filter(p => p.saleId !== saleId) }));
          return ps;
        }
        return null;
      },
      deletePausedSale: (saleId) => {
        const ps = get().pausedSales.find(s => s.saleId === saleId);
        if (ps) {
          ps.items.forEach(item => {
            set((s) => ({ products: s.products.map(p => p.id === item.productId ? { ...p, currentStock: p.currentStock + item.quantity } : p) }));
          });
        }
        set((s) => ({ pausedSales: s.pausedSales.filter(p => p.saleId !== saleId) }));
      },
      getPausedSales: () => get().pausedSales,

      // ── Clients ──────────────
      addClient: async (client) => {
        const saved = await dbAddClient(client);
        const state = get();
        await dbAddLog({ date: '', user: state.currentUser?.name || 'Sistema', controller: 'Clientes', action: 'Agregar', details: `Nuevo cliente: ${client.name}`, platform: navigator.platform });
        set((s) => ({
          clients: [...s.clients, saved],
          activityLogs: [{ id: Date.now(), date: new Date().toLocaleString('es-DO'), user: state.currentUser?.name || 'Sistema', controller: 'Clientes', action: 'Agregar', details: `Nuevo cliente: ${client.name}`, platform: navigator.platform }, ...s.activityLogs],
        }));
      },
      updateClient: async (id, client) => {
        await dbUpdateClient(id, client);
        set((s) => ({ clients: s.clients.map(c => c.id === id ? { ...c, ...client } : c) }));
      },
      deleteClient: async (id) => {
        await dbDeleteClient(id);
        set((s) => ({ clients: s.clients.filter(c => c.id !== id) }));
      },

      // ── Products ──────────────
      addProduct: async (product) => {
        const saved = await dbAddProduct(product);
        set((s) => ({ products: [...s.products, saved] }));
      },
      updateProduct: async (id, product) => {
        await dbUpdateProduct(id, product);
        set((s) => ({ products: s.products.map(p => p.id === id ? { ...p, ...product } : p) }));
      },
      deleteProduct: async (id) => {
        await dbDeleteProduct(id);
        set((s) => ({ products: s.products.filter(p => p.id !== id) }));
      },
      toggleFavorite: async (id) => {
        const product = get().products.find(p => p.id === id);
        if (!product) return;
        const newFav = !product.isFavorite;
        await dbUpdateProduct(id, { isFavorite: newFav });
        set((s) => ({ products: s.products.map(p => p.id === id ? { ...p, isFavorite: newFav } : p) }));
      },

      // ── Sales ──────────────────
      addSale: async (sale) => {
        const saved = await dbAddSale(sale);
        const state = get();
        await dbAddLog({ date: '', user: state.currentUser?.name || 'Sistema', controller: 'Ventas', action: 'Agregar', details: `Venta ${sale.saleId} por RD$${sale.total.toLocaleString()} — ${sale.clientName || 'General'}`, platform: navigator.platform });
        set((s) => ({
          sales: [saved, ...s.sales],
          activityLogs: [{ id: Date.now(), date: new Date().toLocaleString('es-DO'), user: state.currentUser?.name || 'Sistema', controller: 'Ventas', action: 'Agregar', details: `Venta ${sale.saleId} por RD$${sale.total.toLocaleString()} — ${sale.clientName || 'General'}`, platform: navigator.platform }, ...s.activityLogs],
        }));
      },

      // ── Purchases ──────────────
      addPurchase: async (purchase) => {
        const saved = await dbAddPurchase(purchase);
        set((s) => ({ purchases: [saved, ...s.purchases] }));
      },
      updatePurchase: async (id, purchase) => {
        await dbUpdatePurchase(id, purchase);
        set((s) => ({ purchases: s.purchases.map(p => p.id === id ? { ...p, ...purchase } : p) }));
      },
      deletePurchase: async (id) => {
        await dbDeletePurchase(id);
        set((s) => ({ purchases: s.purchases.filter(p => p.id !== id) }));
      },

      // ── Expenses ──────────────
      addExpense: async (expense) => {
        const saved = await dbAddExpense(expense);
        set((s) => ({ expenses: [saved, ...s.expenses] }));
      },
      updateExpense: async (id, expense) => {
        await dbUpdateExpense(id, expense);
        set((s) => ({ expenses: s.expenses.map(e => e.id === id ? { ...e, ...expense } : e) }));
      },
      deleteExpense: async (id) => {
        await dbDeleteExpense(id);
        set((s) => ({ expenses: s.expenses.filter(e => e.id !== id) }));
      },

      // ── Suppliers ──────────────
      addSupplier: async (supplier) => {
        const saved = await dbAddSupplier(supplier);
        set((s) => ({ suppliers: [...s.suppliers, saved] }));
      },
      updateSupplier: async (id, supplier) => {
        await dbUpdateSupplier(id, supplier);
        set((s) => ({ suppliers: s.suppliers.map(sup => sup.id === id ? { ...sup, ...supplier } : sup) }));
      },
      deleteSupplier: async (id) => {
        await dbDeleteSupplier(id);
        set((s) => ({ suppliers: s.suppliers.filter(sup => sup.id !== id) }));
      },

      // ── Employees ──────────────
      addEmployee: async (employee) => {
        const saved = await dbAddEmployee(employee);
        set((s) => ({ employees: [...s.employees, saved] }));
      },
      updateEmployee: async (id, employee) => {
        await dbUpdateEmployee(id, employee);
        set((s) => ({ employees: s.employees.map(e => e.id === id ? { ...e, ...employee } : e) }));
      },
      deleteEmployee: async (id) => {
        await dbDeleteEmployee(id);
        set((s) => ({ employees: s.employees.filter(e => e.id !== id) }));
      },

      // ── Kits ──────────────────
      addKit: async (kit) => {
        const saved = await dbAddKit(kit);
        set((s) => ({ kits: [...s.kits, saved] }));
      },
      updateKit: async (id, kit) => {
        await dbUpdateKit(id, kit);
        set((s) => ({ kits: s.kits.map(k => k.id === id ? { ...k, ...kit } : k) }));
      },
      deleteKit: async (id) => {
        await dbDeleteKit(id);
        set((s) => ({ kits: s.kits.filter(k => k.id !== id) }));
      },

      // ── Vouchers ──────────────
      addVoucher: async (voucher) => {
        const saved = await dbAddVoucher(voucher);
        set((s) => ({ vouchers: [...s.vouchers, saved] }));
      },
      updateVoucher: async (id, voucher) => {
        await dbUpdateVoucher(id, voucher);
        set((s) => ({ vouchers: s.vouchers.map(v => v.id === id ? { ...v, ...voucher } : v) }));
      },
      deleteVoucher: async (id) => {
        await dbDeleteVoucher(id);
        set((s) => ({ vouchers: s.vouchers.filter(v => v.id !== id) }));
      },

      // ── Gift Cards ──────────────
      addGiftCard: async (gc) => {
        const saved = await dbAddGiftCard(gc);
        set((s) => ({ giftCards: [...s.giftCards, saved] }));
      },
      updateGiftCard: async (id, gc) => {
        await dbUpdateGiftCard(id, gc);
        set((s) => ({ giftCards: s.giftCards.map(g => g.id === id ? { ...g, ...gc } : g) }));
      },

      // ── Inventory ──────────────
      addInventoryMovement: (movement) => {
        void dbAddMovement(movement);
        set((s) => ({ inventoryMovements: [{ ...movement, id: Date.now() }, ...s.inventoryMovements] }));
      },
      getProductMovements: (productId) => get().inventoryMovements.filter(m => m.productId === productId),

      adjustStock: async (productId, newStock, reason, user, adminPin) => {
        const state = get();
        const product = state.products.find(p => p.id === productId);
        if (!product) return false;
        const requiresAuth = Math.abs(newStock - product.currentStock) > 10;
        if (requiresAuth) {
          const admin = state.users.find(u => u.pin === adminPin && u.role === 'admin');
          if (!admin) return false;
        }
        const previousStock = product.currentStock;
        const type = newStock > previousStock ? 'entry' : newStock < previousStock ? 'exit' : 'adjustment';
        await dbUpdateProduct(productId, { currentStock: newStock });
        set((s) => ({ products: s.products.map(p => p.id === productId ? { ...p, currentStock: newStock } : p) }));
        get().addInventoryMovement({ productId, productName: product.name, type, quantity: Math.abs(newStock - previousStock), previousStock, newStock, reason, user, date: new Date().toISOString(), requiresAuth, authorizedBy: requiresAuth ? state.users.find(u => u.pin === adminPin)?.name : undefined });
        return true;
      },

      // ── Documents ──────────────
      addDocument: async (doc) => {
        const saved = await dbAddDocument(doc);
        set((s) => ({ documents: [saved, ...s.documents] }));
      },
      deleteDocument: async (id) => {
        await dbDeleteDocument(id);
        set((s) => ({ documents: s.documents.filter(d => d.id !== id) }));
      },
      getEntityDocuments: (entityType, entityId) => get().documents.filter(d => d.entityType === entityType && d.entityId === entityId),

      // ── Stats ──────────────────
      getDashboardStats: () => {
        const state = get();
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const activeSales = state.sales.filter(s => s.status !== 'cancelled');
        return {
          totalSales:    activeSales.length,
          totalInventory: state.products.length,
          totalClients:  state.clients.length,
          totalKits:     state.kits.length,
          todaySales:    activeSales.filter(s => s.date.slice(0, 10) === todayStr).length,
          todayRevenue:  activeSales.filter(s => s.date.slice(0, 10) === todayStr).reduce((sum, s) => sum + s.total, 0),
          weekSales:     activeSales.filter(s => new Date(s.date) >= weekAgo).length,
          monthSales:    activeSales.filter(s => new Date(s.date) >= monthStart).reduce((sum, s) => sum + s.total, 0),
        };
      },

      // ── UI ─────────────────────
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      currentPage: 'dashboard',
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'pos-system-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        sidebarCollapsed: state.sidebarCollapsed,
        // Don't persist data — always reload from Supabase
      }),
    }
  )
);
