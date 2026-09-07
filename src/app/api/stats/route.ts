import { NextResponse } from 'next/server';
import { getUniverseStats, getTimelineEvents } from '@/lib/storage';

export async function GET() {
  try {
    const stats = getUniverseStats();
    const events = getTimelineEvents();
    return NextResponse.json({ ...stats, events });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
