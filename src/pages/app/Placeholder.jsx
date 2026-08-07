import React from 'react';
import { Card, CardBody } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState } from '../../components/layout/EmptyState';

export default function Placeholder({ icon: Icon, title, subtitle, eyebrow = 'Coming soon', ctaLabel, onCta }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        actions={<Badge tone="violet">Awaiting Figma</Badge>}
      />
      <Card>
        <CardBody>
          <EmptyState
            icon={Icon}
            title="Final design pending"
            description="This screen is reserved for a future Figma-driven design. Functionality will land in a later phase."
            action={
              ctaLabel ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 h-10 text-sm font-medium hover:bg-slate-50"
                  onClick={onCta}
                >
                  {ctaLabel}
                </button>
              ) : null
            }
          />
        </CardBody>
      </Card>
    </div>
  );
}
