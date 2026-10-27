import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

export interface ChatUser {
  id: string;
  name: string;
  role: 'founder' | 'broker' | 'moderator' | 'member' | 'guest';
  badge?: string;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: ChatUser;
  text: string;
  timestamp: string;
  pinned?: boolean;
}

// In-memory message store per broadcast channel
const channelMessages: Record<string, ChatMessage[]> = {
  'tears-prime': [
    {
      id: 'msg-seed-1',
      channelId: 'tears-prime',
      sender: {
        id: 'jeanell-ceo',
        name: 'Jeanell Land',
        role: 'founder',
        badge: 'CEO & Founder',
        verified: true
      },
      text: 'Welcome everyone to T.E.A.R.S. Channel Primetime! Tonight we are spotlighting Detroit commercial acreage along the Woodward corridor. Enjoy the broadcast!',
      timestamp: '08:00 AM',
      pinned: true
    },
    {
      id: 'msg-seed-2',
      channelId: 'tears-prime',
      sender: {
        id: 'moderator-1',
        name: 'T.E.A.R.S. Moderator',
        role: 'moderator',
        badge: 'Mod',
        verified: true
      },
      text: 'Notice: Guest viewers are in Read-Only mode to prevent broadcast spam. Set a verified viewer name below to join the live conversation.',
      timestamp: '08:02 AM'
    },
    {
      id: 'msg-seed-3',
      channelId: 'tears-prime',
      sender: {
        id: 'user-detroit-dev',
        name: 'Marcus D. (Detroit Partner)',
        role: 'member',
        badge: 'Investor',
        verified: true
      },
      text: 'Tuning in live on Roku TV. Video quality is crystal clear in 4K HDR.',
      timestamp: '08:05 AM'
    }
  ],
  'real-estate-tv': [
    {
      id: 'msg-seed-re-1',
      channelId: 'real-estate-tv',
      sender: {
        id: 'jeanell-broker',
        name: 'Jeanell Land',
        role: 'broker',
        badge: 'Licensed Land Broker',
        verified: true
      },
      text: 'Woodward Commercial Parcel (2.85 Acres) site walk dossier is live. Download my MLS mobile app at mls-client.com/AC8E6C053 (Access Code: AC8E6C053) for full zoning specs.',
      timestamp: '08:00 AM',
      pinned: true
    },
    {
      id: 'msg-seed-re-2',
      channelId: 'real-estate-tv',
      sender: {
        id: 'user-investor-re',
        name: 'Elena Rostova',
        role: 'member',
        badge: 'Buyer',
        verified: true
      },
      text: 'The drone flyover of the riverfront parcel looks phenomenal. Are environmental Phase 1 reports available?',
      timestamp: '08:08 AM'
    }
  ],
  'tear-radio': [
    {
      id: 'msg-seed-tr-1',
      channelId: 'tear-radio',
      sender: {
        id: 'stearsafe-dispatch',
        name: 'S.T.E.A.R.Safe Dispatch',
        role: 'moderator',
        badge: 'Highway Safety',
        verified: true
      },
      text: 'I-75 & Lodge Freeway traffic flowing smoothly. Wet pavement alert near Southfield corridor. Drive safe!',
      timestamp: '08:00 AM',
      pinned: true
    },
    {
      id: 'msg-seed-tr-2',
      channelId: 'tear-radio',
      sender: {
        id: 'user-soulfan',
        name: 'MotownDave',
        role: 'member',
        badge: 'VIP Listener',
        verified: true
      },
      text: 'Johnnie Taylor playing now! Streaming to my car stereo via CarPlay flawlessly.',
      timestamp: '08:12 AM'
    }
  ],
  'business-spotlight': [
    {
      id: 'msg-seed-bs-1',
      channelId: 'business-spotlight',
      sender: {
        id: 'tears-ad-desk',
        name: 'T.E.A.R.S. Commercial Desk',
        role: 'moderator',
        badge: 'Ad Director',
        verified: true
      },
      text: 'Prime 30-second commercial airtime slots available for Q4. Book on the Advertise tab or email support@tearschannel.online.',
      timestamp: '08:00 AM',
      pinned: true
    }
  ]
};

// Track client rate limits and channels
interface ClientSession {
  ws: WebSocket;
  channelId: string;
  lastMessageTime: number;
}

