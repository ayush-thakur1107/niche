'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CustomNode } from './CustomNode';
import { InspectorDrawer } from './InspectorDrawer';
import { ConnectionModal } from './ConnectionModal';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';
import { useInteractionStore } from '@/interaction/store';
import { NodeItem, ConnectionItem } from '@/lib/types';
import {
  Maximize2,
  Sparkles,
  Layers,
  Filter,
  RefreshCw,
  Plus,
  Trash2,
  Music2
} from 'lucide-react';
import styles from './AtlasCanvas.module.css';

const nodeTypes = {
  custom: CustomNode,
};

type MapMode = 'freeform' | 'constellation' | 'clusters';

interface AtlasCanvasProps {
  onOpenCreateNode?: () => void;
}

export function AtlasCanvas({ onOpenCreateNode }: AtlasCanvasProps) {
  const router = useRouter();
  const { setPlayerExpanded } = useInteractionStore();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rawNodes, setRawNodes] = useState<NodeItem[]>([]);
  const [rawConnections, setRawConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Map Mode
  const [mapMode, setMapMode] = useState<MapMode>('freeform');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Selected Node for Inspector
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);

  // Add Node Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Connection Drag-to-Create Modal
  const [pendingConnection, setPendingConnection] = useState<{
    source: { id: string; title: string };
    target: { id: string; title: string };
  } | null>(null);

  // Fetch graph data
  const loadGraph = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/graph');
      const data = await res.json();

      if (data.nodes && data.connections) {
        setRawNodes(data.nodes);
        setRawConnections(data.connections);

        // Count connections per node
        const connCounts: Record<string, number> = {};
        data.connections.forEach((c: ConnectionItem) => {
          connCounts[c.sourceNodeId] = (connCounts[c.sourceNodeId] || 0) + 1;
          connCounts[c.targetNodeId] = (connCounts[c.targetNodeId] || 0) + 1;
        });

        // Convert to React Flow Nodes
        const flowNodes: Node[] = data.nodes.map((n: any) => ({
          id: n.id,
          type: 'custom',
          position: n.position || { x: 0, y: 0 },
          data: {
            ...n,
            connectionCount: connCounts[n.id] || 0
          }
        }));

        // Convert to React Flow Edges with high-contrast monospace matte badges
        const flowEdges: Edge[] = data.connections.map((c: ConnectionItem) => {
          const rawLabel = c.label || c.relationshipType || '';
          const displayLabel = rawLabel.replace(/_/g, ' ').toUpperCase();
          return {
            id: c.id,
            source: c.sourceNodeId,
            target: c.targetNodeId,
            label: displayLabel,
            animated: c.relationshipType === 'caused' || c.relationshipType === 'inspired',
            style: {
              stroke: c.strength && c.strength >= 4 ? '#e2a857' : 'rgba(255, 255, 255, 0.28)',
              strokeWidth: c.strength ? Math.max(1.5, c.strength * 0.75) : 1.5,
            },
            labelStyle: {
              fill: '#f2f2f5',
              fontSize: 9,
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              letterSpacing: '0.12em'
            },
            labelBgStyle: {
              fill: '#08080c',
              fillOpacity: 0.96,
              stroke: 'rgba(255, 255, 255, 0.16)',
              strokeWidth: 1,
              rx: 0,
              ry: 0
            },
            labelBgPadding: [6, 4] as [number, number],
          };
        });

        setNodes(flowNodes);
        setEdges(flowEdges);
      } else {
        setNodes([]);
        setEdges([]);
        setRawNodes([]);
        setRawConnections([]);
      }
    } catch (err) {
      console.error('Failed to load graph:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  useEffect(() => {
    const handleNodeCreated = (e: any) => {
      loadGraph();
      if (e?.detail) {
        setSelectedNode(e.detail);
      }
    };
    window.addEventListener('universe:nodeCreated', handleNodeCreated);
    return () => window.removeEventListener('universe:nodeCreated', handleNodeCreated);
  }, [loadGraph]);

  // Handle Clear Canvas
  const handleClearCanvas = async () => {
    if (window.confirm('Clear all entities and connections from the canvas? You can restore demo nodes anytime.')) {
      try {
        setLoading(true);
        await fetch('/api/graph', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'clear' })
        });
        setNodes([]);
        setEdges([]);
        setRawNodes([]);
        setRawConnections([]);
        setSelectedNode(null);
      } catch (err) {
        console.error('Failed to clear canvas:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Restore Seed Demo
  const handleRestoreSeed = async () => {
    try {
      setLoading(true);
      await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore_seed' })
      });
      await loadGraph();
    } catch (err) {
      console.error('Failed to restore demo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddNode = () => {
    if (onOpenCreateNode) {
      onOpenCreateNode();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  // Nodes & Edges change callbacks
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Drag handle-to-handle connection
  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;
    const sourceNode = rawNodes.find((n) => n.id === params.source);
    const targetNode = rawNodes.find((n) => n.id === params.target);
    if (sourceNode && targetNode) {
      setPendingConnection({
        source: { id: sourceNode.id, title: sourceNode.title },
        target: { id: targetNode.id, title: targetNode.title },
      });
    }
  }, [rawNodes]);

  // Node selection & click
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const found = rawNodes.find((n) => n.id === node.id);
    if (found) setSelectedNode(found);
  }, [rawNodes]);

  // Double click node to navigate to deep detail page
  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    const found = rawNodes.find((n) => n.id === node.id);
    if (found) {
      router.push(`/node/${found.slug || found.id}`);
    }
  }, [rawNodes, router]);

  // Handle node delete from inspector
  const handleDeleteNode = useCallback(async (nodeId: string) => {
    try {
      await fetch(`/api/nodes/${nodeId}`, { method: 'DELETE' });
      setSelectedNode(null);
      loadGraph();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, [loadGraph]);

  // Persist dragged position
  const onNodeDragStop = useCallback((_: any, node: Node) => {
    fetch('/api/graph', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        positions: [{ nodeId: node.id, x: node.position.x, y: node.position.y }]
      })
    }).catch((err) => console.error('Failed to save position:', err));
  }, []);

  // Switch to Constellation mode
  const applyConstellationLayout = () => {
    setMapMode('constellation');
    const radius = 380;
    const center = { x: 450, y: 350 };
    setNodes((currentNodes) =>
      currentNodes.map((n, i) => {
        const angle = (i / currentNodes.length) * 2 * Math.PI;
        return {
          ...n,
          position: {
            x: center.x + radius * Math.cos(angle) + (Math.random() * 80 - 40),
            y: center.y + radius * Math.sin(angle) + (Math.random() * 80 - 40)
          }
        };
      })
    );
  };

  // Switch to Cluster mode
  const applyClusterLayout = () => {
    setMapMode('clusters');
    const typeClusters: Record<string, { x: number; y: number }> = {
      EMPIRE: { x: 100, y: 120 },
      PERSON: { x: 600, y: 120 },
      PHILOSOPHY: { x: 100, y: 580 },
      CONCEPT: { x: 600, y: 580 },
      BOOK: { x: 350, y: 350 }
    };
    const counts: Record<string, number> = {};

    setNodes((currentNodes) =>
      currentNodes.map((n) => {
        const t = String(n.data?.type || 'CONCEPT');
        const base = typeClusters[t] || { x: 350, y: 350 };
        const idx = counts[t] || 0;
        counts[t] = idx + 1;
        const offsetX = (idx % 3) * 160 + (Math.random() * 30 - 15);
        const offsetY = Math.floor(idx / 3) * 130 + (Math.random() * 30 - 15);

        return {
          ...n,
          position: { x: base.x + offsetX, y: base.y + offsetY }
        };
      })
    );
  };

  // Switch to Freeform mode
  const applyFreeformLayout = () => {
    setMapMode('freeform');
    loadGraph();
  };

  // Filtered visible nodes
  const visibleNodes = useMemo(() => {
    if (typeFilter === 'ALL') return nodes;
    return nodes.filter((n) => n.data?.type === typeFilter);
  }, [nodes, typeFilter]);

  // Unique types present
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    rawNodes.forEach((n) => types.add(n.type));
    return Array.from(types);
  }, [rawNodes]);

  return (
    <div className={`${styles.canvasWrapper} ${mapMode === 'constellation' ? styles.constellationBg : ''}`}>
      {/* Railway HUD Toolbar */}
      <div className={styles.hudToolbar}>
        <button
          className={`${styles.hudBtn} ${mapMode === 'freeform' ? styles.hudBtnActive : ''}`}
          onClick={applyFreeformLayout}
        >
          <span>Freeform</span>
        </button>

        <button
          className={`${styles.hudBtn} ${mapMode === 'constellation' ? styles.hudBtnActive : ''}`}
          onClick={applyConstellationLayout}
        >
          <Sparkles size={13} />
          <span>Constellation</span>
        </button>

        <button
          className={`${styles.hudBtn} ${mapMode === 'clusters' ? styles.hudBtnActive : ''}`}
          onClick={applyClusterLayout}
        >
          <Layers size={13} />
          <span>Clusters</span>
        </button>

        <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Filter size={12} color="var(--text-muted)" />
          <select
            className={styles.hudSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types ({rawNodes.length})</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

        {/* Functional Add Node Button */}
        <button
          className={styles.hudBtn}
          onClick={handleOpenAddNode}
          style={{ color: 'var(--accent-gold)', borderColor: 'rgba(226, 168, 87, 0.4)' }}
          title="Add a new entity to this canvas"
        >
          <Plus size={13} />
          <span>Add Node</span>
        </button>

        {/* Clear Canvas Button */}
        <button
          className={styles.hudBtn}
          onClick={handleClearCanvas}
          style={{ color: '#e06c75' }}
          title="Clear all entities and start fresh"
        >
          <Trash2 size={12} />
          <span>Clear</span>
        </button>

        {/* Restore Sample Demo */}
        <button
          className={styles.hudBtn}
          onClick={handleRestoreSeed}
          title="Restore sample demo entities"
        >
          <Sparkles size={12} />
          <span>Demo</span>
        </button>

        {/* Spotify Audio Hub Access */}
        <button
          className={styles.hudBtn}
          onClick={() => setPlayerExpanded(true)}
          style={{ color: '#1ed760', borderColor: 'rgba(29, 185, 84, 0.35)', background: 'rgba(29, 185, 84, 0.1)' }}
          title="Open Spotify Audio Hub"
        >
          <Music2 size={13} color="#1ed760" />
          <span>Spotify</span>
        </button>

        <button className={styles.hudBtn} onClick={loadGraph} title="Reload Universe">
          <RefreshCw size={12} />
        </button>

        <span className={styles.nodeCountTag}>
          {visibleNodes.length} nodes · {edges.length} connections
        </span>
      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <span>Assembling your universe...</span>
        </div>
      )}

      {/* Atmospheric Empty Canvas Prompt */}
      {visibleNodes.length === 0 && !loading && (
        <div className={styles.emptyCanvasPrompt}>
          <div className={styles.emptyBadge}>// ATLAS UNIVERSE · BLANK SLATE</div>
          <h2 className={styles.emptyTitle}>Your Canvas is Clear</h2>
          <p className={styles.emptyText}>
            Your personal digital universe is ready. Double-click anywhere or click below to place your first entity.
          </p>
          <div className={styles.emptyBtnRow}>
            <button
              className={styles.emptyAddBtn}
              onClick={handleOpenAddNode}
            >
              <Plus size={14} />
              <span>Add First Entity</span>
            </button>
            <button
              className={styles.emptyRestoreBtn}
              onClick={handleRestoreSeed}
            >
              <Sparkles size={13} />
              <span>Restore Sample Demo</span>
            </button>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={visibleNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={() => setSelectedNode(null)}
        onDoubleClick={handleOpenAddNode}
        fitView
        minZoom={0.15}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background
          variant={mapMode === 'constellation' ? BackgroundVariant.Dots : BackgroundVariant.Lines}
          gap={mapMode === 'constellation' ? 32 : 40}
          size={mapMode === 'constellation' ? 1.5 : 1}
          color={mapMode === 'constellation' ? 'rgba(226, 168, 87, 0.25)' : 'rgba(255, 255, 255, 0.04)'}
        />
        <Controls position="bottom-left" />
        <MiniMap
          nodeColor="#525360"
          maskColor="rgba(7, 7, 9, 0.88)"
          maskStrokeColor="var(--accent-gold)"
          maskStrokeWidth={1}
          style={{
            background: '#070709',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 0,
            width: 140,
            height: 90
          }}
        />
      </ReactFlow>

      {/* Slide-out Inspector Drawer */}
      <InspectorDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onSelectNode={(id) => {
          const found = rawNodes.find((n) => n.id === id);
          if (found) setSelectedNode(found);
        }}
        onDeleteNode={handleDeleteNode}
        onNodeUpdated={(updated) => {
          setSelectedNode(updated);
          loadGraph();
        }}
      />

      {/* Drag-to-create Connection Modal */}
      <ConnectionModal
        isOpen={!!pendingConnection}
        onClose={() => setPendingConnection(null)}
        sourceNode={pendingConnection?.source || null}
        targetNode={pendingConnection?.target || null}
        onConnected={() => {
          setPendingConnection(null);
          loadGraph();
        }}
      />

      {/* Add Node Modal */}
      <CreateNodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNodeCreated={(newNode) => {
          setIsCreateModalOpen(false);
          loadGraph();
          if (newNode) setSelectedNode(newNode);
        }}
      />
    </div>
  );
}
