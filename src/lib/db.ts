/**
 * db.ts — All Supabase CRUD operations with camelCase ↔ snake_case mapping
 * Field names match the actual TypeScript types in src/types/index.ts
 */
import { supabase } from './supabase';
import type {
  User, Client, Product, Kit, Supplier, Employee,
  Sale, Purchase, Expense, GiftCard, Voucher,
  Store, CashRegister, ActivityLog, InventoryMovement, Document,
} from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

// ─────────────────────────────────────────────────────────
// ROW MAPPERS  (DB snake_case → App camelCase)
// ─────────────────────────────────────────────────────────
const m = {
  user:  (r: Row): User  => ({ id: r.id, name: r.name, email: r.email, pin: r.pin, role: r.role, isActive: r.is_active, avatar: r.avatar }),
  client:(r: Row): Client=> ({ id: r.id, name: r.name, lastName: r.last_name, company: r.company, email: r.email, phone: r.phone, address1: r.address1, address2: r.address2, city: r.city, province: r.province, taxId: r.tax_id, avatar: r.photo_url, creditBalance: Number(r.credit_balance)||0, creditLimit: Number(r.credit_limit)||0, isActive: r.is_active, createdAt: r.created_at, lastVisit: r.last_visit }),
  product:(r: Row): Product => ({ id: r.id, barcode: r.barcode, name: r.name, description: r.description, category: r.category, size: r.size, supplier: r.supplier_name, unitOfMeasure: r.unit_of_measure||'UNIDAD', cost: Number(r.cost)||0, salePrice: Number(r.sale_price)||0, wholesalePrice: r.wholesale_price ? Number(r.wholesale_price) : undefined, currentStock: Number(r.current_stock)||0, minStock: Number(r.min_stock)||0, isSellable: r.is_sellable, isProduct: r.is_product, isRawMaterial: r.is_raw_material, isService: r.is_service, pricesIncludeTax: r.prices_include_tax, allowAlternateDescription: r.allow_alternate_description, hasSerialNumber: r.has_serial_number, isFavorite: r.is_favorite, isActive: r.is_active, image: r.image_url }),
  kit:   (r: Row, products: Row[] = []): Kit => ({ id: r.id, kitId: r.kit_id, name: r.name, description: r.description, cost: Number(r.cost)||0, salePrice: Number(r.sale_price)||0, image: r.image_url, isActive: r.is_active, category: r.category, products: products.map(p => ({ productId: p.product_id, quantity: Number(p.quantity)||1 })) }),
  supplier:(r: Row): Supplier => ({ id: r.id, company: r.company, firstName: r.first_name, lastName: r.last_name, email: r.email, phone: r.phone, address: r.address, city: r.city, taxId: r.tax_id, balance: Number(r.balance)||0, isActive: r.is_active, totalPurchases: Number(r.total_purchases)||0, lastPurchaseDate: r.last_purchase_date, notes: r.notes }),
  employee:(r: Row, loans: Row[] = [], payments: Row[] = []): Employee => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone, avatar: r.avatar,
    position: r.position, department: r.department, salaryBiweekly: Number(r.salary_biweekly)||0,
    salaryMonthly: Number(r.salary_monthly)||0, hireDate: r.hire_date,
    isActive: r.is_active, totalLoans: Number(r.total_loans)||0, totalPayments: Number(r.total_payments)||0,
    loans: loans.map(l => ({ id: l.id, amount: Number(l.amount), date: l.date, description: l.description, status: l.status, remainingAmount: Number(l.remaining_amount)||0 })),
    payments: payments.map(p => ({ id: p.id, date: p.date, amount: Number(p.amount), type: p.type, description: p.description })),
  }),
  sale:(r: Row, items: Row[] = []): Sale => ({
    id: r.id, saleId: r.sale_id, date: r.date, register: r.register_name || '', employee: r.employee || '',
    clientId: r.client_id, clientName: r.client_name, subtotal: Number(r.subtotal)||0,
    discount: Number(r.discount)||0, tax: Number(r.tax)||0, total: Number(r.total)||0,
    paymentMethod: r.payment_method, paymentAmount: Number(r.amount_paid)||0, change: Number(r.change_amount)||0,
    status: r.status, notes: r.notes,
    items: items.map(i => ({ productId: i.product_id, productName: i.product_name, quantity: Number(i.quantity), unitPrice: Number(i.unit_price), discount: Number(i.discount)||0, total: Number(i.total) })),
  }),
  purchase:(r: Row, items: Row[] = []): Purchase => ({
    id: r.id, purchaseId: r.purchase_id, date: r.date, expectedDate: r.expected_date,
    supplierId: r.supplier_id, supplierName: r.supplier_name, subtotal: Number(r.subtotal)||0,
    tax: Number(r.tax)||0, discount: Number(r.discount)||0, total: Number(r.total)||0,
    status: r.status, notes: r.notes,
    items: items.map(i => ({ productId: i.product_id, productName: i.product_name, quantity: Number(i.quantity), unitCost: Number(i.unit_cost), discount: Number(i.discount)||0, total: Number(i.total) })),
  }),
  expense:(r: Row): Expense => ({ id: r.id, date: r.date, category: r.category, description: r.description, amount: Number(r.amount)||0, tax: Number(r.tax)||0, recipient: r.recipient, approvedBy: r.approved_by, notes: r.notes }),
  giftCard:(r: Row): GiftCard => ({ id: r.id, cardNumber: r.card_number, value: Number(r.value)||0, balance: Number(r.balance)||0, description: r.description, isActive: r.is_active, issueDate: r.issue_date, expiryDate: r.expiry_date }),
  voucher:(r: Row): Voucher => ({ id: r.id, description: r.description, series: r.series, type: r.type, from: r.from, to: r.to, current: r.current, isActive: r.is_active }),
  store:(r: Row): Store => ({ id: r.id, name: r.name, address: r.address || '', phone: r.phone, email: r.email, isActive: r.is_active }),
  register:(r: Row): CashRegister => ({ id: r.id, name: r.name, storeId: r.store_id, isOpen: r.is_open, currentAmount: Number(r.current_amount)||0, openedAt: r.opened_at, openedBy: r.opened_by }),
  log:(r: Row): ActivityLog => ({ id: r.id, date: r.date, user: r.user_name, controller: r.controller, action: r.action, details: r.details, platform: r.platform }),
  movement:(r: Row): InventoryMovement => ({ id: r.id, productId: r.product_id, productName: r.product_name, type: r.type, quantity: Number(r.quantity), previousStock: Number(r.previous_stock), newStock: Number(r.new_stock), reason: r.reason, requiresAuth: r.requires_auth, authorizedBy: r.authorized_by, user: r.user_name, date: r.date }),
  document:(r: Row): Document => ({ id: r.id, name: r.name, type: r.type, fileUrl: r.file_url, fileType: r.file_type || '', fileSize: Number(r.file_size)||0, entityType: r.entity_type, entityId: r.entity_id, uploadedBy: r.uploaded_by, uploadedAt: r.uploaded_at }),
};

