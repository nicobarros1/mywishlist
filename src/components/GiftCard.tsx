import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Gift } from '../types/wishlist'

interface GiftCardProps {
  gift: Gift
  onEdit?: () => void
  onDelete?: () => void
  onReserve?: () => void
}

export default function GiftCard({ gift, onEdit, onDelete, onReserve }: GiftCardProps) {
  const handleReserve = () => {
    if (confirm('¿Confirmas que vas a regalar este regalo? Esta acción avisará al resto que ya está tomado.')) {
      onReserve!()
    }
  }

  return (
    <div className="relative group bg-white rounded-lg shadow hover:shadow-md overflow-hidden border border-gray-100">

      {/* Badge "Reservado" — top-left, siempre visible para todos */}
      {gift.reserved && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
          <span>✓</span>
          <span>Reservado</span>
        </div>
      )}

      {/* Botones owner — top-right, solo visibles al hover */}
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

      {/* Contenido principal (link externo) */}
      <a href={gift.url || '#'} target="_blank" rel="noreferrer" className="block">
        <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
          {gift.imageUrl ? (
            <img
              src={gift.imageUrl}
              alt={gift.name}
              className={`w-full h-full object-cover transition-opacity ${gift.reserved ? 'opacity-50' : ''}`}
            />
          ) : (
            <span className={`text-4xl ${gift.reserved ? 'opacity-50' : ''}`}>🎁</span>
          )}
        </div>
        <div className="p-4">
          <h3 className={`font-semibold text-lg leading-tight ${gift.reserved ? 'text-gray-400' : 'text-gray-800'}`}>
            {gift.name}
          </h3>
          <p className="mt-2 text-xl font-bold text-indigo-600">
            {gift.currency} {Number(gift.price).toLocaleString('es-CL')}
          </p>
          {gift.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{gift.description}</p>
          )}
        </div>
      </a>

      {/* Botón "Lo voy a regalar" — solo visitantes, solo si no está reservado */}
      {!gift.reserved && onReserve && (
        <div className="px-4 pb-4">
          <button
            onClick={handleReserve}
            className="w-full py-2 border border-indigo-300 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
          >
            🎁 Lo voy a regalar
          </button>
        </div>
      )}

    </div>
  )
}