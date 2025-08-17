
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { emailSchema, passwordSchema, displayNameSchema, sanitizeInput, authRateLimiter } from '@/lib/security';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface SecureAuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  loading: boolean;
}

export function SecureAuthForm({ mode, onSubmit, loading }: SecureAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRateLimited, setIsRateLimited] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    try {
      emailSchema.parse(email);
    } catch (error: any) {
      newErrors.email = error.errors[0]?.message || 'Invalid email';
    }

    // Validate password
    try {
      passwordSchema.parse(password);
    } catch (error: any) {
      newErrors.password = error.errors[0]?.message || 'Invalid password';
    }

    // Validate display name for signup
    if (mode === 'signup') {
      try {
        displayNameSchema.parse(displayName);
      } catch (error: any) {
        newErrors.displayName = error.errors[0]?.message || 'Invalid display name';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const rateLimitKey = `auth:${email}`;
    if (authRateLimiter.isRateLimited(rateLimitKey)) {
      setIsRateLimited(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedDisplayName = mode === 'signup' ? sanitizeInput(displayName) : undefined;

    const result = await onSubmit(sanitizedEmail, password, sanitizedDisplayName);
    
    if (result.error) {
      setErrors({ general: result.error.message || 'Authentication failed' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRateLimited && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Too many attempts. Please wait 15 minutes before trying again.
          </AlertDescription>
        </Alert>
      )}

      {errors.general && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {errors.general}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? 'border-red-500' : ''}
          disabled={loading || isRateLimited}
          autoComplete="email"
          required
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            disabled={loading || isRateLimited}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>

      {mode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={errors.displayName ? 'border-red-500' : ''}
            disabled={loading || isRateLimited}
            autoComplete="name"
            required
          />
          {errors.displayName && <p className="text-sm text-red-600">{errors.displayName}</p>}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || isRateLimited}
      >
        {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Button>

      <div className="text-xs text-gray-600 space-y-1">
        <p>🔒 Your data is encrypted and secure</p>
        {mode === 'signup' && (
          <p>⚠️ Choose a strong password with uppercase, lowercase, and numbers</p>
        )}
      </div>
    </form>
  );
}
