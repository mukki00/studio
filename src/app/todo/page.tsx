'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, Plus, Trash2, LogOut, CheckCircle2, Circle,
  ChevronDown, ChevronUp, Calendar, User, DollarSign,
  Clock, X, ListTree, Pencil,
} from 'lucide-react';

/* ── shared style tokens ─────────────────────────── */
const field  = 'w-full h-9 rounded-md border border-accent/20 bg-background/50 px-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50';
const lbl    = 'block text-[11px] font-medium text-foreground/55 mb-1';
const badge  = 'inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-accent/5 border border-accent/10 text-foreground/45';

/* ── module-level helpers ────────────────────────── */
const emptyDraft = { text: '', date: '', assignee: '', assigneeOther: '', budget: '', estHours: '' };
function fmtCurrency(amount: number, currency: string) {
  const sym = currency === 'LKR' ? '₨' : '$';
  return `${sym}${amount.toLocaleString()} ${currency}`;
}

/* ── types ───────────────────────────────────────── */
interface Subtask {
  text: string;
  done: boolean;
  date: string | null;
  assignee: string | null;
  budget: number | null;
  estimatedHours: number | null;
}

interface Todo {
  id: string;
  text: string;
  done: boolean;
  date: string | null;
  assignee: string | null;
  budget: number | null;
  budgetCurrency: string;
  estimatedHours: number | null;
  estimatedUnit: string;
  subtasks: Subtask[];
  createdAt: Date | null;
}

