import React, { useState, useMemo } from 'react';
import { 
  ViewerAppointment, 
  ViewerNotificationPreferences, 
  AppointmentCategory,
  NotificationChannel,
  NotificationDisplayMode,
  NotificationFrequency
} from '../types';
import { 
  Calendar as CalendarIcon, Clock, Bell, BellRing, Volume2, 
  CheckCircle2, AlertTriangle, Plus, Trash2, Edit3, X, Check, 
  ShieldAlert, Sparkles, Smartphone, Eye, Sliders, ChevronLeft, 
  ChevronRight, ArrowRight, Play, Pause, RefreshCw, MapPin
} from 'lucide-react';

interface ViewerAppointmentCalendarProps {
  appointments: ViewerAppointment[];
  preferences: ViewerNotificationPreferences;
  onAddAppointment: (apt: Omit<ViewerAppointment, 'id' | 'createdAt'>) => void;
  onEditAppointment: (id: string, updated: Partial<ViewerAppointment>) => void;
  onDeleteAppointment: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdatePreferences: (prefs: Partial<ViewerNotificationPreferences>) => void;
  onTestNotification: () => void;
  onResetDefaults?: () => void;
}

export const ViewerAppointmentCalendar: React.FC<ViewerAppointmentCalendarProps> = ({
  appointments,
  preferences,
  onAddAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onToggleComplete,
  onUpdatePreferences,
  onTestNotification,
  onResetDefaults
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'agenda' | 'settings'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testTriggered, setTestTriggered] = useState(false);

  // Calendar navigation date state (Default to current month: October 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<AppointmentCategory>('Medical & Doctor');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState('11:00');
  const [formDuration, setFormDuration] = useState('45');
  const [formLocation, setFormLocation] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formPriority, setFormPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [formChannel, setFormChannel] = useState('T.E.A.R.S. Primetime TV');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
      if (selectedDay !== null && viewMode === 'month') {
        const aptDate = new Date(a.date);
        if (aptDate.getFullYear() === year && aptDate.getMonth() === month && aptDate.getDate() === selectedDay) {
          return true;
        }
        return false;
      }
      return true;
    }).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [appointments, selectedCategory, selectedDay, viewMode, year, month]);

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, ViewerAppointment[]> = {};
    appointments.forEach(a => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [appointments]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    onAddAppointment({
      title: formTitle.trim(),
      category: formCategory,
      date: formDate,
      time: formTime,
      durationMinutes: parseInt(formDuration) || 30,
      locationOrLink: formLocation.trim() || undefined,
      notes: formNotes.trim() || undefined,
      priority: formPriority,
      associatedChannelOrShow: formChannel,
      completed: false
    });

    setFormTitle('');
    setFormLocation('');
    setFormNotes('');
    setIsAddModalOpen(false);
  };

  const handleToggleChannel = (channel: NotificationChannel) => {
    const current = preferences.enabledChannels;
    const updated = current.includes(channel)
      ? current.filter(c => c !== channel)
      : [...current, channel];
    onUpdatePreferences({ enabledChannels: updated });
  };

  const handleTriggerTest = () => {
    onTestNotification();
    setTestTriggered(true);
    setTimeout(() => setTestTriggered(false), 2500);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner / Feature Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/30">
            <CalendarIcon className="w-4 h-4 text-purple-400" />
            <span>VIEWER ENTERTAINMENT &amp; APPOINTMENT PROTECTION SUITE</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            Appointment Protection Calendar &amp; Notification Engine
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Never miss doctor visits, court hearings, tax deadlines, or creator filming sessions while enjoying T.E.A.R.S. television and radio. Customize <strong>notification channels, visual display formats, and alert frequencies</strong> that pause or overlay entertainment automatically.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-Pause Watchdog Active</span>
            </span>
            <span>·</span>
            <span className="text-cyan-400">Harmonic Web Audio Chimes</span>
            <span>·</span>
            <span className="text-purple-400">PWA Vibration &amp; Push Alerts</span>
          </div>
        </div>
      </div>

      {/* Action Bar & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        
        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'month'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Month View</span>
          </button>

          <button
            onClick={() => setViewMode('agenda')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'agenda'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Agenda Roster ({appointments.length})</span>
          </button>

          <button
            onClick={() => setViewMode('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'settings'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Notification &amp; Display Preferences</span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleTriggerTest}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              testTriggered
                ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Preview how you will be notified right now"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            <span>{testTriggered ? 'Alert Fired!' : 'Test Notification'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: MONTH CALENDAR VIEW */}
      {/* ============================================================== */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Calendar Grid (8 Cols) */}
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            
            {/* Month Header Navigation */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {monthNames[month]} {year}
                </h4>
                <p className="text-xs text-slate-400">
                  Select a day to inspect protected appointments and upcoming commitments.
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                  title="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentDate(new Date(2026, 9, 1));
                    setSelectedDay(new Date().getDate());
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 font-mono border border-slate-800"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                  title="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Labels */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-slate-500 uppercase tracking-wider py-1 border-b border-slate-800/60">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading padding */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-xl bg-slate-950/20" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayAppointments = appointmentsByDate[dateKey] || [];
                const isSelected = selectedDay === dayNum;
                const hasAppointments = dayAppointments.length > 0;
                const hasCritical = dayAppointments.some(a => a.priority === 'critical');

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`aspect-square p-1.5 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer relative border ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg'
                        : hasAppointments
                        ? 'bg-slate-950 border-purple-500/30 hover:border-purple-400 text-slate-200'
                        : 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-purple-300' : ''}`}>
                      {dayNum}
                    </span>

                    {/* Appointment indicator badges */}
                    {hasAppointments && (
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className={`w-2 h-2 rounded-full ${hasCritical ? 'bg-rose-500 animate-ping' : 'bg-purple-400'}`} />
                        <span className="text-[10px] font-mono text-purple-300 font-bold hidden sm:inline">
                          {dayAppointments.length}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Scheduled Appointment</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Critical Priority Commitment</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-cyan-400 hover:text-white"
              >
                View All Month ({appointments.length})
              </button>
            </div>
          </div>

          {/* Selected Day Agenda Column (4 Cols) */}
          <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{selectedDay ? `${monthNames[month]} ${selectedDay}, ${year}` : 'All Month Agenda'}</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  {filteredAppointments.length} protected commitments
                </span>
              </div>
              {selectedDay && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="p-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              )}
            </div>

            {/* Appointment Cards List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <div 
                    key={apt.id} 
                    className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                      apt.completed 
                        ? 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60' 
                        : apt.priority === 'critical'
                        ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <button
                            onClick={() => onToggleComplete(apt.id)}
                            className="cursor-pointer text-slate-400 hover:text-emerald-400"
                            title={apt.completed ? 'Mark pending' : 'Mark completed'}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${apt.completed ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600'}`} />
                          </button>
                          <span className={apt.completed ? 'line-through' : ''}>{apt.title}</span>
                        </div>
                        <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
                          <span>{apt.time} ({apt.durationMinutes}m)</span>
                          <span>·</span>
                          <span className="text-slate-400">{apt.category}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 ${
                        apt.priority === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : apt.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {apt.priority}
                      </span>
                    </div>

                    {apt.locationOrLink && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{apt.locationOrLink}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 truncate max-w-[170px]">
                        Linked: {apt.associatedChannelOrShow || 'T.E.A.R.S. Live'}
                      </span>
                      <button
                        onClick={() => onDeleteAppointment(apt.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove appointment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <CalendarIcon className="w-6 h-6 text-slate-600 mx-auto" />
                  <p className="text-xs">No appointments scheduled for this date.</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-purple-400 hover:underline text-xs font-semibold"
                  >
                    + Schedule commitment
                  </button>
                </div>
              )}
            </div>

            {/* Watchdog Guarantee Note */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300 leading-relaxed">
              <strong>Entertainment Protection Watchdog:</strong> When this appointment approaches, video playback will pause and your chosen alert will fire so you never lose track of time.
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: COMPLETE AGENDA ROSTER VIEW */}
      {/* ============================================================== */}
      {viewMode === 'agenda' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white">Full Chronological Viewer Commitments</h4>
              <p className="text-xs text-slate-400">All registered appointments and television schedule watchdog anchors.</p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Filter Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="py-1.5 px-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Categories ({appointments.length})</option>
                <option value="Medical & Doctor">Medical &amp; Doctor</option>
                <option value="Legal & Court / Deposition">Legal &amp; Court</option>
                <option value="Creator Shoot & Filming">Creator Shoot &amp; Filming</option>
                <option value="Tax & Financial Review">Tax &amp; Financial Review</option>
                <option value="Broadcast Interview / Show">Broadcast Interview</option>
                <option value="Family & Personal Commitment">Family &amp; Personal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map(apt => (
              <div 
                key={apt.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                      {apt.category}
                    </span>
                    <h5 className="font-bold text-white text-sm">{apt.title}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 ${
                    apt.priority === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : apt.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {apt.priority}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800/80 space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Date:</span>
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Time:</span>
                    <span className="text-cyan-400 font-bold">{apt.time} ({apt.durationMinutes} min)</span>
                  </div>
                  {apt.locationOrLink && (
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Location:</span>
                      <span className="truncate max-w-[180px]">{apt.locationOrLink}</span>
                    </div>
                  )}
                </div>

                {apt.notes && (
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    &ldquo;{apt.notes}&rdquo;
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onToggleComplete(apt.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 cursor-pointer"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${apt.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>{apt.completed ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteAppointment(apt.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: NOTIFICATION & DISPLAY PREFERENCES (USER SELECTS) */}
      {/* ============================================================== */}
      {viewMode === 'settings' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Viewer Notification, Display &amp; Frequency Preferences</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure exactly how, where, and how frequently you want to be notified during entertainment playback.
              </p>
            </div>
            <button
              onClick={handleTriggerTest}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Test Current Setup</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            {/* Setting 1: How they want to be notified (Channels) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span>1. How to be Notified (Channels)</span>
                </h5>
                <span className="text-[10px] font-mono text-purple-400 font-bold">Select All</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Choose the hardware and software signals triggered when an appointment approaches.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  { id: 'audio_chime', label: 'In-App Audio Chime', desc: 'Harmonic Web Audio bell chime' },
                  { id: 'screen_hud', label: 'On-Screen HUD Banner', desc: 'Persistent banner over TV player' },
                  { id: 'auto_pause', label: 'Auto-Pause Video/Radio', desc: 'Pauses stream to prevent binge-lag' },
                  { id: 'browser_push', label: 'Browser Push Notification', desc: 'Native OS/Chrome popup alert' },
                  { id: 'haptic_vibration', label: 'Haptic Device Vibration', desc: 'Vibration pattern for mobile PWA' }
                ].map(item => {
                  const isChecked = preferences.enabledChannels.includes(item.id as NotificationChannel);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleChannel(item.id as NotificationChannel)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-purple-950/30 border-purple-500 text-white' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-purple-600 text-white' : 'border border-slate-700'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-purple-400" />
                    <span>Chime Volume:</span>
                  </span>
                  <span className="font-bold text-white">{preferences.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.volume}
                  onChange={e => onUpdatePreferences({ volume: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            {/* Setting 2: How it should be displayed (Visual Mode) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>2. How to Display (Visual Style)</span>
                </h5>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">Display Mode</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Choose the visual presentation style rendered on top of the live broadcast.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  { id: 'floating_banner', label: 'Floating Overlay Banner', desc: 'Top-anchored translucent glass banner' },
                  { id: 'glow_border', label: 'Ambient Flashing Screen Border', desc: 'Flashing perimeter light over TV' },
                  { id: 'modal_takeover', label: 'Modal Takeover Screen', desc: 'Fullscreen interrupt with Snooze & Dismiss' },
                  { id: 'subtle_badge', label: 'Subtle Corner Alert Pill', desc: 'Minimalist unobtrusive corner indicator' }
                ].map(item => {
                  const isSelected = preferences.displayMode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onUpdatePreferences({ displayMode: item.id as NotificationDisplayMode })}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-cyan-950/30 border-cyan-500 text-white' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-slate-700'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                <strong>TV Compatibility:</strong> All 4 display modes adapt seamlessly to Smart TVs, mobile PWA standalone viewports, and desktop browsers.
              </div>
            </div>

            {/* Setting 3: Frequency & Lead Time */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>3. Alert Timing &amp; Frequency</span>
                </h5>
                <span className="text-[10px] font-mono text-amber-400 font-bold">Frequency</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Determine how early and how repeatedly alerts trigger prior to appointment start time.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  { id: '15_min_before', label: '15 Minutes Before (Standard)', desc: 'Optimal lead time for leaving or joining' },
                  { id: '30_min_before', label: '30 Minutes Before', desc: 'Allows commute and prep time' },
                  { id: '5_min_before', label: '5 Minutes Before (Urgent)', desc: 'Final urgent reminder to wrap up stream' },
                  { id: 'at_time', label: 'At Exact Appointment Time', desc: 'Instant chime at starting minute' },
                  { id: 'staggered_series', label: '3-Stage Series (15m, 5m, Exact)', desc: 'Graduated reminders ensuring you remember' },
                  { id: 'repeating_snooze', label: 'Repeat Every 5 Minutes', desc: 'Continues chiming until user clicks Dismiss' }
                ].map(item => {
                  const isSelected = preferences.frequency === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onUpdatePreferences({ frequency: item.id as NotificationFrequency })}
                      className={`w-full p-2 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-amber-950/30 border-amber-500 text-white font-bold' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <div>{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-1 border ${
                        isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-slate-700'
                      }`}>
                        {isSelected && <span className="w-1 h-1 rounded-full bg-black" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {onResetDefaults && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={onResetDefaults}
                    className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to Recommended Safeguards</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SCHEDULE NEW APPOINTMENT */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl relative">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
              <CalendarIcon className="w-4 h-4 text-purple-400" />
              <span>PROTECT YOUR COMMITMENT FROM ENTERTAINMENT LAG</span>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-lg font-bold text-white">Schedule Viewer Commitment</h4>
              <p className="text-xs text-slate-400">
                Register an appointment so T.E.A.R.S. auto-pauses and notifies you beforehand.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Appointment Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Doctor Physical Exam or Court Deposition"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as AppointmentCategory)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Medical & Doctor">Medical &amp; Doctor</option>
                    <option value="Legal & Court / Deposition">Legal &amp; Court / Deposition</option>
                    <option value="Creator Shoot & Filming">Creator Shoot &amp; Filming</option>
                    <option value="Tax & Financial Review">Tax &amp; Financial Review</option>
                    <option value="Broadcast Interview / Show">Broadcast Interview / Show</option>
                    <option value="Family & Personal Commitment">Family &amp; Personal Commitment</option>
                    <option value="Business / Work Meeting">Business / Work Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="critical">Critical (Must Not Miss)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Location or Virtual Meeting URL</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  placeholder="e.g. 4201 St Antoine St, Detroit, MI or Zoom Link"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Protected Entertainment Channel</label>
                <select
                  value={formChannel}
                  onChange={e => setFormChannel(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="T.E.A.R.S. Primetime TV">T.E.A.R.S. Primetime TV (Ch 101)</option>
                  <option value="T.E.A.R. Real Estate Network">T.E.A.R. Real Estate Network (Ch 102)</option>
                  <option value="T.E.A.R.adio 24/7 Live Stream">T.E.A.R.adio 24/7 Live Stream (Ch 103)</option>
                  <option value="Advertisement & Business TV">Advertisement &amp; Business TV (Ch 104)</option>
                  <option value="All Broadcasts & VOD Player">All Broadcasts &amp; VOD Player</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Preparation Notes / Items to Bring</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Bring insurance card, signed documents, or equipment..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg"
                >
                  Activate Appointment Watchdog
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
