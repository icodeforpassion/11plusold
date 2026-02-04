'use client';

import { FormEvent, useState } from 'react';
import { initFirebase } from '../../firebase/init';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button } from '../Button';
import { GoogleButton } from './GoogleButton';

export function SignupForm() {
  const { auth } = initFirebase();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    setLoading(true);
    setMessage(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }
      setMessage('Account created. Check your email to verify before inviting your child.');
    } catch (error: any) {
      setMessage(error.message ?? 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setMessage(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setMessage('Signed in with Google. Continue to create your child profile.');
    } catch (error: any) {
      setMessage(error.message ?? 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Set up your parent account in seconds with Google single sign-on.
      </div>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-text">
          Parent name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-text">
          Email address
        </label>
        <input id="email" name="email" type="email" required className="w-full rounded-xl border border-slate-300 px-4 py-3" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-text">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account…' : 'Create parent account'}
      </Button>
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        Or
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleButton onClick={handleGoogle} disabled={loading} label="Continue with Google" />
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <p className="text-xs text-slate-500">
        By creating an account you agree to our terms. ElevenSpark builds confidence—no exam pass guarantees.
      </p>
    </form>
  );
}
