import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title')?.trim();
    const year = searchParams.get('year')?.trim();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Try variants: "Title", "Title (film)", "Title (YEAR film)"
    const candidates = [
      title,
      `${title} (film)`,
      year ? `${title} (${year} film)` : null,
      `${title} (movie)`
    ].filter(Boolean) as string[];

    let synopsis = '';
    let description = '';
    let wikiUrl = '';
    let image = '';

    for (const cand of candidates) {
      try {
        const clean = encodeURIComponent(cand.replace(/\s+/g, '_'));
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${clean}`, {
          headers: { 'User-Agent': 'NicheApp/1.0 (https://ayushthakur.space)' }
        });
        if (res.ok) {
          const data = await res.json();
          // Verify it's not a disambiguation page or unrelated
          if (data.type !== 'disambiguation') {
            synopsis = data.extract || '';
            description = data.description || '';
            wikiUrl = data.content_urls?.desktop?.page || '';
            image = data.thumbnail?.source || '';
            break;
          }
        }
      } catch {}
    }

    return NextResponse.json({
      title,
      synopsis,
      description,
      wikiUrl,
      image
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
