import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Gift } from '../types/wishlist'

interface GiftCardProps {
  gift: Gift
  onEdit?: () => void
  onDelete?: () => void
}

export default function GiftCard({ gift, onEdit, onDelete }: GiftCardProps) {
  return (
    <div className="relative group bg-white rounded-lg shadow hover:shadow-md overflow-hidden border border-gray-100">

      {/* Botones de acción (solo visibles al pasar el mouse, solo al owner) */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.preventDefault(); onEdit() }}
              className="p-2 bg-white/90 text-indigo-500 rounded-full shadow-sm hover:bg-indigo-50"
            >
              <Pencil size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.preventDefault(); if (confirm('¿Borrar este regalo?')) onDelete() }}
              className="p-2 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}

      {/* El Link envuelve el contenido */}
      <a href={gift.url || '#'} target="_blank" rel="noreferrer" className="block">
        <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
          {gift.imageUrl ? (
            <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🎁</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg leading-tight text-gray-800">{gift.name}</h3>
          <p className="mt-2 text-xl font-bold text-indigo-600">
            {gift.currency} {Number(gift.price).toLocaleString('es-CL')}
          </p>
          {gift.description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{gift.description}</p>}
        </div>
      </a>
    </div>
  )
}