import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CareerDetailHeader } from '../components/CareerDetailHeader';
import { SkillBar } from '../components/SkillBar';
import { RoadmapPreview } from '../components/RoadmapPreview';
import { careersService } from '../services/careersService';
import { getCareerInterestFit } from '../services/careerFit';
import { CATEGORIES } from '../data/careers.mock';
import { useProfile } from '../../../context/ProfileContext';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../../design-system/Card';
import { Badge } from '../../../design-system/Badge';
import { Spinner } from '../../../design-system/Spinner';
import { Button } from '../../../design-system/Button';
import { EmptyState } from '../../../components/layout/EmptyState';
import { useToast } from '../../../components/layout/useToast';
import { Compass, ArrowRight } from 'lucide-react';
import MarketDataNotice from '../components/MarketDataNotice';

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, saveCareer, removeSavedCareer } = useProfile();
  const [career, setCareer] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [savingToPath, setSavingToPath] = useState(false);
  const toast = useToast();

  const savedCareerIds = profile?.savedCareerIds ?? [];
  const isSaved = Boolean(career && savedCareerIds.includes(career.id));
  const fit = career
    ? getCareerInterestFit(career.interests || [], profile?.interests || [])
    : null;

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
        const relatedIds = (data.relatedCareers || []).slice(0, 3);
        if (relatedIds.length === 0) {
          setRelated([]);
          return;
        }
        const results = await Promise.all(relatedIds.map((relatedId) => careersService.getById(relatedId)));
        if (!alive) return;
        setRelated(results.filter(Boolean));
      })
      .catch((loadError) => {
        if (!alive) return;
        setError(loadError?.message || 'Unable to load career.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  async function handleToggleSaved() {
    if (!career || savingToPath) return;
    setSavingToPath(true);
    try {
      if (isSaved) {
        await removeSavedCareer(career.id);
        toast?.({
          title: `${career.title} removed from your path`,
          description: 'The career was removed from your saved list.',
          tone: 'success',
        });
      } else {
        await saveCareer(career.id);
        toast?.({
          title: `${career.title} saved to your path`,
          description: 'Find it under Saved careers in Career Explorer.',
          tone: 'success',
        });
      }
    } catch (saveError) {
      toast?.({
        title: 'Could not update your path',
        description: saveError?.message || 'Check your connection and try again.',
        tone: 'danger',
      });
    } finally {
      setSavingToPath(false);
    }
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
      <MarketDataNotice />
      <CareerDetailHeader
        career={career}
        fit={fit}
        isSaved={isSaved}
        savingToPath={savingToPath}
        onToggleSaved={handleToggleSaved}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About this career</CardTitle>
              <CardDescription>
                A starting overview for exploration; verify role requirements with current professional sources.
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
              <CardTitle>Skills to explore</CardTitle>
              <CardDescription>
                The relative weights below are illustrative examples, not measured or sourced job-analysis scores.
              </CardDescription>
            </CardHeader>
            <CardBody className="space-y-4">
              {(career.skills || []).map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
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
                  {related.map((relatedCareer) => (
                    <li key={relatedCareer.id}>
                      <Link
                        to={`/careers/${relatedCareer.slug || relatedCareer.id}`}
                        className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900">{relatedCareer.title}</div>
                          <div className="text-xs text-slate-500">{labelForCategory(relatedCareer.category)}</div>
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
                Example stages only; timelines vary with background, access and effort.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <RoadmapPreview stages={career.roadmap} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interest tags</CardTitle>
              <CardDescription>
                Tags used for the explicit overlap count shown above.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-1.5">
                {(career.interests || []).map((interest) => (
                  <Badge key={interest} tone="brand">{titleCase(interest)}</Badge>
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
  const category = CATEGORIES.find((item) => item.value === value);
  return category ? category.label : value;
}

function titleCase(value) {
  return value ? value.charAt(0).toLocaleUpperCase() + value.slice(1) : value;
}
