
import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';

export default function Profile() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-quantum-void text-quantum-glow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="text-quantum-neon">Profile functionality coming soon</p>
        </div>
      </div>
    </AuthGuard>
  );
}
