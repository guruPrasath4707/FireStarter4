import React, { useEffect, useMemo, useState } from 'react';
import { useProfile } from '../../../context/ProfileContext';
import { careersService } from '../services/careersService';
import { CareerFilters } from '../components/CareerFilters';
import { CareerGrid } from '../components/CareerGrid';
import { PageHeader, Section, Stat } from '../../../components/layout/PageHeader';
import { Card, CardBody } from '../../../design-system/Card';
import { Badge } from '../../../design-system/Badge';
import { EmptyState } from '../../../components/layout/EmptyState';
import { Button } from '../../../design-system/Button';
import { Sparkles, Compass, Layers } from 'lucide-react';

const ALL = 'all';

export default function CareerExplorerPage() {
  const { profile } = useProfile();
  const interests = profile?.interests || [];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    careersService
      .list({ interests })
      .then((res) => {
        if (!alive) return;
        setItems(res.items);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || 'Unable to load careers.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [interests]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      if (category !== ALL && c.category !== category) return false;
      if (!q) return true;
      const haystack = [
        c.title,
        c.shortDescription,
        c.description,
        ...c.skills.map((s) => s.name),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, category]);

  const personalizedCount = items.filter(
    (c) => Array.isArray(c.matchScore) ? false : (c.matchScore ?? 0) >= 70,
  ).length;

  const topCategory = useMemo(() => {
    if (filtered.length === 0) return null;
    const counts = {};
    for (const c of filtered) counts[c.category] = (counts[c.category] || 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || null;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career Explorer"
        title="Find a career that fits you"
        subtitle="Browse tracks aligned to your interests, or search by skill and role."
        actions={
          interests.length > 0 ? (
            <Badge tone="brand" icon={Sparkles}>
              Personalized for you
            </Badge>
          ) : (
            <Badge tone="violet">Reference catalogue</Badge>
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
          />
        </CardBody>
      </Card>

      <Section
        title="At a glance"
        subtitle="A snapshot of the careers matching your filters."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat
            icon={Layers}
            label="Showing"
            value={String(filtered.length)}
            hint="matching your filters"
            tone="brand"
          />
          <Stat
            icon={Sparkles}
            label="Personalized"
            value={String(personalizedCount)}
            hint="match score ≥ 70%"
            tone="violet"
          />
          <Stat
            icon={Compass}
            label="Top category"
            value={topCategory ? titleCase(topCategory) : '—'}
            hint="based on current filters"
          />
          <Stat
            label="Source"
            value="Reference"
            hint="mock data — API-ready"
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
                <Button variant="outline" onClick={() => window.location.reload()}>
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
              icon={Compass}
              title="No careers match your filters"
              description="Try clearing the search or selecting a different category."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    setCategory(ALL);
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <CareerGrid careers={filtered} />
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-64 rounded-2xl border border-slate-200 bg-white animate-pulse"
        />
      ))}
    </div>
  );
}

function titleCase(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
