import { NextResponse } from 'next/server';
import { fetchExternalContext } from '@/lib/providers';
import { addSource, upsertNodeContent, getNodeById } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query || body.title;
    if (!query) {
      return NextResponse.json({ error: 'Query or title is required' }, { status: 400 });
    }

    const providerName = body.provider || 'wikipedia';
    const result = await fetchExternalContext(query, providerName);

    if (!result) {
      return NextResponse.json(
        { error: `No external context found for "${query}" on ${providerName}` },
        { status: 404 }
      );
    }

    // If nodeId is provided, attach to node as a source and optionally update EXTERNAL_CONTEXT
    if (body.nodeId) {
      const node = getNodeById(body.nodeId);
      if (node) {
        // Add as a verified source
        addSource({
          nodeId: node.id,
          provider: result.provider,
          title: result.title,
          url: result.url,
          summary: result.description || result.extract.substring(0, 150) + '...',
          rawPayload: result
        });

        // Save into EXTERNAL_CONTEXT section (does NOT overwrite personal notes)
        const markdown = `> **Source: [${result.title}](${result.url})** (${result.provider})
${result.description ? `*${result.description}*\n\n` : ''}${result.extract}`;

        upsertNodeContent(node.id, 'EXTERNAL_CONTEXT', markdown);
      }
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
