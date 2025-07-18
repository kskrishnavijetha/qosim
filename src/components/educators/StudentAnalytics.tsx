
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Clock, Target, Download, Filter, Calendar } from 'lucide-react';

const simulationData = [
  { name: 'Mon', simulations: 12, completions: 8 },
  { name: 'Tue', simulations: 19, completions: 15 },
  { name: 'Wed', simulations: 15, completions: 12 },
  { name: 'Thu', simulations: 25, completions: 20 },
  { name: 'Fri', simulations: 32, completions: 28 },
  { name: 'Sat', simulations: 8, completions: 6 },
  { name: 'Sun', simulations: 5, completions: 4 }
];

const topicData = [
  { name: 'Bell States', value: 35, color: '#00f5ff' },
  { name: 'Quantum Gates', value: 25, color: '#0099cc' },
  { name: 'Entanglement', value: 20, color: '#006699' },
  { name: 'Superposition', value: 15, color: '#003366' },
  { name: 'Other', value: 5, color: '#001133' }
];

const studentProgress = [
  { name: 'Alice Johnson', progress: 85, completedTasks: 17, totalTasks: 20, lastActive: '2 hours ago', grade: 'A' },
  { name: 'Bob Smith', progress: 72, completedTasks: 14, totalTasks: 20, lastActive: '1 day ago', grade: 'B+' },
  { name: 'Charlie Brown', progress: 95, completedTasks: 19, totalTasks: 20, lastActive: '30 min ago', grade: 'A+' },
  { name: 'Diana Prince', progress: 68, completedTasks: 13, totalTasks: 20, lastActive: '3 hours ago', grade: 'B' },
  { name: 'Eve Wilson', progress: 88, completedTasks: 18, totalTasks: 20, lastActive: '1 hour ago', grade: 'A' }
];

const learningOutcomes = [
  { week: 'Week 1', understanding: 65, engagement: 78, performance: 60 },
  { week: 'Week 2', understanding: 72, engagement: 82, performance: 68 },
  { week: 'Week 3', understanding: 78, engagement: 85, performance: 75 },
  { week: 'Week 4', understanding: 85, engagement: 88, performance: 82 },
  { week: 'Week 5', understanding: 88, engagement: 90, performance: 86 },
  { week: 'Week 6', understanding: 92, engagement: 92, performance: 90 }
];

export function StudentAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Progress Analytics</h2>
          <p className="text-quantum-silver">Detailed insights into student performance, simulation usage, and learning outcomes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-quantum-circuit text-quantum-glow">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="border-quantum-circuit text-quantum-glow">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button size="sm" className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-quantum-silver text-sm">Avg. Completion Rate</p>
                <p className="text-2xl font-bold text-white">82%</p>
                <p className="text-green-400 text-xs flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% from last week
                </p>
              </div>
              <Target className="w-8 h-8 text-quantum-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-quantum-silver text-sm">Active Students</p>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-blue-400 text-xs flex items-center gap-1 mt-1">
                  <Users className="w-3 h-3" />
                  3 new this week
                </p>
              </div>
              <Users className="w-8 h-8 text-quantum-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-quantum-silver text-sm">Avg. Session Time</p>
                <p className="text-2xl font-bold text-white">28m</p>
                <p className="text-purple-400 text-xs flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  +3m from last week
                </p>
              </div>
              <Clock className="w-8 h-8 text-quantum-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-quantum-silver text-sm">Weekly Simulations</p>
                <p className="text-2xl font-bold text-white">116</p>
                <p className="text-orange-400 text-xs flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12 from last week
                </p>
              </div>
              <BarChart className="w-8 h-8 text-quantum-glow" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-quantum-matrix">
          <TabsTrigger value="performance" className="text-quantum-silver data-[state=active]:text-quantum-glow">
            Performance
          </TabsTrigger>
          <TabsTrigger value="engagement" className="text-quantum-silver data-[state=active]:text-quantum-glow">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="text-quantum-silver data-[state=active]:text-quantum-glow">
            Learning Outcomes
          </TabsTrigger>
          <TabsTrigger value="students" className="text-quantum-silver data-[state=active]:text-quantum-glow">
            Individual Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-quantum-matrix border-quantum-circuit">
              <CardHeader>
                <CardTitle className="text-white">Daily Simulations vs Completions</CardTitle>
                <CardDescription className="text-quantum-silver">
                  Student simulation activity and completion rates over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Bar dataKey="simulations" fill="#00f5ff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completions" fill="#0099cc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-quantum-matrix border-quantum-circuit">
              <CardHeader>
                <CardTitle className="text-white">Topic Distribution</CardTitle>
                <CardDescription className="text-quantum-silver">
                  Most popular quantum computing topics among students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topicData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {topicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <CardTitle className="text-white">Student Engagement Metrics</CardTitle>
              <CardDescription className="text-quantum-silver">
                Track student participation, forum activity, and assignment submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-quantum-glow">89%</p>
                  <p className="text-quantum-silver text-sm">Forum Participation</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-quantum-glow">94%</p>
                  <p className="text-quantum-silver text-sm">Assignment Submission</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-quantum-glow">76%</p>
                  <p className="text-quantum-silver text-sm">Active Discussion</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Area type="monotone" dataKey="simulations" stackId="1" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="completions" stackId="1" stroke="#0099cc" fill="#0099cc" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <CardTitle className="text-white">Learning Outcomes Progress</CardTitle>
              <CardDescription className="text-quantum-silver">
                Track understanding, engagement, and performance metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={learningOutcomes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                  <XAxis dataKey="week" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Line type="monotone" dataKey="understanding" stroke="#00f5ff" strokeWidth={3} />
                  <Line type="monotone" dataKey="engagement" stroke="#0099cc" strokeWidth={3} />
                  <Line type="monotone" dataKey="performance" stroke="#006699" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00f5ff] rounded-full"></div>
                  <span className="text-quantum-silver text-sm">Understanding</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#0099cc] rounded-full"></div>
                  <span className="text-quantum-silver text-sm">Engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#006699] rounded-full"></div>
                  <span className="text-quantum-silver text-sm">Performance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <CardTitle className="text-white">Individual Student Progress</CardTitle>
              <CardDescription className="text-quantum-silver">
                Detailed view of each student's completion rates and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentProgress.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-quantum-void rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">{student.name}</span>
                          <Badge className={`${
                            student.grade.startsWith('A') ? 'bg-green-500/20 text-green-400' :
                            student.grade.startsWith('B') ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {student.grade}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-quantum-silver text-sm">
                          <span>{student.completedTasks}/{student.totalTasks} tasks</span>
                          <span>{student.progress}%</span>
                          <span className="text-xs">Last active: {student.lastActive}</span>
                        </div>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
