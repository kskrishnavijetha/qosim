
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, BarChart3, Settings, Plus, School, GraduationCap, Play, ArrowRight } from 'lucide-react';
import ClassroomList from './ClassroomList';
import { StudentAnalytics } from './StudentAnalytics';
import LMSIntegrations from './LMSIntegrations';
import { InteractiveCurriculum } from './InteractiveCurriculum';

interface EducatorDashboardProps {
  profile: any;
}

export function EducatorDashboard({ profile }: EducatorDashboardProps) {
  const [activeTab, setActiveTab] = useState('curriculum'); // Start with curriculum tab

  return (
    <div className="min-h-screen bg-quantum-void">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome to QOSim for Educators!</h1>
              <div className="flex items-center gap-2 mt-2">
                <School className="w-4 h-4 text-quantum-glow" />
                <span className="text-quantum-silver">{profile.institution_name}</span>
                <Badge className={`ml-2 ${
                  profile.verification_status === 'verified' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {profile.verification_status}
                </Badge>
              </div>
              <p className="text-quantum-silver mt-2">Start by exploring our interactive curriculum and create your first classroom.</p>
            </div>
            <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void">
              <Plus className="w-4 h-4 mr-2" />
              New Classroom
            </Button>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-quantum-matrix border-quantum-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Start Teaching</h3>
                  <p className="text-quantum-silver text-sm">Explore ready-to-use lessons</p>
                </div>
                <BookOpen className="w-8 h-8 text-quantum-glow" />
              </div>
              <Button 
                onClick={() => setActiveTab('curriculum')} 
                className="w-full bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
              >
                <Play className="w-4 h-4 mr-2" />
                Browse Lessons
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Create Classroom</h3>
                  <p className="text-quantum-silver text-sm">Set up your first class</p>
                </div>
                <Users className="w-8 h-8 text-quantum-glow" />
              </div>
              <Button 
                onClick={() => setActiveTab('classrooms')} 
                variant="outline" 
                className="w-full border-quantum-circuit text-quantum-glow"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">View Analytics</h3>
                  <p className="text-quantum-silver text-sm">Track student progress</p>
                </div>
                <BarChart3 className="w-8 h-8 text-quantum-glow" />
              </div>
              <Button 
                onClick={() => setActiveTab('analytics')} 
                variant="outline" 
                className="w-full border-quantum-circuit text-quantum-glow"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Explore
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-quantum-silver text-sm">Available Lessons</p>
                  <p className="text-2xl font-bold text-white">27</p>
                </div>
                <BookOpen className="w-8 h-8 text-quantum-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-quantum-silver text-sm">Active Students</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <Users className="w-8 h-8 text-quantum-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-quantum-silver text-sm">Classrooms</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <School className="w-8 h-8 text-quantum-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-quantum-silver text-sm">Plan Usage</p>
                  <p className="text-2xl font-bold text-white">0%</p>
                </div>
                <Settings className="w-8 h-8 text-quantum-glow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-quantum-matrix">
            <TabsTrigger value="curriculum" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              <BookOpen className="w-4 h-4 mr-2" />
              Curriculum
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              <Users className="w-4 h-4 mr-2" />
              Classrooms
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="integrations" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              <Settings className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="overview" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="mt-6">
            <InteractiveCurriculum />
          </TabsContent>

          <TabsContent value="classrooms" className="mt-6">
            <ClassroomList educatorId={profile.id} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <StudentAnalytics />
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <LMSIntegrations educatorId={profile.id} />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-quantum-matrix border-quantum-circuit">
                <CardHeader>
                  <CardTitle className="text-white">Getting Started</CardTitle>
                  <CardDescription className="text-quantum-silver">
                    Complete these steps to start teaching quantum computing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-quantum-silver">✓ Educator profile created</span>
                      <Badge className="bg-green-500/20 text-green-400">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-quantum-silver">○ Explore curriculum lessons</span>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab('curriculum')}
                        className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                      >
                        Start
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-quantum-silver">○ Create first classroom</span>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab('classrooms')}
                        variant="outline" 
                        className="border-quantum-circuit text-quantum-glow"
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-quantum-matrix border-quantum-circuit">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-quantum-silver">
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-quantum-circuit text-quantum-glow"
                    onClick={() => setActiveTab('curriculum')}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Browse Interactive Lessons
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-quantum-circuit text-quantum-glow"
                    onClick={() => setActiveTab('classrooms')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Create New Classroom
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-quantum-circuit text-quantum-glow"
                    onClick={() => setActiveTab('integrations')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Setup LMS Integration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
