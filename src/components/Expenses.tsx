import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Expense, Employee } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (payments: { employeeId: number; amount: number; type: 'quincenal' | 'mensual' }[]) => void;
}

function PayrollModal({ isOpen, onClose, onPay }: PayrollModalProps) {
  const { employees } = useAppStore();
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [paymentType, setPaymentType] = useState<'quincenal' | 'mensual'>('quincenal');

  useEffect(() => {
    if (isOpen) {
      setSelectedEmployees([]);
    }
  }, [isOpen]);

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

  const toggleEmployee = (id: number) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const getPaymentAmount = (employee: Employee) => {
    return paymentType === 'quincenal' 
      ? (employee.salaryBiweekly || 0) 
      : (employee.salaryMonthly || 0);
  };

  const totalAmount = employees
    .filter(e => selectedEmployees.includes(e.id))
    .reduce((sum, e) => sum + getPaymentAmount(e), 0);

  const handlePay = () => {
    const payments = employees
      .filter(e => selectedEmployees.includes(e.id))
      .map(e => ({
        employeeId: e.id,
        amount: getPaymentAmount(e),
        type: paymentType
      }));
    onPay(payments);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Pagar Nómina
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--background-hover)] rounded-lg">
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-6">
          {/* Tipo de pago */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setPaymentType('quincenal')}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                paymentType === 'quincenal' 
                  ? 'bg-[#ED6823] text-white border-[#ED6823]' 
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Quincenal
            </button>
            <button
              onClick={() => setPaymentType('mensual')}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                paymentType === 'mensual' 
                  ? 'bg-[#ED6823] text-white border-[#ED6823]' 
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Mensual
            </button>
          </div>

          {/* Lista de empleados */}
          <div className="space-y-2 max-h-80 overflow-y-auto mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Seleccione los empleados:</p>
            {employees.filter(e => e.isActive).map((employee) => (
              <div
                key={employee.id}
                onClick={() => toggleEmployee(employee.id)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedEmployees.includes(employee.id)
                    ? 'bg-[#ED6823]/10 border-[#ED6823]'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    selectedEmployees.includes(employee.id)
                      ? 'bg-[#ED6823] border-[#ED6823]'
                      : 'border-gray-300'
                  }`}>
                    {selectedEmployees.includes(employee.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#ED6823]">
                    RD${getPaymentAmount(employee).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{paymentType}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total a pagar:</span>
              <span className="text-2xl font-bold text-[#ED6823]">
                RD${totalAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {selectedEmployees.length} empleado(s) seleccionado(s)
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button 
              onClick={handlePay}
              disabled={selectedEmployees.length === 0}
              className="btn btn-primary disabled:opacity-50"
            >
              <DollarSign className="w-4 h-4" />
              Procesar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExpenseModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Partial<Expense>) => void;
}

function ExpenseModal({ expense, isOpen, onClose, onSave }: ExpenseModalProps) {
  const [formData, setFormData] = useState<Partial<Expense>>({
    category: '',
    description: '',
    amount: 0,
    tax: 0,
    date: new Date().toISOString().split('T')[0],
    recipient: '',
    approvedBy: '',
  });

  // Cargar datos del gasto cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (expense) {
        setFormData({ ...expense });
      } else {
        setFormData({
          category: '',
          description: '',
          amount: 0,
          tax: 0,
          date: new Date().toISOString().split('T')[0],
          recipient: '',
          approvedBy: '',
        });
      }
    }
  }, [expense, isOpen]);

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
            {expense ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="modern-input"
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="TELEFONO">Teléfono</option>
                <option value="INTERNET">Internet</option>
                <option value="LUZ">Luz</option>
                <option value="AGUA">Agua</option>
                <option value="ALQUILER">Alquiler</option>
                <option value="SUMINISTROS">Suministros</option>
                <option value="MANTENIMIENTO">Mantenimiento</option>
                <option value="OTROS">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Descripción *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="modern-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Monto *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="modern-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Impuesto
                </label>
                <input
                  type="number"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: Number(e.target.value) })}
                  className="modern-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="modern-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Nombre del Recipiente *
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="modern-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Aprobado por *
              </label>
              <input
                type="text"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                className="modern-input"
                required
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
              {expense ? 'Guardar cambios' : 'Registrar gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveExpense = (expenseData: Partial<Expense>) => {
    if (selectedExpense) {
      updateExpense(selectedExpense.id, expenseData);
      toast.success('Gasto actualizado exitosamente');
    } else {
      addExpense(expenseData as Omit<Expense, 'id'>);
      toast.success('Gasto registrado exitosamente');
    }
    setIsModalOpen(false);
  };

  const handleDeleteExpense = (expense: Expense) => {
    if (confirm(`¿Está seguro de eliminar el gasto "${expense.description}"?`)) {
      deleteExpense(expense.id);
      toast.success('Gasto eliminado exitosamente');
    }
  };

  const openAddModal = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handlePayroll = (payments: { employeeId: number; amount: number; type: 'quincenal' | 'mensual' }[]) => {
    // Crear un gasto por cada pago de nómina
    payments.forEach(payment => {
      const employee = useAppStore.getState().employees.find(e => e.id === payment.employeeId);
      if (employee) {
        addExpense({
          category: 'NOMINA',
          description: `Pago ${payment.type} - ${employee.name}`,
          amount: payment.amount,
          tax: 0,
          date: new Date().toISOString().split('T')[0],
          recipient: employee.name,
          approvedBy: 'Sistema',
        } as Omit<Expense, 'id'>);
      }
    });
    toast.success(`Nómina procesada: ${payments.length} pago(s) registrado(s)`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Gastos</h1>
          <p className="page-subtitle">Registre y controle sus gastos</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsPayrollModalOpen(true)} className="btn btn-secondary">
            <DollarSign className="w-4 h-4" />
            Pagar nómina
          </button>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Nuevo Gasto
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar gastos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-primary)]">Lista de Gastos</h2>
          <span className="badge badge-primary">{filteredExpenses.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th>ID</th>
                <th>Escribe</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Impuesto</th>
                <th>Recipiente</th>
                <th>Aprobado por</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td>{expense.id}</td>
                  <td>
                    <span className="badge badge-primary">{expense.category.toLowerCase()}</span>
                  </td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>{expense.date}</td>
                  <td className="font-medium">RD${expense.amount.toLocaleString()}</td>
                  <td>RD${expense.tax.toLocaleString()}</td>
                  <td>{expense.recipient}</td>
                  <td>{expense.approvedBy}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(expense)}
                        className="p-2 hover:bg-[var(--background-hover)] rounded-lg text-[var(--primary)]"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense)}
                        className="p-2 hover:bg-[var(--background-hover)] rounded-lg text-[var(--danger)]"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DollarSign className="w-12 h-12 text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-secondary)]">No se encontraron gastos</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ExpenseModal
        expense={selectedExpense}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
      />

      {/* Payroll Modal */}
      <PayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        onPay={handlePayroll}
      />
    </div>
  );
}
