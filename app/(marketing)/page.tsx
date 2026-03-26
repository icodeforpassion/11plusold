import { Metadata } from 'next';
import { Hero } from '../../components/Hero';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { Card } from '../../components/Card';
import { Tabs } from '../../components/Tabs';
import { Stat } from '../../components/Stat';
import { TrendSparkline } from '../../components/TrendSparkline';
import Link from 'next/link';
import Script from 'next/script';
import { QuestionBankExplorer } from '../../components/QuestionBankExplorer';
import { StudyBuddy3D } from '../../components/StudyBuddy3D';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://elevenspark.example.com/'
  }
};

const strengths = [
  {
    title: 'Adaptive maths practice',
    body: 'Question difficulty adjusts using an ELO-style rating, keeping sessions stretching but not overwhelming.'
  },
  {
    title: 'English vocabulary SRS',
    body: 'SM-2 spaced repetition keeps tricky words returning right when they are needed.'
  },
  {
    title: 'Parent-friendly insights',
    body: 'Weekly summaries highlight strengths, gentle gaps, and confidence-building tips.'
  }
];

export default function MarketingPage() {
  const sparklineData = [68, 71, 74, 78, 80, 82, 85];
  return (
    <div className="min-h-screen bg-background">
      <Script id="ld-json" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'ElevenSpark',
          url: 'https://elevenspark.example.com',
          description:
            'Adaptive 11+ maths and English vocabulary practice for UK learners with dashboards for parents and confidence-building messaging.',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'GB'
          },
          sameAs: ['https://www.facebook.com', 'https://www.instagram.com']
        })}
      </Script>
      <Navigation />
      <main>
        <Hero />
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {strengths.map((item) => (
              <Card key={item.title} className="space-y-3">
                <h3 className="text-lg font-semibold text-text">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.body}</p>
              </Card>
            ))}
          </div>
        </section>
        <section className="bg-white py-16" id="parent-dashboard">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-heading font-semibold text-text">Simple dashboards for students and parents</h2>
                <p className="text-slate-600">
                  Students see streaks, XP, and accuracy by topic. Parents receive clear charts and actionable insights without
                  exam pressure.
                </p>
                <Tabs
                  items={[
                    {
                      id: 'student',
                      label: 'Student view',
                      content: (
                        <div className="grid gap-4 md:grid-cols-2">
                          <Stat label="Streak" value={<span>8 days 🔥</span>} helper="Keep the momentum going!" />
                          <Stat label="Accuracy" value={<span>82%</span>} helper="Up 6% this week" />
                        </div>
                      )
                    },
                    {
                      id: 'parent',
                      label: 'Parent view',
                      content: (
                        <div className="space-y-4">
                          <TrendSparkline data={sparklineData} ariaLabel="Weekly accuracy trend" />
                          <p className="text-sm text-slate-600">
                            Weekly summary emails show minutes practised, accuracy by topic, and tips for building confidence.
                          </p>
                        </div>
                      )
                    }
                  ]}
                />
              </div>
              <Card className="space-y-4">
                <h3 className="text-xl font-semibold text-text">Confidence-focused messaging</h3>
                <p className="text-sm text-slate-600">
                  ElevenSpark celebrates progress, not perfection. Encouraging language keeps learners motivated without
                  promising any pass result.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Friendly nudges when practice is due</li>
                  <li>• Rewards that stay private within the family</li>
                  <li>• Inclusive design compliant with WCAG 2.2 AA</li>
                </ul>
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Start your free 7-day trial
                </Link>
              </Card>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="space-y-3">
              <h3 className="text-lg font-semibold text-text">Dynamic question generation</h3>
              <p className="text-sm text-slate-600">
                Every session uses seeded templates and cooldowns to avoid repetition, keeping practice fresh.
              </p>
            </Card>
            <Card className="space-y-3">
              <h3 className="text-lg font-semibold text-text">Secure & GDPR ready</h3>
              <p className="text-sm text-slate-600">
                Hosted on Firebase with EU data residency options, role-based access, and data export/delete endpoints.
              </p>
            </Card>
            <Card className="space-y-3">
              <h3 className="text-lg font-semibold text-text">SEO-first marketing</h3>
              <p className="text-sm text-slate-600">
                Fast Next.js pages with schema markup help parents discover ElevenSpark when searching for 11+ support.
              </p>
            </Card>
          </div>
        </section>

        <section className="bg-white py-16" id="study-buddy">
          <div className="mx-auto max-w-6xl space-y-8 px-4">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-heading font-semibold text-text">Question Bank + Interactive Study Buddy</h2>
              <p className="text-slate-600">
                Static question datasets are lazy-loaded per subject to keep initial page weight light while supporting large-scale practice.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <QuestionBankExplorer />
              <StudyBuddy3D />
            </div>
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-heading font-semibold text-text">Trusted by families preparing for the 11+</h2>
            <p className="mt-3 text-slate-600">
              "ElevenSpark makes practice feel manageable. My daughter loves the streaks, and I appreciate the gentle email
              reminders." – Priya, parent of Year 5 learner.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
