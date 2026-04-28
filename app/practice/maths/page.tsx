import { Metadata } from 'next';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { ShareSupportWidget } from '../../../components/ShareSupportWidget';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Maths Practice | ElevenSpark'
};

export default function MathsPracticePage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-heading font-semibold text-text">Maths practice modes</h1>
          <p className="text-sm text-slate-600">
            Freshly generated questions from our template engine keep every session unique. Build fluency without exam pressure.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-text">Quick practice</h2>
            <p className="text-sm text-slate-600">10 adaptive questions mixing your focus topics.</p>
            <Button>Start quick set</Button>
          </Card>
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-text">Mock session</h2>
            <p className="text-sm text-slate-600">45-minute timed session with worked solutions at the end.</p>
            <Link
              href="/mock/maths"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Launch mock mode
            </Link>
          </Card>
        </div>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-text">Topics included</h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-600">
            <li>Number & Arithmetic</li>
            <li>Fractions & Decimals</li>
            <li>Percentages & Ratio</li>
            <li>Algebra foundations</li>
            <li>Measures & Geometry</li>
            <li>Data handling & word problems</li>
          </ul>
          <p className="text-xs text-slate-500">We focus on confidence and clarity — no pass guarantees.</p>
        </Card>
        <ShareSupportWidget
          context="quiz"
          title="Nice work today 🎉 Share Prepify11Plus with a friend?"
          subtitle="Every share helps another child learn with confidence. We appreciate your support."
        />
      </div>
    </div>
  );
}
