'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type QuestionCategory = 'vr' | 'nvr' | 'maths' | 'english';

export interface QuestionItem {
  id: string;
  type: 'Multiple Choice' | 'Fill-in-the-blank' | string;
  difficulty: 1 | 2 | 3;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface UseStaticQuestionBankOptions {
  category: QuestionCategory;
  difficulty?: 1 | 2 | 3 | 'all';
  type?: 'all' | 'Multiple Choice' | 'Fill-in-the-blank';
}

const questionCache = new Map<QuestionCategory, QuestionItem[]>();

export function useStaticQuestionBank({ category, difficulty = 'all', type = 'all' }: UseStaticQuestionBankOptions) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        if (questionCache.has(category)) {
          if (active) {
            setQuestions(questionCache.get(category) ?? []);
            setLoading(false);
          }
          return;
        }

        const response = await fetch(`/data/questions/${category}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${category} questions`);
        }

        const payload = (await response.json()) as QuestionItem[];
        questionCache.set(category, payload);

        if (active) {
          setQuestions(payload);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown loading error');
          setQuestions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      active = false;
    };
  }, [category]);

  const filteredQuestions = useMemo(
    () =>
      questions.filter((item) => {
        const difficultyMatches = difficulty === 'all' ? true : item.difficulty === difficulty;
        const typeMatches = type === 'all' ? true : item.type === type;
        return difficultyMatches && typeMatches;
      }),
    [questions, difficulty, type]
  );

  const getRandomQuestion = useCallback(() => {
    if (!filteredQuestions.length) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  }, [filteredQuestions]);

  return {
    loading,
    error,
    totalInCategory: questions.length,
    totalFiltered: filteredQuestions.length,
    getRandomQuestion
  };
}
