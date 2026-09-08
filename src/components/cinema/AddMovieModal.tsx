'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Search,
  X,
  Sparkles,
  Check,
  Calendar,
  Users,
  Image as ImageIcon,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { NodeItem } from '@/lib/types';
import styles from './AddMovieModal.module.css';

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieAdded: (movie: NodeItem) => void;
}

interface SearchResult {
  id: string;
  title: string;
  year?: number;
  stars?: string;
  poster?: string;
  type?: string;
}

export function AddMovieModal({ isOpen, onClose, onMovieAdded }: AddMovieModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<SearchResult | null>(null);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [directorOrCast, setDirectorOrCast] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [whyCare, setWhyCare] = useState('');
  const [category, setCategory] = useState<'FAVORITES' | 'WATCHLIST' | 'ALL'>('FAVORITES');
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedMovie(null);
      setTitle('');
      setYear('');
      setDirectorOrCast('');
      setPosterUrl('');
      setSynopsis('');
      setWhyCare('');
      setManualMode(false);
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Debounced search for real-world movies
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error('Movie search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectMovie = async (movie: SearchResult) => {
    setSelectedMovie(movie);
    setTitle(movie.title);
    setYear(movie.year || '');
    setDirectorOrCast(movie.stars || '');
    setPosterUrl(movie.poster || '');
    setSearchResults([]);

    // Fetch detailed synopsis from Wikipedia
    setIsFetchingDetails(true);
    try {
      const res = await fetch(
        `/api/movies/details?title=${encodeURIComponent(movie.title)}${
          movie.year ? `&year=${movie.year}` : ''
        }`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.synopsis) {
          setSynopsis(data.synopsis);
        } else if (movie.stars) {
          setSynopsis(`${movie.title} (${movie.year || 'Film'}). Starring ${movie.stars}.`);
        }
        if (!movie.poster && data.image) {
          setPosterUrl(data.image);
        }
      }
    } catch {
      if (movie.stars) {
        setSynopsis(`${movie.title} (${movie.year || 'Film'}). Starring ${movie.stars}.`);
      }
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const tags = ['cinema', 'movie'];
      if (category === 'FAVORITES') tags.push('favorite', 'canon');
      if (category === 'WATCHLIST') tags.push('watchlist');

      const fullSummary = synopsis.trim() || `${title} (${year || 'Film'})${directorOrCast ? ` — ${directorOrCast}` : ''}`;

      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          type: 'MOVIE',
          summary: fullSummary,
          coverImage: posterUrl.trim(),
          whyCare: whyCare.trim(),
          uncertaintyLevel: category === 'FAVORITES' ? 'known' : 'need_research',
          learningState: category === 'FAVORITES' ? 4 : 2,
          tags,
          metadata: {
            year: year ? Number(year) : undefined,
            directorOrCast: directorOrCast.trim(),
            category
          }
        })
      });

      if (res.ok) {
        const newNode = await res.json();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('universe:nodeCreated', { detail: newNode }));
        }
        onMovieAdded(newNode);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create movie node:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className={styles.iconBadge}>
              <Film size={18} color="var(--accent-gold)" />
            </div>
            <div>
              <div className={styles.modalTitle}>Log Film to Cinematheque</div>
              <div className={styles.modalSubtitle}>Search real-world cinema or log a custom masterpiece</div>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Search Box */}
          <div className={styles.searchSection}>
            <label className={styles.label}>
              <span>Search Real-World Movie Database</span>
              <span className={styles.labelHint}>IMDb & Wikipedia Real-Time Lookup</span>
            </label>
            <div className={styles.searchBar}>
              <Search size={16} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder="Type movie name (e.g. Inception, Blade Runner 2049, Parasite)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {isSearching && <Loader2 size={16} className={styles.spinner} />}
            </div>

            {/* Dropdown Results */}
            {searchResults.length > 0 && (
              <div className={styles.resultsDropdown}>
                {searchResults.map(movie => (
                  <div
                    key={movie.id}
                    className={styles.resultItem}
                    onClick={() => handleSelectMovie(movie)}
                  >
                    <div
                      className={styles.resultThumb}
                      style={{
                        backgroundImage: movie.poster ? `url(${movie.poster})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!movie.poster && <Film size={14} color="#666" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.resultTitle}>
                        {movie.title}
                        {movie.year && <span className={styles.resultYear}>({movie.year})</span>}
                      </div>
                      {movie.stars && (
                        <div className={styles.resultStars}>{movie.stars}</div>
                      )}
                    </div>
                    <span className={styles.selectTag}>Select</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Movie / Poster Card Preview */}
          {(posterUrl || title) && (
            <div className={styles.moviePreviewCard}>
              <div
                className={styles.previewPoster}
                style={{
                  backgroundImage: posterUrl ? `url(${posterUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!posterUrl && (
                  <div className={styles.noPosterPlaceholder}>
                    <ImageIcon size={24} color="#888" />
                    <span>No Poster</span>
                  </div>
                )}
              </div>

              <div className={styles.previewDetails}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={styles.canonBadge}>FILM CANON SPECIMEN</span>
                  {year && <span className={styles.yearBadge}>{year}</span>}
                </div>
                <div className={styles.previewTitle}>{title || 'Untitled Film'}</div>
                {directorOrCast && (
                  <div className={styles.previewCast}>{directorOrCast}</div>
                )}
                {isFetchingDetails ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontSize: '0.75rem', marginTop: '6px' }}>
                    <Loader2 size={12} className={styles.spinner} />
                    <span>Fetching official synopsis from Wikipedia...</span>
                  </div>
                ) : synopsis ? (
                  <div className={styles.previewSynopsis}>
                    {synopsis.length > 200 ? `${synopsis.substring(0, 200)}...` : synopsis}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Editable Fields */}
          <div className={styles.fieldGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Film Title *</label>
              <input
                type="text"
                className={styles.input}
                required
                placeholder="Blade Runner 2049"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Release Year</label>
              <input
                type="number"
                className={styles.input}
                placeholder="2017"
                value={year}
                onChange={e => setYear(e.target.value ? parseInt(e.target.value, 10) : '')}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Director & Lead Cast</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Denis Villeneuve · Ryan Gosling, Harrison Ford"
              value={directorOrCast}
              onChange={e => setDirectorOrCast(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.label}>Poster Image URL</label>
              <button
                type="button"
                className={styles.linkToggle}
                onClick={() => setManualMode(!manualMode)}
              >
                {manualMode ? 'Hide URL input' : 'Edit Poster URL'}
              </button>
            </div>
            {manualMode && (
              <input
                type="url"
                className={styles.input}
                placeholder="https://m.media-amazon.com/images/... or https://..."
                value={posterUrl}
                onChange={e => setPosterUrl(e.target.value)}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Synopsis / Film Premise</label>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="Brief premise or philosophical thematic core of the film..."
              value={synopsis}
              onChange={e => setSynopsis(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span>Personal Resonance / Why I Care</span>
              <span className={styles.labelHint}>Why this film lives in your intellectual universe</span>
            </label>
            <textarea
              className={styles.textarea}
              rows={2}
              placeholder="“Dying for the right cause. It’s the most human thing we can do.” What did this work alter in you?"
              value={whyCare}
              onChange={e => setWhyCare(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Placement Category</label>
            <div className={styles.radioGroup}>
              {(['FAVORITES', 'ALL', 'WATCHLIST'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.radioBtn} ${category === cat ? styles.radioBtnActive : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === 'FAVORITES' && '★ Canon Masterwork'}
                  {cat === 'ALL' && 'Watched / Logged'}
                  {cat === 'WATCHLIST' && 'Watchlist / Queue'}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className={styles.spinner} />
                  <span>Logging to Universe...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Log Film to Cinematheque</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
