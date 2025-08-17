
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Eye, Users, Globe } from 'lucide-react';

interface CircuitPrivacyWarningProps {
  privacyLevel: 'private' | 'authenticated_only' | 'public';
  onPrivacyChange: (level: 'private' | 'authenticated_only' | 'public') => void;
}

export function CircuitPrivacyWarning({ privacyLevel, onPrivacyChange }: CircuitPrivacyWarningProps) {
  const getPrivacyInfo = (level: typeof privacyLevel) => {
    switch (level) {
      case 'private':
        return {
          icon: Shield,
          title: 'Private Circuit',
          description: 'Only you can view and edit this circuit.',
          color: 'text-green-600'
        };
      case 'authenticated_only':
        return {
          icon: Users,
          title: 'Authenticated Users Only',
          description: 'Any signed-in user can view this circuit, but only you can edit it.',
          color: 'text-yellow-600'
        };
      case 'public':
        return {
          icon: Globe,
          title: 'Public Circuit - Security Warning',
          description: 'Anyone on the internet can view this circuit. Do not include sensitive research, proprietary algorithms, or confidential information.',
          color: 'text-red-600'
        };
    }
  };

  const info = getPrivacyInfo(privacyLevel);
  const IconComponent = info.icon;

  return (
    <div className="space-y-4">
      <Alert className={`border-l-4 ${privacyLevel === 'public' ? 'border-red-500 bg-red-50' : privacyLevel === 'authenticated_only' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
        <IconComponent className={`h-4 w-4 ${info.color}`} />
        <AlertTitle className={info.color}>{info.title}</AlertTitle>
        <AlertDescription className="text-gray-700">
          {info.description}
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <button
          onClick={() => onPrivacyChange('private')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            privacyLevel === 'private' 
              ? 'bg-green-100 text-green-800 border-green-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } border`}
        >
          <Shield className="h-4 w-4" />
          Private
        </button>
        
        <button
          onClick={() => onPrivacyChange('authenticated_only')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            privacyLevel === 'authenticated_only' 
              ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } border`}
        >
          <Users className="h-4 w-4" />
          Authenticated Only
        </button>
        
        <button
          onClick={() => onPrivacyChange('public')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            privacyLevel === 'public' 
              ? 'bg-red-100 text-red-800 border-red-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } border`}
        >
          <Globe className="h-4 w-4" />
          Public
        </button>
      </div>
    </div>
  );
}
