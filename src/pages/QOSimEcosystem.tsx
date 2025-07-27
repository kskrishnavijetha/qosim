
import React from 'react';
import { QOSimEcosystem } from '@/components/qosim/QOSimEcosystem';
import { AuthGuard } from '@/components/AuthGuard';

export default function QOSimEcosystemPage() {
  return (
    <AuthGuard>
      <QOSimEcosystem />
    </AuthGuard>
  );
}
