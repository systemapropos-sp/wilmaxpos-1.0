import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: 'F1', description: 'Ayuda' },
  { key: 'F2', description: 'Buscar artículo' },
  { key: 'F3', description: 'Buscar cliente' },
  { key: 'F4', description: 'Cobrar' },
  { key: 'F5', description: 'Actualizar' },
  { key: 'F6', description: 'Descuento' },
  { key: 'F7', description: 'Abrir cajón' },
  { key: 'F8', description: 'Suspender venta' },
  { key: 'F9', description: 'Recuperar venta' },
  { key: 'F10', description: 'Cerrar sesión' },
  { key: 'Esc', description: 'Cancelar / Cerrar' },
  { key: 'Ctrl + N', description: 'Nuevo' },
  { key: 'Ctrl + S', description: 'Guardar' },
  { key: 'Ctrl + P', description: 'Imprimir' },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="keyboard-shortcuts">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="keyboard-shortcuts-toggle"
      >
        <Keyboard className="w-4 h-4" />
        <span>Atajos de teclado</span>
        <span className="keyboard-shortcut-key">F1</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="keyboard-shortcuts-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="keyboard-shortcuts-title">Atajos de Teclado</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-1">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="keyboard-shortcut-item">
                <span className="text-sm text-gray-600">{shortcut.description}</span>
                <span className="keyboard-shortcut-key">{shortcut.key}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
