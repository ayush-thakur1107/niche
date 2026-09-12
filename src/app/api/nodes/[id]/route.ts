import { NextResponse } from 'next/server';
import {
  getNodeById,
  updateNode,
  deleteNode,
  getNodeContents,
  upsertNodeContent,
  getNodeSources,
  getConnectionsForNode,
  getAllNodes
} from '@/lib/storage';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const node = getNodeById(id);
    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    const contents = getNodeContents(node.id);
    const sources = getNodeSources(node.id);
    const rawConnections = getConnectionsForNode(node.id);
    const allNodes = getAllNodes();
    const nodeMap = new Map(allNodes.map(n => [n.id, n]));

    const outbound = rawConnections.outbound.map(c => ({
      ...c,
      targetNode: nodeMap.get(c.targetNodeId)
    }));

    const inbound = rawConnections.inbound.map(c => ({
      ...c,
      sourceNode: nodeMap.get(c.sourceNodeId)
    }));

    return NextResponse.json({
      ...node,
      contents,
      sources,
      connections: {
        outbound,
        inbound
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const node = getNodeById(id);
    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    const body = await request.json();

    // If updating a content section
    if (body.sectionType && body.contentMarkdown !== undefined) {
      const updatedContent = upsertNodeContent(
        node.id,
        body.sectionType,
        body.contentMarkdown
      );
      return NextResponse.json({ message: 'Content updated', content: updatedContent });
    }

    // Otherwise, updating node attributes
    const updated = updateNode(node.id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const node = getNodeById(id);
    const targetId = node ? node.id : id;

    const success = deleteNode(targetId);
    return NextResponse.json({ success: true, id: targetId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
