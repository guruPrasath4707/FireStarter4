import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Search,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '../../design-system/Card';
import { EmptyState } from '../../components/layout/EmptyState';
import { Field, Input } from '../../design-system/Input';
import { PageHeader, Section, Stat } from '../../components/layout/PageHeader';
import { Progress } from '../../design-system/Progress';
import {
  filterLearningResources,
  getLearningProgress,
  LEARNING_CATEGORIES,
  LEARNING_RESOURCES,
} from '../../features/learning/learningCatalog';

const STATUS_FILTERS = [
  { value: 'all', label: 'All resources' },
  { value: 'incomplete', label: 'Not completed' },
  { value: 'completed', label: 'Completed' },
];

export default function LearningHub() {
  const {
    profile,
    completeLearningResource,
    reopenLearningResource,
  } = useProfile();
  const completedIds = Array.isArray(profile?.completedLearningIds)
    ? profile.completedLearningIds
    : [];
  const progress = getLearningProgress(LEARNING_RESOURCES, completedIds);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [savingId, setSavingId] = useState('');
  const [feedback, setFeedback] = useState(null);

  const resources = useMemo(
    () => filterLearningResources(LEARNING_RESOURCES, {
      query,
      category,
      status,
      completedIds,
    }),
    [query, category, status, completedIds],
  );

  async function toggleCompletion(resource) {
    if (savingId) return;
    const wasCompleted = completedIds.includes(resource.id);
    setSavingId(resource.id);
    setFeedback(null);
    try {
      if (wasCompleted) {
        await reopenLearningResource(resource.id);
        setFeedback({ tone: 'success', message: 'Marked “' + resource.title + '” as not completed.' });
      } else {
        await completeLearningResource(resource.id);
        setFeedback({ tone: 'success', message: 'Saved completion for “' + resource.title + '”.' });
      }
    } catch (error) {
      setFeedback({
        tone: 'danger',
        message: error?.message || 'Your learning progress could not be saved. Check your connection and try again.',
      });
    } finally {
      setSavingId('');
    }
  }

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setStatus('all');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Learning Hub"
        title="Build your learning habit"
        subtitle="A starter catalogue of external resources. Pathlight stores which resources you mark complete; it does not host or certify these courses."
        actions={<Badge tone="default">5 curated resources</Badge>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Your progress</CardTitle>
          <CardDescription>Completion is saved to your signed-in profile and follows you across sessions.</CardDescription>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Stat label="Completed" value={String(progress.completed)} hint="Marked by you" tone="success" />
            <Stat label="Remaining" value={String(progress.remaining)} hint="Not yet marked complete" />
            <Stat label="Catalogue size" value={String(progress.total)} hint="External learning resources" />
          </div>
          <Progress value={progress.percentage} label="Catalogue completion" />
          <p className="text-xs leading-relaxed text-slate-500">
            Marking a resource complete is a personal tracker only. Pathlight does not verify course completion with the provider.
          </p>
        </CardBody>
      </Card>

      <Section
        title="Find a resource"
        subtitle="Each entry identifies its source, access note, license information, and the last date this catalogue entry was checked."
      >
        <Card>
          <CardBody className="space-y-4">
            <Field label="Search the catalogue" htmlFor="learning-search">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <Input
                  id="learning-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search topics, providers, or skills"
                  className="pl-9"
                />
              </div>
            </Field>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Topic</div>
              <div className="flex flex-wrap gap-2">
                {LEARNING_CATEGORIES.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    size="sm"
                    variant={category === item.id ? 'primary' : 'outline'}
                    aria-pressed={category === item.id}
                    onClick={() => setCategory(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Completion status</div>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    size="sm"
                    variant={status === item.value ? 'primary' : 'outline'}
                    aria-pressed={status === item.value}
                    onClick={() => setStatus(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <p className="text-sm text-slate-600" aria-live="polite">
                Showing <span className="font-semibold text-slate-900">{resources.length}</span> of {LEARNING_RESOURCES.length} resources
              </p>
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          </CardBody>
        </Card>
      </Section>

      {feedback ? (
        <div
          role={feedback.tone === 'danger' ? 'alert' : 'status'}
          className={
            'rounded-xl border px-4 py-3 text-sm ' +
            (feedback.tone === 'danger'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800')
          }
        >
          {feedback.message}
        </div>
      ) : null}

      {resources.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No resources match these filters"
          description="Try another search term or clear the topic and completion filters."
          action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const completed = completedIds.includes(resource.id);
            const busy = savingId === resource.id;
            const categoryLabel = LEARNING_CATEGORIES.find((item) => item.id === resource.category)?.label || resource.category;

            return (
              <Card key={resource.id} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge tone="brand">{categoryLabel}</Badge>
                    <Badge tone={completed ? 'success' : 'default'}>
                      {completed ? 'Completed by you' : resource.level}
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.provider} · {resource.format}</CardDescription>
                </CardHeader>
                <CardBody className="flex h-full flex-col gap-4">
                  <p className="text-sm leading-relaxed text-slate-600">{resource.summary}</p>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Access</div>
                    <p className="mt-1 text-sm text-slate-700">{resource.access}</p>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source and license</div>
                    <p className="mt-1 text-sm text-slate-700">
                      Source:{' '}
                      <a
                        href={resource.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-indigo-700 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {resource.sourceLabel}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{resource.licenseLabel}</p>
                    <a
                      href={resource.licenseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      License and reuse notes <ExternalLink size={12} aria-hidden="true" />
                      <span className="sr-only"> for {resource.provider} (opens in a new tab)</span>
                    </a>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{resource.licenseNote}</p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      Catalogue link checked: {resource.reviewedOn}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <Button
                      type="button"
                      variant={completed ? 'secondary' : 'outline'}
                      leftIcon={completed ? CheckCircle2 : Circle}
                      loading={busy}
                      disabled={Boolean(savingId)}
                      onClick={() => toggleCompletion(resource)}
                      aria-pressed={completed}
                    >
                      {busy ? 'Saving…' : completed ? 'Mark not completed' : 'Mark complete'}
                    </Button>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                    >
                      Open resource <ArrowUpRight size={15} aria-hidden="true" />
                      <span className="sr-only">: {resource.title} (opens in a new tab)</span>
                    </a>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        Provider descriptions and licenses can change. The catalogue links to external sites; check the source page and its notices before reusing materials. A completed status records your choice and is not a certificate or provider-verified result.
      </p>
    </div>
  );
}
