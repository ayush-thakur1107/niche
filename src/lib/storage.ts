import fs from 'fs';
import path from 'path';
import {
  NodeItem,
  NodeContent,
  ConnectionItem,
  SourceItem,
  InboxItem,
  TimelineEvent,
  NodePosition,
  GraphPayload,
  SectionType
} from './types';
import { getSeedDatabase } from './seed';

interface DatabaseSchema {
  nodes: NodeItem[];
  contents: NodeContent[];
  connections: ConnectionItem[];
  positions: Record<string, { x: number; y: number; pinned?: boolean; color?: string }>;
  sources: SourceItem[];
  inbox: InboxItem[];
  events: TimelineEvent[];
  initialized?: boolean;
}

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', '.data')
  : path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'universe.json');

let inMemoryDb: DatabaseSchema | null = null;

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function getInitialDatabase(): DatabaseSchema {
  return {
    nodes: [],
    contents: [],
    connections: [],
    positions: {},
    sources: [],
    inbox: [],
    events: [],
    initialized: true
  };
}

export function readDatabase(): DatabaseSchema {
  try {
    if (inMemoryDb) return inMemoryDb;
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      writeDatabase(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const result: DatabaseSchema = {
      nodes: parsed.nodes || [],
      contents: parsed.contents || [],
      connections: parsed.connections || [],
      positions: parsed.positions || {},
      sources: parsed.sources || [],
      inbox: parsed.inbox || [],
      events: parsed.events || [],
      initialized: parsed.initialized ?? true
    };
    inMemoryDb = result;
    return result;
  } catch (error) {
    if (inMemoryDb) return inMemoryDb;
    console.error('Failed to read universe database:', error);
    return getInitialDatabase();
  }
}

export function clearAllNodesAndConnections(): void {
  const cleared: DatabaseSchema = {
    nodes: [],
    contents: [],
    connections: [],
    positions: {},
    sources: [],
    inbox: [],
    events: [],
    initialized: true
  };
  writeDatabase(cleared);
}

export function restoreSeedDatabase(): void {
  const seed: DatabaseSchema = { ...getSeedDatabase(), initialized: true };
  writeDatabase(seed);
}

export function writeDatabase(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    ensureDirectoryExistence(DB_FILE);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Filesystem write notice (using in-memory cache):', error);
  }
}

// === NODES ===

export function getAllNodes(): NodeItem[] {
  const db = readDatabase();
  return db.nodes;
}

export function getNodeById(idOrSlug: string): NodeItem | undefined {
  const db = readDatabase();
  return db.nodes.find(n => n.id === idOrSlug || n.slug === idOrSlug);
}

