import type { User } from '@supabase/supabase-js'

export type Gift = {
  id: string
  category_id: string
  name: string
  price: number
  currency: string
  imageUrl: string
  description?: string
  url: string
  user_id?: string
  reserved?: boolean
}

export type GiftInput = {
  name: string
  price: number
  currency: string
  imageUrl: string
  description?: string
  url: string
}

export type Category = {
  id: string
  name: string
  color: string
  description?: string
  user_id?: string
}

export type { User }
