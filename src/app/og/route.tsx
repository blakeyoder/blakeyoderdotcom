import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
 
export const runtime = 'edge'
 
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Blake Yoder'
  const subtitle = searchParams.get('subtitle') || 'Head of Engineering at Berry Street'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#f8f8f8',
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontFamily: 'serif',
            fontWeight: 600,
            color: '#1a1a1a',
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            fontFamily: 'serif',
            color: '#666',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}