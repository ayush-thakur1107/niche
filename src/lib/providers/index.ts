import { KnowledgeProvider, ExternalContextResult } from './base';
import { WikipediaProvider } from './wikipedia';

export * from './base';
export * from './wikipedia';

const providers: Record<string, KnowledgeProvider> = {
  wikipedia: new WikipediaProvider(),
};

export function getProvider(name: string = 'wikipedia'): KnowledgeProvider | undefined {
  return providers[name.toLowerCase()] || providers['wikipedia'];
}

export async function fetchExternalContext(
  query: string,
  providerName: string = 'wikipedia'
): Promise<ExternalContextResult | null> {
  const provider = getProvider(providerName);
  if (!provider) return null;
  return provider.fetchContext(query);
}
