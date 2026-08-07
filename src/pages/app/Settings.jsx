import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle, CardDescription, Field, Select } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">App preferences and account controls.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-items-center">
              <SettingsIcon size={18} />
            </div>
            <CardTitle>Preferences</CardTitle>
          </div>
          <CardDescription>These will evolve as features ship.</CardDescription>
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
