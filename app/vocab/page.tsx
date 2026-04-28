import { Metadata } from 'next';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ResponsiveTable } from '../../components/ResponsiveTable';
import { ShareSupportWidget } from '../../components/ShareSupportWidget';

export const metadata: Metadata = {
  title: 'Vocabulary Review | ElevenSpark'
};

const dueCards = [
  { term: 'meticulous', dueIn: 'Today', ease: 260 },
  { term: 'reluctant', dueIn: 'Tomorrow', ease: 240 },
  { term: 'undaunted', dueIn: '2 days', ease: 250 }
];

export default function VocabPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-heading font-semibold text-text">Vocabulary review</h1>
          <p className="text-sm text-slate-600">
            Daily SM-2 scheduling keeps words returning just before they are forgotten. Celebrate steady retention; results will
            follow.
          </p>
        </header>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-text">Due today</h2>
          <ResponsiveTable headers={['Word', 'Due', 'Ease']} rows={dueCards.map((card) => [card.term, card.dueIn, card.ease])} />
          <Button className="w-full">Start review session</Button>
          <p className="text-xs text-slate-500">Need a break? Pause anytime — we focus on confidence, not cramming.</p>
        </Card>
        <ShareSupportWidget
          context="milestone"
          title="Thanks for supporting Prepify11Plus"
          subtitle="If Prepify11Plus has helped your family, sharing means a lot."
        />
      </div>
    </div>
  );
}
