import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Invoice Meta'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            fontFamily: 'Inter, Arial, sans-serif',
            color: 'white',
            lineHeight: 1.2,
            padding: '0 80px',
            textAlign: 'center',
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 24, color: 'rgba(255,255,255,0.85)', fontSize: 24 }}>
          Invoice Meta
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}


