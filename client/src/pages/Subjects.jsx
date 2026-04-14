import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubjects, addSubject, editSubject, removeSubject } from '../store/subjectsSlice';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import ProgressBar from '../components/common/ProgressBar';
import { Plus, Pencil, Trash2, BookOpen, Clock, Target, AlertCircle } from 'lucide-react';
import { SUBJECT_COLORS, DIFFICULTY_LABELS } from '../utils/constants';
import Tooltip from '../components/common/Tooltip';

const DIFF_CONFIG = {
  1: { label: 'Very Easy', color: '#10b981', bg: '#ecfdf5' },
  2: { label: 'Easy',      color: '#06b6d4', bg: '#ecfeff' },
  3: { label: 'Medium',    color: '#6366f1', bg: '#eef2ff' },
  4: { label: 'Hard',      color: '#f59e0b', bg: '#fffbeb' },
  5: { label: 'Very Hard', color: '#f43f5e', bg: '#fff1f2' },
};

function SubjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '', description: '', color: SUBJECT_COLORS[0],
    difficulty: 3, estimatedHours: 10, deadline: '', priority: 3,
    ...initial,
  });
  const set    = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setNum = k => e => setForm(f => ({ ...f, [k]: Number(e.target.value) }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-5">
      <Input label="Subject Name *" value={form.name} onChange={set('name')} required placeholder="e.g. Advanced Mathematics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Difficulty</label>
          <div className="grid grid-cols-5 gap-1">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button"
                onClick={() => setForm(f => ({ ...f, difficulty: n }))}
                className="py-2 rounded-xl text-xs font-bold transition-all duration-150 border-2"
                style={form.difficulty === n
                  ? { background: DIFF_CONFIG[n].color, color: '#fff', borderColor: DIFF_CONFIG[n].color }
                  : { background: DIFF_CONFIG[n].bg, color: DIFF_CONFIG[n].color, borderColor: 'transparent' }
                }>
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1 text-center">{DIFF_CONFIG[form.difficulty]?.label}</p>
        </div>
        <Input label="Estimated Hours *" type="number" min="1" step="0.5"
          value={form.estimatedHours} onChange={setNum('estimatedHours')} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Deadline" type="date" value={form.deadline || ''} onChange={set('deadline')} />
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Priority: {form.priority}/5</label>
          <input type="range" min="1" max="5" value={form.priority} onChange={setNum('priority')}
            className="w-full accent-indigo-500 mt-2" />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {SUBJECT_COLORS.map(c => (
            <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
              className="w-8 h-8 rounded-xl transition-all duration-150 border-2"
              style={{ backgroundColor: c, borderColor: form.color === c ? '#1e293b' : 'transparent', transform: form.color === c ? 'scale(1.15)' : 'scale(1)' }} />
          ))}
        </div>
      </div>

      <Input label="Description (optional)" value={form.description || ''} onChange={set('description')} placeholder="What will you study?" />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" className="flex-1">
          {initial?.id ? 'Save Changes' : 'Add Subject'}
        </Button>
      </div>
    </form>
  );
}

export default function Subjects() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.subjects);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);

  useEffect(() => { dispatch(fetchSubjects()); }, [dispatch]);

  const handleSave = async (form) => {
    if (editing) await dispatch(editSubject({ id: editing.id, data: form }));
    else await dispatch(addSubject(form));
    setShowForm(false); setEditing(null);
  };

  const handleDelete = id => {
    if (confirm('Remove this subject? This cannot be undone.')) dispatch(removeSubject(id));
  };

  const totalHours = items.reduce((a, s) => a + Number(s.estimated_hours || 0), 0);
  const doneHours  = items.reduce((a, s) => a + Number(s.hours_completed || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Subjects</h2>
          <p className="text-sm text-slate-500 mt-0.5">{items.length} subject{items.length !== 1 ? 's' : ''} · {doneHours.toFixed(1)} / {totalHours.toFixed(0)}h completed</p>
        </div>
        <Tooltip text="Add a new subject with estimated hours, deadline & difficulty" position="bottom">
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={16} /> Add Subject
          </Button>
        </Tooltip>
      </div>

      {/* Summary bar */}
      {items.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Overall Progress</span>
            <span className="text-sm font-bold text-slate-700">{totalHours > 0 ? Math.round((doneHours / totalHours) * 100) : 0}%</span>
          </div>
          <ProgressBar value={doneHours} max={totalHours || 1} />
          <div className="flex gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock size={11} /> {doneHours.toFixed(1)}h studied</span>
            <span className="flex items-center gap-1"><Target size={11} /> {(totalHours - doneHours).toFixed(1)}h remaining</span>
            <span className="flex items-center gap-1"><BookOpen size={11} /> {items.length} subjects</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-2xl skeleton" />)}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="card p-14 text-center">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)' }}>
            <BookOpen size={28} className="text-brand-400" />
          </div>
          <h3 className="font-bold text-slate-700 text-lg">No subjects yet</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">Add your first subject to start scheduling</p>
          <Button onClick={() => setShowForm(true)}><Plus size={15} /> Add First Subject</Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(subject => {
          const pct     = subject.estimated_hours > 0 ? Math.min(100, (subject.hours_completed / subject.estimated_hours) * 100) : 0;
          const hoursLeft = Math.max(0, subject.estimated_hours - subject.hours_completed).toFixed(1);
          const diff    = DIFF_CONFIG[subject.difficulty] || DIFF_CONFIG[3];
          const isNearDeadline = subject.deadline && new Date(subject.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000;

          return (
            <div key={subject.id} className="card p-5 group">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}cc)` }}>
                    {subject.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{subject.name}</h3>
                    <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: diff.bg, color: diff.color }}>
                      {diff.label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Tooltip text="Edit subject — update name, hours, deadline & color" position="top">
                    <button onClick={() => { setEditing(subject); setShowForm(true); }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                      <Pencil size={13} />
                    </button>
                  </Tooltip>
                  <Tooltip text="Delete subject — removes all associated sessions too" position="top">
                    <button onClick={() => handleDelete(subject.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{Number(subject.hours_completed).toFixed(1)}h done</span>
                  <span className="font-semibold">{Math.round(pct)}%</span>
                </div>
                <ProgressBar value={pct} max={100}
                  gradient={`linear-gradient(90deg, ${subject.color}, ${subject.color}aa)`} />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{hoursLeft}h left</span>
                  <span>of {subject.estimated_hours}h total</span>
                </div>
              </div>

              {/* Footer */}
              {subject.deadline && (
                <div className={`mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-xs font-medium ${isNearDeadline ? 'text-rose-500' : 'text-slate-400'}`}>
                  {isNearDeadline && <AlertCircle size={12} />}
                  <Clock size={11} />
                  Deadline: {new Date(subject.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {isNearDeadline && <span className="ml-auto text-rose-400 font-bold">Soon!</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? 'Edit Subject' : 'Add New Subject'}>
        <SubjectForm initial={editing || {}} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      </Modal>
    </div>
  );
}
