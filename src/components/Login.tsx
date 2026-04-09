import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store';
import { ShoppingCart, Delete, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const [pin, setPin] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const login = useAppStore((state) => state.login);

  const handleNumberClick = useCallback((num: string) => {
    if (pin.length < 4 && !isAnimating) {
      setPin((prev) => prev + num);
    }
  }, [pin.length, isAnimating]);

  const handleDelete = useCallback(() => {
    if (!isAnimating) {
      setPin((prev) => prev.slice(0, -1));
    }
  }, [isAnimating]);

  const handleClear = useCallback(() => {
    if (!isAnimating) {
      setPin('');
    }
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

  // Manejar teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Números del teclado principal y numérico
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumberClick(e.key);
      }
      // Tecla Backspace para borrar
      else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      }
      // Tecla Escape para limpiar
      else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
      // Tecla Enter para enviar
      else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberClick, handleDelete, handleClear, handleSubmit]);

  // Auto-submit cuando se completan 4 dígitos
  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin, handleSubmit]);

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <ShoppingCart className="w-9 h-9 text-white" />
        </div>

        <h1 className="login-title">Sistema de Ventas</h1>
        <p className="login-subtitle">Ingrese su PIN para acceder</p>

        {/* PIN Display */}
        <div className="pin-display">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? 'filled' : ''}`}
            />
          ))}
        </div>

        {/* Teclado numérico */}
        <div className="pin-keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="pin-key"
              disabled={isAnimating}
              type="button"
            >
              {num}
            </button>
          ))}
          <button 
            onClick={handleClear} 
            className="pin-key action" 
            disabled={isAnimating}
            type="button"
          >
            Limpiar
          </button>
          <button 
            onClick={() => handleNumberClick('0')} 
            className="pin-key" 
            disabled={isAnimating}
            type="button"
          >
            0
          </button>
          <button 
            onClick={handleDelete} 
            className="pin-key action" 
            disabled={isAnimating}
            type="button"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Botón Entrar */}
        <button
          onClick={handleSubmit}
          disabled={pin.length !== 4 || isAnimating}
          className="w-full btn btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <ArrowRight className="w-4 h-4" />
          Entrar
        </button>

        <p className="login-hint mt-4">PIN de demostración: 1234</p>
        
        {/* Indicador de teclado */}
        <p className="text-xs text-gray-400 mt-2">
          También puede usar el teclado numérico
        </p>
      </div>
    </div>
  );
}
