import { NextResponse } from 'next/server';
import { getTimelineEvents, addTimelineEvent } from '@/lib/storage';

export async function GET() {
  try {
    const events = getTimelineEvents();
    return NextResponse.json(events);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
    }

    const newEvent = addTimelineEvent({
      title: body.title,
      date: body.date,
      description: body.description || '',
      entityType: body.entityType || 'EXTERNAL',
      entityId: body.entityId || '',
      tags: Array.isArray(body.tags) ? body.tags : []
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
