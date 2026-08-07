import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { Button } from '../../design-system/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Field, Input, Textarea } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Avatar } from '../../design-system/Avatar';
import { PageHeader } from '../../components/layout/PageHeader';

const LEVELS = [
  { value: 'class-9',  label: 'Class 9' },
  { value: 'class-10', label: 'Class 10' },
  { value: 'class-11', label: 'Class 11' },
  { value: 'class-12', label: 'Class 12' },
  { value: 'ug',       label: 'Undergraduate' },
  { value: 'pg',       label: 'Postgraduate' },
  { value: 'working',  label: 'Working professional' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
];

const STUDY = [
  { value: '15', label: '15 min / day — light' },
  { value: '30', label: '30 min / day — steady' },
  { value: '60', label: '1 hr / day — serious' },
  { value: '90', label: '1.5 hr / day — intensive' },
];

export default function Profile() {
  const { user, syncDisplayName } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [form, setForm] = useState({
    name: profile?.name || '',
    academicLevel: profile?.academicLevel || 'class-12',
    interests: profile?.interests || [],
    careerGoal: profile?.careerGoal || '',
    preferredLanguage: profile?.preferredLanguage || 'en',
    dailyStudyGoal: String(profile?.dailyStudyGoal || 30),
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await syncDisplayName(form.name);
      await updateProfile({
        name: form.name,
        academicLevel: form.academicLevel,
        interests: form.interests,
        careerGoal: form.careerGoal,
        preferredLanguage: form.preferredLanguage,
        dailyStudyGoal: Number(form.dailyStudyGoal) || 30,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Your information"
        subtitle="Drives every recommendation we make."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Account</CardTitle>
            <Badge tone="brand">Signed in</Badge>
          </div>
          <CardDescription>Managed by Firebase Authentication.</CardDescription>
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
            <Field label="Display name">
              <Input value={form.name} onChange={(e) => update('name', e.target.value)} />
            </Field>
            <Field label="Email">
              <Input value={user?.email || ''} disabled />
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Used to personalize your learning path.</CardDescription>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Academic level">
              <Select options={LEVELS} value={form.academicLevel} onChange={(v) => update('academicLevel', v)} />
            </Field>
            <Field label="Preferred language">
              <Select options={LANGUAGES} value={form.preferredLanguage} onChange={(v) => update('preferredLanguage', v)} />
            </Field>
            <Field label="Daily study goal">
              <Select options={STUDY} value={form.dailyStudyGoal} onChange={(v) => update('dailyStudyGoal', v)} />
            </Field>
            <Field label="Interests (comma separated)" hint="We'll parse these into tags.">
              <Input
                value={form.interests.join(', ')}
                onChange={(e) =>
                  update('interests', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
                }
              />
            </Field>
          </div>
          <Field label="Career goal">
            <Textarea
              value={form.careerGoal}
              onChange={(e) => update('careerGoal', e.target.value)}
              placeholder="What do you want to become?"
            />
          </Field>
          <div className="flex items-center justify-end gap-3">
            {saved ? <Badge tone="success">Saved</Badge> : null}
            <Button onClick={save} loading={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