export function createNode(node: Omit<NodeItem, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { id?: string; slug?: string }): NodeItem {
  const db = readDatabase();
  const now = new Date().toISOString();
  const id = node.id || `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const slug = node.slug || node.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newNode: NodeItem = {
    ...node,
    id,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  db.nodes.push(newNode);

  // Auto assign an initial position if not already placed
  if (!db.positions[id]) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 100 + Math.random() * 400;
    db.positions[id] = {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }

  // Log creation event
  db.events.unshift({
    id: `ev_${Date.now()}`,
    eventType: 'NODE_CREATED',
    entityType: 'NODE',
    entityId: id,
    title: `Discovered node: ${node.title}`,
    description: `Added new ${node.type} to universe.`,
    createdAt: now
  });

  writeDatabase(db);
  return newNode;
}

export function updateNode(id: string, updates: Partial<NodeItem>): NodeItem | undefined {
  const db = readDatabase();
  const index = db.nodes.findIndex(n => n.id === id || n.slug === id);
  if (index === -1) return undefined;

  const now = new Date().toISOString();
  const current = db.nodes[index];
  const updated: NodeItem = {
    ...current,
    ...updates,
    updatedAt: now
  };

  db.nodes[index] = updated;

  // Log update if significant
  if (updates.learningState !== undefined && updates.learningState !== current.learningState) {
    db.events.unshift({
      id: `ev_${Date.now()}`,
      eventType: 'LEARNING_PROGRESSED',
      entityType: 'NODE',
      entityId: id,
      title: `Competence advanced in ${current.title}`,
      description: `Learning state evolved from level ${current.learningState} to ${updates.learningState}.`,
      createdAt: now
    });
  }

  writeDatabase(db);
  return updated;
}

export function deleteNode(id: string): boolean {
  const db = readDatabase();
  const initialLength = db.nodes.length;
  db.nodes = db.nodes.filter(n => n.id !== id);
  if (db.nodes.length === initialLength) return false;

  // Delete connections
  db.connections = db.connections.filter(c => c.sourceNodeId !== id && c.targetNodeId !== id);
  // Delete contents
  db.contents = db.contents.filter(c => c.nodeId !== id);
  // Delete position
  delete db.positions[id];
  // Delete sources
  db.sources = db.sources.filter(s => s.nodeId !== id);

  writeDatabase(db);
  return true;
}

// === NODE CONTENTS (PERSONAL VS EXTERNAL) ===

export function getNodeContents(nodeId: string): NodeContent[] {
  const db = readDatabase();
  return db.contents.filter(c => c.nodeId === nodeId);
}

export function upsertNodeContent(
  nodeId: string,
  sectionType: SectionType,
  contentMarkdown: string
): NodeContent {
  const db = readDatabase();
  const now = new Date().toISOString();
  const existingIndex = db.contents.findIndex(
    c => c.nodeId === nodeId && c.sectionType === sectionType
  );

  if (existingIndex >= 0) {
    const existing = db.contents[existingIndex];
    const updated: NodeContent = {
      ...existing,
      contentMarkdown,
      version: existing.version + 1,
      updatedAt: now
    };
    db.contents[existingIndex] = updated;
    writeDatabase(db);
    return updated;
  } else {
    const newContent: NodeContent = {
      id: `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nodeId,
      sectionType,
      contentMarkdown,
      version: 1,
      createdAt: now,
      updatedAt: now
    };
    db.contents.push(newContent);
    writeDatabase(db);
    return newContent;
  }
}

// === CONNECTIONS ===

export function getAllConnections(): ConnectionItem[] {
  const db = readDatabase();
  return db.connections;
}

export function getConnectionsForNode(nodeId: string): {
  outbound: ConnectionItem[];
  inbound: ConnectionItem[];
} {
  const db = readDatabase();
  return {
    outbound: db.connections.filter(c => c.sourceNodeId === nodeId),
    inbound: db.connections.filter(c => c.targetNodeId === nodeId)
  };
}

export function createConnection(
  conn: Omit<ConnectionItem, 'id' | 'createdAt'>
): ConnectionItem {
  const db = readDatabase();
  const now = new Date().toISOString();
  const id = `conn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newConn: ConnectionItem = {
    ...conn,
    id,
    createdAt: now
  };

  db.connections.push(newConn);

  const sourceNode = db.nodes.find(n => n.id === conn.sourceNodeId);
  const targetNode = db.nodes.find(n => n.id === conn.targetNodeId);

  db.events.unshift({
    id: `ev_${Date.now()}`,
    eventType: 'CONNECTION_CREATED',
    entityType: 'CONNECTION',
    entityId: id,
    title: `Connected: ${sourceNode?.title || 'Node'} → ${targetNode?.title || 'Node'}`,
    description: `Relationship: ${conn.label || conn.relationshipType}`,
    createdAt: now
  });

  writeDatabase(db);
  return newConn;
}

export function deleteConnection(id: string): boolean {
  const db = readDatabase();
  const initial = db.connections.length;
  db.connections = db.connections.filter(c => c.id !== id);
  if (db.connections.length === initial) return false;
  writeDatabase(db);
  return true;
}

// === POSITIONS & GRAPH PAYLOAD ===

export function getGraphPayload(): GraphPayload {
  const db = readDatabase();
  const positionedNodes = db.nodes.map(node => ({
    ...node,
    position: db.positions[node.id] || { x: 0, y: 0 }
  }));

  return {
    nodes: positionedNodes,
    connections: db.connections
  };
}

export function updateNodePositions(
  positions: { nodeId: string; x: number; y: number }[]
): void {
  const db = readDatabase();
  positions.forEach(p => {
    db.positions[p.nodeId] = {
      ...(db.positions[p.nodeId] || {}),
      x: p.x,
      y: p.y
    };
  });
  writeDatabase(db);
}

// === SOURCES ===

export function getNodeSources(nodeId: string): SourceItem[] {
  const db = readDatabase();
  return db.sources.filter(s => s.nodeId === nodeId);
}

export function addSource(source: Omit<SourceItem, 'id' | 'fetchedAt'>): SourceItem {
  const db = readDatabase();
  const now = new Date().toISOString();
  const newSource: SourceItem = {
    ...source,
    id: `src_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fetchedAt: now
  };
  db.sources.push(newSource);
  writeDatabase(db);
  return newSource;
}

