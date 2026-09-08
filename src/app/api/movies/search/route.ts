import { NextResponse } from 'next/server';

export interface MovieSearchResult {
  id: string;
  title: string;
  year?: number;
  stars?: string;
  poster?: string;
  type?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // 1. Try IMDb official suggestion API
    // Format: https://v2.sg.media-imdb.com/suggestion/{first_char}/{query}.json
    const cleanQuery = query
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    const firstChar = cleanQuery.charAt(0) || 'a';
    const imdbUrl = `https://v2.sg.media-imdb.com/suggestion/${firstChar}/${cleanQuery}.json`;

    let results: MovieSearchResult[] = [];

    try {
      const res = await fetch(imdbUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'application/json'
        },
        next: { revalidate: 3600 }
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.d)) {
          // Filter for movies / features / TV
          results = data.d
            .filter((item: any) => {
              const qid = item.qid?.toLowerCase() || '';
              const q = item.q?.toLowerCase() || '';
              return (
                qid === 'movie' ||
                qid === 'tvseries' ||
                qid === 'tvepisode' ||
                qid === 'short' ||
                q.includes('feature') ||
                q.includes('movie') ||
                item.i?.imageUrl
              );
            })
            .slice(0, 10)
            .map((item: any) => ({
              id: item.id,
              title: item.l,
              year: item.y,
              stars: item.s || '',
              poster: item.i?.imageUrl || '',
              type: item.qid || item.q || 'movie'
            }));
        }
      }
    } catch (imdbErr) {
      console.error('IMDb search fetch error:', imdbErr);
    }

    // 2. If no results or poster missing, try Wikipedia search fallback
    if (results.length === 0) {
      try {
        const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
          query + ' film'
        )}&limit=5&format=json`;

        const wikiRes = await fetch(wikiSearchUrl, {
          headers: { 'User-Agent': 'NicheApp/1.0 (https://ayushthakur.space)' }
        });

        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          const titles: string[] = wikiData[1] || [];

          for (const title of titles.slice(0, 3)) {
            try {
              const cleanTitle = encodeURIComponent(title.replace(/\s+/g, '_'));
              const sumRes = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanTitle}`,
                { headers: { 'User-Agent': 'NicheApp/1.0' } }
              );
              if (sumRes.ok) {
                const sumData = await sumRes.json();
                results.push({
                  id: `wiki-${cleanTitle}`,
                  title: sumData.title.replace(/\s*\([^)]*film[^)]*\)/i, ''),
                  year: sumData.description?.match(/\b(19\d{2}|20\d{2})\b/)?.[1]
                    ? parseInt(sumData.description.match(/\b(19\d{2}|20\d{2})\b/)![1], 10)
                    : undefined,
                  stars: sumData.description || '',
                  poster: sumData.thumbnail?.source || '',
                  type: 'movie'
                });
              }
            } catch {}
          }
        }
      } catch (wikiErr) {
        console.error('Wikipedia fallback error:', wikiErr);
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
