'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Music2,
  ExternalLink,
  Play,
  Sparkles,
  Link as LinkIcon,
  Check,
  Radio,
  Headphones,
  Compass,
  ArrowRight,
  Disc3,
  Volume2
} from 'lucide-react';
import { useInteractionStore, SPOTIFY_PRESETS, SpotifyPreset } from '@/interaction/store';
import styles from './page.module.css';

const EXTENDED_PRESETS = [
  ...SPOTIFY_PRESETS,
  {
    id: 'preset-lofi',
    name: 'Lofi Beats & Late Night Code',
    category: 'LO-FI',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWJnOwhguM',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWJnOwhguM?theme=0',
    description: 'Chill beats, vintage vinyl crackle, and soft loops for quiet sessions.'
  },
  {
    id: 'preset-jazz',
    name: 'Midnight Jazz Club',
    category: 'JAZZ',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXbITWG1ZJKYt?theme=0',
    description: 'Miles Davis, Bill Evans, Chet Baker, and introspective nocturnal jazz.'
  },
  {
    id: 'preset-postrock',
    name: 'Cine-Atmospheric Post-Rock',
    category: 'POST-ROCK',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX0h0QZaVKUAC',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0h0QZaVKUAC?theme=0',
    description: 'Explosions in the Sky, Sigur Rós, Mogwai, and building crescendos.'
  }
];

