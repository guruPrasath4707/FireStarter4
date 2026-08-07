import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import Placeholder from './Placeholder';

export default function Assessments() {
  return (
    <Placeholder
      icon={ClipboardCheck}
      title="Assessments"
      subtitle="Adaptive tests that reveal where you are and what to learn next."
    />
  );
}
