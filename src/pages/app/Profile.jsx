import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { Button } from '../../design-system/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Field, Input, Textarea } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Avatar } from '../../design-system/Avatar';
import { PageHeader } from '../../components/layout/PageHeader';
import { getProfileFormValues, normalizeProfileForm } from '../../utils/profileForm';

const LEVELS = [
  { value: 'class-9', label: 'Class 9' },
  { value: 'class-10', label: 'Class 10' },
  { value: 'class-11', label: 'Class 11' },
  { value: 'class-12', label: 'Class 12' },
  { value: 'ug', label: 'Undergraduate' },
  { value: 'pg', label: 'Postgraduate' },
  { value: 'working', label: 'Working professional' },
];

const STUDY_GOALS = [
  { value: '15', label: '15 min / day — light' },
  { value: '30', label: '30 min / day — steady' },
  { value: '60', label: '1 hr / day — focused' },
  { value: '90', label: '1.5 hr / day — intensive' },
];

export default function Profile() {
  const { user, syncDisplayName } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [form, setForm] = useState(() => getProfileFormValues(profile, user));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [warning, setWarning] = useState('');

  // Refresh a clean form when the profile arrives or changes in another tab,
  // but never overwrite edits the user has not saved.
  useEffect(() => {
    if (dirty) return;
    setForm(getProfileFormValues(profile, user));
    setFieldErrors({});
  }, [profile, user, dirty]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setSaved(false);
    setError('');
    setWarning('');
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaved(false);
    setError('');
    setWarning('');

    const result = normalizeProfileForm(form);
    setFieldErrors(result.errors);
    if (!result.valid) {
      setError('Check the highlighted fields and try again.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(result.values);
      setForm((current) => ({ ...current, ...result.values }));
      setDirty(false);
      setSaved(true);

      // Firestore profile fields are the source of truth for this screen. Keep
      // the Firebase Auth display name in sync as a secondary operation.
      if (result.values.name !== (user?.displayName || '')) {
        try {
          await syncDisplayName(result.values.name);
        } catch {
          setWarning('Your profile was saved, but the account display name could not be synchronized. Your saved profile name is unchanged.');
        }
      }
    } catch (saveError) {
      setError(saveError?.message || 'Your changes could not be saved. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Your information"
        subtitle="Manage the profile details used for career interest comparisons."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Account</CardTitle>
              <Badge tone="brand">Signed in</Badge>
            </div>
            <CardDescription>Account authentication is managed by Firebase.</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4">
              <Avatar name={profile?.name || user?.email} size="lg" />
              <div>
                <div className="text-base font-semibold text-slate-900">
                  {profile?.name || (user?.email?.split('@')[0] ?? 'User')}
                </div>
                <div className="text-sm text-slate-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Field label="Display name" htmlFor="profile-name" required error={fieldErrors.name}>
                <Input
                  id="profile-name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'profile-name-error' : undefined}
                  required
                />
              </Field>
              <Field label="Account email" htmlFor="profile-email" hint="Email changes are managed by Firebase Authentication.">
                <Input id="profile-email" type="email" value={user?.email || ''} disabled />
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study profile</CardTitle>
            <CardDescription>These are saved to your account and can be edited later.</CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Academic level" htmlFor="profile-level" required error={fieldErrors.academicLevel}>
                <Select
                  id="profile-level"
                  options={LEVELS}
                  value={form.academicLevel}
                  onChange={(value) => update('academicLevel', value)}
                  aria-invalid={Boolean(fieldErrors.academicLevel)}
                />
              </Field>
              <Field label="Daily study goal" htmlFor="profile-study-goal" required error={fieldErrors.dailyStudyGoal}>
                <Select
                  id="profile-study-goal"
                  options={STUDY_GOALS}
                  value={form.dailyStudyGoal}
                  onChange={(value) => update('dailyStudyGoal', value)}
                  aria-invalid={Boolean(fieldErrors.dailyStudyGoal)}
                />
              </Field>
              <Field label="Interests (comma separated)" htmlFor="profile-interests" hint="Use the interest labels from onboarding; duplicates are removed when saved.">
                <Input
                  id="profile-interests"
                  value={form.interests.join(', ')}
                  onChange={(event) => update(
                    'interests',
                    event.target.value.split(',').map((value) => value.trim()).filter(Boolean),
                  )}
                />
              </Field>
            </div>

            <Field label="Career goal" htmlFor="profile-career-goal" hint="A short description is enough.">
              <Textarea
                id="profile-career-goal"
                value={form.careerGoal}
                onChange={(event) => update('careerGoal', event.target.value)}
                placeholder="What would you like to explore?"
              />
            </Field>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-800">Interface language: English</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Other languages are not available across the full interface yet, so the language selector is temporarily unavailable rather than implying a translation that does not exist.
              </p>
            </div>

            {error ? (
              <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
            {warning ? (
              <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {warning}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div aria-live="polite" className="text-sm">
                {saved ? <span className="text-emerald-700">Changes saved.</span> : dirty ? <span className="text-slate-500">Unsaved changes</span> : null}
              </div>
              <Button type="submit" variant="brand" loading={saving} disabled={saving || !dirty}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
