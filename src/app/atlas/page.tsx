'use client';

import React from 'react';
import { AtlasCanvas } from '@/components/atlas/AtlasCanvas';

export default function AtlasPage() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <AtlasCanvas />
    </div>
  );
}
