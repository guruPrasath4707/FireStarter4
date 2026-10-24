import React, { useEffect, useMemo, useState } from 'react';
import { useProfile } from '../../../context/ProfileContext';
import { careersService } from '../services/careersService';
import { getCareerInterestFit } from '../services/careerFit';
import { CareerFilters } from '../components/CareerFilters';
import { CareerGrid } from '../components/CareerGrid';
import { PageHeader, Section, Stat } from '../../../components/layout/PageHeader';
import { Card, CardBody } from '../../../design-system/Card';
import { Badge } from '../../../design-system/Badge';
import { EmptyState } from '../../../components/layout/EmptyState';
import { Button } from '../../../design-system/Button';
import { Compass, Layers, Tags } from 'lucide-react';

const ALL = 'all';
const EMPTY_INTERESTS = [];
const EMPTY_SAVED_IDS = [];

export default function CareerExplorerPage() {
  const { profile } = useProfile();
  const interests = profile?.interests ?? EMPTY_INTERESTS;
  const savedCareerIds = profile?.savedCareerIds ?? EMPTY_SAVED_IDS;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    careersService
      .list()
      .then((result) => {
        if (!alive) return;
        setItems(result.items);
      })
      .catch((loadError) => {
        if (!alive) return;
        setError(loadError?.message || 'Unable to load careers.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  const rankedItems = useMemo(() => {
    if (interests.length === 0) return items;
    // A transparent tag-overlap count is used for ordering; no static mock
    // score or unvalidated predictive claim is used.
    return [...items].sort((a, b) => (
      getCareerInterestFit(b.interests, interests).matchCount -
      getCareerInterestFit(a.interests, interests).matchCount
    ));
  }, [items, interests]);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return rankedItems.filter((career) => {
      if (showSavedOnly && !savedCareerIds.includes(career.id)) return false;
      if (category !== ALL && career.category !== category) return false;
      if (!search) return true;
      const haystack = [
        career.title,
        career.shortDescription,
        career.description,
        ...career.skills.map((skill) => skill.name),
      ].join(' ').toLocaleLowerCase();
      return haystack.includes(search);
    });
  }, [rankedItems, query, category, showSavedOnly, savedCareerIds]);

  const careersWithOverlap = useMemo(
    () => items.filter((career) => getCareerInterestFit(career.interests, interests).matchCount > 0).length,
    [items, interests],
  );

  const topCategory = useMemo(() => {
    if (filtered.length === 0) return null;
    const counts = {};
    for (const career of filtered) {
      counts[career.category] = (counts[career.category] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career Explorer"
        title="Explore career paths"
        subtitle="Search the reference catalogue and compare its interest tags with your profile."
        actions={
          interests.length > 0 ? (
            <Badge tone="brand" icon={Tags}>Interest matching</Badge>
          ) : (
            <Badge tone="default">Reference catalogue</Badge>
          )
        }
      />

      <Card>
        <CardBody className="p-6">
          <CareerFilters
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            total={filtered.length}
            savedOnly={showSavedOnly}
            onSavedOnlyChange={setShowSavedOnly}
            savedCount={savedCareerIds.length}
          />
        </CardBody>
      </Card>

      <Section
        title="At a glance"
        subtitle="Catalogue counts describe the current filters; interest overlap is a tag comparison, not a prediction."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat
            icon={Layers}
            label="Showing"
            value={String(filtered.length)}
            hint={showSavedOnly ? 'saved careers matching filters' : 'careers matching filters'}
            tone="brand"
          />
          <Stat
            icon={Tags}
            label="Interest overlap"
            value={interests.length > 0 ? String(careersWithOverlap) : '—'}
            hint={interests.length > 0 ? 'careers with at least one matching tag' : 'add interests in your profile'}
          />
          <Stat
            icon={Compass}
            label="Top category"
            value={topCategory ? titleCase(topCategory) : '—'}
            hint="based on current filters"
          />
          <Stat
            label="Catalogue"
            value="Demo data"
            hint="salary and outlook are illustrative"
          />
        </div>
      </Section>

      {error ? (
        <Card>
          <CardBody className="p-6">
            <EmptyState
              icon={Compass}
              title="Unable to load careers"
              description={error}
              action={
                <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                  Try again
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : loading ? (
        <GridSkeleton />
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody className="p-6">
            <EmptyState
              icon={showSavedOnly ? Tags : Compass}
              title={showSavedOnly ? 'No saved careers match these filters' : 'No careers match your filters'}
              description={
                showSavedOnly
                  ? 'Try clearing search and category filters, or save a career from its detail page.'
                  : 'Try clearing the search or selecting a different category.'
              }
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    setCategory(ALL);
                    setShowSavedOnly(false);
                  }}
                >
                  {showSavedOnly ? 'Show all careers' : 'Clear filters'}
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <CareerGrid
          careers={filtered}
          interests={interests}
          savedCareerIds={savedCareerIds}
        />
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-64 rounded-2xl border border-slate-200 bg-white animate-pulse"
        />
      ))}
    </div>
  );
}

function titleCase(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}
