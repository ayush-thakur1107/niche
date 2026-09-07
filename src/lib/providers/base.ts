export interface ExternalContextResult {
  provider: string;
  title: string;
  extract: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  coordinates?: { lat: number; lon: number };
  facts?: Record<string, string>;
  relatedTopics?: string[];
  fetchedAt: string;
}

export interface KnowledgeProvider {
  name: string;
  search(query: string): Promise<{ title: string; snippet?: string }[]>;
  fetchContext(queryOrTitle: string): Promise<ExternalContextResult | null>;
}
