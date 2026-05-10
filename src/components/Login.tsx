import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store';
import { ShoppingCart, Delete, ArrowRight, Building2, Loader2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  // ── Step 1: business code  |  Step 2: PIN ──
  const [step, setStep] = useState<'business' | 'pin'>('business');
  const [businessCode, setBusinessCode] = useState('');
  const [businessLabel, setBusinessLabel] = useState('');
  const [pin, setPin] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingBusiness, setLoadingBusiness] = useState(false);

  const { login, loginBusiness, businessId, businessName, initializeApp, initialized } = useAppStore();

  // If a businessId is already persisted (page reload), skip step 1
  useEffect(() => {
    if (businessId) {
      setStep('pin');
      setBusinessLabel(businessName || businessId.slice(0, 8));
      if (!initialized) initializeApp();
    }
  }, []);

  // ── STEP 1 handlers ─────────────────────────
  const handleBusinessSubmit = async () => {
    const code = businessCode.trim().toUpperCase();
    if (!code) return;
    setLoadingBusiness(true);
    try {
      const biz = await loginBusiness(code);
      if (biz) {
        setBusinessLabel(biz.name);
        setStep('pin');
        await initializeApp();
      } else {
        toast.error('Código de negocio no encontrado o inactivo.');
      }
    } catch {
      toast.error('Error al verificar el código de negocio.');
    } finally {
      setLoadingBusiness(false);
    }
  };

  // ── STEP 2 handlers ─────────────────────────
  const handleNumberClick = useCallback((num: string) => {
    if (pin.length < 4 && !isAnimating) setPin(p => p + num);
  }, [pin.length, isAnimating]);

  const handleDelete = useCallback(() => {
    if (!isAnimating) setPin(p => p.slice(0, -1));
  }, [isAnimating]);

  const handleClear = useCallback(() => {
    if (!isAnimating) setPin('');
  }, [isAnimating]);

  const handleSubmit = useCallback(() => {
    if (pin.length === 4 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        const user = login(pin);
        if (user) {
          toast.success(`Bienvenido, ${user.name}!`);
        } else {
          toast.error('PIN incorrecto. Intente nuevamente.');
          setPin('');
          setIsAnimating(false);
        }
      }, 300);
    }
  }, [pin, isAnimating, login]);

  useEffect(() => {
    if (step !== 'pin') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') { e.preventDefault(); handleNumberClick(e.key); }
      else if (e.key === 'Backspace')    { e.preventDefault(); handleDelete(); }
      else if (e.key === 'Escape')       { e.preventDefault(); handleClear(); }
      else if (e.key === 'Enter')        { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleNumberClick, handleDelete, handleClear, handleSubmit]);

  useEffect(() => {
    if (pin.length === 4) handleSubmit();
  }, [pin, handleSubmit]);

  // ── STEP 1: Business Code ────────────────────
  if (step === 'business') {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <Building2 className="w-9 h-9 text-white" />
          </div>
          <h1 className="login-title">WILMAX POS</h1>
          <p className="login-subtitle">Ingrese su código de negocio</p>

          <div className="mt-6">
            <input
              type="text"
              value={businessCode}
              onChange={e => setBusinessCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleBusinessSubmit()}
              placeholder="Ej: WILMAX01"
              className="modern-input text-center text-xl font-mono tracking-widest uppercase w-full"
              maxLength={20}
              autoFocus
            />
            <button
              onClick={handleBusinessSubmit}
              disabled={!businessCode.trim() || loadingBusiness}
              className="w-full btn btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {loadingBusiness
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</>
                : <><ArrowRight className="w-4 h-4" /> Continuar</>
              }
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            ¿No tienes un código? Contacta al administrador del sistema.
          </p>
        </div>
      </div>
    );
  }

  // ── STEP 2: PIN ──────────────────────────────
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <ShoppingCart className="w-9 h-9 text-white" />
        </div>

        {/* Business badge */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-[#ED6823]" />
          <span className="text-sm font-semibold text-[#ED6823] uppercase tracking-wide">{businessLabel}</span>
        </div>

        <h1 className="login-title">Acceso al Sistema</h1>
        <p className="login-subtitle">Ingrese su PIN para acceder</p>

        {/* PIN Display */}
        <div className="pin-display">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
          ))}
        </div>

        {/* Keypad */}
        <div className="pin-keypad">
          {['1','2','3','4','5','6','7','8','9'].map((num) => (
            <button key={num} onClick={() => handleNumberClick(num)} className="pin-key" disabled={isAnimating} type="button">
              {num}
            </button>
          ))}
          <button onClick={handleClear} className="pin-key action" disabled={isAnimating} type="button">Limpiar</button>
          <button onClick={() => handleNumberClick('0')} className="pin-key" disabled={isAnimating} type="button">0</button>
          <button onClick={handleDelete} className="pin-key action" disabled={isAnimating} type="button">
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={pin.length !== 4 || isAnimating}
          className="w-full btn btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <ArrowRight className="w-4 h-4" />
          Entrar
        </button>

        {/* Back to business selection */}
        <button
          onClick={() => { setStep('business'); setPin(''); }}
          className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mx-auto"
          type="button"
        >
          <ChevronLeft className="w-3 h-3" />
          Cambiar negocio
        </button>

        <p className="text-xs text-gray-400 mt-2 text-center">
          También puede usar el teclado numérico
        </p>
      </div>
    </div>
  );
}
