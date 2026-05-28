'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2, LogOut, Waves, CheckCircle2, Circle } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: Date | null;
}

export default function TodoPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [todos, setTodos]       = useState<Todo[]>([]);
  const [newText, setNewText]   = useState('');
  const [adding, setAdding]     = useState(false);
  const [dbLoading, setDbLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Real-time Firestore listener
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'todos'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'asc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setTodos(snap.docs.map((d) => ({
        id: d.id,
        text: d.data().text as string,
        done: d.data().done as boolean,
        createdAt: d.data().createdAt?.toDate() ?? null,
      })));
      setDbLoading(false);
    });
    return unsub;
  }, [user]);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim() || !user) return;
    setAdding(true);
    await addDoc(collection(db, 'todos'), {
      uid: user.uid,
      text: newText.trim(),
      done: false,
      createdAt: serverTimestamp(),
    });
    setNewText('');
    setAdding(false);
  }

  async function toggleTodo(todo: Todo) {
    await updateDoc(doc(db, 'todos', todo.id), { done: !todo.done });
  }

  async function deleteTodo(id: string) {
    await deleteDoc(doc(db, 'todos', id));
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

  return (
    <div className="relative min-h-screen hero-wave-bg overflow-hidden">

      {/* Floating bubbles */}
      {[
        { left: '5%',  bottom: '12%', size: 'w-3 h-3', delay: '0s',   dur: '4.2s' },
        { left: '15%', bottom: '30%', size: 'w-2 h-2', delay: '1.5s', dur: '3.8s' },
        { right: '8%', bottom: '20%', size: 'w-4 h-4', delay: '2.4s', dur: '5.0s' },
        { right: '20%',bottom: '40%', size: 'w-2 h-2', delay: '0.8s', dur: '4.6s' },
      ].map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`pointer-events-none absolute ${b.size} rounded-full bg-accent/20 animate-float`}
          style={{ left: b.left, right: b.right, bottom: b.bottom, animationDelay: b.delay, animationDuration: b.dur } as React.CSSProperties}
        />
      ))}

      <div className="relative z-10 max-w-xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Waves className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="font-headline text-xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                My Todos
              </h1>
              <p className="text-xs text-foreground/50">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-accent/30 text-accent hover:bg-accent/10 gap-1.5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        {/* Progress pill */}
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

        {/* Add todo form */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <Input
            placeholder="Add a new task…"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 bg-background/50 border-accent/20 focus:border-accent/50"
          />
          <Button
            type="submit"
            disabled={adding || !newText.trim()}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        {/* Todo list */}
        {dbLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : todos.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-foreground/50 text-sm">No tasks yet. Add one above!</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="glass-card card-swim rounded-xl px-4 py-3 flex items-center gap-3 group"
              >
                <button
                  onClick={() => toggleTodo(todo)}
                  aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
                  className="shrink-0 text-accent hover:scale-110 transition-transform"
                >
                  {todo.done
                    ? <CheckCircle2 className="h-5 w-5 fill-accent/20" />
                    : <Circle className="h-5 w-5 opacity-50" />}
                </button>
                <span className={`flex-1 text-sm leading-snug transition-all ${todo.done ? 'line-through text-foreground/35' : 'text-foreground/85'}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete task"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/30 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
