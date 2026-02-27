import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  let query = supabase
    .from('quotes')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'all') {
    query = query.eq('category_id', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, author, category_id } = body;

  if (!text || !author || !category_id) {
    return NextResponse.json(
      { error: 'text, author, and category_id are required' },
      { status: 400 }
    );
  }

  if (text.length > 500) {
    return NextResponse.json(
      { error: 'Quote text must be 500 characters or less' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('quotes')
    .insert({ text, author, category_id })
    .select('*, categories(*)')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
