'use client';

import { useMemo, useState } from 'react';
import { useStaticQuestionBank, type QuestionCategory, type QuestionItem } from '../lib/hooks/useStaticQuestionBank';

const categories: { label: string; value: QuestionCategory }[] = [
  { label: 'Verbal Reasoning', value: 'vr' },
  { label: 'Non-Verbal Reasoning', value: 'nvr' },
  { label: 'Maths', value: 'maths' },
  { label: 'English', value: 'english' }
];

export function QuestionBankExplorer() {
  const [category, setCategory] = useState<QuestionCategory>('vr');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 'all'>('all');
  const [type, setType] = useState<'all' | 'Multiple Choice' | 'Fill-in-the-blank'>('all');
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem | null>(null);

  const { loading, error, totalFiltered, totalInCategory, getRandomQuestion } = useStaticQuestionBank({
    category,
    difficulty,
    type
  });

  const subtitle = useMemo(() => {
    if (loading) return 'Loading static question bank…';
    if (error) return error;
    return `${totalFiltered} matching questions from ${totalInCategory} loaded in this category.`;
  }, [loading, error, totalFiltered, totalInCategory]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value as QuestionCategory)}>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value === 'all' ? 'all' : Number(e.target.value) as 1 | 2 | 3)}>
          <option value="all">All difficulties</option>
          <option value="1">Difficulty 1</option>
          <option value="2">Difficulty 2</option>
          <option value="3">Difficulty 3</option>
        </select>

        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value as 'all' | 'Multiple Choice' | 'Fill-in-the-blank')}>
          <option value="all">All types</option>
          <option value="Multiple Choice">Multiple Choice</option>
          <option value="Fill-in-the-blank">Fill in the blank</option>
        </select>

        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          onClick={() => setActiveQuestion(getRandomQuestion())}
          disabled={loading || !!error}
        >
          Serve random question
        </button>
      </div>

      <p className="text-sm text-slate-600">{subtitle}</p>

      {activeQuestion && (
        <article className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {activeQuestion.type} • Difficulty {activeQuestion.difficulty}
          </p>
          <div className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: activeQuestion.question_text }} />
          {activeQuestion.options.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {activeQuestion.options.map((option) => (
                <li key={option}>{option}</li>
              ))}
            </ul>
          )}
          <p className="text-sm text-slate-700">
            <strong>Answer:</strong> {activeQuestion.correct_answer}
          </p>
          <p className="text-sm text-slate-600">{activeQuestion.explanation}</p>
        </article>
      )}
    </div>
  );
}
