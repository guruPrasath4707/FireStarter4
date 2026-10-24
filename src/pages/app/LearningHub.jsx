import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Search,
  Tags,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { learningService } from '../../features/learning';
import { LEARNING_CATEGORIES } from '../../features/learning/data/resources';
import { Button } from '../../design-system/Button';
import { Card, CardBody } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState } from '../../components/layout/EmptyState';
import { formatInterestLabel } from '../../utils/interestMatching';

export default function LearningHub() {
  const {
    profile,
    completeLearningResource,
    reopenCompletedLearningResource,
  } = useProfile();
  const interests = profile?.interests ?? [];
  const completedIds = profile?.completedLearningResourceIds ?? [];

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [matchingOnly, setMatchingOnly] = useState(false);
  const [pendingResourceId, setPendingResourceId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');

  const result = useMemo(
    () => learningService.list({
      query,
      category,
      interests,
      matchingOnly,
    }),
    [query, category, interests, matchingOnly],
  );

  const completedCount = completedIds.filter((id) =>
    result.items.some((resource) => resource.id === id),
  ).length;

  async function toggleComplete(resource) {
    if (pendingResourceId) return;

    const wasCompleted = completedIds.includes(resource.id);
    setPendingResourceId(resource.id);
    setActionError('');
    setNotice('');

    try {
      if (wasCompleted) {
        await reopenCompletedLearningResource(resource.id);
        setNotice(`Reopened “${resource.title}”. It is no longer marked complete.`);
      } else {
        await completeLearningResource(resource.id);
        setNotice(`Marked “${resource.title}” complete on your profile.`);
      }
    } catch (error) {
      setActionError(
        error?.message ||
        'Your progress could not be saved. Check your connection and try again.',
      );
    } finally {
      setPendingResourceId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Learning Hub"
        title="Choose a resource to study"
        subtitle="A small, source-attributed catalogue of external learning resources. Open the provider's material, then self-mark it complete here."
        actions={<Badge tone="brand">{result.total} resources</Badge>}
      />

      <Card>
        <CardBody className="p-5 sm:p-6 space-y-4">
          <div className="grid md:grid-cols-[minmax(0,1fr)_240px] gap-3">
            <div>
              <label htmlFor="learning-search" className="mb-1.5 block text-sm font-medium text-slate-800">
                Search resources
              </label>
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="learning-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Title, provider, topic…"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label htmlFor="learning-category" className="mb-1.5 block text-sm font-medium text-slate-800">
                Topic
              </label>
              <Select
                id="learning-category"
                options={LEARNING_CATEGORIES}
                value={category}
                onChange={setCategory}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button
              type="button"
              size="sm"
              variant={matchingOnly ? 'brand' : 'outline'}
              aria-pressed={matchingOnly}
              disabled={interests.length === 0}
              onClick={() => setMatchingOnly((current) => !current)}
              leftIcon={Tags}
            >
              {matchingOnly ? 'Showing interest matches' : 'Only match my interests'}
            </Button>
            <div className="text-xs text-slate-500">
              {completedIds.length} resource{completedIds.length === 1 ? '' : 's'} self-marked complete in your profile
            </div>
          </div>

          {interests.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              Add interests to your <Link to="/profile" className="font-medium text-indigo-700 underline underline-offset-2">profile</Link> to compare their tags with the catalogue. All resources remain browseable without interests.
            </div>
          ) : null}

          <p className="text-xs leading-relaxed text-slate-500">
            Interest matching is a simple tag overlap. Completion is self-reported; Pathlight does not verify activity on external sites or award certificates.
          </p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryStat label="Catalogue" value={String(result.total)} description="Resources matching current filters" />
        <SummaryStat label="Completed in this view" value={String(completedCount)} description="Items you marked complete" />
        <SummaryStat label="Catalogue review" value="25 Oct 2026" description="External URLs reviewed" />
      </div>

      {actionError ? (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </div>
      ) : null}
      {notice ? (
        <div role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      ) : null}

      {result.items.length === 0 ? (
        <Card>
          <CardBody className="p-6">
            <EmptyState
              icon={BookOpen}
              title="No resources match these filters"
              description="Try another search term or topic. The local catalogue will continue to show the full list when filters are cleared."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                    setMatchingOnly(false);
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {result.items.map((resource) => {
            const completed = completedIds.includes(resource.id);
            const saving = pendingResourceId === resource.id;

            return (
              <Card key={resource.id} className="h-full">
                <CardBody className="h-full p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge tone="brand">{resource.category}</Badge>
                    {completed ? (
                      <Badge tone="success"><CheckCircle2 size={12} /> Completed</Badge>
                    ) : (
                      <Badge tone="default">Not marked</Badge>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-semibold leading-snug text-slate-900">{resource.title}</h2>
                    <div className="mt-1 text-sm text-slate-500">{resource.provider}</div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600">{resource.summary}</p>

                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-700">Level</div>
                    <p className="text-xs leading-relaxed text-slate-600">{resource.level}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {resource.topics.map((topic) => (
                      <Badge key={topic} tone="default">{topic}</Badge>
                    ))}
                  </div>

                  {interests.length > 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Interest overlap</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {resource.interestFit.matchCount} of {resource.interestFit.selectedCount} selected tags
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {resource.interestFit.matchCount > 0
                          ? resource.interestFit.matchingInterests.map(formatInterestLabel).join(', ')
                          : 'No direct tag overlap.'}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-auto border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Open resource <ExternalLink size={14} />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleComplete(resource)}
                      disabled={pendingResourceId !== null}
                      aria-pressed={completed}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${completed ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                      {saving ? 'Saving…' : completed ? <><CheckCircle2 size={15} /> Reopen resource</> : <><Circle size={15} /> Mark complete</>}
                    </button>

                    <details className="text-xs text-slate-500">
                      <summary className="cursor-pointer font-medium text-slate-600">
                        Source and usage notes
                      </summary>
                      <div className="mt-2 space-y-2 leading-relaxed">
                        <p>Source reviewed: {resource.sourceReviewDate}</p>
                        <p>{resource.rightsNote}</p>
                        <a
                          href={resource.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-700 underline underline-offset-2"
                        >
                          Publisher source page <ArrowUpRight size={12} />
                        </a>
                      </div>
                    </details>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        External resource summaries are short navigational descriptions, not copied lessons. Provider availability, sign-in requirements, and content terms can change.
      </p>
    </div>
  );
}

function SummaryStat({ label, value, description }) {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      </CardBody>
    </Card>
  );
}
