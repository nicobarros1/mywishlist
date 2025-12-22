import { NextResponse } from 'next/server'
import { analyzeProductUrl } from '../../actions/analyzeProductUrl'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ success: false, error: 'URL missing' }, { status: 400 })

    const result = await analyzeProductUrl(url)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
