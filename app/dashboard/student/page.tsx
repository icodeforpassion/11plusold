"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/Card';
import { ProgressRing } from '../../../components/ProgressRing';
import { ResponsiveTable } from '../../../components/ResponsiveTable';
import { Button } from '../../../components/Button';
import { TrendSparkline } from '../../../components/TrendSparkline';
import { initFirebase } from '../../../firebase/init';
import { onAuthStateChanged } from 'firebase/auth';

type StudentProgress = {
  streak: number;
  xp: number;
  accuracy: number;
  minutes: number;
  nextRecommended: Array<{ topic: string; mode: string; difficulty: string }>;
  accuracyByTopic: Array<{ topic: string; accuracy: number }>;
  accuracyTrend: number[];
  updatedAt: string;
};

export default function StudentDashboard() {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const { auth } = initFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatusMessage('Sign in to see your personalised progress dashboard.');
        setProgress(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setStatusMessage(null);
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/studentProgress?childId=${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load progress.');
        }
        const data = (await response.json()) as StudentProgress;
        setProgress(data);
      } catch (error: any) {
        setStatusMessage(error.message || 'Unable to load progress.');
        setProgress(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const stats = useMemo(
    () =>
      progress ?? {
        streak: 0,
        xp: 0,
        accuracy: 0,
        minutes: 0,
        nextRecommended: [],
        accuracyByTopic: [],
        accuracyTrend: [],
        updatedAt: ''
      },
    [progress]
  );

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-text">Welcome back!</h1>
            <p className="text-sm text-slate-600">
              {loading ? 'Loading your latest progress…' : 'Your learning streak is growing — keep the confidence going.'}
            </p>
          </div>
          <Link
            href="/practice/maths"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Start a 10-question practice
          </Link>
        </header>

        {statusMessage && (
          <Card className="border-amber-200 bg-amber-50 text-sm text-amber-700">
            {statusMessage}
          </Card>
        )}

        <section className="grid gap-4 md:grid-cols-4" aria-label="Key stats">
          <Card className="space-y-2">
            <p className="text-sm text-slate-500">Streak</p>
            <p className="text-3xl font-semibold">{stats.streak} days 🔥</p>
          </Card>
          <Card className="space-y-2">
            <p className="text-sm text-slate-500">XP earned</p>
            <p className="text-3xl font-semibold">{stats.xp}</p>
            <p className="text-xs text-slate-400">Earn 10 XP per question</p>
          </Card>
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Accuracy</p>
              <p className="text-3xl font-semibold">{stats.accuracy}%</p>
            </div>
            <ProgressRing value={stats.accuracy} label="Accuracy percentage" />
          </Card>
          <Card className="space-y-2">
            <p className="text-sm text-slate-500">Minutes this week</p>
            <p className="text-3xl font-semibold">{stats.minutes}</p>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text">Next recommended sessions</h2>
                <p className="text-sm text-slate-500">Curated from your latest accuracy and confidence score.</p>
              </div>
              {stats.updatedAt && (
                <span className="text-xs text-slate-400">Updated {new Date(stats.updatedAt).toLocaleTimeString()}</span>
              )}
            </div>
            {stats.nextRecommended.length ? (
              <ul className="space-y-3 text-sm text-slate-600">
                {stats.nextRecommended.map((item) => (
                  <li key={`${item.topic}-${item.mode}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>
                      <strong>{item.topic}</strong> — {item.mode}
                    </span>
                    <span className="text-slate-500">{item.difficulty}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                Complete a quick session to unlock personalised recommendations.
              </p>
            )}
            <Button className="w-full" onClick={() => {}}>
              Practice similar questions
            </Button>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-text">Accuracy by topic</h2>
            {stats.accuracyByTopic.length ? (
              <ResponsiveTable
                headers={['Topic', 'Accuracy']}
                rows={stats.accuracyByTopic.map((item) => [item.topic, `${item.accuracy}%`])}
              />
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                Once you complete a few questions, your strongest topics will appear here.
              </p>
            )}
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-text">Weekly accuracy trend</h2>
            <p className="text-sm text-slate-600">
              We track how your accuracy is moving so you can focus on steady improvement, not just scores.
            </p>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last 7 days</p>
                <p className="text-3xl font-semibold text-text">{stats.accuracy}%</p>
              </div>
              <TrendSparkline data={stats.accuracyTrend} ariaLabel="Weekly accuracy trend" />
            </div>
          </Card>
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-text">Keep your streak</h2>
            <p className="text-sm text-slate-600">
              Complete a session today to earn another spark badge. Remember, we focus on confidence and steady progress — no pass
              promises, just your personal best.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button>Start quick practice</Button>
              <Button variant="secondary">Review vocab due</Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
