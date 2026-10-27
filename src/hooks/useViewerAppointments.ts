import { useState, useEffect, useCallback } from 'react';
import { 
  ViewerAppointment, 
  ViewerNotificationPreferences, 
  AppointmentCategory,
  NotificationChannel,
  NotificationDisplayMode,
  NotificationFrequency
} from '../types';

const APPOINTMENTS_STORAGE_KEY = 'tears_viewer_appointments_v1';
const PREFERENCES_STORAGE_KEY = 'tears_viewer_notification_prefs_v1';

// Seed benchmark appointments
const getTomorrowDate = (daysAhead: number = 1): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

const INITIAL_APPOINTMENTS: ViewerAppointment[] = [
  {
    id: 'apt-001',
    title: 'Medical Health Screening & Cardiologist Checkup',
    category: 'Medical & Doctor',
    date: getTomorrowDate(1),
    time: '10:30',
    durationMinutes: 45,
    locationOrLink: 'Detroit Medical Center (DMC) Specialty Clinic',
    notes: 'Fast 2 hours prior; bring medical card and photo ID.',
    priority: 'high',
    associatedChannelOrShow: 'T.E.A.R.S. Primetime TV',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-002',
    title: 'IRS Schedule C Quarterly Estimated Tax Review',
    category: 'Tax & Financial Review',
    date: getTomorrowDate(3),
    time: '14:00',
    durationMinutes: 60,
    locationOrLink: 'Zoom CPA Consultation with Michigan Tax Group',
    notes: 'Review camera gear receipts, drone leases, and 1099-NEC distribution inflow.',
    priority: 'high',
    associatedChannelOrShow: 'Advertisement & Business TV',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-003',
    title: 'Woodward Corridor 4K Drone Filming Session',
    category: 'Creator Shoot & Filming',
    date: getTomorrowDate(5),
    time: '09:00',
    durationMinutes: 180,
    locationOrLink: 'Woodward Ave & Warren Parcel Assemblage, Detroit MI',
    notes: 'FAA Part 107 Class D airspace authorization active. Sony FX6 and Inspire 3.',
    priority: 'medium',
    associatedChannelOrShow: 'T.E.A.R. Real Estate Network',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-004',
    title: 'USPTO Sovereign Biometrics Patent Docket Review',
    category: 'Legal & Court / Deposition',
    date: getTomorrowDate(8),
    time: '15:30',
    durationMinutes: 45,
    locationOrLink: 'Federal Patent Attorney Secure Video Conference',
    notes: 'Review System Claims 4, 5, 6, and 7 (Zero-Honeypot Client-Side Verification).',
    priority: 'critical',
    associatedChannelOrShow: 'T.E.A.R.S. Primetime TV',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-005',
    title: 'T.E.A.R.adio Live Airplay Interview with Jeanell Land',
    category: 'Broadcast Interview / Show',
    date: getTomorrowDate(10),
    time: '18:00',
    durationMinutes: 60,
    locationOrLink: 'T.E.A.R.adio 24/7 Live Broadcast Studio / Ch 103',
    notes: 'Discuss Motown soul music releases, DSP distribution, and Family Reunite Act.',
    priority: 'high',
    associatedChannelOrShow: 'T.E.A.R.adio 24/7 Live Stream',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_PREFERENCES: ViewerNotificationPreferences = {
  enabledChannels: ['audio_chime', 'screen_hud', 'auto_pause', 'browser_push'],
  displayMode: 'floating_banner',
  frequency: '15_min_before',
  soundEnabled: true,
  volume: 85,
  autoPauseVideoOnAlert: true,
  leadTimeMinutes: 15
};

export function useViewerAppointments() {
  const [appointments, setAppointments] = useState<ViewerAppointment[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_APPOINTMENTS;
  });

  const [preferences, setPreferences] = useState<ViewerNotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PREFERENCES;
  });

  const [activeAlertAppointment, setActiveAlertAppointment] = useState<ViewerAppointment | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    } catch {}
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  // High-fidelity Web Audio Chime generator (Pure client-side, zero external MP3 dependency)
  const playChimeSound = useCallback(() => {
    if (!preferences.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const vol = (preferences.volume / 100) * 0.3;

      // Two-tone harmonic bell (C5 -> E5 -> G5)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(vol, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.0);
      });
    } catch {
      // AudioContext unavailable
    }
  }, [preferences.soundEnabled, preferences.volume]);

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200, 100, 300]);
      } catch {}
    }
  }, []);

  // Browser Web Notification
  const triggerPushNotification = useCallback((apt: ViewerAppointment) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(`T.E.A.R.S. Viewer Alert: ${apt.title}`, {
            body: `Starting at ${apt.time}. Entertainment has been auto-paused to protect your schedule.`,
            icon: '/pwa-192x192.png',
            tag: `apt-${apt.id}`
          });
        } catch {}
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Execute full notification dispatch according to user preferences
  const executeNotification = useCallback((apt: ViewerAppointment) => {
    if (preferences.enabledChannels.includes('audio_chime')) {
      playChimeSound();
    }
    if (preferences.enabledChannels.includes('haptic_vibration')) {
      triggerHaptic();
    }
    if (preferences.enabledChannels.includes('browser_push')) {
      triggerPushNotification(apt);
    }
    if (preferences.enabledChannels.includes('screen_hud') || preferences.enabledChannels.includes('auto_pause')) {
      setActiveAlertAppointment(apt);
    }
  }, [preferences, playChimeSound, triggerHaptic, triggerPushNotification]);

  // Interactive Test Notification
  const testNotification = useCallback(() => {
    const sampleApt: ViewerAppointment = {
      id: 'test-preview',
      title: 'Sample Priority Appointment (Entertainment Protection Active)',
      category: 'Medical & Doctor',
      date: new Date().toISOString().split('T')[0],
      time: new Date(Date.now() + 15 * 60000).toTimeString().slice(0, 5),
      durationMinutes: 30,
      locationOrLink: 'Downtown Medical Suite',
      notes: 'This is a live preview of your configured appointment notification style.',
      priority: 'critical',
      associatedChannelOrShow: 'T.E.A.R.S. Primetime TV',
      completed: false,
      createdAt: new Date().toISOString()
    };
    executeNotification(sampleApt);
  }, [executeNotification]);

  // Appointment Actions
  const addAppointment = useCallback((newApt: Omit<ViewerAppointment, 'id' | 'createdAt'>) => {
    const item: ViewerAppointment = {
      ...newApt,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [item, ...prev]);
    return item;
  }, []);

  const editAppointment = useCallback((id: string, updated: Partial<ViewerAppointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  }, []);

  const updatePreferences = useCallback((newPrefs: Partial<ViewerNotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  const dismissAlert = useCallback(() => {
    setActiveAlertAppointment(null);
  }, []);

  const snoozeAlert = useCallback((minutes: number = 5) => {
    setActiveAlertAppointment(null);
    setTimeout(() => {
      playChimeSound();
      triggerHaptic();
    }, minutes * 60000);
  }, [playChimeSound, triggerHaptic]);

  const resetDefaults = useCallback(() => {
    setAppointments(INITIAL_APPOINTMENTS);
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
  }, []);

  return {
    appointments,
    preferences,
    activeAlertAppointment,
    addAppointment,
    editAppointment,
    deleteAppointment,
    toggleComplete,
    updatePreferences,
    executeNotification,
    testNotification,
    dismissAlert,
    snoozeAlert,
    resetDefaults
  };
}
