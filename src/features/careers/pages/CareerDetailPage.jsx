import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CareerDetailHeader } from '../components/CareerDetailHeader';
import { SkillBar } from '../components/SkillBar';
import { RoadmapPreview } from '../components/RoadmapPreview';
import { careersService } from '../services/careersService';
import { CATEGORIES } from '../data/careers.mock';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../../design-system/Card';
import { Badge } from '../../../design-system/Badge';
import { Spinner } from '../../../design-system/Spinner';
import { Button } from '../../../design-system/Button';
import { EmptyState } from '../../../components/layout/EmptyState';
import { useToast } from '../../../components/layout/useToast';
import { useGamification } from '../../gamification';
import { Compass, ArrowRight } from 'lucide-react';

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { awardXP } = useGamification();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setNotFound(false);
    setError(null);
    setCareer(null);
    setRelated([]);

    careersService
      .getById(id)
      .then(async (data) => {
        if (!alive) return;
        if (!data) {
          setNotFound(true);
          return;
        }
        setCareer(data);
        // Award XP for viewing a career (deduplicated by career id + date within session)
        awardXP('CAREER_VIEWED', { careerId: data.id });
        const ids = (data.relatedCareers || []).slice(0, 3);
        if (ids.length === 0) {
          setRelated([]);
          return;
        }
        const results = await Promise.all(ids.map((rid) => careersService.getById(rid)));
        if (!alive) return;
        setRelated(results.filter(Boolean));
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || 'Unable to load career.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  function handleAddToPath() {
    if (!career) return;
    // Award XP for saving a career to the path
    awardXP('CAREER_SAVED', { careerId: career.id });
    toast?.({
      title: `${career.title} added to your path`,
      description: 'You can review your saved careers in the Learning Hub.',
      tone: 'success',
    });
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-16">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <Spinner size="sm" />
          Loading career…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody className="p-6">
          <EmptyState
            icon={Compass}
            title="Unable to load this career"
            description={error}
            action={
              <Button variant="outline" onClick={() => navigate('/careers')}>
                Back to careers
              </Button>
            }
          />
        </CardBody>
      </Card>
    );
  }

  if (notFound || !career) {
    return (
      <Card>
        <CardBody className="p-6">
          <EmptyState
            icon={Compass}
            title="Career not found"
            description={`We couldn't find a career with id “${id}”.`}
            action={
              <Button variant="brand" onClick={() => navigate('/careers')}>
                Back to careers
              </Button>
            }
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CareerDetailHeader career={career} onAddToPath={handleAddToPath} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About this career</CardTitle>
              <CardDescription>
                A grounded overview of what the role involves day to day.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-slate-700 leading-relaxed">
                {career.description}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills you'll lean on</CardTitle>
              <CardDescription>
                Weights reflect how central each skill is to the role.
              </CardDescription>
            </CardHeader>
            <CardBody className="space-y-4">
              {(career.skills || []).map((s) => (
                <SkillBar key={s.name} skill={s} />
              ))}
            </CardBody>
          </Card>

          {related.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Related careers</CardTitle>
                <CardDescription>
                  Tracks adjacent to this one — useful to compare.
                </CardDescription>
              </CardHeader>
              <CardBody>
                <ul className="divide-y divide-slate-100">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link
                        to={`/careers/${r.slug || r.id}`}
                        className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900">{r.title}</div>
                          <div className="text-xs text-slate-500">{labelForCategory(r.category)}</div>
                        </div>
                        <ArrowRight size={16} className="text-slate-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap preview</CardTitle>
              <CardDescription>
                A rough path — durations vary by effort and background.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <RoadmapPreview stages={career.roadmap} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>What this career tends to click with.</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-1.5">
                {(career.interests || []).map((i) => (
                  <Badge key={i} tone="brand">{titleCase(i)}</Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function labelForCategory(value) {
  const c = CATEGORIES.find((x) => x.value === value);
  return c ? c.label : value;
}

function titleCase(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
