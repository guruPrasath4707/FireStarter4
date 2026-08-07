import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../design-system/Card';
import { Field } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="App preferences"
        subtitle="These will evolve as features ship."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[linear-gradient(135deg,#eef2ff,#fdf4ff)] border border-slate-200 text-violet-700 grid place-items-center">
              <SettingsIcon size={18} />
            </div>
            <CardTitle>Preferences</CardTitle>
          </div>
          <CardDescription>UI-only controls for now.</CardDescription>
        </CardHeader>
        <CardBody className="grid sm:grid-cols-2 gap-4">
          <Field label="Theme">
            <Select
              options={[
                { value: 'system', label: 'System' },
                { value: 'light',  label: 'Light' },
                { value: 'dark',   label: 'Dark' },
              ]}
              value="system"
              onChange={() => {}}
            />
          </Field>
          <Field label="Notifications">
            <Select
              options={[
                { value: 'all', label: 'All' },
                { value: 'mentor', label: 'Mentor only' },
                { value: 'none', label: 'None' },
              ]}
              value="all"
              onChange={() => {}}
            />
          </Field>
          <Field label="Account email">
            <Select
              options={[{ value: user?.email || '', label: user?.email || '' }]}
              value={user?.email || ''}
              onChange={() => {}}
              disabled
            />
          </Field>
        </CardBody>
      </Card>
    </div>
  );
}
