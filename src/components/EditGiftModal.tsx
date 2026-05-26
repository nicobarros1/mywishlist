import React, { useState } from 'react'
import type { Gift, GiftInput } from '../types/wishlist'

interface EditGiftModalProps {
  gift: Gift
  onClose: () => void
  onSave: (updates: Partial<GiftInput>) => void
}

export default function EditGiftModal({ gift, onClose, onSave }: EditGiftModalProps) {
  const [formData, setFormData] = useState({
    name: gift.name,
    price: gift.price.toString(),
    currency: gift.currency,
    imageUrl: gift.imageUrl || '',
    description: gift.description || '',
  })

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      alert('Por favor ingresa al menos un nombre y precio')
      return
    }
    onSave({
      name: formData.name,
      price: Number(formData.price),
      currency: formData.currency,
      imageUrl: formData.imageUrl,
      description: formData.description,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Editar Regalo</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 space-y-4">

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Nombre del Producto</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Precio y moneda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Precio</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Moneda</label>
              <select
                className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="CLP">CLP ($)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* URL de imagen */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">URL de Imagen</label>
            <input
              type="text"
              placeholder="https://..."
              className="w-full border rounded px-3 py-2 mt-1 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            {formData.imageUrl && (
              <div className="mt-2 h-32 w-full bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                <img src={formData.imageUrl} alt="Preview" className="h-full object-contain" />
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Descripción (opcional)</label>
            <textarea
              rows={2}
              placeholder="Agrega una nota..."
              className="w-full border rounded px-3 py-2 mt-1 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

        </div>

        {/* Footer */}
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
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  )
}
