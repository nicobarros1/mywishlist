"use client"

import { useState, useMemo } from 'react'
import GiftCard from '../../src/components/GiftCard'
import AddGiftModal from '../../src/components/AddGiftModal'
import { useWishlist } from '../../src/context/WishlistContext'

interface Params {
  params: { category: string }
}

export default function CategoryPage({ params }: Params) {
  const { category } = params
  // 1. Importamos removeGift para poder borrar
  const { items, addGift, removeGift } = useWishlist()
  const [showModal, setShowModal] = useState(false)
  const [sortDesc, setSortDesc] = useState(false)

  const list = items[category] ?? []

  const sorted = useMemo(() => {
    return [...list].sort((a, b) => (sortDesc ? b.price - a.price : a.price - b.price))
  }, [list, sortDesc])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold capitalize text-gray-800">{category}</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortDesc((s) => !s)}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 text-gray-700"
          >
            Precio: {sortDesc ? 'Mayor a Menor' : 'Menor a Mayor'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition-colors"
          >
            + Agregar Regalo
          </button>
        </div>
      </div>

      {/* Grid de Regalos */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((g: any) => (
            <GiftCard 
              key={g.id} 
              gift={g} 
              // 2. Conectamos la función de eliminar
              onDelete={() => removeGift(category, g.id)}
            />
          ))}
        </div>
      ) : (
        // Estado vacío (Empty State)
        <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
          <p className="text-gray-500">No hay regalos en esta lista todavía.</p>
          <button 
            onClick={() => setShowModal(true)} 
            className="mt-2 text-indigo-600 font-medium hover:underline"
          >
            ¡Agrega el primero!
          </button>
        </div>
      )}

      {showModal && (
        <AddGiftModal
          category={category}
          onClose={() => setShowModal(false)}
          onAdd={(gift) => {
            addGift(category, gift)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}