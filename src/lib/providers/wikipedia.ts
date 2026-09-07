import { KnowledgeProvider, ExternalContextResult } from './base';

export class WikipediaProvider implements KnowledgeProvider {
  name = 'Wikipedia';

  async search(query: string): Promise<{ title: string; snippet?: string }[]> {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=6&namespace=0&format=json`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'NicheMaxingApp/1.0 (https://niche.ayushthakur.space; contact@ayushthakur.space)' }
      });
      if (!res.ok) return [];
      const data = await res.json();
      // data format: [query, [titles], [descriptions], [urls]]
      const titles: string[] = data[1] || [];
      const descriptions: string[] = data[2] || [];
      return titles.map((title, i) => ({
        title,
        snippet: descriptions[i] || undefined
      }));
    } catch (err) {
      console.error('Wikipedia search error:', err);
      return [];
    }
  }

  async fetchContext(queryOrTitle: string): Promise<ExternalContextResult | null> {
    try {
      const cleanTitle = encodeURIComponent(queryOrTitle.trim().replace(/\s+/g, '_'));
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanTitle}`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'NicheMaxingApp/1.0 (https://niche.ayushthakur.space)' }
      });

      if (!res.ok) {
        // Try search fallback
        const matches = await this.search(queryOrTitle);
        if (matches.length > 0 && matches[0].title !== queryOrTitle) {
          return this.fetchContext(matches[0].title);
        }
        return null;
      }

      const data = await res.json();

      return {
        provider: 'Wikipedia',
        title: data.title || queryOrTitle,
        extract: data.extract || data.description || 'No extract available.',
        description: data.description,
        url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${cleanTitle}`,
        thumbnailUrl: data.thumbnail?.source,
        coordinates: data.coordinates ? { lat: data.coordinates.lat, lon: data.coordinates.lon } : undefined,
        fetchedAt: new Date().toISOString()
      };
    } catch (err) {
      console.error('Wikipedia fetch error:', err);
      return null;
    }
  }
}
