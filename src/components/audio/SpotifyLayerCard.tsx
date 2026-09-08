'use client';

import React, { useState } from 'react';
import {
  Music2,
  Headphones,
  ExternalLink,
  Check,
  Sparkles,
  Link as LinkIcon,
  Play,
  Volume2,
  Disc3,
  Radio
} from 'lucide-react';
import {
  useInteractionStore,
  SPOTIFY_PRESETS,
  CURATED_TRACKS,
  parseSpotifyEmbedUrl
} from '@/interaction/store';

export function SpotifyLayerCard() {
  const {
    userSpotifyLink,
    userSpotifyEmbedUrl,
    setSpotifyLink,
    setPlayerExpanded,
    playTrack,
    isPlaying,
    currentTrack
  } = useInteractionStore();

  const [inputVal, setInputVal] = useState(userSpotifyLink);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    setSpotifyLink(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2400);
  };

  const handleSelectPreset = (url: string) => {
    setInputVal(url);
    setSpotifyLink(url);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2400);
  };

  return (
    <section
      style={{
        background: 'linear-gradient(145deg, rgba(20, 20, 28, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)',
        border: '1px solid rgba(29, 185, 84, 0.3)',
        borderRadius: 'var(--radius-sm, 12px)',
        padding: '28px 32px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(29, 185, 84, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient accent */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29, 185, 84, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1ed760', marginBottom: '6px' }}>
            <Headphones size={15} />
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              SECTION 16 · PERSONAL AUDIO LAYER
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontSize: '1.65rem',
              color: '#ffffff',
              margin: '0 0 6px 0',
              fontWeight: 600
            }}
          >
            Spotify Soundtrack & Focus Atmospheres
          </h2>
          <p style={{ color: 'var(--text-secondary, #8e8e9c)', fontSize: '0.86rem', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
            “We don’t host music. We create your personal acoustic layer.” Link your personal Spotify profile, public or private playlists, albums, or tracks to accompany your intellectual universe.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(29, 185, 84, 0.12)',
              border: '1px solid rgba(29, 185, 84, 0.4)',
              color: '#1ed760',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#1ed760',
                boxShadow: '0 0 8px #1ed760'
              }}
            />
            SPOTIFY ACTIVE
          </div>

          <button
            onClick={() => setPlayerExpanded(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(226, 168, 87, 0.15)',
              border: '1px solid rgba(226, 168, 87, 0.35)',
              color: '#e2a857',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Radio size={14} />
            <span>Open Music Room</span>
          </button>
        </div>
      </div>

      {/* Link Input Bar */}
      <form
        onSubmit={handleSave}
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          background: 'rgba(10, 10, 16, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '8px 12px',
          width: '100%'
        }}
      >
        <LinkIcon size={16} color="#1ed760" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Paste your Spotify playlist, track, album, or profile URL..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#f0f0f5',
            fontSize: '0.84rem',
            outline: 'none',
            fontFamily: 'var(--font-mono)'
          }}
        />
        <button
          type="submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            background: savedSuccess
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #1ed760 0%, #159441 100%)',
            border: 'none',
            color: '#050508',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {savedSuccess ? <Check size={14} /> : <Sparkles size={14} />}
          <span>{savedSuccess ? 'Linked & Saved!' : 'Link Spotify'}</span>
        </button>
      </form>

      {/* Presets & Focus Atmospheres */}
      <div>
        <div style={{ fontSize: '0.74rem', color: '#8e8e9c', fontFamily: 'var(--font-mono)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Or Select Curated Focus Atmospheres:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {SPOTIFY_PRESETS.map((preset) => {
            const isSelected = userSpotifyLink === preset.url;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset.url)}
                style={{
                  background: isSelected ? 'rgba(29, 185, 84, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid #1ed760' : '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.64rem', color: isSelected ? '#1ed760' : '#8e8e9c', fontWeight: 700, letterSpacing: '0.06em' }}>
                    {preset.category}
                  </span>
                  {isSelected && <Check size={13} color="#1ed760" />}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 650, color: '#f0f0f5', marginBottom: '3px' }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#8e8e9c', lineHeight: 1.3 }}>
                  {preset.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Spotify Live Player */}
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(29, 185, 84, 0.25)',
          background: '#121212',
          marginTop: '4px'
        }}
      >
        {userSpotifyEmbedUrl ? (
          <iframe
            src={userSpotifyEmbedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ display: 'block' }}
          />
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: '#8e8e9c', fontSize: '0.84rem' }}>
            Paste any Spotify URL above to embed your player here.
          </div>
        )}
      </div>

      {/* Footer helper note */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#68687a', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
        <span>Audio state persists in your browser storage across all 22 universe routes.</span>
        <a
          href={userSpotifyLink}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1ed760', textDecoration: 'none' }}
        >
          <span>Open on Spotify</span>
          <ExternalLink size={11} />
        </a>
      </div>
    </section>
  );
}
