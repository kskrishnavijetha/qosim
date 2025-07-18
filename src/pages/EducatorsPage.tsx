
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, BookOpen, Settings, BarChart3, Zap, CheckCircle, Globe } from 'lucide-react';
import EducatorSignupForm from '@/components/educators/EducatorSignupForm';
import { EducatorDashboard } from '@/components/educators/EducatorDashboard';
import { useEducatorProfile } from '@/hooks/useEducatorProfile';

const EducatorsPage = () => {
  const { user } = useAuth();
  const { profile, loading } = useEducatorProfile();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-quantum-void flex items-center justify-center">
        <div className="text-quantum-glow">Loading...</div>
      </div>
    );
  }

  // If user is logged in and has an educator profile, show dashboard
  if (user && profile) {
    return <EducatorDashboard profile={profile} />;
  }

  // If user is logged in but no educator profile, show signup form
  if (user && showSignup) {
    return (
      <div className="min-h-screen bg-quantum-void py-16">
        <div className="max-w-4xl mx-auto px-4">
          <EducatorSignupForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quantum-void">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="w-16 h-16 text-quantum-glow" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Teach Quantum Computing
              <span className="block text-quantum-glow">Made Simple</span>
            </h1>
            <p className="text-xl text-quantum-silver max-w-3xl mx-auto mb-8">
              Bring quantum computing to your classroom with interactive simulations, 
              comprehensive curriculum support, and real-time student progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button 
                  size="lg" 
                  className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                  onClick={() => setShowSignup(true)}
                >
                  Create Educator Account
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                  onClick={() => window.location.href = '/auth'}
                >
                  Get Started Free
                </Button>
              )}
              <Button size="lg" variant="outline" className="border-quantum-matrix text-quantum-glow hover:bg-quantum-matrix">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Teach Quantum</h2>
          <p className="text-xl text-quantum-silver">Comprehensive tools designed specifically for educators</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <Users className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">Classroom Management</CardTitle>
              <CardDescription className="text-quantum-silver">
                Create virtual classrooms, manage student enrollments, and track progress in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">Interactive Curriculum</CardTitle>
              <CardDescription className="text-quantum-silver">
                Pre-built lessons, tutorials, and assignments covering quantum fundamentals to advanced topics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">Progress Analytics</CardTitle>
              <CardDescription className="text-quantum-silver">
                Detailed insights into student performance, simulation usage, and learning outcomes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <Globe className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">LMS Integration</CardTitle>
              <CardDescription className="text-quantum-silver">
                Seamlessly integrate with Canvas, Moodle, Blackboard, and other popular LMS platforms.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <Zap className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">Unlimited Simulations</CardTitle>
              <CardDescription className="text-quantum-silver">
                Run quantum circuit simulations without limits during class sessions and assignments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <Settings className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">Customizable Environment</CardTitle>
              <CardDescription className="text-quantum-silver">
                Tailor the learning experience to match your curriculum and teaching style.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-quantum-silver">Start free, upgrade as you grow</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <CardTitle className="text-white">Free Classroom</CardTitle>
              <CardDescription className="text-quantum-silver">Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold text-quantum-glow mt-4">$0<span className="text-sm text-quantum-silver">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Up to 30 students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">500 simulations/month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Basic analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Email support</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-glow relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-quantum-glow text-quantum-void">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-white">Premium Classroom</CardTitle>
              <CardDescription className="text-quantum-silver">For active educators</CardDescription>
              <div className="text-3xl font-bold text-quantum-glow mt-4">$29<span className="text-sm text-quantum-silver">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Up to 100 students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Unlimited simulations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">LMS integrations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Priority support</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <CardTitle className="text-white">Enterprise</CardTitle>
              <CardDescription className="text-quantum-silver">For institutions</CardDescription>
              <div className="text-3xl font-bold text-quantum-glow mt-4">Custom</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Unlimited students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">White-label solution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Custom integrations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Dedicated support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">Training & onboarding</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-quantum-matrix py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Quantum Teaching?</h2>
          <p className="text-xl text-quantum-silver mb-8">
            Join thousands of educators already using QOSim to teach quantum computing effectively.
          </p>
          {user ? (
            <Button 
              size="lg" 
              className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
              onClick={() => setShowSignup(true)}
            >
              Create Your Educator Account
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
              onClick={() => window.location.href = '/auth'}
            >
              Start Your Free Classroom Today
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducatorsPage;