function throwOnError(error: { message: string } | null, ctx: string) {
  if (error) throw new Error(`[DB:${ctx}] ${error.message}`);
}

// ─────────────────────────────────────────────────────────
// FETCH ALL  (called on app init to populate Zustand store)
// ─────────────────────────────────────────────────────────
export async function fetchAllData() {
  const [
    uR, cR, pR, kR, kpR, sR, eR, lR, pyR,
    saR, siR, prR, piR, exR, gcR, vR, stR, rgR, lgR, mvR, dcR,
  ] = await Promise.all([
    supabase.from('users').select('*').order('id'),
    supabase.from('clients').select('*').order('name'),
    supabase.from('products').select('*').order('name'),
    supabase.from('kits').select('*').order('kit_id'),
    supabase.from('kit_products').select('*'),
    supabase.from('suppliers').select('*').order('company'),
    supabase.from('employees').select('*').order('name'),
    supabase.from('employee_loans').select('*').order('date'),
    supabase.from('employee_payments').select('*').order('date'),
    supabase.from('sales').select('*').order('date', { ascending: false }),
    supabase.from('sale_items').select('*'),
    supabase.from('purchases').select('*').order('date', { ascending: false }),
    supabase.from('purchase_items').select('*'),
    supabase.from('expenses').select('*').order('date', { ascending: false }),
    supabase.from('gift_cards').select('*').order('card_number'),
    supabase.from('vouchers').select('*').order('type'),
    supabase.from('stores').select('*').order('id'),
    supabase.from('cash_registers').select('*').order('id'),
    supabase.from('activity_logs').select('*').order('date', { ascending: false }).limit(200),
    supabase.from('inventory_movements').select('*').order('date', { ascending: false }),
    supabase.from('documents').select('*').order('uploaded_at', { ascending: false }),
  ]);

  const kitProds = kpR.data || [];
  const loans    = lR.data || [];
  const pays     = pyR.data || [];
  const siRows   = siR.data || [];
  const piRows   = piR.data || [];

  return {
    users:              (uR.data  || []).map(m.user),
    clients:            (cR.data  || []).map(m.client),
    products:           (pR.data  || []).map(m.product),
    kits:               (kR.data  || []).map(r => m.kit(r, kitProds.filter(kp => kp.kit_id === r.id))),
    suppliers:          (sR.data  || []).map(m.supplier),
    employees:          (eR.data  || []).map(r => m.employee(r, loans.filter(l => l.employee_id === r.id), pays.filter(p => p.employee_id === r.id))),
    sales:              (saR.data || []).map(r => m.sale(r, siRows.filter(i => i.sale_id === r.id))),
    purchases:          (prR.data || []).map(r => m.purchase(r, piRows.filter(i => i.purchase_id === r.id))),
    expenses:           (exR.data || []).map(m.expense),
    giftCards:          (gcR.data || []).map(m.giftCard),
    vouchers:           (vR.data  || []).map(m.voucher),
    stores:             (stR.data || []).map(m.store),
    registers:          (rgR.data || []).map(m.register),
    activityLogs:       (lgR.data || []).map(m.log),
    inventoryMovements: (mvR.data || []).map(m.movement),
    documents:          (dcR.data || []).map(m.document),
  };
}

