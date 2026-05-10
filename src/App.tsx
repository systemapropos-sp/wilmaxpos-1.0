import { Toaster } from 'sonner';
import { useAppStore } from '@/store';
import { useEffect } from 'react';
import { Login } from '@/components/Login';
import { Sidebar } from '@/components/Sidebar';
import { QuickActionsButton } from '@/components/QuickActionsButton';
import { Notifications, useNotifications } from '@/components/Notifications';
import { Dashboard } from '@/components/Dashboard';
import { Clients } from '@/components/Clients';
import { Inventory } from '@/components/Inventory';
import { Kits } from '@/components/Kits';
import { Suppliers } from '@/components/Suppliers';
import { Reports } from '@/components/Reports';
import { Purchases } from '@/components/Purchases';
import { Sales } from '@/components/Sales';
import { Expenses } from '@/components/Expenses';
import { Employees } from '@/components/Employees';
import { GiftCards } from '@/components/GiftCards';
import { Vouchers } from '@/components/Vouchers';
import { HistoryComponent } from '@/components/History';
import { Stores } from '@/components/Stores';
import { Settings } from '@/components/Settings';
import { Help } from '@/components/Help';
import { Products } from '@/components/Products';
function App() {
  const { isAuthenticated, sidebarCollapsed, currentPage, initialized, loading, initializeApp } = useAppStore();
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Cargando WILMAX POS…</h2>
          <p className="text-sm text-gray-400 mt-1">Sincronizando datos con Supabase</p>
        </div>
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'clients':
        return <Clients />;
      case 'inventory':
        return <Inventory />;
      case 'kits':
        return <Kits />;
      case 'suppliers':
        return <Suppliers />;
      case 'reports':
        return <Reports />;
      case 'purchases':
        return <Purchases />;
      case 'sales':
        return <Sales />;
      case 'expenses':
        return <Expenses />;
      case 'employees':
        return <Employees />;
      case 'giftcards':
        return <GiftCards />;
      case 'vouchers':
        return <Vouchers />;
      case 'history':
        return <HistoryComponent />;
      case 'stores':
        return <Stores />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      default:
        return <Dashboard />;
    }
  };

  const sidebarWidth = sidebarCollapsed ? 50 : 200;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      
      {/* Header con notificaciones - Fixed */}
      <div 
        className="fixed top-0 z-30 bg-white border-b border-[var(--border)] px-4 py-3 flex items-center justify-between"
        style={{ 
          left: sidebarWidth,
          right: 0,
          transition: 'left 0.3s ease'
        }}
      >
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {currentPage === 'dashboard' && 'Dashboard'}
            {currentPage === 'products' && 'Productos'}
            {currentPage === 'clients' && 'Clientes'}
            {currentPage === 'inventory' && 'Inventario'}
            {currentPage === 'kits' && 'Kits'}
            {currentPage === 'suppliers' && 'Proveedores'}
            {currentPage === 'reports' && 'Reportes'}
            {currentPage === 'purchases' && 'Compras'}
            {currentPage === 'sales' && 'Ventas'}
            {currentPage === 'expenses' && 'Gastos'}
            {currentPage === 'employees' && 'Empleados'}
            {currentPage === 'giftcards' && 'Tarjetas de Regalo'}
            {currentPage === 'vouchers' && 'Comprobantes'}
            {currentPage === 'history' && 'Historial'}
            {currentPage === 'stores' && 'Tiendas'}
            {currentPage === 'settings' && 'Configuración'}
            {currentPage === 'help' && 'Ayuda'}
          </h2>
        </div>
        <Notifications
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClear={clearNotification}
        />
      </div>
      
      <main
        className="transition-all duration-300 min-h-screen pt-14"
        style={{ 
          marginLeft: sidebarWidth,
          transition: 'margin-left 0.3s ease'
        }}
      >
        <div className="p-4">
          {renderPage()}
        </div>
      </main>
      
      {/* Botón flotante de accesos rápidos */}
      <QuickActionsButton />
      
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
