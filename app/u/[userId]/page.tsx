'use client'

import Link from 'next/link'
import CategoryCard from '../../../src/components/CategoryCard'
import { useWishlist } from '../../../src/context/WishlistContext'

interface Params {
  params: { userId: string }
}

export default function PublicProfilePage({ params }: Params) {
  const { categories } = useWishlist()
  const { userId } = params

  // Filtramos las categorías para mostrar SOLO las de este usuario
  const userCategories = categories.filter(c => c.user_id === userId)

  return (
    <div>
      <div className="mb-8 border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-800">Perfil de Usuario</h2>
        <p className="text-gray-500 mt-1">
          Estás viendo las listas de deseos de este usuario.
        </p>
      </div>

      {userCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCategories.map((c) => (
            <Link key={c.id} href={`/${c.id}`} className="block">
              {/* Usamos la tarjeta en modo solo lectura (sin onEdit ni onDelete) */}
              <CategoryCard 
                name={c.name} 
                color={c.color} 
                description={c.description}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-xl text-gray-400 font-medium">Este usuario no tiene listas públicas aún.</p>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-indigo-600 font-medium hover:underline">
          &larr; Ir a mi inicio
        </Link>
      </div>
    </div>
  )
}