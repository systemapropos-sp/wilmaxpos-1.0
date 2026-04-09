// Tipos del Sistema de Ventas

export interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  avatar?: string;
  role: 'admin' | 'cashier' | 'manager';
  storeId?: number;
  isActive: boolean;
}

export interface Client {
  id: number;
  name: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  country?: string;
  avatar?: string;
  creditLimit?: number;
  creditBalance: number;
  birthDate?: string;
  taxId?: string;
  priceType?: string;
  shippingZone?: string;
  lastVisit?: string;
  isActive: boolean;
  createdAt: string;
  totalPurchases?: number;
  lastPurchaseDate?: string;
}

export interface Product {
  id: number;
  barcode?: string;
  productId?: string;
  name: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  size?: string;
  supplier?: string;
  minStock?: number;
  expirationDays?: number;
  description?: string;
  unitOfMeasure: string;
  isSellable: boolean;
  isProduct: boolean;
  isRawMaterial: boolean;
  pricesIncludeTax: boolean;
  isService: boolean;
  allowAlternateDescription: boolean;
  hasSerialNumber: boolean;
  image?: string;
  cost: number;
  salePrice: number;
  wholesalePrice?: number;
  bulkPrice?: number;
  price3?: number;
  promoPrice?: number;
  promoStartDate?: string;
  promoEndDate?: string;
  currentStock: number;
  location?: string;
  isActive: boolean;
  isFavorite?: boolean;
}

export interface Kit {
  id: number;
  kitId: string;
  barcode?: string;
  name: string;
  description?: string;
  image?: string;
  cost: number;
  salePrice: number;
  products: KitProduct[];
  isActive: boolean;
  category?: string;
}

export interface KitProduct {
  productId: number;
  quantity: number;
  name?: string;
}

// Préstamo para empleados
export interface Loan {
  id: number;
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'paid' | 'partial';
  remainingAmount: number;
}

// Pago aplicable para empleados
export interface Payment {
  id: number;
  date: string;
  amount: number;
  type: 'salary' | 'bonus' | 'loan_payment' | 'other';
  description: string;
}

export interface Supplier {
  id: number;
  company: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  balance: number;
  avatar?: string;
  isActive: boolean;
  address?: string;
  city?: string;
  taxId?: string;
  notes?: string;
  totalPurchases?: number;
  lastPurchaseDate?: string;
  paymentTerms?: number; // días de crédito
  productsCount?: number;
}

export interface Employee {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  commission?: number;
  isActive: boolean;
  salaryBiweekly?: number;
  salaryMonthly?: number;
  hireDate?: string;
  position?: string;
  department?: string;
  loans: Loan[];
  payments: Payment[];
  totalLoans: number;
  totalPayments: number;
}

export interface Sale {
  id: number;
  saleId: string;
  date: string;
  register: string;
  employee: string;
  clientId?: number;
  clientName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'credit' | 'giftcard';
  paymentAmount: number;
  change: number;
  status: 'completed' | 'pending' | 'cancelled' | 'credit';
  notes?: string;
}

export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  image?: string;
}

// Venta pausada
export interface PausedSale {
  id: number;
  saleId: string;
  date: string;
  employee: string;
  clientId?: number;
  clientName?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface Purchase {
  id: number;
  purchaseId: string;
  date: string;
  expectedDate?: string;
  supplierId?: number;
  supplierName?: string;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'received' | 'cancelled';
  notes?: string;
  attachments?: string[];
}

export interface PurchaseItem {
  productId?: number;
  productName: string;
  quantity: number;
  unitCost: number;
  discount: number;
  total: number;
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  tax: number;
  date: string;
  recipient: string;
  approvedBy: string;
  notes?: string;
}

export interface GiftCard {
  id: number;
  cardNumber: string;
  value: number;
  balance: number;
  description?: string;
  clientName?: string;
  isActive: boolean;
  issueDate: string;
  expiryDate?: string;
}

export interface Voucher {
  id: number;
  description: string;
  series: string;
  type: string;
  from: string;
  to: string;
  current: string;
  isActive: boolean;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface CashRegister {
  id: number;
  name: string;
  storeId: number;
  isOpen: boolean;
  openingAmount?: number;
  currentAmount: number;
  openedAt?: string;
  openedBy?: string;
}

export interface ActivityLog {
  id: number;
  date: string;
  user: string;
  controller: string;
  action: string;
  details: string;
  platform: string;
}

export interface ReportType {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface DashboardStats {
  totalSales: number;
  totalInventory: number;
  totalClients: number;
  totalKits: number;
  todaySales: number;
  todayRevenue: number;
  weekSales: number;
  monthSales: number;
}

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  image?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
  currentStore: Store | null;
  currentRegister: CashRegister | null;
  sidebarCollapsed: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  read: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  productCount: number;
}

// Movimientos de inventario
export interface InventoryMovement {
  id: number;
  productId: number;
  productName: string;
  type: 'entry' | 'exit' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  user: string;
  date: string;
  requiresAuth: boolean;
  authorizedBy?: string;
}

// Documentos adjuntos
export interface Document {
  id: number;
  name: string;
  type: 'invoice' | 'receipt' | 'payment' | 'contract' | 'other';
  fileUrl: string;
  fileType: string;
  fileSize: number;
  entityType: 'client' | 'supplier' | 'purchase' | 'sale' | 'employee';
  entityId: number;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}
