'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { useWishlist } from '../context/WishlistContext'

export default function Header() {
  const { user } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })
    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
          MyWishlist 🎁
        </Link>
        
        <nav className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              {/* Usuario Logueado */}
              <span className="hidden sm:inline text-gray-500">
                {user.email?.split('@')[0]} {/* Muestra solo la parte antes del @ */}
              </span>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
              >
                Salir
              </button>
            </>
          ) : (
            /* Usuario NO Logueado */
            <Link 
              href="/login" 
              className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}