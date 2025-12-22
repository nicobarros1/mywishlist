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
  user_id?: string
}

type Category = {
  id: string
  name: string
  color: string
  description?: string
  user_id?: string
}

// AQUÍ ESTABA EL ERROR: Faltaba declarar updateCategory en la interfaz
interface WishlistContextType {
  items: Record<string, Gift[]>
  categories: Category[]
  addGift: (categoryId: string, gift: any) => Promise<void>
  removeGift: (categoryId: string, giftId: string) => Promise<void>
  addCategory: (name: string) => Promise<void>
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void> // <--- ESTA ES LA LÍNEA CLAVE
  deleteCategory: (id: string) => Promise<void>
  loading: boolean
  user: any
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, Gift[]>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const currentUser = session?.user || null
    setUser(currentUser)

    try {
      const { data: catsData } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
      if (catsData) setCategories(catsData)

      const { data: giftsData } = await supabase.from('gifts').select('*')
      if (giftsData) {
        const grouped: Record<string, Gift[]> = {}
        giftsData.forEach((g: any) => {
          // Mapeamos image_url (base de datos) a imageUrl (frontend)
          const formattedGift: Gift = { ...g, imageUrl: g.image_url }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if(_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') fetchData()
    })
    return () => subscription.unsubscribe()
  }, [])

  const addGift = async (categoryId: string, gift: any) => {
    if (!user) return alert('Debes iniciar sesión')
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
    if (!error) fetchData()
  }

  const removeGift = async (categoryId: string, giftId: string) => {
    setItems((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].filter((g) => g.id !== giftId),
    }))
    await supabase.from('gifts').delete().eq('id', giftId)
  }

  const addCategory = async (name: string) => {
    if (!user) return alert('Debes iniciar sesión')
    const newId = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4)
    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500', 'bg-cyan-500', 'bg-gray-800']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    
    const newCat = { id: newId, name, color: randomColor, user_id: user.id }
    setCategories(prev => [...prev, newCat])

    const { error } = await supabase.from('categories').insert(newCat)
    if (error) fetchData()
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    // Optimistic Update
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))

    const { error } = await supabase.from('categories').update(updates).eq('id', id)
    if (error) {
      console.error(error)
      alert('Error al actualizar')
      fetchData()
    }
  }

  const deleteCategory = async (id: string) => {
    if(!confirm('¿Estás seguro de borrar esta categoría y todos sus regalos?')) return
    setCategories(prev => prev.filter(c => c.id !== id))
    await supabase.from('categories').delete().eq('id', id)
  }

  return (
    // IMPORTANTE: Aquí pasamos updateCategory al Provider
    <WishlistContext.Provider value={{ items, categories, addGift, removeGift, addCategory, updateCategory, deleteCategory, loading, user }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider')
  return context
}