// ─────────────────────────────────────────────────────────
// CLIENTS
// ─────────────────────────────────────────────────────────
export async function dbAddClient(c: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
  const { data, error } = await supabase.from('clients').insert({
    name: c.name, last_name: c.lastName, company: c.company, email: c.email, phone: c.phone,
    address1: c.address1, address2: c.address2, city: c.city, province: c.province,
    tax_id: c.taxId, photo_url: c.avatar, credit_balance: c.creditBalance || 0,
    credit_limit: c.creditLimit || 0, is_active: c.isActive ?? true,
  }).select().single();
  throwOnError(error, 'addClient');
  return m.client(data);
}
export async function dbUpdateClient(id: number, c: Partial<Client>) {
  const p: Row = {};
  if (c.name !== undefined)          p.name = c.name;
  if (c.lastName !== undefined)      p.last_name = c.lastName;
  if (c.email !== undefined)         p.email = c.email;
  if (c.phone !== undefined)         p.phone = c.phone;
  if (c.address1 !== undefined)      p.address1 = c.address1;
  if (c.company !== undefined)       p.company = c.company;
  if (c.taxId !== undefined)         p.tax_id = c.taxId;
  if (c.creditBalance !== undefined) p.credit_balance = c.creditBalance;
  if (c.creditLimit !== undefined)   p.credit_limit = c.creditLimit;
  if (c.avatar !== undefined)        p.photo_url = c.avatar;
  if (c.isActive !== undefined)      p.is_active = c.isActive;
  const { error } = await supabase.from('clients').update(p).eq('id', id);
  throwOnError(error, 'updateClient');
}
export async function dbDeleteClient(id: number) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  throwOnError(error, 'deleteClient');
}

// ─────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────
export async function dbAddProduct(prod: Omit<Product, 'id'>): Promise<Product> {
  const { data, error } = await supabase.from('products').insert({
    barcode: prod.barcode, name: prod.name, description: prod.description,
    category: prod.category, size: prod.size, supplier_name: prod.supplier,
    unit_of_measure: prod.unitOfMeasure, cost: prod.cost, sale_price: prod.salePrice,
    wholesale_price: prod.wholesalePrice, current_stock: prod.currentStock || 0,
    min_stock: prod.minStock || 0,
    is_sellable: prod.isSellable, is_product: prod.isProduct, is_raw_material: prod.isRawMaterial,
    is_service: prod.isService, prices_include_tax: prod.pricesIncludeTax,
    allow_alternate_description: prod.allowAlternateDescription,
    has_serial_number: prod.hasSerialNumber, is_favorite: prod.isFavorite || false,
    is_active: prod.isActive ?? true, image_url: prod.image,
  }).select().single();
  throwOnError(error, 'addProduct');
  return m.product(data);
}
export async function dbUpdateProduct(id: number, prod: Partial<Product>) {
  const p: Row = {};
  if (prod.name !== undefined)          p.name = prod.name;
  if (prod.barcode !== undefined)       p.barcode = prod.barcode;
  if (prod.description !== undefined)   p.description = prod.description;
  if (prod.category !== undefined)      p.category = prod.category;
  if (prod.cost !== undefined)          p.cost = prod.cost;
  if (prod.salePrice !== undefined)     p.sale_price = prod.salePrice;
  if (prod.wholesalePrice !== undefined)p.wholesale_price = prod.wholesalePrice;
  if (prod.currentStock !== undefined)  p.current_stock = prod.currentStock;
  if (prod.minStock !== undefined)      p.min_stock = prod.minStock;
  if (prod.isActive !== undefined)      p.is_active = prod.isActive;
  if (prod.isFavorite !== undefined)    p.is_favorite = prod.isFavorite;
  if (prod.isService !== undefined)     p.is_service = prod.isService;
  if (prod.image !== undefined)         p.image_url = prod.image;
  if (prod.unitOfMeasure !== undefined) p.unit_of_measure = prod.unitOfMeasure;
  if (prod.size !== undefined)          p.size = prod.size;
  if (prod.supplier !== undefined)      p.supplier_name = prod.supplier;
  p.updated_at = new Date().toISOString();
  const { error } = await supabase.from('products').update(p).eq('id', id);
  throwOnError(error, 'updateProduct');
}
export async function dbDeleteProduct(id: number) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  throwOnError(error, 'deleteProduct');
}

