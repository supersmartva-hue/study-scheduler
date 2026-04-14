import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActiveSchedule, generateNewSchedule, markComplete, markSkip } from '../store/scheduleSlice';
import { fetchSubjects } from '../store/subjectsSlice';
import Button from '../components/common/Button';
import { Sparkles, Calendar, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import Tooltip from '../components/common/Tooltip';
import { formatTime, getWeekDays, getMondayOfWeek, addDays, formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:     { bg: '#eef2ff', text: '#4f46e5', label: 'Pending'   },
  completed:   { bg: '#ecfdf5', text: '#059669', label: 'Done'      },
  missed:      { bg: '#fff1f2', text: '#e11d48', label: 'Missed'    },
  skipped:     { bg: '#f8fafc', text: '#64748b', label: 'Skipped'   },
  rescheduled: { bg: '#fffbeb', text: '#d97706', label: 'Moved'     },
};

function SessionBlock({ session, onComplete, onSkip, fullWidth = false }) {
  const cfg    = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
  const canAct = session.status === 'pending';

  if (fullWidth) {
    return (
      <div className={`rounded-2xl p-4 border transition-all duration-150 ${canAct ? 'hover:shadow-md' : 'opacity-80'}`}
        style={{ background: canAct ? '#fff' : '#fafafa', borderColor: canAct ? '#e2e8f0' : '#f1f5f9' }}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-10 rounded-full flex-shrink-0"
            style={{ backgroundColor: session.subject_color || '#6366f1' }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {session.title || session.subject_name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Clock size={11} />
              {formatTime(session.start_time)} – {formatTime(session.end_time)} · {session.duration_mins} min
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0"
            style={{ background: cfg.bg, color: cfg.text }}>
            {cfg.label}
          </span>
        </div>
        {canAct && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
            <button onClick={() => onComplete(session.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <CheckCircle2 size={15} /> Mark Done
            </button>
            <button onClick={() => onSkip(session.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors">
              <XCircle size={15} /> Skip
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-2.5 border transition-all duration-150 ${canAct ? 'hover:shadow-md cursor-default' : 'opacity-80'}`}
      style={{ background: canAct ? '#fff' : '#fafafa', borderColor: canAct ? '#e2e8f0' : '#f1f5f9' }}>
      <div className="flex items-start gap-2 mb-1.5">
        <div className="w-1.5 h-full min-h-full rounded-full flex-shrink-0 mt-0.5"
          style={{ minHeight: 28, backgroundColor: session.subject_color || '#6366f1' }} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-slate-800 leading-tight truncate">
            {session.title || session.subject_name}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-0.5">
            <Clock size={9} />
            {formatTime(session.start_time)}
            <span className="mx-0.5">·</span>
            {session.duration_mins}m
          </p>
        </div>
      </div>
      <span className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold"
        style={{ background: cfg.bg, color: cfg.text }}>
        {cfg.label}
      </span>
      {canAct && (
        <div className="flex gap-1 mt-2 pt-1.5 border-t border-slate-100">
          <Tooltip text="Mark complete — earns XP and updates your streak" position="top">
            <button onClick={() => onComplete(session.id)}
              className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded-lg text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <CheckCircle2 size={10} /> Done
            </button>
          </Tooltip>
          <Tooltip text="Skip session — marks it as skipped, no XP earned" position="top">
            <button onClick={() => onSkip(session.id)}
              className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors">
              <XCircle size={10} /> Skip
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default function Schedule() {
  const dispatch = useDispatch();
  const { data: schedule, loading, generating, error } = useSelector(s => s.schedule);
  const subjects = useSelector(s => s.subjects.items);
  const [weekOffset, setWeekOffset] = useState(0);
  const [mobileDayIdx, setMobileDayIdx] = useState(0);

  const weekStart = getMondayOfWeek(addDays(new Date(), weekOffset * 7));
  const weekDays  = getWeekDays(weekStart);

  // Reset mobile day selection to today (or 0) when week changes
  useEffect(() => {
    const today = formatDate(new Date());
    const idx = weekDays.findIndex(d => d.date === today);
    setMobileDayIdx(idx >= 0 ? idx : 0);
  }, [weekOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchActiveSchedule());
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleGenerate = async () => {
    if (subjects.length === 0) { toast.error('Add at least one subject first!'); return; }
    const result = await dispatch(generateNewSchedule());
    if (!result.error) {
      toast.success(result.payload?.isMock ? '📅 Schedule ready! (Mock mode — add OpenAI key for AI-powered)' : '✨ AI schedule generated!');
    } else {
      toast.error(result.payload || 'Failed to generate');
    }
  };

  const handleComplete = async (id) => {
    await dispatch(markComplete(id));
    toast.success('🎉 Session complete! XP earned!');
  };

  const sessionsByDay = (date) =>
    schedule?.sessions?.filter(s => s.planned_date?.startsWith(date)) || [];

  const totalThisWeek  = schedule?.sessions?.length || 0;
  const doneThisWeek   = schedule?.sessions?.filter(s => s.status === 'completed').length || 0;

  return (
    <div className="space-y-5 max-w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Weekly Schedule</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' – '}
            {addDays(new Date(weekStart), 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {totalThisWeek > 0 && ` · ${doneThisWeek}/${totalThisWeek} done`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            <button onClick={() => setWeekOffset(w => w - 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => setWeekOffset(0)}
              className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              Today
            </button>
            <button onClick={() => setWeekOffset(w => w + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>
          <Tooltip text={schedule ? 'Regenerate — creates a fresh AI schedule (replaces current)' : 'Generate — AI builds your personalized weekly study plan'} position="bottom">
            <Button onClick={handleGenerate} loading={generating} size="md">
              <Sparkles size={15} />
              <span className="hidden sm:inline">{schedule ? 'Regenerate' : 'Generate Schedule'}</span>
              <span className="sm:hidden">{schedule ? 'Regen' : 'Generate'}</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* AI reasoning */}
      {schedule?.ai_reasoning && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-2xl border"
          style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', borderColor: '#c7d2fe' }}>
          <Bot size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-800 leading-relaxed">
            <span className="font-bold">AI Insight: </span>{schedule.ai_reasoning}
          </p>
        </div>
      )}

      {/* Generating state */}
      {generating && (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Sparkles size={28} className="text-white" />
          </div>
          <h3 className="font-bold text-slate-800">Building your schedule...</h3>
          <p className="text-sm text-slate-400 mt-1">AI is analyzing your subjects and deadlines</p>
        </div>
      )}

      {/* Empty state */}
      {!schedule && !loading && !generating && (
        <div className="card p-14 text-center">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)' }}>
            <Calendar size={28} className="text-brand-400" />
          </div>
          <h3 className="font-bold text-slate-700 text-lg">No schedule yet</h3>
          <p className="text-sm text-slate-400 mt-1.5 max-w-xs mx-auto">
            Click "Generate Schedule" and let AI create your perfect weekly study plan
          </p>
          <Button className="mt-5" onClick={handleGenerate} loading={generating}>
            <Sparkles size={15} /> Generate My Schedule
          </Button>
        </div>
      )}

      {/* Weekly calendar grid */}
      {schedule && !generating && (
        <>
          {/* ── Desktop (sm+): 7-column grid ── */}
          <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
            <div className="grid grid-cols-7 gap-2 min-w-[640px]">
              {weekDays.map(({ date, label, dayNum, isToday }) => {
                const daySessions = sessionsByDay(date);
                const done = daySessions.filter(s => s.status === 'completed').length;
                const total = daySessions.length;

                return (
                  <div key={date}
                    className={`rounded-2xl border flex flex-col min-h-[280px] overflow-hidden transition-shadow ${
                      isToday ? 'shadow-brand' : ''
                    }`}
                    style={{
                      background: isToday ? 'linear-gradient(180deg, #eef2ff 0%, #fff 40%)' : '#fff',
                      borderColor: isToday ? '#818cf8' : '#e2e8f0',
                    }}>
                    {/* Day header */}
                    <div className={`px-2.5 py-2.5 border-b ${isToday ? 'border-indigo-200' : 'border-slate-50'}`}>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</div>
                      <div className={`text-lg font-black leading-none mt-0.5 ${isToday ? 'text-brand-600' : 'text-slate-800'}`}>
                        {dayNum}
                      </div>
                      {total > 0 && (
                        <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{
                              width: `${(done / total) * 100}%`,
                              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                              transition: 'width 0.7s ease',
                            }} />
                        </div>
                      )}
                    </div>

                    {/* Sessions */}
                    <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                      {daySessions.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-[10px] text-slate-300 text-center font-medium">Free day</p>
                        </div>
                      ) : (
                        daySessions.map(s => (
                          <SessionBlock key={s.id} session={s}
                            onComplete={handleComplete}
                            onSkip={id => dispatch(markSkip(id))} />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mobile (< sm): single-day view ── */}
          <div className="sm:hidden">
            {/* Day tab bar */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {weekDays.map(({ date, label, dayNum, isToday }, i) => {
                const daySessions = sessionsByDay(date);
                const isSelected = mobileDayIdx === i;
                return (
                  <button key={date} onClick={() => setMobileDayIdx(i)}
                    className="flex-shrink-0 flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-150"
                    style={isSelected
                      ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff' }
                      : isToday
                      ? { background: '#eef2ff', color: '#4f46e5' }
                      : { background: '#f8fafc', color: '#64748b' }
                    }>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                    <span className="text-lg font-black leading-none mt-0.5">{dayNum}</span>
                    {daySessions.length > 0 && (
                      <div className="w-1.5 h-1.5 rounded-full mt-1"
                        style={{ background: isSelected ? 'rgba(255,255,255,0.7)' : '#6366f1' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sessions for selected day */}
            <div className="mt-3">
              {(() => {
                const { date } = weekDays[mobileDayIdx] || {};
                const daySessions = sessionsByDay(date);
                if (daySessions.length === 0) return (
                  <div className="text-center py-12 card">
                    <p className="text-2xl mb-2">🎉</p>
                    <p className="text-sm font-semibold text-slate-600">Free day!</p>
                    <p className="text-xs text-slate-400 mt-1">No sessions scheduled</p>
                  </div>
                );
                return (
                  <div className="space-y-2.5">
                    {daySessions.map(s => (
                      <SessionBlock key={s.id} session={s} fullWidth
                        onComplete={handleComplete}
                        onSkip={id => dispatch(markSkip(id))} />
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      {/* Legend */}
      {schedule && (
        <div className="flex items-center gap-4 flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: cfg.text }} />
              <span className="text-slate-500">{cfg.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
