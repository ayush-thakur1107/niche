import { NextResponse } from 'next/server';
import { getAllConnections, createConnection } from '@/lib/storage';

export async function GET() {
  try {
    const connections = getAllConnections();
    return NextResponse.json(connections);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.sourceNodeId || !body.targetNodeId) {
      return NextResponse.json({ error: 'sourceNodeId and targetNodeId are required' }, { status: 400 });
    }

    const newConnection = createConnection({
      sourceNodeId: body.sourceNodeId,
      targetNodeId: body.targetNodeId,
      relationshipType: body.relationshipType || 'related_to',
      label: body.label || body.relationshipType || 'relates to',
      description: body.description || '',
      direction: body.direction || 'directed',
      strength: body.strength || 3,
      personalNotes: body.personalNotes || ''
    });

    return NextResponse.json(newConnection, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
