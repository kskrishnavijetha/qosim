import posthog from 'posthog-js';

// Initialize PostHog
export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    posthog.init('phc_demo_key_replace_with_real_key', {
      api_host: 'https://app.posthog.com',
      disable_session_recording: false,
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
};

// Analytics event types
export type AnalyticsEvent = {
  'circuit_created': { numQubits: number };
  'circuit_modified': { gateType: string; numGates: number };
  'gate_added': { gateType: string; qubit?: number; position: number };
  'gate_removed': { gateType: string };
  'circuit_exported': { format: 'json' | 'qasm'; gateCount: number };
  'circuit_simulated': { gateCount: number; numQubits: number; mode?: string };
  'session_time': { duration: number; circuitId: string };
  'feedback_submitted': { rating?: number; feedback: string };
};

// Track analytics events
export const trackEvent = <T extends keyof AnalyticsEvent>(
  event: T,
  properties: AnalyticsEvent[T]
) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, properties);
  }
};

// Track circuit session time
export class CircuitSessionTracker {
  private startTime: number = Date.now();
  private circuitId: string;

  constructor(circuitId: string) {
    this.circuitId = circuitId;
    this.startTime = Date.now();
  }

  trackTimeSpent() {
    const duration = Date.now() - this.startTime;
    trackEvent('session_time', { 
      duration: Math.round(duration / 1000), // in seconds
      circuitId: this.circuitId 
    });
  }

  reset() {
    this.startTime = Date.now();
  }
}

// Gate usage counter
export const gateUsageTracker = {
  counts: {} as Record<string, number>,
  
  increment(gateType: string) {
    this.counts[gateType] = (this.counts[gateType] || 0) + 1;
  },
  
  getTopGates() {
    return Object.entries(this.counts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);
  }
};
