
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';

const simulationData = [
  { name: 'Mon', simulations: 12 },
  { name: 'Tue', simulations: 19 },
  { name: 'Wed', simulations: 15 },
  { name: 'Thu', simulations: 25 },
  { name: 'Fri', simulations: 32 },
  { name: 'Sat', simulations: 8 },
  { name: 'Sun', simulations: 5 }
];

const topicData = [
  { name: 'Bell States', value: 35, color: '#00f5ff' },
  { name: 'Quantum Gates', value: 25, color: '#0099cc' },
  { name: 'Entanglement', value: 20, color: '#006699' },
  { name: 'Superposition', value: 15, color: '#003366' },
  { name: 'Other', value: 5, color: '#001133' }
];

const studentProgress = [
  { name: 'Alice Johnson', progress: 85, completedTasks: 17, totalTasks: 20 },
  { name: 'Bob Smith', progress: 72, completedTasks: 14, totalTasks: 20 },
  { name: 'Charlie Brown', progress: 95, completedTasks: 19, totalTasks: 20 },
  { name: 'Diana Prince', progress: 68, completedTasks: 13, totalTasks: 20 },
  { name: 'Eve Wilson', progress: 88, completedTasks: 18, totalTasks: 20 }
];

export function StudentAnalytics() {
  return (
    <div className="space-y-6">
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardHeader>
            <CardTitle className="text-white">Daily Simulations</CardTitle>
            <CardDescription className="text-quantum-silver">
              Student simulation activity over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Bar dataKey="simulations" fill="#00f5ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardHeader>
            <CardTitle className="text-white">Topic Distribution</CardTitle>
            <CardDescription className="text-quantum-silver">
              Most popular quantum computing topics
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

      {/* Student Progress */}
      <Card className="bg-quantum-matrix border-quantum-circuit">
        <CardHeader>
          <CardTitle className="text-white">Student Progress</CardTitle>
          <CardDescription className="text-quantum-silver">
            Individual student completion rates and task progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentProgress.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-quantum-void rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{student.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        student.progress >= 80 ? 'bg-green-500/20 text-green-400' :
                        student.progress >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {student.progress}%
                      </Badge>
                      <span className="text-quantum-silver text-sm">
                        {student.completedTasks}/{student.totalTasks} tasks
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={student.progress} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
