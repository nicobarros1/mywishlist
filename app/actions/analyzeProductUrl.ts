'use server'

import OpenAI from 'openai'

export async function analyzeProductUrl(url: string) {
  console.log('--- 1. Iniciando análisis de URL:', url)
  
  try {
    // DISFRAZ DE NAVEGADOR (Stealth Headers)
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
      'Referer': 'https://www.google.com/', // Fingimos venir de Google
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    }

    const res = await fetch(url, { headers })
    
    if (!res.ok) {
      // Si falla (ej: 403), lanzamos error para manejarlo en el frontend
      throw new Error(`El sitio bloqueó el acceso (Error ${res.status}). Intenta ingresar los datos manualmente.`)
    }

    const html = await res.text()
    // Truncamos a 25k caracteres para dar más contexto a la IA sin gastar tanto
    const truncated = html.slice(0, 25000) 
    console.log('--- 2. HTML descargado (longitud):', html.length)

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Falta la API KEY de OpenAI en .env.local")
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Modelo rápido y económico
      messages: [
        {
          role: "system",
          content: "Eres un asistente experto en scraping. Extrae datos de productos de e-commerce en JSON. Si no encuentras un dato, usa valores por defecto (price: 0)."
        },
        {
          role: "user",
          content: `Analiza este HTML y extrae un JSON válido con:
          { 
            "name": "Nombre exacto del producto", 
            "price": 9990 (solo el número, limpia puntos/comas), 
            "currency": "CLP" (o la que corresponda), 
            "imageUrl": "URL de la imagen principal (busca en meta og:image o img tags)", 
            "description": "Breve descripción" 
          }.
          
          HTML: ${truncated}`
        }
      ],
      // @ts-ignore
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content
    console.log('--- 3. Respuesta de IA:', content)

    if (!content) throw new Error("La IA no devolvió datos")

    const parsed = JSON.parse(content)
    return { success: true, data: parsed }

  } catch (err: any) {
    console.error('--- ERROR CONTROLADO:', err.message)
    // Devolvemos success: false para que el frontend le diga al usuario que llene a mano
    return { success: false, error: err.message }
  }
}