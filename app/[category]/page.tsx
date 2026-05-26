"use client"

import { useState, useMemo } from 'react'
import GiftCard from '../../src/components/GiftCard'
import AddGiftModal from '../../src/components/AddGiftModal'
import EditGiftModal from '../../src/components/EditGiftModal'
import ShareButton from '../../src/components/ShareButton'
import { useWishlist } from '../../src/context/WishlistContext'
import type { Gift } from '../../src/types/wishlist'

interface Params {
  params: { category: string }
}

export default function CategoryPage({ params }: Params) {
  const { category: categoryId } = params // El parámetro de la URL es el ID de la categoría
  
  // 1. Traemos todo lo necesario del contexto, incluyendo al usuario y categorías
  const { items, categories, addGift, updateGift, removeGift, user } = useWishlist()

  const [showModal, setShowModal] = useState(false)
  const [sortDesc, setSortDesc] = useState(false)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)

  // 2. Buscamos la información de la categoría actual para saber de quién es
  const currentCategory = categories.find(c => c.id === categoryId)
  
  // 3. Verificamos si soy el dueño (Usuario logueado + ID coincide con el creador de la categoría)
  const isOwner = user && currentCategory && user.id === currentCategory.user_id

  const list = items[categoryId] ?? []

  const sorted = useMemo(() => {
    return [...list].sort((a, b) => (sortDesc ? b.price - a.price : a.price - b.price))
  }, [list, sortDesc])

  // Si la categoría no existe y no hay items (quizás cargando o url mala), mostramos algo simple
  if (!currentCategory && list.length === 0 && !user) {
    return <div className="p-8 text-center text-gray-500">Cargando lista...</div>
  }

  return (
    <div>
      {/* Header de la Lista */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-bold text-gray-800 capitalize">
               {currentCategory?.name || categoryId}
             </h2>
             {/* Botón para compartir ESTA lista específica */}
             <ShareButton url={`/${categoryId}`} label="Compartir" />
          </div>
          
          {/* Mostramos la descripción si existe */}
          {currentCategory?.description && (
            <p className="text-gray-600 mt-2 max-w-2xl">{currentCategory.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSortDesc((s) => !s)}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 text-gray-700 whitespace-nowrap"
          >
            Precio: {sortDesc ? 'Mayor a Menor' : 'Menor a Mayor'}
          </button>
          
          {/* 4. SOLO EL DUEÑO VE EL BOTÓN DE AGREGAR */}
          {isOwner && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              + Agregar Regalo
            </button>
          )}
        </div>
      </div>

      {/* Grid de Regalos */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((g) => (
            <GiftCard
              key={g.id}
              gift={g}
              onEdit={isOwner ? () => setEditingGift(g) : undefined}
              onDelete={isOwner ? () => removeGift(categoryId, g.id) : undefined}
            />
          ))}
        </div>
      ) : (
        // Estado vacío (Empty State)
        <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
          <p className="text-gray-500">No hay regalos en esta lista todavía.</p>
          
          {/* Solo mostramos el botón de "Agrega el primero" si es el dueño */}
          {isOwner && (
             <button 
               onClick={() => setShowModal(true)} 
               className="mt-2 text-indigo-600 font-medium hover:underline"
             >
               ¡Agrega el primero!
             </button>
          )}
        </div>
      )}

      {/* Modal agregar regalo */}
      {showModal && isOwner && (
        <AddGiftModal
          category={categoryId}
          onClose={() => setShowModal(false)}
          onAdd={(gift) => {
            addGift(categoryId, gift)
            setShowModal(false)
          }}
        />
      )}

      {/* Modal editar regalo */}
      {editingGift && isOwner && (
        <EditGiftModal
          gift={editingGift}
          onClose={() => setEditingGift(null)}
          onSave={(updates) => {
            updateGift(editingGift.id, updates)
            setEditingGift(null)
          }}
        />
      )}
    </div>
  )
}