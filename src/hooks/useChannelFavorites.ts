import { useState, useEffect, useCallback } from 'react';
import { ChannelId, ChannelFavoriteState } from '../types';

const STORAGE_KEY = 'tears_channel_favorites';

const DEFAULT_FAVORITES: ChannelId[] = ['tears-prime', 'real-estate-tv'];

export function useChannelFavorites(): ChannelFavoriteState {
  const [favorites, setFavorites] = useState<ChannelId[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is ChannelId => 
            ['tears-prime', 'real-estate-tv', 'tear-radio', 'business-spotlight'].includes(id)
          );
        }
      }
    } catch {
      // Storage unavailable or JSON error
    }
    return DEFAULT_FAVORITES;
  });

  // Sync to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage write errors
    }
  }, [favorites]);

  // Listen to storage events across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch {
          // Ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isFavorite = useCallback((channelId: ChannelId): boolean => {
    return favorites.includes(channelId);
  }, [favorites]);

  const toggleFavorite = useCallback((channelId: ChannelId) => {
    setFavorites(prev => {
      const isFav = prev.includes(channelId);
      const updated = isFav 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId];
      return updated;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites
  };
}
