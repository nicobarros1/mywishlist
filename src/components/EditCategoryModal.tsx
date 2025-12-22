import React, { useState } from 'react'

interface Category {
  id: string
  name: string
  color: string
  description?: string
}

interface EditCategoryModalProps {
  category: Category
  onClose: () => void
  onSave: (id: string, updates: Partial<Category>) => void
}

// Paleta de colores disponibles (Tailwind classes)
const COLORS = [
  'bg-slate-800', 'bg-gray-500', 'bg-zinc-600',
  'bg-red-500', 'bg-orange-500', 'bg-amber-500',
  'bg-yellow-500', 'bg-lime-500', 'bg-green-600',
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
  'bg-sky-500', 'bg-blue-600', 'bg-indigo-600',
  'bg-violet-600', 'bg-purple-600', 'bg-fuchsia-600',
  'bg-pink-500', 'bg-rose-500'
]

export default function EditCategoryModal({ category, onClose, onSave }: EditCategoryModalProps) {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description || '')
  const [color, setColor] = useState(category.color)

  const handleSave = () => {
    if (!name.trim()) return alert('El nombre no puede estar vacío')
    onSave(category.id, { name, description, color })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Editar Categoría</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
            <textarea 
              rows={2}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Cosas para mi casa nueva..."
            />
          </div>

          {/* Selector de Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color de Tarjeta</label>
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${c} transition-transform hover:scale-110 flex items-center justify-center ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                >
                  {color === c && <span className="text-white text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium">Guardar Cambios</button>
        </div>
      </div>
    </div>
  )
}