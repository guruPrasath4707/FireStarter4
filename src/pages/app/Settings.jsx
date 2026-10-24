import React from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, UserRound, Bell, Palette, Languages } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { PageHeader } from '../../components/layout/PageHeader';

const UNAVAILABLE_PREFERENCES = [
  {
    icon: Palette,
    title: 'Theme',
    description: 'A persistent light/dark theme is not implemented yet.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'The app does not currently send in-app or push notifications.',
  },
  {
    icon: Languages,
    title: 'Additional interface languages',
    description: 'Only English is currently implemented across the interface. Additional languages will be offered after complete translations are available.',
  },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="App settings"
        subtitle="Only working settings are shown as editable controls."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 grid place-items-center">
              <SettingsIcon size={18} />
            </div>
            <div>
              <CardTitle>Profile preferences</CardTitle>
              <CardDescription>Your academic level, interests, career goal, and study goal are saved on your profile.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Button as={Link} to="/profile" variant="brand" leftIcon={UserRound}>
            Edit profile preferences
          </Button>
        </CardBody>
      </Card>

      <section aria-labelledby="settings-unavailable-title" className="space-y-3">
        <div>
          <h2 id="settings-unavailable-title" className="text-base font-semibold text-slate-900">Not available yet</h2>
          <p className="mt-1 text-sm text-slate-600">These are status notes, not inactive controls.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {UNAVAILABLE_PREFERENCES.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardBody className="p-5">
                <div className="h-9 w-9 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 grid place-items-center">
                  <Icon size={17} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
