'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ExternalLink,
  Radio,
  Music2,
  ChevronUp,
  ChevronDown,
  Link as LinkIcon,
  Check,
  Sparkles,
  Disc3,
  X,
  Volume2
} from 'lucide-react';
import {
  useInteractionStore,
  CURATED_TRACKS,
  SPOTIFY_PRESETS,
  Track
} from '../store';
import { FluidTabs, type TabItem } from '@/interaction/tabs/FluidTabs';
import styles from './PersistentMusicPlayer.module.css';

export function PersistentMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    isPlayerExpanded,
    togglePlay,
    playTrack,
    togglePlayerExpanded,
    setPlayerExpanded,
    userSpotifyLink,
    userSpotifyEmbedUrl,
    setSpotifyLink,
    setCursor,
    resetCursor
  } = useInteractionStore();

  const [progress, setProgress] = useState(32); // percentage
  const [inputUrl, setInputUrl] = useState(userSpotifyLink);
  const [justLinked, setJustLinked] = useState(false);
  const [activeTab, setActiveTab] = useState<'spotify' | 'queue' | 'presets'>('spotify');
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('niche:player_dismissed');
      if (saved === 'false') {
        setIsDismissed(false);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (isPlaying) {
      setIsDismissed(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = CURATED_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % CURATED_TRACKS.length;
    playTrack(CURATED_TRACKS[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = CURATED_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + CURATED_TRACKS.length) % CURATED_TRACKS.length;
    playTrack(CURATED_TRACKS[prevIndex]);
  };

  const handleSaveSpotifyLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;
    setSpotifyLink(inputUrl.trim());
    setJustLinked(true);
    setTimeout(() => setJustLinked(false), 2400);
  };

  if (!currentTrack) return null;

  if (isDismissed) {
    return null;
  }

  return (
    <>
      {/* 1. Persistent Bottom Bar */}
      <div
        className={styles.bar}
      >
        {/* Track Metadata / Click to Expand */}
        <div
          className={styles.trackInfo}
          onClick={togglePlayerExpanded}
          title="Click to open Niche Music Room & Spotify Hub"
        >
          <img
            src={currentTrack.coverImage}
            alt={currentTrack.title}
            className={`${styles.albumArt} ${isPlaying ? styles.vinylSpin : ''}`}
          />
          <div className={styles.metaText}>
            <span className={styles.title}>{currentTrack.title}</span>
            <span className={styles.artist}>
              {currentTrack.artist} · {currentTrack.genre}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8e8e9c',
              marginLeft: '4px'
            }}
          >
            {isPlayerExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </div>
        </div>

        {/* Central Playback Controls */}
        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={handlePrevTrack} title="Previous Track">
            <SkipBack size={16} />
          </button>

          <button
            className={styles.playPauseBtn}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} style={{ marginLeft: '2px' }} />}
          </button>

          <button className={styles.controlBtn} onClick={handleNextTrack} title="Next Track">
            <SkipForward size={16} />
          </button>

          {/* Progress Scrubber */}
          <div className={styles.progressContainer}>
            <span className={styles.timeTag}>04:36</span>
            <div
              className={styles.progressBar}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                setProgress((clickX / rect.width) * 100);
              }}
            >
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.timeTag}>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Right Actions & External Links */}
        <div className={styles.rightActions}>
          <button
            onClick={() => {
              setPlayerExpanded(true);
              setActiveTab('spotify');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 14px',
              borderRadius: '6px',
              background: 'rgba(29, 185, 84, 0.18)',
              border: '1px solid rgba(29, 185, 84, 0.45)',
              color: '#1ed760',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 14px rgba(29, 185, 84, 0.25)'
            }}
            title="Open Spotify Audio Hub"
          >
            <Music2 size={14} />
            <span>MY SPOTIFY</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Radio size={14} color={isPlaying ? 'var(--accent-sage)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
              {isPlaying ? 'STREAMING' : 'READY'}
            </span>
          </div>

          <a
            href={userSpotifyLink || 'https://open.spotify.com'}
            target="_blank"
            rel="noreferrer"
            className={styles.externalLinkBtn}
            style={{ fontFamily: 'var(--font-mono)' }}
            title="Launch Spotify Web App"
          >
            <span>open.spotify.com</span>
            <ExternalLink size={12} />
          </a>

          <button
            onClick={() => {
              setIsDismissed(true);
              try {
                localStorage.setItem('niche:player_dismissed', 'true');
              } catch (e) {}
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#8e8e9c',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              marginLeft: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8e8e9c';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
            title="Minimize Player Bar"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 2. Expanded Music Room & Spotify Hub Modal */}
      <AnimatePresence>
        {isPlayerExpanded && (
          <motion.div
            key="music-room-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99990,
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(18px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '80px'
            }}
            onClick={() => setPlayerExpanded(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '820px',
                background: 'linear-gradient(160deg, #13131a 0%, #09090e 100%)',
                border: '1px solid rgba(226, 168, 87, 0.3)',
                borderRadius: '20px',
                padding: '28px 32px',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 50px rgba(226, 168, 87, 0.12)',
                maxHeight: '85vh',
                overflowY: 'auto'
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '16px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(29, 185, 84, 0.15)',
                      border: '1px solid rgba(29, 185, 84, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Music2 size={18} color="#1ed760" />
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        margin: 0
                      }}
                    >
                      Niche Music Room & Spotify Hub
                    </h2>
                    <div style={{ fontSize: '0.72rem', color: '#8e8e9c', letterSpacing: '0.04em' }}>
                      Your personal audio soundtrack linked seamlessly into the universe
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FluidTabs
                    tabs={[
                      { id: 'spotify', label: 'Spotify Embed', icon: <Radio size={14} /> },
                      { id: 'presets', label: 'Curated Playlists', icon: <Disc3 size={14} /> },
                      { id: 'queue', label: 'Universe Tracks', icon: <Music2 size={14} /> },
                    ]}
                    activeTab={activeTab}
                    onChange={(id) => setActiveTab(id as 'spotify' | 'presets' | 'queue')}
                    size="sm"
                  />

                  <button
                    onClick={() => setPlayerExpanded(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a0a0ab',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Link Your Spotify Input Bar */}
              <form
                onSubmit={handleSaveSpotifyLink}
                style={{
                  background: 'rgba(20, 20, 28, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <LinkIcon size={16} color="#1ed760" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Paste your Spotify playlist, track, album, or user profile URL..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#f0f0f5',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: justLinked
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #1ed760 0%, #169c46 100%)',
                    border: 'none',
                    color: '#050508',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {justLinked ? <Check size={14} /> : <Sparkles size={14} />}
                  <span>{justLinked ? 'Linked!' : 'Link Spotify'}</span>
                </button>
              </form>

              {/* TAB 1: Live Spotify Embed */}
              {activeTab === 'spotify' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                        FOCUS PRESETS:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const link = 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM';
                          setInputUrl(link);
                          setSpotifyLink(link);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#c4c5cf',
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Ambient Deep
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const link = 'https://open.spotify.com/playlist/37i9dQZF1DX9uKNf5jGX6m';
                          setInputUrl(link);
                          setSpotifyLink(link);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#c4c5cf',
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Classical Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const link = 'https://open.spotify.com/playlist/37i9dQZF1DXcBWJnOwhguM';
                          setInputUrl(link);
                          setSpotifyLink(link);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#c4c5cf',
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Lo-Fi Study
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const link = 'https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt';
                          setInputUrl(link);
                          setSpotifyLink(link);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#c4c5cf',
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Midnight Jazz
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href="spotify:open"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.72rem',
                          color: '#1ed760',
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none',
                          background: 'rgba(29, 185, 84, 0.12)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(29, 185, 84, 0.35)'
                        }}
                        title="Launch Spotify Desktop App on Windows"
                      >
                        <span>Desktop App ↗</span>
                      </a>
                      <a
                        href={userSpotifyLink || 'https://open.spotify.com'}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.72rem',
                          color: '#38bdf8',
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none'
                        }}
                        title="Open in Spotify Web Player"
                      >
                        <span>Web Player ↗</span>
                      </a>
                      <a
                        href="/spotify"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.72rem',
                          color: 'var(--accent-gold)',
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none'
                        }}
                        title="Open Full Spotify Sanctuary Page"
                      >
                        <span>Full Page ↗</span>
                      </a>
                    </div>
                  </div>

                  <div
                    style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid rgba(29, 185, 84, 0.25)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                      background: '#121212',
                      minHeight: '352px'
                    }}
                  >
                    {userSpotifyEmbedUrl ? (
                      <iframe
                        src={userSpotifyEmbedUrl}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        style={{ display: 'block', borderRadius: '12px' }}
                      />
                    ) : (
                      <div
                        style={{
                          height: '352px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8e8e9c',
                          gap: '12px'
                        }}
                      >
                        <Music2 size={36} color="#1ed760" />
                        <div>Paste any Spotify URL above to stream your music directly here.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Curated Playlists */}
              {activeTab === 'presets' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '14px'
                  }}
                >
                  {SPOTIFY_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setInputUrl(preset.url);
                        setSpotifyLink(preset.url);
                        setActiveTab('spotify');
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border:
                          userSpotifyLink === preset.url
                            ? '1px solid #1ed760'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: '#1ed760',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          marginBottom: '4px'
                        }}
                      >
                        {preset.category}
                      </div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 650, color: '#f0f0f5', marginBottom: '6px' }}>
                        {preset.name}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#8e8e9c', lineHeight: 1.4, margin: 0 }}>
                        {preset.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Universe Tracks */}
              {activeTab === 'queue' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CURATED_TRACKS.map((track) => {
                    const isCurrent = currentTrack.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: isCurrent ? 'rgba(226, 168, 87, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: isCurrent ? '1px solid #e2a857' : '1px solid rgba(255, 255, 255, 0.06)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={track.coverImage}
                            alt={track.title}
                            style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f0f5' }}>
                              {track.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#8e8e9c' }}>
                              {track.artist} · {track.genre}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#8e8e9c' }}>
                            {track.duration}
                          </span>
                          {isCurrent && (
                            <span style={{ fontSize: '0.7rem', color: '#e2a857', fontWeight: 700 }}>
                              PLAYING
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
