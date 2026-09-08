'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';

interface SpatialItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  subtitle?: string;
}

interface SpatialFolderProps {
  title: string;
  items: SpatialItem[];
  onSelectItem?: (item: SpatialItem) => void;
}

export function SpatialFolder({ title, items, onSelectItem }: SpatialFolderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Folder Thumbnail Button */}
      <motion.div
        layoutId={`folder-${title}`}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '120px',
          height: '120px',
          background: 'rgba(24, 24, 31, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* 2x2 Mini Grid Icons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', height: '60px' }}>
          {items.slice(0, 4).map(item => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          {title}
        </div>
      </motion.div>

      {/* Expanded Dimensional Spatial Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(7, 7, 9, 0.85)',
              backdropFilter: 'blur(16px)',
              zIndex: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              layoutId={`folder-${title}`}
              style={{
                width: '90%',
                maxWidth: '540px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-muted)',
                borderRadius: '32px',
                padding: '28px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(226, 168, 87, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Grid of Expanded Items */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.06, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (onSelectItem) onSelectItem(item);
                      setIsOpen(false);
                    }}
                    style={{
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {item.subtitle}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
