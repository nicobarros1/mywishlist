import '../styles/globals.css'
import React from 'react'
import { WishlistProvider } from '../src/context/WishlistContext'
import Header from '../src/components/Header' // <-- Importamos tu nuevo Header

export const metadata = {
  title: 'MyWishlist',
  description: 'Comparte tus listas de regalos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <WishlistProvider>
          {/* Aquí va el Header Inteligente */}
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </WishlistProvider>
      </body>
    </html>
  )
}