// ─────────────────────────────────────────────────────────
// SALES
// ─────────────────────────────────────────────────────────
export async function dbAddSale(s: Omit<Sale, 'id'>): Promise<Sale> {
  const { data, error } = await supabase.from('sales').insert({
    sale_id: s.saleId, date: s.date, client_id: s.clientId, client_name: s.clientName,
    employee: s.employee, register_name: s.register,
    subtotal: s.subtotal, discount: s.discount, tax: s.tax, total: s.total,
    amount_paid: s.paymentAmount, change_amount: s.change,
    payment_method: s.paymentMethod, status: s.status, notes: s.notes,
  }).select().single();
  throwOnError(error, 'addSale');
  if (s.items.length > 0) {
    const rows = s.items.map(i => ({
      sale_id: data.id, product_id: i.productId, product_name: i.productName,
      quantity: i.quantity, unit_price: i.unitPrice, discount: i.discount || 0, total: i.total,
    }));
    const { error: ie } = await supabase.from('sale_items').insert(rows);
    throwOnError(ie, 'addSaleItems');
  }
  return { ...s, id: data.id };
}

// ─────────────────────────────────────────────────────────
// PURCHASES
// ─────────────────────────────────────────────────────────
export async function dbAddPurchase(pur: Omit<Purchase, 'id'>): Promise<Purchase> {
  const { data, error } = await supabase.from('purchases').insert({
    purchase_id: pur.purchaseId, date: pur.date, expected_date: pur.expectedDate,
    supplier_id: pur.supplierId, supplier_name: pur.supplierName,
    subtotal: pur.subtotal, tax: pur.tax, discount: pur.discount, total: pur.total,
    status: pur.status, notes: pur.notes,
  }).select().single();
  throwOnError(error, 'addPurchase');
  if (pur.items.length > 0) {
    const rows = pur.items.map(i => ({ purchase_id: data.id, product_id: i.productId, product_name: i.productName, quantity: i.quantity, unit_cost: i.unitCost, discount: i.discount || 0, total: i.total }));
    const { error: ie } = await supabase.from('purchase_items').insert(rows);
    throwOnError(ie, 'addPurchaseItems');
  }
  return { ...pur, id: data.id };
}
export async function dbUpdatePurchase(id: number, pur: Partial<Purchase>) {
  const p: Row = {};
  if (pur.status !== undefined) p.status = pur.status;
  if (pur.notes !== undefined)  p.notes = pur.notes;
  const { error } = await supabase.from('purchases').update(p).eq('id', id);
  throwOnError(error, 'updatePurchase');
}
export async function dbDeletePurchase(id: number) {
  const { error } = await supabase.from('purchases').delete().eq('id', id);
  throwOnError(error, 'deletePurchase');
}

