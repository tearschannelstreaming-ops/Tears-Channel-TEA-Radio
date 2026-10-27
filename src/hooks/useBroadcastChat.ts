import { useState, useEffect, useRef, useCallback } from 'react';
import { ChannelId } from '../types';

export interface ChatUser {
  id: string;
  name: string;
  role: 'founder' | 'broker' | 'moderator' | 'member' | 'guest';
  badge?: string;
  verified: boolean;
  email?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: ChatUser;
  text: string;
  timestamp: string;
  pinned?: boolean;
}

export interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
}

const USER_STORAGE_KEY = 'tears_chat_user';

export function useBroadcastChat(channelId: ChannelId) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(14820);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);

  // Load user from localStorage or default to guest (Read-Only)
  const [currentUser, setCurrentUser] = useState<ChatUser>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.verified) {
          return parsed;
        }
      }
    } catch {
      // Storage unavailable
    }
    return {
      id: `guest-${Math.floor(Math.random() * 90000 + 10000)}`,
      name: 'Guest Viewer',
      role: 'guest',
      verified: false
    };
  });

  const isGuest = !currentUser.verified || currentUser.role === 'guest';

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect WebSocket
  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setErrorMessage(null);
        // Join active channel
        ws.send(JSON.stringify({
          type: 'join:channel',
          channelId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'init' || data.type === 'channel:switched') {
            if (Array.isArray(data.messages)) {
              setMessages(data.messages);
            }
            if (data.onlineCount) {
              setOnlineCount(data.onlineCount);
            }
          }

          if (data.type === 'chat:message') {
            if (data.channelId === channelId && data.message) {
              setMessages(prev => {
                // Prevent duplicate messages
                if (prev.some(m => m.id === data.message.id)) {
                  return prev;
                }
                return [...prev, data.message];
              });
            }
          }

          if (data.type === 'chat:reaction') {
            if (data.channelId === channelId) {
              const newReaction: FloatingReaction = {
                id: `react-${Date.now()}-${Math.random()}`,
                emoji: data.emoji || '❤️',
                x: Math.floor(Math.random() * 70) + 15
              };
              setFloatingReactions(prev => [...prev.slice(-8), newReaction]);
              setTimeout(() => {
                setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
              }, 2200);
            }
          }

          if (data.type === 'presence') {
            if (data.onlineCount) {
              setOnlineCount(data.onlineCount);
            }
          }

          if (data.type === 'error') {
            setErrorMessage(data.message || 'An error occurred.');
            setTimeout(() => setErrorMessage(null), 4000);
          }
        } catch {
          // Ignore JSON errors
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };

    } catch {
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(connect, 4000);
    }
  }, [channelId]);

  // Initial connect & cleanup
  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  // Handle channel change
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'join:channel',
        channelId
      }));
    } else {
      // Fallback: load channel messages via HTTP API
      fetch(`/api/chat/messages?channel=${encodeURIComponent(channelId)}`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.messages)) {
            setMessages(data.messages);
          }
        })
        .catch(() => {});
    }
  }, [channelId]);

  // Send message
  const sendMessage = useCallback(async (text: string): Promise<boolean> => {
    if (isGuest) {
      setErrorMessage('Read-only mode active for guests to prevent spam. Please set a verified screen name to participate.');
      return false;
    }

    const cleanText = text.trim();
    if (!cleanText) return false;

    // Fast path: WebSocket is open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat:message',
        sender: currentUser,
        text: cleanText
      }));
      return true;
    }

    // Fallback path: HTTP POST API
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId,
          sender: currentUser,
          text: cleanText
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.message) {
          setMessages(prev => {
            if (prev.some(m => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
          return true;
        }
      }
    } catch {
      // Local optimistic fallback
      const optimisticMsg: ChatMessage = {
        id: `msg-opt-${Date.now()}`,
        channelId,
        sender: currentUser,
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, optimisticMsg]);
      return true;
    }

    setErrorMessage('Reconnecting to live chat server...');
    return false;
  }, [channelId, currentUser, isGuest]);

  // Send reaction
  const sendReaction = useCallback((emoji: string) => {
    // Show local reaction immediately
    const localReact: FloatingReaction = {
      id: `react-local-${Date.now()}`,
      emoji,
      x: Math.floor(Math.random() * 70) + 15
    };
    setFloatingReactions(prev => [...prev.slice(-8), localReact]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== localReact.id));
    }, 2200);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat:reaction',
        emoji,
        senderName: currentUser.name
      }));
    } else {
      // HTTP fallback for reaction
      fetch('/api/chat/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId,
          emoji,
          senderName: currentUser.name
        })
      }).catch(() => {});
    }
  }, [channelId, currentUser.name]);

  // Set verified user
  const setVerifiedUser = useCallback((name: string, role: 'member' | 'broker' = 'member', email?: string) => {
    const updated: ChatUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      role,
      badge: role === 'broker' ? 'Real Estate' : 'Verified Viewer',
      verified: true,
      email: email?.trim()
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }, []);

  const resetToGuest = useCallback(() => {
    const guestUser: ChatUser = {
      id: `guest-${Math.floor(Math.random() * 90000 + 10000)}`,
      name: 'Guest Viewer',
      role: 'guest',
      verified: false
    };
    setCurrentUser(guestUser);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return {
    messages,
    onlineCount,
    isConnected,
    errorMessage,
    currentUser,
    isGuest,
    sendMessage,
    sendReaction,
    setVerifiedUser,
    resetToGuest,
    floatingReactions
  };
}
