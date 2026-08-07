import React from 'react';
import { Card, CardBody, CardHeader, CardTitle, CardDescription, Badge } from '../../components/ui';

export default function Placeholder({ icon: Icon, title, description, tone = 'brand' }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {description ? <p className="mt-1 text-slate-500">{description}</p> : null}
        </div>
        <Badge tone={tone}>Coming soon</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {Icon ? (
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-items-center">
                <Icon size={18} />
              </div>
            ) : null}
            <CardTitle>This module is in progress</CardTitle>
          </div>
          <CardDescription>
            We're building this with care. The shell, routing, and your profile are wired up —
            intelligence and personalization land in the next phases.
          </CardDescription>
        </CardHeader>
        <CardBody>
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            Nothing here yet — but it's the right place to come back to.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
