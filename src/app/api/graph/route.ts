import { NextResponse } from 'next/server';
import { getGraphPayload, updateNodePositions } from '@/lib/storage';

export async function GET() {
  try {
    const payload = getGraphPayload();
    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body.positions)) {
      updateNodePositions(body.positions);
      return NextResponse.json({ success: true, count: body.positions.length });
    }
    return NextResponse.json({ error: 'positions array is required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
