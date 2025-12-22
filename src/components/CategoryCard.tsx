import React from 'react'
import { Trash2, Pencil } from 'lucide-react'

interface CategoryCardProps {
  name: string
  color?: string
  description?: string // Nuevo prop
  onDelete?: (e: React.MouseEvent) => void
  onEdit?: (e: React.MouseEvent) => void // Nuevo prop
}

export default function CategoryCard({ name, color, description, onDelete, onEdit }: CategoryCardProps) {
  return (
    <div className={`relative group p-6 rounded-xl shadow-lg text-white transition-all hover:scale-[1.02] hover:shadow-xl ${color || 'bg-gray-700'} min-h-[160px] flex flex-col justify-between`}>
      
      {/* Botones de Acción (Solo visibles si pasamos las funciones y al hacer hover) */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button 
            onClick={onEdit}
            className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm"
            title="Editar categoría"
          >
            <Pencil size={14} />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete}
            className="p-1.5 bg-white/20 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm"
            title="Borrar categoría"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold truncate tracking-tight">{name}</h3>
        {description && (
          <p className="mt-2 text-white/80 text-sm line-clamp-2 leading-relaxed font-light">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
        <span className="text-xs font-medium uppercase tracking-wider opacity-75">Ver lista</span>
        <span className="bg-white/20 rounded-full p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </span>
      </div>
    </div>
  )
}