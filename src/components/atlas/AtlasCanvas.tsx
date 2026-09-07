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
import { NodeItem, ConnectionItem } from '@/lib/types';
import {
  Maximize2,
  Sparkles,
  Layers,
  Filter,
  RefreshCw,
  Plus
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

        // Convert to React Flow Edges
        const flowEdges: Edge[] = data.connections.map((c: ConnectionItem) => ({
          id: c.id,
          source: c.sourceNodeId,
          target: c.targetNodeId,
          label: c.label || c.relationshipType,
          animated: c.relationshipType === 'caused' || c.relationshipType === 'inspired',
          style: {
            stroke: c.strength && c.strength >= 4 ? '#e2a857' : 'rgba(255, 255, 255, 0.25)',
            strokeWidth: c.strength ? c.strength * 0.75 : 1.5,
          },
          labelStyle: {
            fill: '#a3a4af',
            fontSize: 10,
            fontFamily: 'var(--font-mono)'
          },
          labelBgStyle: {
            fill: '#121216',
            fillOpacity: 0.85
          }
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
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

  // Handle position changes and save debounced
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(nds => {
        const updated = applyNodeChanges(changes, nds);
        // If drag ended, persist new positions
        const positionChanges = changes.filter(
          c => c.type === 'position' && (c as any).dragging === false
        );

        if (positionChanges.length > 0) {
          const positionsToSave = updated.map(n => ({
            nodeId: n.id,
            x: n.position.x,
            y: n.position.y
          }));

          fetch('/api/graph', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ positions: positionsToSave })
          }).catch(err => console.error('Failed to save node positions:', err));
        }

        return updated;
      });
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  );

  // Handle new connection dropped
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const sourceNode = rawNodes.find(n => n.id === params.source);
      const targetNode = rawNodes.find(n => n.id === params.target);

      if (sourceNode && targetNode) {
        setPendingConnection({
          source: { id: sourceNode.id, title: sourceNode.title },
          target: { id: targetNode.id, title: targetNode.title }
        });
      }
    },
    [rawNodes]
  );

  // Click on node opens inspector
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const fullNode = rawNodes.find(n => n.id === node.id);
      if (fullNode) {
        setSelectedNode(fullNode);
      }
    },
    [rawNodes]
  );

  // Double click navigates to full page
  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const fullNode = rawNodes.find(n => n.id === node.id);
      if (fullNode) {
        router.push(`/node/${fullNode.slug || fullNode.id}`);
      }
    },
    [rawNodes, router]
  );

  // Delete node handler
  const handleDeleteNode = async (nodeId: string) => {
    try {
      await fetch(`/api/nodes/${nodeId}`, { method: 'DELETE' });
      loadGraph();
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Re-cluster nodes when mode is 'clusters'
  const applyClusterLayout = () => {
    setMapMode('clusters');
    const typeGroups: Record<string, Node[]> = {};
    nodes.forEach(n => {
      const t = n.data.type as string;
      if (!typeGroups[t]) typeGroups[t] = [];
      typeGroups[t].push(n);
    });

    const groupKeys = Object.keys(typeGroups);
    const radius = 350;
    const newNodes = nodes.map(n => {
      const t = n.data.type as string;
      const groupIdx = groupKeys.indexOf(t);
      const angle = (groupIdx / groupKeys.length) * 2 * Math.PI;
      const cx = Math.cos(angle) * radius;
      const cy = Math.sin(angle) * radius;

      const itemsInGroup = typeGroups[t];
      const itemIdx = itemsInGroup.findIndex(item => item.id === n.id);
      const subAngle = (itemIdx / itemsInGroup.length) * 2 * Math.PI;
      const subRadius = 70 + itemIdx * 30;

      return {
        ...n,
        position: {
          x: cx + Math.cos(subAngle) * subRadius,
          y: cy + Math.sin(subAngle) * subRadius
        }
      };
    });

    setNodes(newNodes);
  };

  // Filtered nodes
  const visibleNodes = useMemo(() => {
    if (typeFilter === 'ALL') return nodes;
    return nodes.filter(n => n.data.type === typeFilter);
  }, [nodes, typeFilter]);

  const uniqueTypes = useMemo(() => {
    const set = new Set(rawNodes.map(n => n.type));
    return Array.from(set);
  }, [rawNodes]);

  return (
    <div
      className={`${styles.canvasWrapper} ${
        mapMode === 'constellation' ? styles.constellationBg : ''
      }`}
    >
      {/* Floating HUD Toolbar */}
      <div className={styles.hudToolbar}>
        <button
          className={`${styles.hudBtn} ${mapMode === 'freeform' ? styles.hudBtnActive : ''}`}
          onClick={() => setMapMode('freeform')}
        >
          <span>Freeform</span>
        </button>

        <button
          className={`${styles.hudBtn} ${mapMode === 'constellation' ? styles.hudBtnActive : ''}`}
          onClick={() => setMapMode('constellation')}
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
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types ({rawNodes.length})</option>
            {uniqueTypes.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {onOpenCreateNode && (
          <button
            className={styles.hudBtn}
            onClick={onOpenCreateNode}
            style={{ color: 'var(--accent-gold)' }}
          >
            <Plus size={13} />
            <span>Add Node</span>
          </button>
        )}

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

      <ReactFlow
        nodes={visibleNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
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
          nodeColor={n => {
            if (n.data?.type === 'EMPIRE') return '#e5c07b';
            if (n.data?.type === 'PERSON') return '#61afef';
            if (n.data?.type === 'PHILOSOPHY') return '#c678dd';
            return '#e2a857';
          }}
          maskColor="rgba(7, 7, 9, 0.85)"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)'
          }}
        />
      </ReactFlow>

      {/* Slide-out Inspector Drawer */}
      <InspectorDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onSelectNode={id => {
          const found = rawNodes.find(n => n.id === id);
          if (found) setSelectedNode(found);
        }}
        onDeleteNode={handleDeleteNode}
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
    </div>
  );
}
