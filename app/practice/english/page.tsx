import { Metadata } from 'next';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { ShareSupportWidget } from '../../../components/ShareSupportWidget';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'English Practice | ElevenSpark'
};

export default function EnglishPracticePage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-heading font-semibold text-text">English vocabulary & reasoning</h1>
          <p className="text-sm text-slate-600">
            Our spaced repetition engine resurfaces tricky words at the right time, helping learners feel prepared without pressure.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-text">Daily vocab review</h2>
            <p className="text-sm text-slate-600">Clear queue of due cards using SM-2 scheduling.</p>
            <Button>Review due cards</Button>
          </Card>
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-text">Reasoning practice</h2>
            <p className="text-sm text-slate-600">Synonyms, antonyms, analogies, cloze and homophones.</p>
            <Link
              href="/mock/english"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Launch mock mode
            </Link>
          </Card>
        </div>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-text">Word families covered</h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-600">
            <li>Synonyms & antonyms</li>
            <li>Homophones in context</li>
            <li>Prefixes & suffixes</li>
            <li>Analogies & odd-one-out</li>
            <li>British spellings</li>
            <li>Definitions with usage</li>
          </ul>
          <p className="text-xs text-slate-500">Confidence-first vocabulary building — never promising pass results.</p>
        </Card>
        <ShareSupportWidget
          context="quiz"
          title="Know a parent who’d love this?"
          subtitle="Every share helps another child learn with confidence. We appreciate your support."
        />
      </div>
    </div>
  );
}
