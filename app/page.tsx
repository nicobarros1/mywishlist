"use client"

import Link from 'next/link'
import { useState } from 'react'
import CategoryCard from '../src/components/CategoryCard'
import EditCategoryModal from '../src/components/EditCategoryModal' // Importar Modal
import { useWishlist } from '../src/context/WishlistContext'

export default function Home() {
  const { categories, addCategory, updateCategory, deleteCategory, user } = useWishlist()
  const [newCatName, setNewCatName] = useState('')
  
  // Estado para controlar qué categoría estamos editando
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Inicia sesión para crear una lista.')
    if (newCatName.trim()) {
      addCategory(newCatName)
      setNewCatName('')
    }
  }

  const displayedCategories = user 
    ? categories.filter(c => c.user_id === user.id)
    : []

  return (
    <div>
      {/* Header Sección */}
      <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {user ? `Hola, ${user.email?.split('@')[0]} 👋` : 'Bienvenido a MyWishlist'}
          </h2>
          <p className="text-gray-500 mt-1">
            {user ? 'Aquí están tus listas de regalos.' : 'Inicia sesión para crear tus listas.'}
          </p>
        </div>
        
        {user && (
          <form onSubmit={handleCreate} className="flex w-full sm:w-auto gap-2">
            <input 
              type="text" 
              placeholder="Nueva lista (ej: Cumpleaños)..." 
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-md"
            >
              + Crear
            </button>
          </form>
        )}
      </div>

      {/* Grid de Categorías */}
      {displayedCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((c) => (
            <Link key={c.id} href={`/${c.id}`} className="block">
              <CategoryCard 
                name={c.name} 
                color={c.color}
                description={c.description} // Pasamos la descripción
                
                // Editar
                onEdit={(e) => {
                  e.preventDefault()
                  setEditingCategory(c) // Abrimos el modal con esta categoría
                }}
                
                // Borrar
                onDelete={(e) => {
                  e.preventDefault()
                  deleteCategory(c.id)
                }}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          {user ? (
            <>
              <p className="text-xl text-gray-400 font-medium">No tienes listas creadas.</p>
              <p className="text-gray-400 text-sm mt-2">¡Crea la primera usando el formulario de arriba!</p>
            </>
          ) : (
            <>
              <p className="text-xl text-gray-800 font-bold">¡Empieza tu lista de deseos!</p>
              <p className="text-gray-500 mt-2 mb-4">Guarda enlaces de cualquier tienda en un solo lugar.</p>
              <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                Inicia sesión para comenzar &rarr;
              </Link>
            </>
          )}
        </div>
      )}

      {/* Modal de Edición (Solo se muestra si hay una categoría seleccionada) */}
      {editingCategory && (
        <EditCategoryModal 
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={(id, updates) => {
            updateCategory(id, updates)
          }}
        />
      )}
    </div>
  )
}