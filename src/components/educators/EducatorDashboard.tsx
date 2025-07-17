
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, BarChart3, Settings, Plus, School } from 'lucide-react';
import ClassroomList from './ClassroomList';
import { StudentAnalytics } from './StudentAnalytics';
import LMSIntegrations from './LMSIntegrations';

interface EducatorDashboardProps {
  profile: any;
}

export function EducatorDashboard({ profile }: EducatorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-quantum-void">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Educator Dashboard</h1>
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
            </div>
            <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void">
              <Plus className="w-4 h-4 mr-2" />
              New Classroom
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-quantum-silver text-sm">Active Students</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
                <Users className="w-8 h-8 text-quantum-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-quantum-silver text-sm">Simulations This Month</p>
                  <p className="text-2xl font-bold text-white">342</p>
                </div>
                <BarChart3 className="w-8 h-8 text-quantum-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-quantum-silver text-sm">Active Classrooms</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <BookOpen className="w-8 h-8 text-quantum-glow" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-quantum-silver text-sm">Plan Usage</p>
                  <p className="text-2xl font-bold text-white">68%</p>
                </div>
                <Settings className="w-8 h-8 text-quantum-glow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-quantum-matrix">
            <TabsTrigger value="overview" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              Overview
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              Classrooms
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="integrations" className="text-quantum-silver data-[state=active]:text-quantum-glow">
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-quantum-matrix border-quantum-circuit">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-quantum-silver">
                    Latest student interactions and submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-quantum-silver">Alice completed Bell State tutorial</span>
                      <span className="text-xs text-quantum-silver">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-quantum-silver">Bob submitted Quantum Fourier assignment</span>
                      <span className="text-xs text-quantum-silver">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-quantum-silver">Charlie ran 15 simulations</span>
                      <span className="text-xs text-quantum-silver">1 day ago</span>
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
                  <Button variant="outline" className="w-full justify-start border-quantum-circuit text-quantum-glow">
                    Create New Assignment
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-quantum-circuit text-quantum-glow">
                    Export Student Progress
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-quantum-circuit text-quantum-glow">
                    Schedule Virtual Office Hours
                  </Button>
                </CardContent>
              </Card>
            </div>
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
        </Tabs>
      </div>
    </div>
  );
}
