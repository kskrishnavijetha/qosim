
import { z } from 'zod';

// Input validation schemas
export const emailSchema = z.string().email('Invalid email format').max(255, 'Email too long');
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number');
export const displayNameSchema = z.string().min(1, 'Display name required').max(50, 'Display name too long');

// Enhanced sanitization with comprehensive XSS protection
export const sanitizeInput = (input: string): string => {
  return input
    // Remove all HTML tags completely
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol
    .replace(/data:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove script tags even if obfuscated
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Remove style tags
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Remove iframe tags
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    // Remove object and embed tags
    .replace(/<(object|embed)[\s\S]*?<\/(object|embed)>/gi, '')
    // HTML entity encode remaining special characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Enhanced HTML sanitization for rich content
export const sanitizeHTML = (html: string): string => {
  // Allow only safe HTML tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'code', 'pre', 'blockquote'];
  const tagRegex = /<(\/?)([\w]+)([^>]*)>/g;
  
  return html.replace(tagRegex, (match, slash, tag, attributes) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      // Strip all attributes for security
      return `<${slash}${tag}>`;
    }
    return ''; // Remove disallowed tags
  });
};

// Rate limiting helper with enhanced security
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number; blocked: boolean }> = new Map();
  
  constructor(
    private maxAttempts: number = 5, 
    private windowMs: number = 15 * 60 * 1000,
    private blockDurationMs: number = 60 * 60 * 1000 // 1 hour block
  ) {}
  
  isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs, blocked: false });
      return false;
    }
    
    // If blocked, check if block period has expired
    if (record.blocked && now < record.resetTime + this.blockDurationMs) {
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      record.blocked = true;
      record.resetTime = now; // Reset timer for block duration
      return true;
    }
    
    record.count++;
    return false;
  }
  
  getRemainingAttempts(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return this.maxAttempts;
    return Math.max(0, this.maxAttempts - record.count);
  }
}

export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length === 64;
};

// Content Security Policy helper
export const getCSPHeader = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://esm.sh",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
};

// Input validation for quantum circuit data
export const circuitDataSchema = z.object({
  gates: z.array(z.object({
    type: z.string(),
    qubit: z.number().min(0),
    params: z.record(z.any()).optional()
  })),
  qubits: z.number().min(1).max(1000),
  measurements: z.array(z.number()).optional()
});

// Secure logging function that excludes sensitive data
export const secureLog = (message: string, data?: any) => {
  const sanitizedData = data ? {
    ...data,
    password: data.password ? '[REDACTED]' : undefined,
    token: data.token ? '[REDACTED]' : undefined,
    apiKey: data.apiKey ? '[REDACTED]' : undefined,
    credentials: data.credentials ? '[REDACTED]' : undefined,
  } : undefined;
  
  console.log(`[SECURITY] ${message}`, sanitizedData);
};
