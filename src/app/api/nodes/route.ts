import { NextResponse } from 'next/server';
import { getAllNodes, createNode } from '@/lib/storage';

export async function GET() {
  try {
    const nodes = getAllNodes();
    return NextResponse.json(nodes);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newNode = createNode({
      title: body.title,
      type: body.type || 'CONCEPT',
      summary: body.summary || '',
      coverImage: body.coverImage || '',
      status: body.status || 'draft',
      uncertaintyLevel: body.uncertaintyLevel || 'partially_understood',
      learningState: body.learningState ?? 1,
      culturalFluency: body.culturalFluency,
      whyCare: body.whyCare || '',
      curiosityTrail: body.curiosityTrail || '',
      tags: Array.isArray(body.tags) ? body.tags : [],
      metadata: body.metadata || {}
    });

    return NextResponse.json(newNode, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
