
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Smartphone, 
  Users, 
  Cloud, 
  FileText, 
  Shield,
  Wifi,
  Upload
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  details?: string;
}

export function AppFunctionsTester() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Authentication Flow', status: 'pending' },
    { name: 'Session Persistence', status: 'pending' },
    { name: 'Real-time Connection', status: 'pending' },
    { name: 'Collaboration Features', status: 'pending' },
    { name: 'Cloud Backend APIs', status: 'pending' },
    { name: 'File Operations', status: 'pending' },
    { name: 'Mobile Responsiveness', status: 'pending' },
    { name: 'Touch Interactions', status: 'pending' }
  ]);

  const updateTest = (name: string, status: TestResult['status'], message?: string, details?: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message, details } : test
    ));
  };

  const runAuthenticationTests = async () => {
    updateTest('Authentication Flow', 'running');
    
    try {
      // Test 1: Check if user is authenticated
      if (user && session) {
        updateTest('Authentication Flow', 'passed', 'User is authenticated', `User ID: ${user.id}`);
      } else {
        updateTest('Authentication Flow', 'failed', 'User not authenticated', 'Please sign in to test authentication');
        return;
      }

      // Test 2: Test session persistence
      updateTest('Session Persistence', 'running');
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        updateTest('Session Persistence', 'passed', 'Session is properly persisted', 
          `Expires: ${new Date(currentSession.expires_at! * 1000).toLocaleString()}`);
      } else {
        updateTest('Session Persistence', 'failed', 'Session not found');
      }
    } catch (error) {
      updateTest('Authentication Flow', 'failed', 'Authentication test failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runCollaborationTests = async () => {
    updateTest('Real-time Connection', 'running');
    
    try {
      // Test real-time connection
      const channel = supabase
        .channel('test-channel')
        .on('presence', { event: 'sync' }, () => {
          updateTest('Real-time Connection', 'passed', 'Real-time connection established');
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            updateTest('Real-time Connection', 'passed', 'Successfully connected to real-time');
          } else if (status === 'CHANNEL_ERROR') {
            updateTest('Real-time Connection', 'failed', 'Real-time connection failed');
          }
        });

      // Test collaboration features
      updateTest('Collaboration Features', 'running');
      
      if (user) {
        // Check if circuits table exists and is accessible
        const { data, error } = await supabase
          .from('circuits')
          .select('id, name')
          .limit(1);
        
        if (error) {
          updateTest('Collaboration Features', 'failed', 'Database access error', error.message);
        } else {
          updateTest('Collaboration Features', 'passed', 'Collaboration database accessible', 
            `Found ${data?.length || 0} circuits`);
        }
      }

      // Cleanup
      setTimeout(() => {
        supabase.removeChannel(channel);
      }, 2000);

    } catch (error) {
      updateTest('Real-time Connection', 'failed', 'Real-time test failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runCloudBackendTests = async () => {
    updateTest('Cloud Backend APIs', 'running');
    
    try {
      // Test if backend service is available
      const { quantumBackendService } = await import('@/services/quantumBackendService');
      
      // Test local backend first
      const testCircuit = [
        { 
          id: 'test-h-0', 
          type: 'H', 
          qubit: 0, 
          position: 0,
          angle: 0 
        }
      ];
      
      const result = await quantumBackendService.executeCircuit(testCircuit, 100);
      
      if (result && result.stateVector && result.stateVector.length > 0) {
        updateTest('Cloud Backend APIs', 'passed', 'Local quantum backend working', 
          `State vector length: ${result.stateVector.length}`);
      } else {
        updateTest('Cloud Backend APIs', 'failed', 'Backend returned invalid results');
      }
    } catch (error) {
      updateTest('Cloud Backend APIs', 'failed', 'Backend test failed', error instanceof Error ? error.message : 'Backend service unavailable');
    }
  };

  const runFileOperationTests = async () => {
    updateTest('File Operations', 'running');
    
    try {
      if (!user) {
        updateTest('File Operations', 'failed', 'User not authenticated for file tests');
        return;
      }

      // Test quantum files access
      const { data, error } = await supabase
        .from('quantum_files')
        .select('id, name, type')
        .limit(5);
      
      if (error) {
        updateTest('File Operations', 'failed', 'File system access error', error.message);
      } else {
        updateTest('File Operations', 'passed', 'File system accessible', 
          `Found ${data?.length || 0} files`);
      }
    } catch (error) {
      updateTest('File Operations', 'failed', 'File operation test failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runMobileResponsivenessTests = () => {
    updateTest('Mobile Responsiveness', 'running');
    updateTest('Touch Interactions', 'running');
    
    try {
      // Test screen size detection
      const isMobile = window.innerWidth <= 768;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Test viewport meta tag
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const hasViewport = viewportMeta !== null;
      
      // Test CSS media queries
      const supportsMediaQueries = window.matchMedia && window.matchMedia('(max-width: 768px)').matches !== undefined;
      
      if (hasViewport && supportsMediaQueries) {
        updateTest('Mobile Responsiveness', 'passed', 'Mobile responsiveness configured', 
          `Screen: ${window.innerWidth}x${window.innerHeight}, Mobile: ${isMobile}`);
      } else {
        updateTest('Mobile Responsiveness', 'failed', 'Mobile responsiveness not properly configured');
      }
      
      if (hasTouch) {
        updateTest('Touch Interactions', 'passed', 'Touch support detected', 
          `Max touch points: ${navigator.maxTouchPoints}`);
      } else {
        updateTest('Touch Interactions', 'passed', 'Desktop environment (no touch)', 'Touch not required on desktop');
      }
    } catch (error) {
      updateTest('Mobile Responsiveness', 'failed', 'Mobile test failed', error instanceof Error ? error.message : 'Unknown error');
      updateTest('Touch Interactions', 'failed', 'Touch test failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAllTests = async () => {
    toast({
      title: "Running Tests",
      description: "Testing all app functions...",
    });

    await runAuthenticationTests();
    await runCollaborationTests();
    await runCloudBackendTests();
    await runFileOperationTests();
    runMobileResponsivenessTests();

    const passedTests = tests.filter(t => t.status === 'passed').length;
    const totalTests = tests.length;
    
    toast({
      title: "Tests Complete",
      description: `${passedTests}/${totalTests} tests passed`,
      variant: passedTests === totalTests ? "default" : "destructive"
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'bg-green-500/20 text-green-500',
      failed: 'bg-red-500/20 text-red-500',
      running: 'bg-blue-500/20 text-blue-500',
      pending: 'bg-gray-500/20 text-gray-500'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryIcon = (testName: string) => {
    if (testName.includes('Authentication') || testName.includes('Session')) return <Shield className="w-4 h-4" />;
    if (testName.includes('Real-time') || testName.includes('Collaboration')) return <Users className="w-4 h-4" />;
    if (testName.includes('Cloud') || testName.includes('Backend')) return <Cloud className="w-4 h-4" />;
    if (testName.includes('File')) return <FileText className="w-4 h-4" />;
    if (testName.includes('Mobile') || testName.includes('Touch')) return <Smartphone className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;
  const runningTests = tests.filter(t => t.status === 'running').length;
  const progressPercentage = ((passedTests + failedTests) / tests.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow font-mono flex items-center gap-2">
            <Upload className="w-5 h-5" />
            App Functions Tester
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="quantum-progress" />
            <div className="flex gap-4 text-sm">
              <span className="text-green-400">✓ {passedTests} Passed</span>
              <span className="text-red-400">✗ {failedTests} Failed</span>
              <span className="text-blue-400">⟳ {runningTests} Running</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runAllTests} 
            className="w-full bg-quantum-glow text-quantum-void hover:bg-quantum-neon"
            disabled={runningTests > 0}
          >
            {runningTests > 0 ? 'Running Tests...' : 'Run All Tests'}
          </Button>

          <div className="grid gap-4">
            {tests.map((test, index) => (
              <Card key={index} className="bg-quantum-matrix/10 border-quantum-matrix">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(test.name)}
                      <span className="font-medium text-quantum-neon">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                  
                  {test.message && (
                    <div className="text-sm text-muted-foreground mb-1">
                      {test.message}
                    </div>
                  )}
                  
                  {test.details && (
                    <div className="text-xs text-quantum-particle font-mono bg-quantum-matrix/20 p-2 rounded">
                      {test.details}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {user ? (
            <Alert className="border-quantum-glow/30 bg-quantum-glow/10">
              <Shield className="w-4 h-4" />
              <AlertDescription className="text-quantum-glow">
                Authenticated as: {user.email} - All tests can run
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-yellow-500/30 bg-yellow-500/10">
              <Shield className="w-4 h-4" />
              <AlertDescription className="text-yellow-400">
                Not authenticated - Some tests will be limited. Please sign in for full testing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