export default function SpotifyPage() {
  const { userSpotifyLink, userSpotifyEmbedUrl, setSpotifyLink } = useInteractionStore();
  const [inputUrl, setInputUrl] = useState(userSpotifyLink);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    setInputUrl(userSpotifyLink);
  }, [userSpotifyLink]);

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setSpotifyLink(inputUrl.trim());
    setActivePreset(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2600);
  };

  const handleSelectPreset = (preset: (typeof EXTENDED_PRESETS)[0]) => {
    setInputUrl(preset.url);
    setSpotifyLink(preset.url);
    setActivePreset(preset.id);
  };

  return (
    <div className={styles.container}>
      {/* Editorial Header */}
      <header className={styles.header}>
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrowBadge}>// AUDIO SANCTUARY · SPOTIFY DIRECT ACCESS</span>
          <span className={styles.statusIndicator}>
            <span className={styles.statusDot} />
            SPOTIFY LINK ACTIVE
          </span>
        </div>

        <h1 className={styles.mainTitle}>Spotify Access Hub</h1>
        <p className={styles.tagline}>
          Your private audio companion. Connect your personal Spotify library, launch native desktop or web playback, or immerse in curated thinking environments.
        </p>

        {/* Quick Launch Button Grid */}
        <div className={styles.launchGrid}>
          {/* 1. Desktop App */}
          <a
            href="spotify:open"
            className={styles.launchCardPrimary}
            title="Launch native Spotify desktop application"
          >
            <div className={styles.launchCardHeader}>
              <Headphones size={20} color="#1ed760" />
              <span className={styles.launchCardType}>NATIVE APP</span>
            </div>
            <div className={styles.launchCardTitle}>Launch Spotify Desktop</div>
            <div className={styles.launchCardDesc}>
              Opens your installed Spotify Windows client with full hardware controls.
            </div>
            <div className={styles.launchCardAction}>
              <span>spotify:open</span>
              <ArrowRight size={13} />
            </div>
          </a>

          {/* 2. Web Player */}
          <a
            href={userSpotifyLink || 'https://open.spotify.com'}
            target="_blank"
            rel="noreferrer"
            className={styles.launchCard}
            title="Open Spotify Web Player in new browser tab"
          >
            <div className={styles.launchCardHeader}>
              <Radio size={20} color="#38bdf8" />
              <span className={styles.launchCardType}>BROWSER</span>
            </div>
            <div className={styles.launchCardTitle}>Open Spotify Web Player</div>
            <div className={styles.launchCardDesc}>
              Direct access to your Spotify Web interface in a new browser tab.
            </div>
            <div className={styles.launchCardAction}>
              <span>open.spotify.com</span>
              <ExternalLink size={13} />
            </div>
          </a>

          {/* 3. Return to Atlas Universe */}
          <Link href="/atlas" className={styles.launchCard}>
            <div className={styles.launchCardHeader}>
              <Compass size={20} color="var(--accent-gold)" />
              <span className={styles.launchCardType}>UNIVERSE</span>
            </div>
            <div className={styles.launchCardTitle}>Explore Atlas Graph</div>
            <div className={styles.launchCardDesc}>
              Return to your personal knowledge canvas with background sound active.
            </div>
            <div className={styles.launchCardAction}>
              <span>/atlas</span>
              <ArrowRight size={13} />
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content Layout: Left Player & Input, Right Presets */}
      <div className={styles.contentLayout}>
        {/* Left Column: Input Form & Embedded Spotify Player */}
        <div className={styles.leftCol}>
          {/* Account / Playlist Linker */}
          <div className={styles.panelBox}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleGroup}>
                <LinkIcon size={16} color="#1ed760" />
                <span className={styles.panelTitle}>CONNECT YOUR SPOTIFY PLAYLIST / ACCOUNT</span>
              </div>
              <span className={styles.monoSubtext}>PERSISTENT IN LOCAL STORAGE</span>
            </div>

            <form onSubmit={handleLinkSubmit} className={styles.linkForm}>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste any Spotify playlist, album, track, or user URL..."
                className={styles.linkInput}
              />
              <button type="submit" className={styles.linkSubmitBtn}>
                {savedSuccess ? <Check size={14} /> : <Sparkles size={14} />}
                <span>{savedSuccess ? 'Linked!' : 'Set Active'}</span>
              </button>
            </form>
            <div className={styles.inputHelpText}>
              Accepts URLs like <code className={styles.codeSnippet}>https://open.spotify.com/playlist/...</code>, <code className={styles.codeSnippet}>spotify:album:...</code>, or artist pages.
            </div>
          </div>

          {/* Embedded Spotify Widget */}
          <div className={styles.playerFrameContainer}>
            <div className={styles.playerBarHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Disc3 size={14} color="#1ed760" className={styles.discSpin} />
                <span className={styles.playerBarTitle}>ACTIVE SPOTIFY PLAYER</span>
              </div>
              <a
                href={userSpotifyLink || 'https://open.spotify.com'}
                target="_blank"
                rel="noreferrer"
                className={styles.playerBarLink}
              >
                <span>Full Web Player</span>
                <ExternalLink size={11} />
              </a>
            </div>

            <div className={styles.iframeWrapper}>
              {userSpotifyEmbedUrl ? (
                <iframe
                  src={userSpotifyEmbedUrl}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className={styles.spotifyIframe}
                />
              ) : (
                <div className={styles.emptyIframePrompt}>
                  <Music2 size={32} color="rgba(255, 255, 255, 0.2)" />
                  <p>No active playlist linked. Enter a URL above or pick a preset below.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Curated Stations & Presets */}
        <div className={styles.rightCol}>
          <div className={styles.presetsPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleGroup}>
                <Sparkles size={15} color="var(--accent-gold)" />
                <span className={styles.panelTitle}>CURATED FOCUS PRESETS</span>
              </div>
              <span className={styles.monoSubtext}>1-CLICK LOAD</span>
            </div>

            <div className={styles.presetList}>
              {EXTENDED_PRESETS.map((preset) => {
                const isSelected = activePreset === preset.id || userSpotifyLink === preset.url;
                return (
                  <div
                    key={preset.id}
                    className={`${styles.presetCard} ${isSelected ? styles.presetCardActive : ''}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <div className={styles.presetTop}>
                      <span className={styles.presetCat}>{preset.category}</span>
                      {isSelected && <span className={styles.activeTag}>CURRENT</span>}
                    </div>
                    <div className={styles.presetName}>{preset.name}</div>
                    <div className={styles.presetDesc}>{preset.description}</div>
                    <div className={styles.presetFooter}>
                      <span className={styles.loadBtnText}>Load into Player →</span>
                      <a
                        href={preset.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={styles.presetDirectLink}
                        title="Open in Spotify Web"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