// === INBOX ===

export function getInboxItems(): InboxItem[] {
  const db = readDatabase();
  return db.inbox.filter(i => i.status !== 'archived');
}

export function createInboxItem(content: string, category?: string): InboxItem {
  const db = readDatabase();
  const newItem: InboxItem = {
    id: `inbox_${Date.now()}`,
    content,
    category: category || 'idea',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.inbox.unshift(newItem);
  writeDatabase(db);
  return newItem;
}

export function updateInboxItem(id: string, updates: Partial<InboxItem>): InboxItem | undefined {
  const db = readDatabase();
  const item = db.inbox.find(i => i.id === id);
  if (!item) return undefined;
  Object.assign(item, updates);
  writeDatabase(db);
  return item;
}

export function deleteInboxItem(id: string): boolean {
  const db = readDatabase();
  const initial = db.inbox.length;
  db.inbox = db.inbox.filter(i => i.id !== id);
  if (db.inbox.length === initial) return false;
  writeDatabase(db);
  return true;
}

export function getTimelineEvents(): TimelineEvent[] {
  const db = readDatabase();
  return db.events;
}

export function addTimelineEvent(event: {
  title: string;
  date: string;
  description: string;
  entityType?: 'NODE' | 'EXTERNAL';
  entityId?: string;
  tags?: string[];
}): TimelineEvent {
  const db = readDatabase();
  const newEvent: TimelineEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    eventType: 'MILESTONE',
    title: event.title,
    date: event.date,
    description: event.description,
    entityType: event.entityType || 'EXTERNAL',
    entityId: event.entityId || '',
    tags: event.tags || [],
    createdAt: new Date().toISOString()
  };
  if (!Array.isArray(db.events)) {
    db.events = [];
  }
  db.events.unshift(newEvent);
  writeDatabase(db);
  return newEvent;
}

// === SEARCH ===

export function searchUniverse(query: string): {
  nodes: NodeItem[];
  contents: { nodeTitle: string; nodeId: string; sectionType: string; snippet: string }[];
} {
  const db = readDatabase();
  const q = query.toLowerCase().trim();
  if (!q) return { nodes: [], contents: [] };

  const matchedNodes = db.nodes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.summary.toLowerCase().includes(q) ||
    n.type.toLowerCase().includes(q) ||
    n.tags.some(t => t.toLowerCase().includes(q))
  );

  const matchedContents: { nodeTitle: string; nodeId: string; sectionType: string; snippet: string }[] = [];
  db.contents.forEach(c => {
    const text = c.contentMarkdown.toLowerCase();
    const idx = text.indexOf(q);
    if (idx !== -1) {
      const node = db.nodes.find(n => n.id === c.nodeId);
      const start = Math.max(0, idx - 40);
      const end = Math.min(text.length, idx + q.length + 60);
      matchedContents.push({
        nodeTitle: node?.title || 'Unknown',
        nodeId: c.nodeId,
        sectionType: c.sectionType,
        snippet: (start > 0 ? '...' : '') + c.contentMarkdown.substring(start, end) + (end < text.length ? '...' : '')
      });
    }
  });

  return { nodes: matchedNodes, contents: matchedContents };
}

// === STATS ===

export function getUniverseStats() {
  const db = readDatabase();
  const typeCounts: Record<string, number> = {};
  const learningStates: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };

  db.nodes.forEach(n => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
    learningStates[n.learningState] = (learningStates[n.learningState] || 0) + 1;
  });

  return {
    totalNodes: (db.nodes || []).length,
    totalConnections: (db.connections || []).length,
    totalSources: (db.sources || []).length,
    inboxCount: (db.inbox || []).filter(i => i.status === 'pending').length,
    typeCounts,
    learningStates,
    recentEvents: (db.events || []).slice(0, 10)
  };
}
