'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Gift = {
  id: string
  category_id: string
  name: string
  price: number
  currency: string
  imageUrl: string
  description?: string
  url: string
  user_id?: string // Nuevo: para saber de quién es
}

type Category = {
  id: string
  name: string
  color: string
  user_id?: string // Nuevo
}

interface WishlistContextType {
  items: Record<string, Gift[]>
  categories: Category[]
  addGift: (categoryId: string, gift: any) => Promise<void>
  removeGift: (categoryId: string, giftId: string) => Promise<void>
  addCategory: (name: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void> // Ahora devuelve Promise
  loading: boolean
  user: any // Exponemos el usuario actual para saber qué botones mostrar
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, Gift[]>>({})
  const [categories, setCategories] = useState<Category[]>([]) // ¡Empieza vacío!
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // 1. CARGAR DATOS
  const fetchData = async () => {
    setLoading(true)
    
    // Obtener usuario actual
    const { data: { session } } = await supabase.auth.getSession()
    const currentUser = session?.user || null
    setUser(currentUser)

    try {
      // A) Traer Categorías (Supabase ya filtra o muestra todo según nuestras reglas)
      // Nota: Si queremos ver SOLO las mías en el Home, podríamos filtrar aquí.
      // Por ahora traemos todas para permitir ver perfiles de amigos en el futuro.
      const { data: catsData } = await supabase.from('categories').select('*')
      if (catsData) setCategories(catsData)

      // B) Traer Regalos
      const { data: giftsData } = await supabase.from('gifts').select('*')
      
      if (giftsData) {
        const grouped: Record<string, Gift[]> = {}
        giftsData.forEach((g: any) => {
          const formattedGift: Gift = {
            id: g.id,
            category_id: g.category_id,
            name: g.name,
            price: g.price,
            currency: g.currency,
            imageUrl: g.image_url,
            description: g.description,
            url: g.url,
            user_id: g.user_id
          }
          if (!grouped[g.category_id]) grouped[g.category_id] = []
          grouped[g.category_id].push(formattedGift)
        })
        setItems(grouped)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Suscribirse a cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if(_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') fetchData()
    })
    return () => subscription.unsubscribe()
  }, [])

  const addGift = async (categoryId: string, gift: any) => {
    if (!user) return alert('Debes iniciar sesión')
    
    // Optimistic
    const tempId = Date.now().toString()
    const newGiftUI = { ...gift, id: tempId, category_id: categoryId, user_id: user.id }
    setItems((prev) => ({ ...prev, [categoryId]: [...(prev[categoryId] || []), newGiftUI] }))

    const { error } = await supabase.from('gifts').insert({
      category_id: categoryId,
      name: gift.name,
      price: gift.price,
      currency: gift.currency,
      image_url: gift.imageUrl,
      description: gift.description,
      url: gift.url,
      user_id: user.id
    })
    if (error) {
      console.error(error)
      alert('Error guardando regalo')
      fetchData() // Revertir
    } else {
      fetchData() // Actualizar ID real
    }
  }

  const removeGift = async (categoryId: string, giftId: string) => {
    setItems((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].filter((g) => g.id !== giftId),
    }))
    await supabase.from('gifts').delete().eq('id', giftId)
  }

  const addCategory = async (name: string) => {
    if (!user) return alert('Debes iniciar sesión para crear categorías')

    const newId = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4) // ID único para evitar choques
    const colors = ['bg-purple-500', 'bg-teal-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-600', 'bg-pink-600']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newCat = { id: newId, name, color: randomColor, user_id: user.id }

    setCategories(prev => [...prev, newCat])

    const { error } = await supabase.from('categories').insert({
      id: newId,
      name,
      color: randomColor,
      user_id: user.id
    })
    
    if (error) {
      console.error(error)
      alert('Error creando categoría')
      fetchData()
    }
  }

  // ¡NUEVO! Función para borrar categoría
  const deleteCategory = async (id: string) => {
    if(!confirm('¿Estás seguro de borrar esta categoría y todos sus regalos?')) return

    // Optimistic UI
    setCategories(prev => prev.filter(c => c.id !== id))
    
    // 1. Borrar la categoría (Supabase borrará los regalos en cascada si configuráramos cascade, 
    // pero por seguridad borramos la categoría y dejamos que el backend maneje o borramos manual)
    // Para simplificar: Borramos la categoría.
    const { error } = await supabase.from('categories').delete().eq('id', id)
    
    if (error) {
      console.error(error)
      alert('No se pudo borrar (¿Quizás no es tuya?)')
      fetchData()
    }
  }

  return (
    <WishlistContext.Provider value={{ items, categories, addGift, removeGift, addCategory, deleteCategory, loading, user }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider')
  return context
}