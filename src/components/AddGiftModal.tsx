import React, { useState } from 'react'
import { analyzeProductUrl } from '../../app/actions/analyzeProductUrl'

interface AddGiftModalProps {
  category: string
  onClose: () => void
  onAdd: (gift: any) => void
}

// 🕵️‍♂️ Lógica de Sherlock Holmes: Adivinar nombre desde la URL si la IA falla
const guessNameFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    // Obtenemos la ruta (ej: /p/zapatillas-running-nike)
    const path = urlObj.pathname
    // Dividimos por barras y filtramos segmentos muy cortos (ids, 'p', 'com', etc)
    const segments = path.split('/').filter(s => s.length > 2)
    
    // Normalmente el segmento más largo es el nombre del producto
    const candidate = segments.sort((a, b) => b.length - a.length)[0]
    
    if (candidate) {
      // Reemplazamos guiones por espacios y quitamos extensiones .html
      const cleanName = candidate.replace(/[-_]/g, ' ').replace(/\.html?/g, '')
      // Capitalizamos la primera letra
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
    }
    return ''
  } catch (e) {
    return ''
  }
}

export default function AddGiftModal({ category, onClose, onAdd }: AddGiftModalProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Estado del formulario manual
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'CLP',
    imageUrl: '',
    description: ''
  })

  // Paso 1: Intentar analizar la URL con IA
  const handleAnalyze = async () => {
    if (!url) return
    setLoading(true)
    setError('')

    try {
      const result = await analyzeProductUrl(url)
      
      if (result.success && result.data) {
        // ESCENARIO IDEAL: La IA funcionó
        setFormData({
          name: result.data.name || guessNameFromUrl(url), // Si la IA devuelve nombre vacío, usamos la URL
          price: result.data.price?.toString() || '',
          currency: result.data.currency || 'CLP',
          imageUrl: result.data.imageUrl || '',
          description: result.data.description || ''
        })
      } else {
        // ESCENARIO BLOQUEO: La IA falló (ej: Decathlon), usamos Sherlock Holmes
        const guessedName = guessNameFromUrl(url)
        setFormData(prev => ({ ...prev, name: guessedName }))
        setError('El sitio bloqueó el análisis automático, pero intentamos adivinar el nombre. Por favor completa el precio e imagen.')
      }
    } catch (err) {
      // ESCENARIO ERROR DE RED
      const guessedName = guessNameFromUrl(url)
      setFormData(prev => ({ ...prev, name: guessedName }))
      setError('Error de conexión. Completa los datos manualmente.')
    } finally {
      setLoading(false)
    }
  }

  // Paso 2: Guardar el regalo final
  const handleSave = () => {
    if (!formData.name || !formData.price) {
      alert('Por favor ingresa al menos un nombre y precio')
      return
    }

    const newGift = {
      id: Date.now().toString(),
      url: url, // Mantenemos el link original para comprar!
      ...formData,
      price: Number(formData.price) // Aseguramos que sea número
    }

    onAdd(newGift)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Agregar Regalo a {category}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Input de URL (La clave de todo) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link del producto</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="https://..." 
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button 
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Analizando...' : 'Auto-rellenar'}
              </button>
            </div>
            {error && <p className="text-amber-600 text-xs mt-1">⚠️ {error}</p>}
          </div>

          <hr className="border-gray-100" />

          {/* Formulario Manual (Editable) */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Nombre del Producto</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2 mt-1"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Precio</label>
                <input 
                  type="number" 
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Moneda</label>
                <select 
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                >
                  <option value="CLP">CLP ($)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">URL de Imagen</label>
              <input 
                type="text" 
                placeholder="Pega aquí el link de una imagen (clic derecho -> copiar dirección de imagen)"
                className="w-full border rounded px-3 py-2 mt-1 text-sm text-gray-600"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
              {/* Previsualización de imagen */}
              {formData.imageUrl && (
                <div className="mt-2 h-32 w-full bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                   <img src={formData.imageUrl} alt="Preview" className="h-full object-contain" />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium shadow-sm"
          >
            Guardar Regalo
          </button>
        </div>
      </div>
    </div>
  )
}