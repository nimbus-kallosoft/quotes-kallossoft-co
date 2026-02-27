import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, categories(*)')
    .eq('id', id)
    .single();

  if (!quote) {
    return new Response('Quote not found', { status: 404 });
  }

  const category = quote.categories;
  const colorFrom = category?.color_from || '#8B5CF6';
  const colorTo = category?.color_to || '#3B82F6';
  const emoji = category?.emoji || '✨';
  const categoryName = category?.name || 'Quote';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colorFrom}22 0%, #0a0a1a 50%, ${colorTo}22 100%)`,
          backgroundColor: '#0a0a1a',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: `radial-gradient(ellipse, ${colorFrom}33 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        {/* Category badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: `linear-gradient(135deg, ${colorFrom}44, ${colorTo}44)`,
            border: `1px solid ${colorFrom}66`,
            borderRadius: '100px',
            padding: '8px 20px',
            marginBottom: '40px',
          }}
        >
          <span style={{ fontSize: '20px' }}>{emoji}</span>
          <span
            style={{
              color: '#e2e8f0',
              fontSize: '16px',
              fontFamily: 'sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {categoryName}
          </span>
        </div>

        {/* Quote marks */}
        <div
          style={{
            fontSize: '120px',
            color: colorFrom,
            lineHeight: '0.5',
            marginBottom: '20px',
            fontFamily: 'serif',
            opacity: 0.4,
            display: 'flex',
          }}
        >
          &ldquo;
        </div>

        {/* Quote text */}
        <div
          style={{
            color: '#f1f5f9',
            fontSize: quote.text.length > 150 ? '28px' : '36px',
            fontFamily: 'serif',
            textAlign: 'center',
            lineHeight: '1.5',
            maxWidth: '900px',
            zIndex: 1,
            display: 'flex',
          }}
        >
          {quote.text}
        </div>

        {/* Author */}
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '2px',
              background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
              display: 'flex',
            }}
          />
          <span
            style={{
              color: '#94a3b8',
              fontSize: '20px',
              fontFamily: 'sans-serif',
            }}
          >
            {quote.author}
          </span>
          <div
            style={{
              width: '40px',
              height: '2px',
              background: `linear-gradient(90deg, ${colorTo}, ${colorFrom})`,
              display: 'flex',
            }}
          />
        </div>

        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              color: '#475569',
              fontSize: '14px',
              fontFamily: 'sans-serif',
            }}
          >
            quotes.kallossoft.co
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
