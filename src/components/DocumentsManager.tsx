import { useState, useRef } from 'react';
import { useAppStore } from '@/store';
import type { Document } from '@/types';
import {
  FileText,
  Upload,
  Trash2,
  Download,
  X,
  File,
  Image as ImageIcon,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

interface DocumentsManagerProps {
  entityType: Document['entityType'];
  entityId: number;
  entityName: string;
}

export function DocumentsManager({ entityType, entityId, entityName }: DocumentsManagerProps) {
  const { addDocument, deleteDocument, getEntityDocuments } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<Document['type']>('other');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const entityDocuments = getEntityDocuments(entityType, entityId);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return <FileSpreadsheet className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('El archivo no puede superar los 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      addDocument({
        name: file.name,
        type: selectedType,
        fileUrl: reader.result as string,
        fileType: file.type,
        fileSize: file.size,
        entityType,
        entityId,
        uploadedBy: 'Usuario Actual',
        uploadedAt: new Date().toISOString(),
        notes: notes || undefined,
      });
      toast.success('Documento subido correctamente');
      setNotes('');
      setSelectedType('other');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (doc: Document) => {
    if (confirm(`¿Eliminar el documento "${doc.name}"?`)) {
      deleteDocument(doc.id);
      toast.success('Documento eliminado');
    }
  };

  const getTypeLabel = (type: Document['type']) => {
    const labels: Record<Document['type'], string> = {
      invoice: 'Factura',
      receipt: 'Recibo',
      payment: 'Comprobante de Pago',
      contract: 'Contrato',
      other: 'Otro',
    };
    return labels[type];
  };

  const getTypeColor = (type: Document['type']) => {
    const colors: Record<Document['type'], string> = {
      invoice: 'bg-blue-100 text-blue-700',
      receipt: 'bg-green-100 text-green-700',
      payment: 'bg-purple-100 text-purple-700',
      contract: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[type];
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FileText className="w-4 h-4" />
        Documentos
        {entityDocuments.length > 0 && (
          <span className="bg-[#ED6823] text-white text-xs px-1.5 py-0.5 rounded-full">
            {entityDocuments.length}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold">Documentos</h3>
                <p className="text-sm text-gray-500">{entityName}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Upload Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-3">Subir Nuevo Documento</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tipo de Documento</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as Document['type'])}
                      className="modern-input w-full"
                    >
                      <option value="invoice">Factura</option>
                      <option value="receipt">Recibo</option>
                      <option value="payment">Comprobante de Pago</option>
                      <option value="contract">Contrato</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Notas (opcional)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="modern-input w-full"
                      placeholder="Notas sobre el documento..."
                    />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full btn btn-outline py-3 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Seleccionar Archivo
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  PDF, imágenes, Word, Excel (máx. 10MB)
                </p>
              </div>

              {/* Documents List */}
              <div>
                <h4 className="font-medium mb-3">Documentos ({entityDocuments.length})</h4>
                {entityDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    <p>No hay documentos</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {entityDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400">
                          {getFileIcon(doc.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{doc.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(doc.type)}`}>
                              {getTypeLabel(doc.type)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                          {doc.notes && <p className="text-xs text-gray-400 mt-1">{doc.notes}</p>}
                        </div>
                        <div className="flex gap-1">
                          <a
                            href={doc.fileUrl}
                            download={doc.name}
                            className="p-2 hover:bg-white rounded-lg text-[#ED6823]"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-2 hover:bg-white rounded-lg text-red-500"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