// ─────────────────────────────────────────────────────────
// EXPENSES
// ─────────────────────────────────────────────────────────
export async function dbAddExpense(e: Omit<Expense, 'id'>): Promise<Expense> {
  const { data, error } = await supabase.from('expenses').insert({
    date: e.date, category: e.category, description: e.description,
    amount: e.amount, tax: e.tax || 0, recipient: e.recipient, approved_by: e.approvedBy, notes: e.notes,
  }).select().single();
  throwOnError(error, 'addExpense');
  return m.expense(data);
}
export async function dbUpdateExpense(id: number, e: Partial<Expense>) {
  const p: Row = {};
  if (e.category !== undefined)    p.category = e.category;
  if (e.description !== undefined) p.description = e.description;
  if (e.amount !== undefined)      p.amount = e.amount;
  if (e.recipient !== undefined)   p.recipient = e.recipient;
  if (e.date !== undefined)        p.date = e.date;
  const { error } = await supabase.from('expenses').update(p).eq('id', id);
  throwOnError(error, 'updateExpense');
}
export async function dbDeleteExpense(id: number) {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  throwOnError(error, 'deleteExpense');
}

// ─────────────────────────────────────────────────────────
// SUPPLIERS
// ─────────────────────────────────────────────────────────
export async function dbAddSupplier(s: Omit<Supplier, 'id'>): Promise<Supplier> {
  const { data, error } = await supabase.from('suppliers').insert({
    company: s.company, first_name: s.firstName, last_name: s.lastName,
    email: s.email, phone: s.phone, address: s.address, city: s.city,
    tax_id: s.taxId, balance: s.balance || 0, notes: s.notes, is_active: s.isActive ?? true,
  }).select().single();
  throwOnError(error, 'addSupplier');
  return m.supplier(data);
}
export async function dbUpdateSupplier(id: number, s: Partial<Supplier>) {
  const p: Row = {};
  if (s.company !== undefined)       p.company = s.company;
  if (s.firstName !== undefined)     p.first_name = s.firstName;
  if (s.email !== undefined)         p.email = s.email;
  if (s.phone !== undefined)         p.phone = s.phone;
  if (s.balance !== undefined)       p.balance = s.balance;
  if (s.isActive !== undefined)      p.is_active = s.isActive;
  if (s.totalPurchases !== undefined) p.total_purchases = s.totalPurchases;
  const { error } = await supabase.from('suppliers').update(p).eq('id', id);
  throwOnError(error, 'updateSupplier');
}
export async function dbDeleteSupplier(id: number) {
  const { error } = await supabase.from('suppliers').delete().eq('id', id);
  throwOnError(error, 'deleteSupplier');
}

// ─────────────────────────────────────────────────────────
// EMPLOYEES
// ─────────────────────────────────────────────────────────
export async function dbAddEmployee(e: Omit<Employee, 'id'>): Promise<Employee> {
  const { data, error } = await supabase.from('employees').insert({
    name: e.name, email: e.email, phone: e.phone, avatar: e.avatar,
    position: e.position, department: e.department,
    salary_biweekly: e.salaryBiweekly, salary_monthly: e.salaryMonthly,
    hire_date: e.hireDate, total_loans: 0, total_payments: 0, is_active: e.isActive ?? true,
  }).select().single();
  throwOnError(error, 'addEmployee');
  return m.employee(data);
}
export async function dbUpdateEmployee(id: number, e: Partial<Employee>) {
  const p: Row = {};
  if (e.name !== undefined)           p.name = e.name;
  if (e.email !== undefined)          p.email = e.email;
  if (e.phone !== undefined)          p.phone = e.phone;
  if (e.position !== undefined)       p.position = e.position;
  if (e.department !== undefined)     p.department = e.department;
  if (e.salaryBiweekly !== undefined) p.salary_biweekly = e.salaryBiweekly;
  if (e.salaryMonthly !== undefined)  p.salary_monthly = e.salaryMonthly;
  if (e.isActive !== undefined)       p.is_active = e.isActive;
  if (e.totalLoans !== undefined)     p.total_loans = e.totalLoans;
  if (e.totalPayments !== undefined)  p.total_payments = e.totalPayments;
  if (e.avatar !== undefined)         p.avatar = e.avatar;
  const { error } = await supabase.from('employees').update(p).eq('id', id);
  throwOnError(error, 'updateEmployee');
}
export async function dbDeleteEmployee(id: number) {
  const { error } = await supabase.from('employees').delete().eq('id', id);
  throwOnError(error, 'deleteEmployee');
}