export default function TodoPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [todos, setTodos]       = useState<Todo[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  /* form state */
  const [formOpen,           setFormOpen]           = useState(false);
  const [adding,             setAdding]             = useState(false);
  const [newText,            setNewText]            = useState('');
  const [newDate,            setNewDate]            = useState('');
  const [newAssignee,        setNewAssignee]        = useState('');
  const [newAssigneeOther,   setNewAssigneeOther]   = useState('');
  const [newBudget,          setNewBudget]          = useState('');
  const [newBudgetCurrency,  setNewBudgetCurrency]  = useState<'USD' | 'LKR'>('USD');
  const [newEstHours,        setNewEstHours]        = useState('');
  const [newEstUnit,         setNewEstUnit]         = useState<'hrs' | 'days'>('hrs');
  const [newSubtasks,  setNewSubtasks]  = useState<Subtask[]>([]);
  const [stFormOpen,   setStFormOpen]   = useState(false);
  const [stDraft,      setStDraft]      = useState(emptyDraft);
  const [stError,      setStError]      = useState('');

  /* add-subtask-to-existing-task state */
  const [activeSubtaskId, setActiveSubtaskId] = useState<string | null>(null);
  const [subDraft,        setSubDraft]        = useState(emptyDraft);
  const [subError,        setSubError]        = useState('');

  /* expanded subtask panels */
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  /* delete confirmation */
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  /* edit task state */
  const [editingTaskId,  setEditingTaskId]  = useState<string | null>(null);
  const [editTaskDraft,  setEditTaskDraft]  = useState({
    text: '', date: '', assignee: '', assigneeOther: '',
    budget: '', budgetCurrency: 'USD' as 'USD' | 'LKR',
    estHours: '', estUnit: 'hrs' as 'hrs' | 'days',
  });

  /* edit subtask state */
  const [editingSubtask, setEditingSubtask] = useState<{ todoId: string; index: number } | null>(null);
  const [editSubDraft,   setEditSubDraft]   = useState(emptyDraft);
  const [editLoading,    setEditLoading]    = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Fetch all todos from MongoDB
  const fetchTodos = useCallback(async () => {
    try {
      const res  = await fetch('/api/workload');
      const data = await res.json() as Todo[];
      setTodos(data);
    } catch (err) {
      console.error('fetchTodos', err);
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTodos();
  }, [user, fetchTodos]);

  /* ── form helpers ────────────────────────────── */
  function commitSubtask() {
    if (!stDraft.text.trim()) { setStError('Title is required'); return; }
    const parentBudget = newBudget !== '' ? parseFloat(newBudget) : null;
    const parentEst    = newEstHours !== '' ? parseFloat(newEstHours) : null;
    const usedBudget   = newSubtasks.reduce((s, t) => s + (t.budget ?? 0), 0);
    const usedEst      = newSubtasks.reduce((s, t) => s + (t.estimatedHours ?? 0), 0);
    if (parentBudget !== null && stDraft.budget !== '') {
      const b = parseFloat(stDraft.budget);
      if (usedBudget + b > parentBudget) {
        setStError(`Budget exceeds remaining ${fmtCurrency(parentBudget - usedBudget, newBudgetCurrency)}`); return;
      }
    }
    if (parentEst !== null && stDraft.estHours !== '') {
      const e = parseFloat(stDraft.estHours);
      if (usedEst + e > parentEst) {
        setStError(`Exceeds remaining estimate (${parentEst - usedEst} ${newEstUnit})`); return;
      }
    }
    setNewSubtasks((p) => [...p, {
      text:           stDraft.text.trim(),
      done:           false,
      date:           stDraft.date || null,
      assignee:       stDraft.assignee === 'other' ? (stDraft.assigneeOther.trim() || null) : (stDraft.assignee || null),
      budget:         stDraft.budget !== '' ? parseFloat(stDraft.budget) : null,
      estimatedHours: stDraft.estHours !== '' ? parseFloat(stDraft.estHours) : null,
    }]);
    setStDraft(emptyDraft); setStError(''); setStFormOpen(false);
  }

  function resetForm() {
    setNewText(''); setNewDate(''); setNewAssignee('');
    setNewAssigneeOther(''); setNewBudget('');
    setNewBudgetCurrency('USD'); setNewEstHours('');
    setNewEstUnit('hrs'); setNewSubtasks([]);
    setStDraft(emptyDraft); setStFormOpen(false); setStError('');
  }

  /* ── CRUD ────────────────────────────────────── */
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim() || !user) return;
    setAdding(true);
    const res = await fetch('/api/workload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text:           newText.trim(),
        date:           newDate || null,
        assignee:       newAssignee === 'other'
                          ? (newAssigneeOther.trim() || null)
                          : (newAssignee || null),
        budget:         newBudget !== '' ? parseFloat(newBudget) : null,
        budgetCurrency: newBudgetCurrency,
        estimatedHours: newEstHours !== '' ? parseFloat(newEstHours) : null,
        estimatedUnit:  newEstUnit,
        subtasks:       newSubtasks,
      }),
    });
    const created = await res.json() as Todo;
    setTodos((p) => [...p, created]);
    resetForm();
    setFormOpen(false);
    setAdding(false);
  }

  async function toggleTodo(todo: Todo) {
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id, done: !todo.done }),
    });
    setTodos((p) => p.map((t) => t.id === todo.id ? { ...t, done: !t.done } : t));
  }

  async function toggleSubtask(todo: Todo, idx: number) {
    const updated = todo.subtasks.map((s, i) =>
      i === idx ? { ...s, done: !s.done } : s
    );
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id, subtaskIndex: idx, done: !todo.subtasks[idx].done }),
    });
    setTodos((p) => p.map((t) => t.id === todo.id ? { ...t, subtasks: updated } : t));
  }

  async function addSubtaskToTodo(todo: Todo) {
    if (!subDraft.text.trim()) { setSubError('Title is required'); return; }
    const usedBudget = (todo.subtasks ?? []).reduce((s, t) => s + (t.budget ?? 0), 0);
    const usedEst    = (todo.subtasks ?? []).reduce((s, t) => s + (t.estimatedHours ?? 0), 0);
    if (todo.budget !== null && subDraft.budget !== '') {
      const b = parseFloat(subDraft.budget);
      if (usedBudget + b > todo.budget) {
        setSubError(`Budget exceeds remaining ${fmtCurrency(todo.budget - usedBudget, todo.budgetCurrency)}`); return;
      }
    }
    if (todo.estimatedHours !== null && subDraft.estHours !== '') {
      const e = parseFloat(subDraft.estHours);
      if (usedEst + e > todo.estimatedHours) {
        setSubError(`Exceeds remaining estimate (${todo.estimatedHours - usedEst} ${todo.estimatedUnit})`); return;
      }
    }
    const newSub: Subtask = {
      text:           subDraft.text.trim(),
      done:           false,
      date:           subDraft.date || null,
      assignee:       subDraft.assignee === 'other' ? (subDraft.assigneeOther.trim() || null) : (subDraft.assignee || null),
      budget:         subDraft.budget !== '' ? parseFloat(subDraft.budget) : null,
      estimatedHours: subDraft.estHours !== '' ? parseFloat(subDraft.estHours) : null,
    };
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id, addSubtask: newSub }),
    });
    setTodos((p) => p.map((t) => t.id === todo.id ? { ...t, subtasks: [...(t.subtasks ?? []), newSub] } : t));
    setActiveSubtaskId(null);
    setSubDraft(emptyDraft);
    setSubError('');
    // ensure panel stays expanded
    setExpanded((p) => { const s = new Set(p); s.add(todo.id); return s; });
  }

  async function deleteTodo(id: string) {
    setConfirmDeleteId(null);
    await fetch('/api/workload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTodos((p) => p.filter((t) => t.id !== id));
  }

  async function saveEditTask() {
    if (!editingTaskId || !editTaskDraft.text.trim()) return;
    setEditLoading(true);
    const patch = {
      text:           editTaskDraft.text.trim(),
      date:           editTaskDraft.date || null,
      assignee:       editTaskDraft.assignee === 'other'
                        ? (editTaskDraft.assigneeOther.trim() || null)
                        : (editTaskDraft.assignee || null),
      budget:         editTaskDraft.budget !== '' ? parseFloat(editTaskDraft.budget) : null,
      budgetCurrency: editTaskDraft.budgetCurrency,
      estimatedHours: editTaskDraft.estHours !== '' ? parseFloat(editTaskDraft.estHours) : null,
      estimatedUnit:  editTaskDraft.estUnit,
    };
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingTaskId, updateTask: patch }),
    });
    setTodos((p) => p.map((t) => t.id === editingTaskId ? { ...t, ...patch } : t));
    setEditingTaskId(null);
    setEditLoading(false);
  }

  async function saveEditSubtask() {
    if (!editingSubtask || !editSubDraft.text.trim()) return;
    const { todoId, index } = editingSubtask;
    const parentTodo = todos.find((t) => t.id === todoId)!;
    setEditLoading(true);
    const updatedSub: Subtask = {
      text:           editSubDraft.text.trim(),
      done:           parentTodo.subtasks[index].done,
      date:           editSubDraft.date || null,
      assignee:       editSubDraft.assignee === 'other'
                        ? (editSubDraft.assigneeOther.trim() || null)
                        : (editSubDraft.assignee || null),
      budget:         editSubDraft.budget !== '' ? parseFloat(editSubDraft.budget) : null,
      estimatedHours: editSubDraft.estHours !== '' ? parseFloat(editSubDraft.estHours) : null,
    };
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todoId, subtaskIndex: index, updateSubtask: updatedSub }),
    });
    setTodos((p) => p.map((t) =>
      t.id === todoId
        ? { ...t, subtasks: t.subtasks.map((s, i) => i === index ? updatedSub : s) }
        : t
    ));
    setEditingSubtask(null);
    setEditSubDraft(emptyDraft);
    setEditLoading(false);
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const remaining = todos.filter((t) => !t.done).length;

  /* ── render ──────────────────────────────────── */
  return (
    <div className="relative min-h-screen hero-wave-bg overflow-hidden">

      {/* Dome silhouette */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: 'min(460px, 80vw)', opacity: 0.06 }}>
        <svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" className="w-full" fill="currentColor">
          <rect x="10" y="205" width="460" height="15" rx="3"/>
          <rect x="40" y="186" width="400" height="19" rx="2"/>
          <polygon points="55,186 425,186 405,138 75,138"/>
          <rect x="168" y="86" width="144" height="52" rx="5"/>
          <path d="M153,86 Q240,-35 327,86 Z"/>
          <rect x="237" y="-35" width="6" height="32" rx="2"/>
          <rect x="57" y="103" width="22" height="83" rx="3"/>
          <rect x="51" y="122" width="34" height="7" rx="1"/>
          <polygon points="57,103 79,103 68,74"/>
          <rect x="401" y="103" width="22" height="83" rx="3"/>
          <rect x="395" y="122" width="34" height="7" rx="1"/>
          <polygon points="401,103 423,103 412,74"/>
        </svg>
      </div>

      {/* Floating watermelons */}
      <span aria-hidden="true" className="pointer-events-none select-none absolute left-[4%]  bottom-[14%] text-2xl" style={{ animation: 'float-up-down 5s ease-in-out infinite' }}>🍉</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute right-[5%] bottom-[22%] text-xl" style={{ animation: 'float-up-down 6s ease-in-out infinite', animationDelay: '1.5s' }}>🍉</span>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-12">

        {/* ── page header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-accent/20 overflow-hidden flex-shrink-0">
              <img src="/profile_photo.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-headline text-xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                Workload
              </h1>
              <p className="text-xs text-foreground/50">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}
            className="border-accent/30 text-accent hover:bg-accent/10 gap-1.5">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        {/* ── progress pill ── */}
        {todos.length > 0 && (
          <div className="glass-card rounded-full px-5 py-2.5 mb-6 flex items-center justify-between text-sm">
            <span className="text-foreground/65">
              {remaining === 0 ? '🎉 All done!' : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`}
            </span>
            <span className="text-accent font-semibold">
              {todos.filter((t) => t.done).length} / {todos.length} completed
            </span>
          </div>
        )}

        {/* ── add task form ── */}
        <div className="glass-card rounded-2xl mb-6 overflow-visible">
          <button type="button"
            onClick={() => { setFormOpen((o) => !o); if (formOpen) resetForm(); }}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground/70 hover:text-accent hover:bg-accent/5 transition-colors rounded-2xl">
            <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add a new task</span>
            {formOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {formOpen && (
            <form onSubmit={addTodo} className="px-4 pb-5 space-y-4 border-t border-accent/10 pt-4">

              {/* Task title */}
              <div>
                <label className={lbl}>Task title <span className="text-accent">*</span></label>
                <Input
                  placeholder="e.g. Design homepage layout"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="h-9 bg-background/50 border-accent/20 focus:border-accent/50"
                  required
                  autoFocus
                />
              </div>

              {/* Row 1 — Due date + Assignee */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Due date <span className="text-accent">*</span></label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    style={{ colorScheme: 'light dark' }}
                    className={field}
                  />
                </div>
                <div>
                  <label className={lbl}>Assignee <span className="text-accent">*</span></label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    required
                    className={field}
                  >
                    <option value="">Select…</option>
                    <option value="Myself">Myself</option>
                    <option value="other">Other…</option>
                  </select>
                  {newAssignee === 'other' && (
                    <Input
                      placeholder="Enter name"
                      value={newAssigneeOther}
                      onChange={(e) => setNewAssigneeOther(e.target.value)}
                      required
                      className="h-9 mt-2 bg-background/50 border-accent/20 focus:border-accent/50"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              {/* Row 2 — Budget + Estimated */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Budget <span className="text-accent">*</span></label>
                  <div className="flex gap-1.5">
                    <select
                      value={newBudgetCurrency}
                      onChange={(e) => setNewBudgetCurrency(e.target.value as 'USD' | 'LKR')}
                      className="h-9 rounded-md border border-accent/20 bg-background/50 px-2 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/50 shrink-0"
                    >
                      <option value="USD">USD $</option>
                      <option value="LKR">LKR ₨</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={newBudget}
                      onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                      onChange={(e) => setNewBudget(e.target.value)}
                      required
                      className={`${field} flex-1 min-w-0`}
                    />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Estimated time <span className="text-accent">*</span></label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={newEstHours}
                      onChange={(e) => setNewEstHours(e.target.value)}
                      required
                      className={`${field} flex-1 min-w-0`}
                    />
                    <select
                      value={newEstUnit}
                      onChange={(e) => setNewEstUnit(e.target.value as 'hrs' | 'days')}
                      className="h-9 rounded-md border border-accent/20 bg-background/50 px-2 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/50 shrink-0"
                    >
                      <option value="hrs">hrs</option>
                      <option value="days">days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sub-tasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={lbl}><ListTree className="inline h-3 w-3 mr-1" />Sub-tasks <span className="text-foreground/35 font-normal">(optional)</span></label>
                  {(newBudget !== '' || newEstHours !== '') && (
                    <div className="flex gap-3 text-[10px] text-foreground/40">
                      {newBudget !== '' && (
                        <span>Pool: {fmtCurrency(
                          parseFloat(newBudget) - newSubtasks.reduce((s, t) => s + (t.budget ?? 0), 0),
                          newBudgetCurrency
                        )} left</span>
                      )}
                      {newEstHours !== '' && (
                        <span>{parseFloat(newEstHours) - newSubtasks.reduce((s, t) => s + (t.estimatedHours ?? 0), 0)} {newEstUnit} left</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Added subtasks list */}
                {newSubtasks.length > 0 && (
                  <ul className="mb-2 space-y-1.5">
                    {newSubtasks.map((st, i) => (
                      <li key={i} className="flex items-start gap-2 px-3 py-2 rounded-md bg-accent/5 border border-accent/10">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-foreground/80">{st.text}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {st.date && (
                              <span className={badge}><Calendar className="h-2 w-2" />{new Date(st.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                            )}
                            {st.assignee && <span className={badge}><User className="h-2 w-2" />{st.assignee}</span>}
                            {st.budget != null && (
                              <span className={badge}><DollarSign className="h-2 w-2" />{fmtCurrency(st.budget, newBudgetCurrency)}</span>
                            )}
                            {st.estimatedHours != null && (
                              <span className={badge}><Clock className="h-2 w-2" />{st.estimatedHours} {newEstUnit}</span>
                            )}
                          </div>
                        </div>
                        <button type="button" onClick={() => setNewSubtasks((p) => p.filter((_, idx) => idx !== i))}
                          className="shrink-0 text-foreground/30 hover:text-destructive transition-colors mt-0.5">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Sub-task entry form */}
                {stFormOpen ? (
                  <div className="rounded-lg border border-accent/20 bg-accent/[0.04] p-3 space-y-3">
                    <input type="text" placeholder="Sub-task title *" value={stDraft.text}
                      onChange={(e) => setStDraft({ ...stDraft, text: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                      className={field} autoFocus />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={lbl}>Due date</label>
                        <input type="date" value={stDraft.date}
                          max={newDate || undefined}
                          style={{ colorScheme: 'light dark' }}
                          onChange={(e) => setStDraft({ ...stDraft, date: e.target.value })}
                          className={field} />
                      </div>
                      <div>
                        <label className={lbl}>Assignee</label>
                        <select value={stDraft.assignee}
                          onChange={(e) => setStDraft({ ...stDraft, assignee: e.target.value })}
                          className={field}>
                          <option value="">Select…</option>
                          <option value="Myself">Myself</option>
                          <option value="other">Other…</option>
                        </select>
                        {stDraft.assignee === 'other' && (
                          <Input placeholder="Enter name" value={stDraft.assigneeOther}
                            onChange={(e) => setStDraft({ ...stDraft, assigneeOther: e.target.value })}
                            className="h-9 mt-1.5 bg-background/50 border-accent/20 focus:border-accent/50" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={lbl}>
                          Budget
                          {newBudget !== '' && (
                            <span className="text-foreground/35 font-normal ml-1">
                              (max {fmtCurrency(parseFloat(newBudget) - newSubtasks.reduce((s,t) => s+(t.budget??0),0), newBudgetCurrency)})
                            </span>
                          )}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-foreground/50 shrink-0">{newBudgetCurrency === 'LKR' ? '₨' : '$'}</span>
                          <input type="number" min="0" step="0.01" placeholder="0.00"
                            value={stDraft.budget}
                            max={newBudget !== '' ? (parseFloat(newBudget) - newSubtasks.reduce((s,t) => s+(t.budget??0),0)).toString() : undefined}
                            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                            onChange={(e) => { setStDraft({ ...stDraft, budget: e.target.value }); setStError(''); }}
                            className={`${field} flex-1`} />
                        </div>
                      </div>
                      <div>
                        <label className={lbl}>
                          Estimate
                          {newEstHours !== '' && (
                            <span className="text-foreground/35 font-normal ml-1">
                              (max {parseFloat(newEstHours) - newSubtasks.reduce((s,t) => s+(t.estimatedHours??0),0)} {newEstUnit})
                            </span>
                          )}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input type="number" min="0" step="0.5" placeholder="0"
                            value={stDraft.estHours}
                            max={newEstHours !== '' ? (parseFloat(newEstHours) - newSubtasks.reduce((s,t) => s+(t.estimatedHours??0),0)).toString() : undefined}
                            onChange={(e) => { setStDraft({ ...stDraft, estHours: e.target.value }); setStError(''); }}
                            className={`${field} flex-1`} />
                          <span className="text-xs text-foreground/50 shrink-0">{newEstUnit}</span>
                        </div>
                      </div>
                    </div>

                    {stError && <p className="text-xs text-destructive">{stError}</p>}

                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="ghost" size="sm"
                        onClick={() => { setStFormOpen(false); setStDraft(emptyDraft); setStError(''); }}
                        className="text-foreground/50 hover:text-foreground">Cancel</Button>
                      <Button type="button" size="sm" onClick={commitSubtask}
                        disabled={!stDraft.text.trim()}
                        className="bg-accent/80 hover:bg-accent text-accent-foreground gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Add sub-task
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={() => setStFormOpen(true)}
                    className="w-full border-dashed border-accent/25 text-accent/60 hover:text-accent hover:border-accent/40 hover:bg-accent/5 gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Add sub-task
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-1 border-t border-accent/10">
                <Button type="button" variant="ghost" size="sm"
                  onClick={() => { setFormOpen(false); resetForm(); }}
                  className="text-foreground/50 hover:text-foreground">
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={adding || !newText.trim()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                  {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  Add task
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* ── task list ── */}
        {dbLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : todos.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-foreground/50 text-sm">No tasks yet. Add one above!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => {
              const isExpanded  = expanded.has(todo.id);
              const doneCount   = (todo.subtasks ?? []).filter((s) => s.done).length;
              const totalSubs   = (todo.subtasks ?? []).length;

              return (
                <li key={todo.id} className={`glass-card card-swim rounded-xl overflow-hidden group transition-shadow ${confirmDeleteId === todo.id ? 'ring-1 ring-destructive/40 shadow-destructive/10' : ''}`}>
                  {/* Main task row or inline edit form */}
                  {editingTaskId === todo.id ? (
                    <div className="px-4 py-3 space-y-3">
                      <div>
                        <label className={lbl}>Task title <span className="text-accent">*</span></label>
                        <Input
                          value={editTaskDraft.text}
                          onChange={(e) => setEditTaskDraft({ ...editTaskDraft, text: e.target.value })}
                          className="h-9 bg-background/50 border-accent/20 focus:border-accent/50"
                          autoFocus
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={lbl}>Due date</label>
                          <input type="date" value={editTaskDraft.date}
                            onChange={(e) => setEditTaskDraft({ ...editTaskDraft, date: e.target.value })}
                            style={{ colorScheme: 'light dark' }} className={field} />
                        </div>
                        <div>
                          <label className={lbl}>Assignee</label>
                          <select value={editTaskDraft.assignee}
                            onChange={(e) => setEditTaskDraft({ ...editTaskDraft, assignee: e.target.value })}
                            className={field}>
                            <option value="">Select…</option>
                            <option value="Myself">Myself</option>
                            <option value="other">Other…</option>
                          </select>
                          {editTaskDraft.assignee === 'other' && (
                            <Input value={editTaskDraft.assigneeOther}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, assigneeOther: e.target.value })}
                              placeholder="Enter name"
                              className="h-9 mt-1.5 bg-background/50 border-accent/20 focus:border-accent/50" />
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={lbl}>Budget</label>
                          <div className="flex gap-1.5">
                            <select value={editTaskDraft.budgetCurrency}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, budgetCurrency: e.target.value as 'USD' | 'LKR' })}
                              className="h-9 rounded-md border border-accent/20 bg-background/50 px-2 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/50 shrink-0">
                              <option value="USD">USD $</option>
                              <option value="LKR">LKR ₨</option>
                            </select>
                            <input type="number" min="0" step="0.01" placeholder="0.00"
                              value={editTaskDraft.budget}
                              onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, budget: e.target.value })}
                              className={`${field} flex-1 min-w-0`} />
                          </div>
                        </div>
                        <div>
                          <label className={lbl}>Estimated time</label>
                          <div className="flex gap-1.5">
                            <input type="number" min="0" step="0.5" placeholder="0"
                              value={editTaskDraft.estHours}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, estHours: e.target.value })}
                              className={`${field} flex-1 min-w-0`} />
                            <select value={editTaskDraft.estUnit}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, estUnit: e.target.value as 'hrs' | 'days' })}
                              className="h-9 rounded-md border border-accent/20 bg-background/50 px-2 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/50 shrink-0">
                              <option value="hrs">hrs</option>
                              <option value="days">days</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-1 border-t border-accent/10">
                        <Button type="button" variant="ghost" size="sm"
                          onClick={() => setEditingTaskId(null)}
                          className="text-foreground/50 hover:text-foreground">Cancel</Button>
                        <Button type="button" size="sm"
                          onClick={saveEditTask}
                          disabled={editLoading || !editTaskDraft.text.trim()}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                          {editLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                          Save changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                  <div className="px-4 py-3 flex gap-3">
                    <button onClick={() => toggleTodo(todo)}
                      aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
                      className="shrink-0 mt-0.5 text-accent hover:scale-110 transition-transform">
                      {todo.done
                        ? <CheckCircle2 className="h-5 w-5 fill-accent/20" />
                        : <Circle className="h-5 w-5 opacity-50" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <span className={`block text-sm font-medium leading-snug ${todo.done ? 'line-through text-foreground/35' : 'text-foreground/85'}`}>
                        {todo.text}
                      </span>
                      {/* Meta badges */}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {todo.date && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/8 border border-accent/15 text-foreground/55">
                            <Calendar className="h-2.5 w-2.5" />
                            {new Date(todo.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </span>
                        )}
                        {todo.assignee && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/8 border border-accent/15 text-foreground/55">
                            <User className="h-2.5 w-2.5" />{todo.assignee}
                          </span>
                        )}
                        {todo.budget != null && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/8 border border-accent/15 text-foreground/55">
                            <DollarSign className="h-2.5 w-2.5" />
                            {todo.budgetCurrency === 'LKR' ? '₨' : '$'}{todo.budget.toLocaleString()} {todo.budgetCurrency}
                          </span>
                        )}
                        {todo.estimatedHours != null && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/8 border border-accent/15 text-foreground/55">
                            <Clock className="h-2.5 w-2.5" />{todo.estimatedHours} {todo.estimatedUnit}
                          </span>
                        )}
                        {totalSubs > 0 && (
                          <button
                            onClick={() => setExpanded((p) => {
                              const s = new Set(p);
                              s.has(todo.id) ? s.delete(todo.id) : s.add(todo.id);
                              return s;
                            })}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/8 border border-accent/15 text-accent hover:bg-accent/15 transition-colors">
                            <ListTree className="h-2.5 w-2.5" />
                            {doneCount}/{totalSubs} subtasks
                            {isExpanded ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditTaskDraft({
                          text: todo.text,
                          date: todo.date || '',
                          assignee: todo.assignee ? (todo.assignee === 'Myself' ? 'Myself' : 'other') : '',
                          assigneeOther: (todo.assignee && todo.assignee !== 'Myself') ? todo.assignee : '',
                          budget: todo.budget != null ? todo.budget.toString() : '',
                          budgetCurrency: todo.budgetCurrency as 'USD' | 'LKR',
                          estHours: todo.estimatedHours != null ? todo.estimatedHours.toString() : '',
                          estUnit: todo.estimatedUnit as 'hrs' | 'days',
                        });
                        setEditingTaskId(todo.id);
                      }}
                      aria-label="Edit task"
                      className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/30 hover:text-accent">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirmDeleteId(confirmDeleteId === todo.id ? null : todo.id)} aria-label="Delete task"
                      className={`shrink-0 mt-0.5 transition-opacity text-foreground/30 hover:text-destructive ${confirmDeleteId === todo.id ? 'opacity-100 text-destructive' : 'opacity-0 group-hover:opacity-100'}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveSubtaskId(todo.id);
                        setSubDraft(emptyDraft);
                        setSubError('');
                        setExpanded((p) => { const s = new Set(p); s.add(todo.id); return s; });
                      }}
                      aria-label="Add sub-task"
                      className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/30 hover:text-accent">
                      <ListTree className="h-4 w-4" />
                    </button>
                  </div>
                  )}

                  {/* Delete confirmation strip */}
                  {confirmDeleteId === todo.id && (
                    <div className="px-4 py-2.5 flex items-center justify-between gap-3 bg-destructive/8 border-t border-destructive/20">
                      <div className="flex items-center gap-2 min-w-0">
                        <Trash2 className="h-3.5 w-3.5 text-destructive/70 shrink-0" />
                        <span className="text-xs text-foreground/60 truncate">
                          Delete <span className="font-semibold text-foreground/80">&ldquo;{todo.text}&rdquo;</span>?
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs px-2.5 py-1 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent/10 transition-colors">
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-xs px-3 py-1 rounded-md bg-destructive hover:bg-destructive/90 text-white font-medium transition-colors flex items-center gap-1.5">
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subtask panel */}
                  {(isExpanded || activeSubtaskId === todo.id) && (
                    <div className="border-t border-accent/10 bg-accent/[0.03]">

                      {/* Existing subtasks */}
                      {totalSubs > 0 && (
                        <ul className="px-4 pt-2 pb-1 space-y-1">
                          {(todo.subtasks ?? []).map((sub, i) => (
                            <li key={i} className={editingSubtask?.todoId === todo.id && editingSubtask?.index === i ? 'rounded-md bg-accent/5 border border-accent/20 p-2 space-y-2' : 'group/sub flex items-start gap-2 py-1.5'}>
                              {editingSubtask?.todoId === todo.id && editingSubtask?.index === i ? (
                                <>
                                  <input type="text" value={editSubDraft.text}
                                    onChange={(e) => setEditSubDraft({ ...editSubDraft, text: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                    className={field} autoFocus />
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className={lbl}>Due date</label>
                                      <input type="date" value={editSubDraft.date}
                                        max={todo.date || undefined}
                                        style={{ colorScheme: 'light dark' }}
                                        onChange={(e) => setEditSubDraft({ ...editSubDraft, date: e.target.value })}
                                        className={field} />
                                    </div>
                                    <div>
                                      <label className={lbl}>Assignee</label>
                                      <select value={editSubDraft.assignee}
                                        onChange={(e) => setEditSubDraft({ ...editSubDraft, assignee: e.target.value })}
                                        className={field}>
                                        <option value="">Select…</option>
                                        <option value="Myself">Myself</option>
                                        <option value="other">Other…</option>
                                      </select>
                                      {editSubDraft.assignee === 'other' && (
                                        <Input value={editSubDraft.assigneeOther}
                                          onChange={(e) => setEditSubDraft({ ...editSubDraft, assigneeOther: e.target.value })}
                                          placeholder="Enter name"
                                          className="h-9 mt-1.5 bg-background/50 border-accent/20 focus:border-accent/50" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className={lbl}>Budget</label>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-foreground/50 shrink-0">{todo.budgetCurrency === 'LKR' ? '₨' : '$'}</span>
                                        <input type="number" min="0" step="0.01" placeholder="0.00"
                                          value={editSubDraft.budget}
                                          onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                          onChange={(e) => setEditSubDraft({ ...editSubDraft, budget: e.target.value })}
                                          className={`${field} flex-1`} />
                                      </div>
                                    </div>
                                    <div>
                                      <label className={lbl}>Estimate</label>
                                      <div className="flex items-center gap-1.5">
                                        <input type="number" min="0" step="0.5" placeholder="0"
                                          value={editSubDraft.estHours}
                                          onChange={(e) => setEditSubDraft({ ...editSubDraft, estHours: e.target.value })}
                                          className={`${field} flex-1`} />
                                        <span className="text-xs text-foreground/50 shrink-0">{todo.estimatedUnit}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 justify-end pt-1 border-t border-accent/10">
                                    <Button type="button" variant="ghost" size="sm"
                                      onClick={() => { setEditingSubtask(null); setEditSubDraft(emptyDraft); }}
                                      className="text-foreground/50 hover:text-foreground">Cancel</Button>
                                    <Button type="button" size="sm"
                                      onClick={saveEditSubtask}
                                      disabled={editLoading || !editSubDraft.text.trim()}
                                      className="bg-accent/80 hover:bg-accent text-accent-foreground gap-1.5">
                                      {editLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                                      Save
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => toggleSubtask(todo, i)}
                                    className="shrink-0 mt-0.5 text-accent/70 hover:scale-110 transition-transform">
                                    {sub.done
                                      ? <CheckCircle2 className="h-4 w-4 fill-accent/15" />
                                      : <Circle className="h-4 w-4 opacity-40" />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <span className={`text-xs font-medium leading-snug ${sub.done ? 'line-through text-foreground/30' : 'text-foreground/65'}`}>
                                      {sub.text}
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {sub.date && (
                                        <span className={badge}><Calendar className="h-2 w-2" />{new Date(sub.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                      )}
                                      {sub.assignee && <span className={badge}><User className="h-2 w-2" />{sub.assignee}</span>}
                                      {sub.budget != null && (
                                        <span className={badge}><DollarSign className="h-2 w-2" />{fmtCurrency(sub.budget, todo.budgetCurrency)}</span>
                                      )}
                                      {sub.estimatedHours != null && (
                                        <span className={badge}><Clock className="h-2 w-2" />{sub.estimatedHours} {todo.estimatedUnit}</span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setEditSubDraft({
                                        text: sub.text,
                                        date: sub.date || '',
                                        assignee: sub.assignee ? (sub.assignee === 'Myself' ? 'Myself' : 'other') : '',
                                        assigneeOther: (sub.assignee && sub.assignee !== 'Myself') ? sub.assignee : '',
                                        budget: sub.budget != null ? sub.budget.toString() : '',
                                        estHours: sub.estimatedHours != null ? sub.estimatedHours.toString() : '',
                                      });
                                      setEditingSubtask({ todoId: todo.id, index: i });
                                    }}
                                    aria-label="Edit sub-task"
                                    className="shrink-0 mt-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity text-foreground/30 hover:text-accent">
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Add sub-task to existing task */}
                      {activeSubtaskId === todo.id ? (() => {
                        const usedBudget = (todo.subtasks ?? []).reduce((s, t) => s + (t.budget ?? 0), 0);
                        const usedEst    = (todo.subtasks ?? []).reduce((s, t) => s + (t.estimatedHours ?? 0), 0);
                        const remBudget  = todo.budget !== null ? todo.budget - usedBudget : null;
                        const remEst     = todo.estimatedHours !== null ? todo.estimatedHours - usedEst : null;
                        return (
                          <div className="px-4 pb-3 pt-2 space-y-3 border-t border-accent/10">
                            <input type="text" placeholder="Sub-task title *" value={subDraft.text}
                              onChange={(e) => setSubDraft({ ...subDraft, text: e.target.value })}
                              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                              className={field} autoFocus />

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className={lbl}>Due date</label>
                                <input type="date" value={subDraft.date}
                                  max={todo.date || undefined}
                                  style={{ colorScheme: 'light dark' }}
                                  onChange={(e) => setSubDraft({ ...subDraft, date: e.target.value })}
                                  className={field} />
                              </div>
                              <div>
                                <label className={lbl}>Assignee</label>
                                <select value={subDraft.assignee}
                                  onChange={(e) => setSubDraft({ ...subDraft, assignee: e.target.value })}
                                  className={field}>
                                  <option value="">Select…</option>
                                  <option value="Myself">Myself</option>
                                  <option value="other">Other…</option>
                                </select>
                                {subDraft.assignee === 'other' && (
                                  <Input placeholder="Enter name" value={subDraft.assigneeOther}
                                    onChange={(e) => setSubDraft({ ...subDraft, assigneeOther: e.target.value })}
                                    className="h-9 mt-1.5 bg-background/50 border-accent/20 focus:border-accent/50" />
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className={lbl}>
                                  Budget
                                  {remBudget !== null && (
                                    <span className="text-foreground/35 font-normal ml-1">(max {fmtCurrency(remBudget, todo.budgetCurrency)})</span>
                                  )}
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-foreground/50 shrink-0">{todo.budgetCurrency === 'LKR' ? '₨' : '$'}</span>
                                  <input type="number" min="0" step="0.01" placeholder="0.00"
                                    value={subDraft.budget}
                                    max={remBudget !== null ? remBudget.toString() : undefined}
                                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                    onChange={(e) => { setSubDraft({ ...subDraft, budget: e.target.value }); setSubError(''); }}
                                    className={`${field} flex-1`} />
                                </div>
                              </div>
                              <div>
                                <label className={lbl}>
                                  Estimate
                                  {remEst !== null && (
                                    <span className="text-foreground/35 font-normal ml-1">(max {remEst} {todo.estimatedUnit})</span>
                                  )}
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input type="number" min="0" step="0.5" placeholder="0"
                                    value={subDraft.estHours}
                                    max={remEst !== null ? remEst.toString() : undefined}
                                    onChange={(e) => { setSubDraft({ ...subDraft, estHours: e.target.value }); setSubError(''); }}
                                    className={`${field} flex-1`} />
                                  <span className="text-xs text-foreground/50 shrink-0">{todo.estimatedUnit}</span>
                                </div>
                              </div>
                            </div>

                            {subError && <p className="text-xs text-destructive">{subError}</p>}

                            <div className="flex gap-2 justify-end">
                              <Button type="button" variant="ghost" size="sm"
                                onClick={() => { setActiveSubtaskId(null); setSubDraft(emptyDraft); setSubError(''); }}
                                className="text-foreground/50 hover:text-foreground">Cancel</Button>
                              <Button type="button" size="sm" onClick={() => addSubtaskToTodo(todo)}
                                disabled={!subDraft.text.trim()}
                                className="bg-accent/80 hover:bg-accent text-accent-foreground gap-1.5">
                                <Plus className="h-3.5 w-3.5" /> Add sub-task
                              </Button>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="px-4 pb-3 pt-2">
                          <Button type="button" variant="outline" size="sm"
                            onClick={() => { setActiveSubtaskId(todo.id); setSubDraft(emptyDraft); setSubError(''); }}
                            className="w-full border-dashed border-accent/25 text-accent/60 hover:text-accent hover:border-accent/40 hover:bg-accent/5 gap-1.5">
                            <Plus className="h-3.5 w-3.5" /> Add sub-task
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
