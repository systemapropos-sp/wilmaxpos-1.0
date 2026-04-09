import { useState } from 'react';
import {
  Book,
  Video,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Headphones,
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: '¿Cómo crear una nueva venta?',
    answer: 'Para crear una nueva venta, vaya al módulo de Ventas, seleccione una caja abierta y busque los productos. Luego haga clic en "Cobrar" para completar la transacción.',
  },
  {
    question: '¿Cómo agregar un nuevo producto?',
    answer: 'Vaya al módulo de Inventario y haga clic en "Nuevo Artículo". Complete la información requerida como nombre, categoría, costo y precio de venta.',
  },
  {
    question: '¿Cómo generar un reporte?',
    answer: 'En el módulo de Reportes, seleccione la categoría y el tipo de reporte que desea generar. Configure las fechas y haga clic en "Generar".',
  },
  {
    question: '¿Cómo registrar un gasto?',
    answer: 'Vaya al módulo de Gastos y haga clic en "Nuevo Gasto". Complete la información de la categoría, descripción, monto y fecha.',
  },
  {
    question: '¿Cómo gestionar clientes?',
    answer: 'En el módulo de Clientes puede agregar, editar y eliminar clientes. También puede ver el historial de compras y saldos de cada cliente.',
  },
];

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  onClick: () => void;
}

function ResourceCard({ title, description, icon: Icon, action, onClick }: ResourceCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[var(--primary)]" />
      </div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{description}</p>
      <button
        onClick={onClick}
        className="text-[var(--primary)] font-medium text-sm flex items-center gap-1 hover:underline"
      >
        {action}
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Ayuda</h1>
          <p className="page-subtitle">Encuentre respuestas y recursos de ayuda</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar en la ayuda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input pl-12"
          />
        </div>
      </div>

      {/* Resources */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Recursos de Ayuda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ResourceCard
            title="Documentación"
            description="Guías completas y documentación del sistema"
            icon={Book}
            action="Ver documentación"
            onClick={() => {}}
          />
          <ResourceCard
            title="Tutoriales en Video"
            description="Aprenda con videos paso a paso"
            icon={Video}
            action="Ver videos"
            onClick={() => {}}
          />
          <ResourceCard
            title="Soporte Técnico"
            description="Contacte con nuestro equipo de soporte"
            icon={Headphones}
            action="Contactar"
            onClick={() => {}}
          />
          <ResourceCard
            title="Comunidad"
            description="Únase a nuestra comunidad de usuarios"
            icon={MessageCircle}
            action="Unirse"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Preguntas Frecuentes
        </h2>
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className={`border-b border-[var(--border)] last:border-b-0 ${
                expandedFAQ === index ? 'bg-[var(--background)]' : ''
              }`}
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--background-hover)] transition-colors"
              >
                <span className="font-medium text-[var(--text-primary)]">{faq.question}</span>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                )}
              </button>
              {expandedFAQ === index && (
                <div className="px-4 pb-4">
                  <p className="text-[var(--text-secondary)]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">¿Necesita más ayuda?</h2>
            <p className="text-blue-100">
              Nuestro equipo de soporte está disponible para ayudarle
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="mailto:soporte@sistema.com"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <a
              href="tel:+18091234567"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Llamar</span>
            </a>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          Sistema de Punto de Venta Pro v2.0.0
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          © 2026 Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
