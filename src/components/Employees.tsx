import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Employee } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  UserCircle,
  X,
  DollarSign,
  Calendar,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Phone,
  Mail,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
}

function EmployeeModal({ employee, isOpen, onClose, onSave }: EmployeeModalProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salaryBiweekly: 0,
    salaryMonthly: 0,
    hireDate: '',
    isActive: true,
  });
  const [previewImage, setPreviewImage] = useState<string | undefined>('');

  // Cargar datos del empleado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (employee) {
        setFormData({ ...employee });
        setPreviewImage(employee.avatar || '');
      } else {
        // Resetear para nuevo empleado
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          salaryBiweekly: 0,
          salaryMonthly: 0,
          hireDate: '',
          isActive: true,
        });
        setPreviewImage('');
      }
    }
  }, [employee, isOpen]);

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
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-6">
            {/* Preview Container - Circular */}
            <div 
              onClick={() => document.getElementById('employee-image-input')?.click()}
              className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-[#ED6823] transition-colors overflow-hidden bg-gray-50 group"
            >
              {previewImage ? (
                <>
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay para cambiar */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <Camera className="w-10 h-10 text-gray-400" />
              )}
            </div>
            
            <input
              id="employee-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {/* Controles debajo */}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => document.getElementById('employee-image-input')?.click()}
                className="text-xs text-[#ED6823] hover:underline"
              >
                Cambiar
              </button>
              {previewImage && (
                <>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => setPreviewImage('')}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="modern-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="modern-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="modern-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Departamento
                </label>
                <select
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="modern-input"
                >
                  <option value="">Seleccionar</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Administración">Administración</option>
                  <option value="TI">TI</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="Almacén">Almacén</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Sueldo Quincenal
                </label>
                <input
                  type="number"
                  value={formData.salaryBiweekly || ''}
                  onChange={(e) => setFormData({ ...formData, salaryBiweekly: Number(e.target.value) })}
                  className="modern-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Sueldo Mensual
                </label>
                <input
                  type="number"
                  value={formData.salaryMonthly || ''}
                  onChange={(e) => setFormData({ ...formData, salaryMonthly: Number(e.target.value) })}
                  className="modern-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Fecha de Contratación
              </label>
              <input
                type="date"
                value={formData.hireDate || ''}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                className="modern-input"
              />
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
              {employee ? 'Guardar cambios' : 'Crear empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal para préstamos
interface LoanModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

function LoanModal({ employee, isOpen, onClose }: LoanModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen || !employee) return null;

  const handleAddLoan = () => {
    toast.success(`Préstamo de RD$${amount} registrado para ${employee.name}`);
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Préstamo - {employee.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-6">
          {/* Préstamos existentes */}
          {employee.loans && employee.loans.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
                Préstamos Existentes
              </h3>
              <div className="space-y-2">
                {employee.loans.map((loan) => (
                  <div key={loan.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">RD${loan.amount.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        loan.status === 'partial' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {loan.status === 'pending' ? 'Pendiente' :
                         loan.status === 'partial' ? 'Parcial' : 'Pagado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{loan.description}</p>
                    {loan.remainingAmount > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        Pendiente: RD${loan.remainingAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuevo préstamo */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
              Nuevo Préstamo
            </h3>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Monto
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="modern-input"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="modern-input"
                placeholder="Motivo del préstamo"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button 
              onClick={handleAddLoan}
              disabled={!amount}
              className="btn btn-primary"
            >
              Registrar Préstamo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal para pagos
interface PaymentModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

function PaymentModal({ employee, isOpen, onClose }: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'salary' | 'bonus' | 'loan_payment' | 'other'>('salary');
  const [description, setDescription] = useState('');

  if (!isOpen || !employee) return null;

  const handleAddPayment = () => {
    toast.success(`Pago de RD$${amount} registrado para ${employee.name}`);
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Registrar Pago - {employee.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-6">
          {/* Pagos existentes */}
          {employee.payments && employee.payments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
                Pagos Anteriores
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {employee.payments.map((payment) => (
                  <div key={payment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">RD${payment.amount.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{payment.date}</span>
                    </div>
                    <p className="text-sm text-gray-500">{payment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuevo pago */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
              Nuevo Pago
            </h3>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Tipo de Pago
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="modern-input"
              >
                <option value="salary">Salario</option>
                <option value="bonus">Bono</option>
                <option value="loan_payment">Pago de Préstamo</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Monto
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="modern-input"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="modern-input"
                placeholder="Descripción del pago"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button 
              onClick={handleAddPayment}
              disabled={!amount}
              className="btn btn-primary"
            >
              Registrar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tarjeta de empleado
interface EmployeeCardProps {
  employee: Employee;
  onEdit: () => void;
  onDelete: () => void;
  onLoan: () => void;
  onPayment: () => void;
}

function EmployeeCard({ employee, onEdit, onDelete, onLoan, onPayment }: EmployeeCardProps) {
  const initials = employee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all">
      {/* Header con avatar */}
      <div className="p-4 flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#ED6823] to-[#D55A1A] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
          {employee.avatar ? (
            <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-lg font-bold">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] truncate">{employee.name}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{employee.position || 'Sin cargo'}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
              {employee.department || 'General'}
            </span>
            {employee.isActive !== false && (
              <span className="text-xs px-2 py-0.5 bg-green-100 rounded text-green-600">
                Activo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="px-4 pb-3 border-b border-[var(--border)]">
        <div className="flex flex-wrap gap-3 text-sm">
          {employee.phone && (
            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
              <Phone className="w-3.5 h-3.5" />
              <span>{employee.phone}</span>
            </div>
          )}
          {employee.email && (
            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{employee.email}</span>
            </div>
          )}
          {employee.hireDate && (
            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Desde {employee.hireDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sueldos */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Quincenal</p>
            <p className="font-semibold text-[var(--text-primary)]">
              RD${(employee.salaryBiweekly || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Mensual</p>
            <p className="font-semibold text-[var(--text-primary)]">
              RD${(employee.salaryMonthly || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Préstamos y Pagos */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Préstamos</p>
              <p className={`font-semibold ${(employee.totalLoans || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                RD${(employee.totalLoans || 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Pagos</p>
              <p className="font-semibold text-green-500">
                RD${(employee.totalPayments || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="p-3 flex gap-2">
        <button
          onClick={onLoan}
          className="flex-1 btn btn-outline text-xs py-2"
        >
          <CreditCard className="w-3.5 h-3.5" />
          Préstamo
        </button>
        <button
          onClick={onPayment}
          className="flex-1 btn btn-primary text-xs py-2"
        >
          <DollarSign className="w-3.5 h-3.5" />
          Pagar
        </button>
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
  );
}

export function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (employeeData: Partial<Employee>) => {
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, employeeData);
      toast.success('Empleado actualizado');
    } else {
      addEmployee(employeeData as Omit<Employee, 'id'>);
      toast.success('Empleado creado');
    }
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const openLoanModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsLoanModalOpen(true);
  };

  const openPaymentModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsPaymentModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    if (confirm(`¿Está seguro de eliminar a ${employee.name}?`)) {
      deleteEmployee(employee.id);
      toast.success('Empleado eliminado');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Empleados</h1>
          <p className="page-subtitle">Gestione sus empleados, sueldos y préstamos</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Nuevo Empleado
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar empleados por nombre, cargo o departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      {/* Employees Grid - 2 por fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={() => openEditModal(employee)}
            onDelete={() => handleDelete(employee)}
            onLoan={() => openLoanModal(employee)}
            onPayment={() => openPaymentModal(employee)}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-[var(--border)]">
          <UserCircle className="w-12 h-12 text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-secondary)]">No se encontraron empleados</p>
        </div>
      )}

      {/* Modals */}
      <EmployeeModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <LoanModal
        employee={selectedEmployee}
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
      />

      <PaymentModal
        employee={selectedEmployee}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
