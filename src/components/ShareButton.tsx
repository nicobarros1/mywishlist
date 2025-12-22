'use client'
import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

export default function ShareButton({ url, label = "Compartir" }: { url: string, label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    // Copia la URL completa (dominio + ruta)
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        copied 
          ? 'bg-green-100 text-green-700' 
          : 'bg-white/90 text-gray-700 hover:bg-gray-100 border shadow-sm'
      }`}
    >
      {copied ? <Check size={16} /> : <Link2 size={16} />}
      {copied ? '¡Copiado!' : label}
    </button>
  )
}