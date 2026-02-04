import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth/server';
import { requireActiveSubscription } from '../../../lib/auth/subscription';
import { initAdmin } from '../../../firebase/admin';
import { selectNextTopics } from '../../../lib/adaptive';
import { formatISO, startOfDay, subDays } from 'date-fns';

const TOPIC_LABELS: Record<string, string> = {
  'number-arithmetic': 'Number & arithmetic',
  fractions: 'Fractions',
  'decimals-percentages': 'Decimals & percentages',
  'ratio-proportion': 'Ratio & proportion',
  synonyms: 'Synonyms',
  antonyms: 'Antonyms',
  cloze: 'Cloze passages'
};

function labelTopic(topicKey: string) {
  return TOPIC_LABELS[topicKey] ?? topicKey.replace(/-/g, ' ');
}

function difficultyLabel(theta = 1200) {
  if (theta < 1150) return 'Focus';
  if (theta < 1300) return 'Steady';
  return 'Stretch';
}

export async function GET(request: Request) {
  try {
    const decoded = await requireAuth();
    await requireActiveSubscription(decoded.uid);
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId') ?? decoded.uid;
    const { db } = initAdmin();

    const childDoc = await db.collection('children').doc(childId).get();
    if (!childDoc.exists) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }
    const childData = childDoc.data() as any;
    if (childData.parentId && childData.parentId !== decoded.uid && childId !== decoded.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const streakWindowStart = formatISO(subDays(startOfDay(new Date()), 30), { representation: 'date' });
    const attemptsSnap = await db
      .collection('attempts')
      .where('childId', '==', childId)
      .where('createdAt', '>=', streakWindowStart)
      .get();

    const attempts = attemptsSnap.docs.map((doc) => doc.data() as any);
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((attempt) => attempt.isCorrect).length;
    const minutesPracticed = Math.round(
      attempts.reduce((acc, attempt) => acc + (attempt.timeTakenMs || 0), 0) / 60000
    );
    const accuracy = totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    const byTopic: Record<string, { correct: number; total: number }> = {};
    attempts.forEach((attempt) => {
      const key = attempt.topicKey ?? 'general';
      if (!byTopic[key]) byTopic[key] = { correct: 0, total: 0 };
      byTopic[key].total += 1;
      if (attempt.isCorrect) byTopic[key].correct += 1;
    });

    const accuracyByTopic = Object.entries(byTopic)
      .map(([topic, stats]) => ({
        topic: labelTopic(topic),
        accuracy: Math.round((stats.correct / stats.total) * 100) || 0,
        total: stats.total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4)
      .map(({ topic, accuracy }) => ({ topic, accuracy }));

    const streakDays = new Set(
      attempts.map((attempt) => formatISO(startOfDay(new Date(attempt.createdAt)), { representation: 'date' }))
    );
    let streak = 0;
    for (let i = 0; i < 30; i += 1) {
      const dateKey = formatISO(subDays(startOfDay(new Date()), i), { representation: 'date' });
      if (streakDays.has(dateKey)) {
        streak += 1;
      } else {
        break;
      }
    }

    const trendStart = startOfDay(subDays(new Date(), 6));
    const trendBuckets = Array.from({ length: 7 }, (_, index) =>
      formatISO(subDays(startOfDay(new Date()), 6 - index), { representation: 'date' })
    );
    const trendMap: Record<string, { correct: number; total: number }> = {};
    trendBuckets.forEach((key) => {
      trendMap[key] = { correct: 0, total: 0 };
    });
    attempts.forEach((attempt) => {
      const day = formatISO(startOfDay(new Date(attempt.createdAt)), { representation: 'date' });
      if (trendMap[day]) {
        trendMap[day].total += 1;
        if (attempt.isCorrect) trendMap[day].correct += 1;
      }
    });
    const accuracyTrend = trendBuckets.map((day) => {
      const bucket = trendMap[day];
      return bucket.total ? Math.round((bucket.correct / bucket.total) * 100) : 0;
    });

    const skillsSnap = await db.collection('skills').where('childId', '==', childId).get();
    const skills = skillsSnap.docs.map((doc) => doc.data() as any);
    const recommended = selectNextTopics(skills, 3, Date.now());
    const nextRecommended = recommended.map((item) => ({
      topic: labelTopic(item.topicKey),
      mode: item.subject === 'english' ? 'Vocab SRS' : 'Quick Practice',
      difficulty: difficultyLabel(item.theta)
    }));

    return NextResponse.json({
      childId,
      streak,
      xp: totalAttempts * 10,
      accuracy,
      minutes: minutesPracticed,
      nextRecommended,
      accuracyByTopic,
      accuracyTrend,
      updatedAt: new Date().toISOString(),
      windowStartISO: streakWindowStart,
      trendStartISO: formatISO(trendStart, { representation: 'date' })
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'Unable to load progress' },
      { status: error.message === 'Unauthorized' ? 401 : 400 }
    );
  }
}
