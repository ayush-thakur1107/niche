export type NodeType =
  | 'PERSON'
  | 'PLACE'
  | 'EVENT'
  | 'ERA'
  | 'CIVILIZATION'
  | 'EMPIRE'
  | 'CONCEPT'
  | 'IDEA'
  | 'THEORY'
  | 'BOOK'
  | 'MOVIE'
  | 'SONG'
  | 'ALBUM'
  | 'ARTIST'
  | 'GAME'
  | 'SPORT'
  | 'SKILL'
  | 'PROJECT'
  | 'CRAFT'
  | 'ARCHITECTURE'
  | 'WORD'
  | 'PHILOSOPHY'
  | 'QUOTE'
  | 'CUSTOM';

export const CREATIVE_WORK_TYPES: NodeType[] = [
  'MOVIE',
  'BOOK',
  'SONG',
  'ALBUM',
  'ARTIST'
];

export function isCreativeWork(type?: string | null): boolean {
  if (!type) return false;
  return CREATIVE_WORK_TYPES.includes(type.toUpperCase() as NodeType);
}

export type UncertaintyLevel =
  | 'known'
  | 'partially_understood'
  | 'confused'
  | 'need_research'
  | 'question'
  | 'unverified';

export type LearningState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const LEARNING_STATE_LABELS: Record<LearningState, string> = {
  0: 'Never encountered',
  1: 'Recognize',
  2: 'Understand',
  3: 'Can explain',
  4: 'Can discuss',
  5: 'Can participate',
  6: 'Competent',
  7: 'Deep expertise'
};

export type CulturalFluency =
  | 'heard_of'
  | 'recognize'
  | 'understand'
  | 'explain'
  | 'discuss'
  | 'participate'
  | 'competent'
  | 'deep_interest';

export type SectionType =
  | 'USER_KNOWLEDGE'
  | 'USER_OPINION'
  | 'USER_QUESTION'
  | 'USER_CONNECTION'
  | 'EXTERNAL_CONTEXT';

export type RelationshipType =
  | 'influenced'
  | 'inspired'
  | 'preceded'
  | 'followed'
  | 'caused'
  | 'part_of'
  | 'related_to'
  | 'studied_with'
  | 'created_by'
  | 'located_in'
  | 'developed_from'
  | 'contradicts'
  | 'similar_to'
  | 'reminds_me_of'
  | 'want_to_learn'
  | 'connected_because'
  | 'custom';

export interface NodeItem {
  id: string;
  slug: string;
  title: string;
  type: NodeType;
  summary: string;
  coverImage?: string;
  status?: string;
  uncertaintyLevel: UncertaintyLevel;
  learningState: LearningState;
  culturalFluency?: CulturalFluency;
  whyCare?: string;
  curiosityTrail?: string;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NodeContent {
  id: string;
  nodeId: string;
  sectionType: SectionType;
  contentMarkdown: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionItem {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: RelationshipType;
  label: string;
  description?: string;
  direction: 'directed' | 'undirected';
  strength?: number; // 1-5
  personalNotes?: string;
  createdAt: string;
}

export interface SourceItem {
  id: string;
  nodeId: string;
  provider: string;
  title: string;
  url: string;
  author?: string;
  publishedDate?: string;
  summary?: string;
  fetchedAt: string;
  rawPayload?: any;
}

export interface InboxItem {
  id: string;
  content: string;
  category?: string;
  status: 'pending' | 'processed' | 'archived';
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface NodePosition {
  nodeId: string;
  x: number;
  y: number;
  pinned?: boolean;
  color?: string;
}

export interface GraphPayload {
  nodes: (NodeItem & { position: { x: number; y: number } })[];
  connections: ConnectionItem[];
}
