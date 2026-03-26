'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface ConversationEntry {
  id: string;
  topic: string;
  keywords: string[];
  prompt_examples: string[];
  answer: string;
}

declare global {
  interface Window {
    THREE?: any;
  }
}

const threeScriptId = 'three-cdn-script';

function similarityScore(source: string, target: string) {
  const sourceTokens = source.toLowerCase().split(/\W+/).filter(Boolean);
  const targetTokens = target.toLowerCase().split(/\W+/).filter(Boolean);
  if (!sourceTokens.length || !targetTokens.length) return 0;

  const overlap = sourceTokens.filter((token) => targetTokens.includes(token)).length;
  return overlap / new Set([...sourceTokens, ...targetTokens]).size;
}

export function StudyBuddy3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<'idle' | 'wave' | 'nod'>('idle');
  const [library, setLibrary] = useState<ConversationEntry[]>([]);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('Ask me a study question to get started.');
  const [threeReady, setThreeReady] = useState<boolean>(typeof window !== 'undefined' && !!window.THREE);

  useEffect(() => {
    fetch('/data/conversation_library.json')
      .then((res) => res.json())
      .then((payload: ConversationEntry[]) => setLibrary(payload))
      .catch(() => setResponse('I could not load my answer library right now.'));
  }, []);

  const bestLibraryMatch = useMemo(() => {
    if (!question.trim() || !library.length) return null;

    const prompt = question.trim().toLowerCase();
    let best: { item: ConversationEntry; score: number } | null = null;

    for (const item of library) {
      const corpus = [item.topic, ...item.keywords, ...item.prompt_examples].join(' ');
      const score = similarityScore(prompt, corpus);
      if (!best || score > best.score) {
        best = { item, score };
      }
    }

    return best;
  }, [question, library]);

  useEffect(() => {
    if (window.THREE) {
      setThreeReady(true);
      return;
    }

    const existing = document.getElementById(threeScriptId) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => setThreeReady(true), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = threeScriptId;
    script.src = 'https://unpkg.com/three@0.179.1/build/three.min.js';
    script.async = true;
    script.addEventListener('load', () => setThreeReady(true), { once: true });
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!threeReady || !canvasRef.current || !window.THREE) return;

    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvasRef.current.clientWidth, 320, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, canvasRef.current.clientWidth / 320, 0.1, 100);
    camera.position.set(0, 1.3, 5);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(4, 5, 3);
    scene.add(ambient, key);

    const buddy = new THREE.Group();
    const materialA = new THREE.MeshStandardMaterial({ color: '#4f7cff', flatShading: true });
    const materialB = new THREE.MeshStandardMaterial({ color: '#8fb3ff', flatShading: true });
    const materialC = new THREE.MeshStandardMaterial({ color: '#2f4bb8', flatShading: true });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.6, 0.8), materialA);
    body.position.y = 0.8;
    const head = new THREE.Mesh(new THREE.BoxGeometry(1, 0.9, 0.9), materialB);
    head.position.y = 2;

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.3), materialC);
    leftArm.position.set(-0.9, 1.1, 0);
    const rightArm = leftArm.clone();
    rightArm.position.x = 0.9;

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 6), new THREE.MeshStandardMaterial({ color: '#dbe5ff', flatShading: true }));
    base.position.y = -0.1;

    buddy.add(body, head, leftArm, rightArm, base);
    scene.add(buddy);

    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      buddy.rotation.y = Math.sin(elapsed * 0.6) * 0.2;

      rightArm.rotation.z = animationRef.current === 'wave' ? Math.sin(elapsed * 10) * 0.6 - 0.2 : 0;
      head.rotation.x = animationRef.current === 'nod' ? Math.sin(elapsed * 8) * 0.25 : 0;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      renderer.setSize(width, 320, false);
      camera.aspect = width / 320;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.clear();
    };
  }, [threeReady]);

  const handleAsk = () => {
    if (!bestLibraryMatch) {
      setResponse('Ask with a topic keyword such as fractions, vocabulary, patterns, or exam nerves.');
      animationRef.current = 'nod';
      return;
    }

    if (bestLibraryMatch.score >= 0.12) {
      setResponse(bestLibraryMatch.item.answer);
      animationRef.current = bestLibraryMatch.item.topic.includes('math') ? 'nod' : 'wave';
    } else {
      setResponse('Great question. Try adding a topic keyword like fractions, vocabulary, or exam nerves.');
      animationRef.current = 'nod';
    }

    window.setTimeout(() => {
      animationRef.current = 'idle';
    }, 1800);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-blue-50">
        <canvas ref={canvasRef} className="h-80 w-full" aria-label="3D Study Buddy" />
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 p-3 backdrop-blur">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Study Buddy chat</p>
          <div className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask: How do I do fractions?"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button type="button" onClick={handleAsk} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">
              Ask
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600">{response}</p>
        </div>
      </div>
    </div>
  );
}
