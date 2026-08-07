import React from 'react';
import { Bot } from 'lucide-react';
import Placeholder from './Placeholder';

export default function AIMentor() {
  return (
    <Placeholder
      icon={Bot}
      title="AI Mentor"
      description="Ask anything — your goals, next steps, or how to learn something."
      tone="violet"
    />
  );
}
