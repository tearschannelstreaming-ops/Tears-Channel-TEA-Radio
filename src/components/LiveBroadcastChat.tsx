import React, { useState, useEffect, useRef } from 'react';
import { ChannelId } from '../types';
import { useBroadcastChat, ChatMessage } from '../hooks/useBroadcastChat';
import { 
  MessageSquare, Send, Lock, Unlock, ShieldCheck, CheckCircle2, 
  Users, Pin, Sparkles, X, ChevronDown, ChevronUp, AlertCircle, 
  Heart, Flame, ThumbsUp, Trophy, Building2, Radio, User
} from 'lucide-react';

interface LiveBroadcastChatProps {
  channelId: ChannelId;
  channelName: string;
  isDocked?: boolean;
  onToggleDock?: () => void;
}

const REACTION_EMOJIS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👏', label: 'Applause' },
  { emoji: '🏆', label: 'Champion' },
  { emoji: '🏙️', label: 'Detroit Land' },
  { emoji: '📻', label: 'Soul Music' }
];

export const LiveBroadcastChat: React.FC<LiveBroadcastChatProps> = ({
  channelId,
  channelName,
  isDocked = true,
  onToggleDock
}) => {
  const {
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
  } = useBroadcastChat(channelId);

  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Verification form state
  const [verifyName, setVerifyName] = useState('');
  const [verifyRole, setVerifyRole] = useState<'member' | 'broker'>('member');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!isCollapsed) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCollapsed]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    if (isGuest) {
      setShowUnlockModal(true);
      return;
    }

    setIsSending(true);
    const success = await sendMessage(inputText);
    setIsSending(false);
    if (success) {
      setInputText('');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = verifyName.trim();
    if (cleanName.length < 2) {
      setVerifyError('Please enter at least 2 characters for your screen name.');
      return;
    }
    setVerifiedUser(cleanName, verifyRole, verifyEmail);
    setShowUnlockModal(false);
    setVerifyError('');
  };

  return (
    <div className="flex flex-col h-full bg-[#090e18] border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
      
      {/* Floating Reaction Visual Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {floatingReactions.map(r => (
          <div
            key={r.id}
            className="absolute bottom-16 text-2xl animate-float-up opacity-90 filter drop-shadow-md select-none"
            style={{ left: `${r.x}%` }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-[#0d1524] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className={`w-2 h-2 rounded-full absolute -top-1 -right-1 ${
              isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
            }`} />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">Live Broadcast Chat</span>
              <span className="px-1.5 py-0.2 rounded bg-black/50 text-[10px] font-mono text-cyan-300 border border-slate-700/80">
                {channelName.split(':')[0]}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{onlineCount.toLocaleString()} in room</span>
              </span>
              <span>·</span>
              <span>{isConnected ? 'Real-Time Sync' : 'Reconnecting...'}</span>
            </div>
          </div>
        </div>

        {/* Spam Protection & Collapse Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isGuest ? (
            <button
              onClick={() => setShowUnlockModal(true)}
              className="px-2 py-0.5 rounded-md bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
              title="Guest Mode: Read-Only to prevent spam. Click to unlock chat."
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Read-Only</span>
            </button>
          ) : (
            <div className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="truncate max-w-[80px]">{currentUser.name}</span>
            </div>
          )}

          {onToggleDock && (
            <button
              onClick={onToggleDock}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Close Live Chat"
              aria-label="Close Live Chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors sm:hidden"
            title="Collapse chat"
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Pinned Broadcast Announcement */}
          <div className="px-3.5 py-2 bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#121c2e] border-b border-amber-500/30 flex items-start gap-2 text-xs shrink-0">
            <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 fill-current" />
            <div className="text-[11px] text-slate-300 leading-tight">
              <span className="font-bold text-amber-300">Jeanell Land (CEO &amp; Land Broker): </span>
              <span>Metro Detroit land site walks &amp; Change.org Family Reunite Act petition are live. Keep discussions courteous and spam-free!</span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="px-3 py-1.5 bg-red-950/80 border-b border-red-500/40 text-[11px] font-mono text-red-200 flex items-center justify-between shrink-0 animate-in fade-in">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-1">
                <MessageSquare className="w-6 h-6 mx-auto text-slate-600" />
                <p className="font-semibold text-slate-400">Welcome to T.E.A.R.S. Live Chat</p>
                <p className="text-[11px]">Be the first verified viewer to send a message!</p>
              </div>
            ) : (
              messages.map(msg => {
                const isFounder = msg.sender.role === 'founder' || msg.sender.name.toLowerCase().includes('jeanell');
                const isBroker = msg.sender.role === 'broker';
                const isMod = msg.sender.role === 'moderator';

                return (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-2.5 transition-colors ${
                      msg.pinned
                        ? 'bg-amber-950/20 border border-amber-500/30'
                        : 'bg-black/30 border border-slate-800/80 hover:bg-black/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-bold ${
                          isFounder ? 'text-amber-300' : isBroker ? 'text-cyan-300' : isMod ? 'text-emerald-300' : 'text-slate-200'
                        }`}>
                          {msg.sender.name}
                        </span>

                        {/* Verified Role Badge */}
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          isFounder
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : isBroker
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : isMod
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {msg.sender.badge || (msg.sender.verified ? 'Verified' : 'Viewer')}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs break-words">
                      {msg.text}
                    </p>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reaction Emoji Row */}
          <div className="px-3 py-1.5 bg-[#0a101d] border-t border-slate-800 flex items-center justify-between gap-1 shrink-0">
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              Reactions:
            </span>
            <div className="flex items-center gap-1.5 flex-1 justify-around sm:justify-end">
              {REACTION_EMOJIS.map(r => (
                <button
                  key={r.label}
                  onClick={() => sendReaction(r.emoji)}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-sm hover:scale-125 transition-transform"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area: Read-Only Guest Warning vs Live Input Form */}
          <div className="p-3 bg-[#0d1524] border-t border-slate-800 shrink-0">
            {isGuest ? (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Read-Only Guest Mode (Spam Protection)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Zero Spam</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Guests can watch the real-time chat and send reactions. To send messages in the live broadcast, choose your screen name.
                </p>
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="w-full py-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-extrabold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Set Screen Name to Chat (Free)</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    maxLength={280}
                    placeholder={`Chat as ${currentUser.name}...`}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="p-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold rounded-xl transition-all shrink-0 hover:scale-105"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified: {currentUser.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={resetToGuest}
                      className="text-slate-500 hover:text-slate-300 underline"
                      title="Switch back to read-only guest mode"
                    >
                      (Switch to Guest)
                    </button>
                  </div>
                  <span>{inputText.length}/280</span>
                </div>
              </form>
            )}
          </div>
        </>
      )}

      {/* Screen Name Verification Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Unlock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-white">
                  Join Live Broadcast Chat
                </h3>
              </div>
              <button
                onClick={() => setShowUnlockModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              T.E.A.R.S. Channel enforces read-only mode for anonymous visitors to protect viewers from spam bots. Choose a verified screen name to participate.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Screen Name *
                </label>
                <input
                  type="text"
                  required
                  value={verifyName}
                  onChange={e => { setVerifyName(e.target.value); setVerifyError(''); }}
                  placeholder="e.g. Marcus D. (Detroit Investor)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Viewer Interest / Role
                </label>
                <select
                  value={verifyRole}
                  onChange={e => setVerifyRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="member">Viewer / TV &amp; Radio Enthusiast</option>
                  <option value="broker">Commercial Real Estate Investor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email (Optional for network notifications)
                </label>
                <input
                  type="email"
                  value={verifyEmail}
                  onChange={e => setVerifyEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {verifyError && (
                <p className="text-[11px] text-red-400 font-mono">{verifyError}</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Stay Guest
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-lg transition-all shadow"
                >
                  Unlock Live Chat
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
              Protected by S.T.E.A.R.Safe anti-spam protocols.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