// ─────────────────────────────────────────────────────────
// KITS
// ─────────────────────────────────────────────────────────
export async function dbAddKit(k: Omit<Kit, 'id'>): Promise<Kit> {
  const { data, error } = await supabase.from('kits').insert({
    kit_id: k.kitId, name: k.name, description: k.description,
    cost: k.cost || 0, sale_price: k.salePrice || 0, category: k.category,
    image_url: k.image, is_active: k.isActive ?? true,
  }).select().single();
  throwOnError(error, 'addKit');
  return m.kit(data);
}
export async function dbUpdateKit(id: number, k: Partial<Kit>) {
  const p: Row = {};
  if (k.name !== undefined)      p.name = k.name;
  if (k.cost !== undefined)      p.cost = k.cost;
  if (k.salePrice !== undefined) p.sale_price = k.salePrice;
  if (k.isActive !== undefined)  p.is_active = k.isActive;
  if (k.image !== undefined)     p.image_url = k.image;
  const { error } = await supabase.from('kits').update(p).eq('id', id);
  throwOnError(error, 'updateKit');
}
export async function dbDeleteKit(id: number) {
  const { error } = await supabase.from('kits').delete().eq('id', id);
  throwOnError(error, 'deleteKit');
}

// ─────────────────────────────────────────────────────────
// VOUCHERS
// ─────────────────────────────────────────────────────────
export async function dbAddVoucher(v: Omit<Voucher, 'id'>): Promise<Voucher> {
  const { data, error } = await supabase.from('vouchers').insert({
    description: v.description, series: v.series, type: v.type,
    from: v.from, to: v.to, current: v.current, is_active: v.isActive ?? true,
  }).select().single();
  throwOnError(error, 'addVoucher');
  return m.voucher(data);
}
export async function dbUpdateVoucher(id: number, v: Partial<Voucher>) {
  const p: Row = {};
  if (v.current !== undefined)    p.current = v.current;
  if (v.isActive !== undefined)   p.is_active = v.isActive;
  if (v.description !== undefined) p.description = v.description;
  const { error } = await supabase.from('vouchers').update(p).eq('id', id);
  throwOnError(error, 'updateVoucher');
}
export async function dbDeleteVoucher(id: number) {
  const { error } = await supabase.from('vouchers').delete().eq('id', id);
  throwOnError(error, 'deleteVoucher');
}

// ─────────────────────────────────────────────────────────
// GIFT CARDS
// ─────────────────────────────────────────────────────────
export async function dbAddGiftCard(g: Omit<GiftCard, 'id'>): Promise<GiftCard> {
  const { data, error } = await supabase.from('gift_cards').insert({
    card_number: g.cardNumber, value: g.value, balance: g.balance,
    description: g.description, is_active: g.isActive ?? true, issue_date: g.issueDate,
  }).select().single();
  throwOnError(error, 'addGiftCard');
  return m.giftCard(data);
}
export async function dbUpdateGiftCard(id: number, g: Partial<GiftCard>) {
  const p: Row = {};
  if (g.balance !== undefined)  p.balance = g.balance;
  if (g.isActive !== undefined) p.is_active = g.isActive;
  const { error } = await supabase.from('gift_cards').update(p).eq('id', id);
  throwOnError(error, 'updateGiftCard');
}

// ─────────────────────────────────────────────────────────
// ACTIVITY LOG
// ─────────────────────────────────────────────────────────
export async function dbAddLog(log: Omit<ActivityLog, 'id'>) {
  await supabase.from('activity_logs').insert({
    date: new Date().toISOString(), user_name: log.user, controller: log.controller,
    action: log.action, details: log.details, platform: log.platform || navigator.platform,
  });
}

// ─────────────────────────────────────────────────────────
// INVENTORY MOVEMENTS
// ─────────────────────────────────────────────────────────
export async function dbAddMovement(mv: Omit<InventoryMovement, 'id'>) {
  await supabase.from('inventory_movements').insert({
    product_id: mv.productId, product_name: mv.productName, type: mv.type,
    quantity: mv.quantity, previous_stock: mv.previousStock, new_stock: mv.newStock,
    reason: mv.reason, requires_auth: mv.requiresAuth, authorized_by: mv.authorizedBy,
    user_name: mv.user, date: mv.date || new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────
export async function dbAddDocument(d: Omit<Document, 'id'>): Promise<Document> {
  const { data, error } = await supabase.from('documents').insert({
    name: d.name, type: d.type, file_url: d.fileUrl, file_type: d.fileType,
    file_size: d.fileSize, entity_type: d.entityType, entity_id: d.entityId,
    uploaded_by: d.uploadedBy, uploaded_at: d.uploadedAt,
  }).select().single();
  throwOnError(error, 'addDocument');
  return m.document(data);
}
export async function dbDeleteDocument(id: number) {
  const { error } = await supabase.from('documents').delete().eq('id', id);
  throwOnError(error, 'deleteDocument');
}
