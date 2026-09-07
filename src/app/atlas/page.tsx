'use client';

import React, { useState } from 'react';
import { AtlasCanvas } from '@/components/atlas/AtlasCanvas';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';

export default function AtlasPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <AtlasCanvas onOpenCreateNode={() => setIsCreateOpen(true)} />
      <CreateNodeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onNodeCreated={() => {
          // Canvas will reload or can refresh
        }}
      />
    </div>
  );
}