const clients = new Map<WebSocket, ClientSession>();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health and chat history API endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/chat/messages', (req, res) => {
    const channel = (req.query.channel as string) || 'tears-prime';
    res.json({
      channel,
      messages: channelMessages[channel] || [],
      onlineCount: Math.max(1, clients.size)
    });
  });

  // Roku Direct Publisher & Smart TV Universal Media Feed
  app.get('/api/feed.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
      providerName: 'T.E.A.R.S. Channel Network',
      lastUpdated: new Date().toISOString(),
      language: 'en',
      tvSpec: 'v1.3',
      branding: {
        logo240x180: '/app-media/app_logo.jpg',
        splash1920x1080: '/app-media/app_logo.jpg'
      },
      liveFeeds: [
        {
          id: 'tears-prime',
          title: 'T.E.A.R.S. Channel Primetime 24/7',
          shortDescription: '24/7 Primetime television featuring True Crime, Detroit Commercial Real Estate & Motown Soul.',
          thumbnail: '/app-media/app_logo.jpg',
          genres: ['entertainment', 'special'],
          tags: ['live', 'detroit', 'real-estate', 'tv'],
          content: {
            dateAdded: '2025-01-01T00:00:00Z',
            videos: [
              {
                url: 'https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/live/tears-prime/master.m3u8',
                quality: 'HD',
                videoType: 'HLS'
              }
            ],
            duration: 0
          }
        },
        {
          id: 'real-estate-tv',
          title: 'T.E.A.R.S. Real Estate & Land TV',
          shortDescription: 'Detroit commercial land auctions, MLS acreage walk-throughs & urban investment tours.',
          thumbnail: '/app-media/app_logo.jpg',
          genres: ['educational', 'special'],
          tags: ['commercial-land', 'mls', 'investing'],
          content: {
            dateAdded: '2025-01-01T00:00:00Z',
            videos: [
              {
                url: 'https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/live/real-estate-tv/master.m3u8',
                quality: 'HD',
                videoType: 'HLS'
              }
            ],
            duration: 0
          }
        },
        {
          id: 'tear-radio',
          title: 'T.E.A.R.adio Worldwide',
          shortDescription: 'Detroit Soul, Motown legends, R&B classics & S.T.E.A.R.Safe highway safety alerts.',
          thumbnail: '/app-media/app_logo.jpg',
          genres: ['music'],
          tags: ['radio', 'motown', 'soul', 'traffic-safety'],
          content: {
            dateAdded: '2025-01-01T00:00:00Z',
            videos: [
              {
                url: 'https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/live/tear-radio/stream.mp3',
                quality: 'FHD',
                videoType: 'HLS'
              }
            ],
            duration: 0
          }
        }
      ]
    });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  // HTTP POST Fallback for messages
  app.post('/api/chat/messages', (req, res) => {
    const { channelId = 'tears-prime', sender, text } = req.body || {};

    // Read-only guest spam enforcement
    if (!sender || sender.role === 'guest' || !sender.verified || !sender.name?.trim()) {
      return res.status(403).json({
        error: 'Read-only mode is active for guests to prevent live broadcast spam. Please set a verified screen name to participate.'
      });
    }

    const cleanText = String(text || '').trim().slice(0, 280);
    if (!cleanText) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      channelId,
      sender: {
        id: sender.id || `user-${Date.now()}`,
        name: sender.name.slice(0, 32),
        role: sender.role || 'member',
        badge: sender.badge || 'Verified',
        verified: true
      },
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!channelMessages[channelId]) {
      channelMessages[channelId] = [];
    }
    channelMessages[channelId].push(newMessage);
    if (channelMessages[channelId].length > 80) {
      channelMessages[channelId].shift();
    }

    // Broadcast to connected WebSocket clients
    const broadcastPayload = JSON.stringify({
      type: 'chat:message',
      channelId,
      message: newMessage
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        const clientSession = clients.get(client);
        if (clientSession && clientSession.channelId === channelId) {
          client.send(broadcastPayload);
        }
      }
    });

    return res.json({ success: true, message: newMessage });
  });

  // HTTP POST Fallback for reactions
  app.post('/api/chat/reaction', (req, res) => {
    const { channelId = 'tears-prime', emoji = '❤️', senderName = 'Viewer' } = req.body || {};
    const reactionPayload = JSON.stringify({
      type: 'chat:reaction',
      channelId,
      emoji,
      senderName
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        const clientSession = clients.get(client);
        if (clientSession && clientSession.channelId === channelId) {
          client.send(reactionPayload);
        }
      }
    });

    return res.json({ success: true, emoji });
  });

  wss.on('connection', (ws: WebSocket) => {
    const session: ClientSession = {
      ws,
      channelId: 'tears-prime',
      lastMessageTime: 0
    };
    clients.set(ws, session);

    // Send initial state for default channel
    const initialHistory = channelMessages[session.channelId] || [];
    ws.send(JSON.stringify({
      type: 'init',
      channelId: session.channelId,
      messages: initialHistory,
      onlineCount: Math.max(1, clients.size)
    }));

    // Broadcast updated presence
    broadcastPresence(wss);

    ws.on('message', (data: string) => {
      try {
        const payload = JSON.parse(data.toString());

        // 1. Channel Switching
        if (payload.type === 'join:channel') {
          const targetChannel = payload.channelId || 'tears-prime';
          session.channelId = targetChannel;
          ws.send(JSON.stringify({
            type: 'channel:switched',
            channelId: targetChannel,
            messages: channelMessages[targetChannel] || [],
            onlineCount: Math.max(1, clients.size)
          }));
          return;
        }

        // 2. Incoming Chat Message
        if (payload.type === 'chat:message') {
          const { sender, text } = payload;

          // READ-ONLY GUEST SPAM ENFORCEMENT
          if (!sender || sender.role === 'guest' || !sender.verified || !sender.name?.trim()) {
            ws.send(JSON.stringify({
              type: 'error',
              code: 'READ_ONLY_GUEST',
              message: 'Read-only mode is active for guests to prevent live broadcast spam. Please set a verified screen name to participate.'
            }));
            return;
          }

          // Rate Limiting (max 1 message every 1.5 seconds)
          const now = Date.now();
          if (now - session.lastMessageTime < 1500) {
            ws.send(JSON.stringify({
              type: 'error',
              code: 'RATE_LIMITED',
              message: 'Slow down! Please wait 1.5 seconds between messages.'
            }));
            return;
          }
          session.lastMessageTime = now;

          // Content Validation
          const cleanText = String(text || '').trim().slice(0, 280);
          if (!cleanText) return;

          const newMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            channelId: session.channelId,
            sender: {
              id: sender.id || `user-${Date.now()}`,
              name: sender.name.slice(0, 32),
              role: sender.role || 'member',
              badge: sender.badge || 'Verified',
              verified: true
            },
            text: cleanText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          // Store in message history (keep last 80 messages per channel)
          if (!channelMessages[session.channelId]) {
            channelMessages[session.channelId] = [];
          }
          channelMessages[session.channelId].push(newMessage);
          if (channelMessages[session.channelId].length > 80) {
            channelMessages[session.channelId].shift();
          }

          // Broadcast to all clients subscribed to this channel
          const broadcastPayload = JSON.stringify({
            type: 'chat:message',
            channelId: session.channelId,
            message: newMessage
          });

          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              const clientSession = clients.get(client);
              if (clientSession && clientSession.channelId === session.channelId) {
                client.send(broadcastPayload);
              }
            }
          });
          return;
        }

        // 3. Floating Reaction Broadcast (Hearts, Claps, Fire, etc.)
        if (payload.type === 'chat:reaction') {
          const reactionEmoji = payload.emoji || '❤️';
          const reactionPayload = JSON.stringify({
            type: 'chat:reaction',
            channelId: session.channelId,
            emoji: reactionEmoji,
            senderName: payload.senderName || 'Viewer'
          });

          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              const clientSession = clients.get(client);
              if (clientSession && clientSession.channelId === session.channelId) {
                client.send(reactionPayload);
              }
            }
          });
        }

      } catch (err) {
        // Ignore malformed payloads
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      broadcastPresence(wss);
    });
  });

  // Attach Vite middleware in development
  if (!isProd) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, () => {
    console.log(`T.E.A.R.S. Channel server + WebSocket live on http://localhost:${PORT}`);
  });
}

function broadcastPresence(wss: WebSocketServer) {
  const onlineCount = Math.max(1, wss.clients.size);
  const payload = JSON.stringify({
    type: 'presence',
    onlineCount
  });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

startServer();
