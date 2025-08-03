
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { HardwareJob } from '@/services/quantumHardwareService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CostTrackerProps {
  usage: any;
  jobs: HardwareJob[];
}

export function CostTracker({ usage, jobs }: CostTrackerProps) {
  const completedJobs = jobs.filter(job => job.status === 'completed');
  
  const getCostTrend = () => {
    const last30Days = completedJobs
      .filter(job => {
        const jobDate = job.completedAt || job.submittedAt;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return jobDate >= thirtyDaysAgo;
      })
      .sort((a, b) => {
        const dateA = a.completedAt || a.submittedAt;
        const dateB = b.completedAt || b.submittedAt;
        return dateA.getTime() - dateB.getTime();
      });

    // Group by day and calculate daily costs
    const dailyCosts = last30Days.reduce((acc, job) => {
      const date = (job.completedAt || job.submittedAt).toDateString();
      const cost = job.cost.actual || job.cost.estimated;
      
      if (!acc[date]) {
        acc[date] = { date, cost: 0, jobs: 0 };
      }
      
      acc[date].cost += cost;
      acc[date].jobs += 1;
      
      return acc;
    }, {} as Record<string, { date: string; cost: number; jobs: number }>);

    return Object.values(dailyCosts).slice(-14); // Last 14 days
  };

  const getProviderBreakdown = () => {
    if (!usage?.providers) return [];
    
    const colors = ['#64ffda', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    
    return Object.entries(usage.providers).map(([provider, data]: [string, any], index) => ({
      name: provider.toUpperCase(),
      value: data.cost,
      jobs: data.jobs,
      color: colors[index % colors.length]
    }));
  };

  const getBudgetStatus = () => {
    const monthlyBudget = 50; // Mock monthly budget of $50
    const currentSpend = usage?.monthlyCost || 0;
    const percentage = (currentSpend / monthlyBudget) * 100;
    
    let status = 'good';
    let message = 'Within budget';
    
    if (percentage > 90) {
      status = 'critical';
      message = 'Over budget';
    } else if (percentage > 75) {
      status = 'warning';
      message = 'Approaching limit';
    }
    
    return { percentage: Math.min(100, percentage), status, message, budget: monthlyBudget };
  };

  const costTrendData = getCostTrend();
  const providerData = getProviderBreakdown();
  const budgetStatus = getBudgetStatus();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-mono text-quantum-glow">Cost Tracking & Usage</h3>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="quantum-panel">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-quantum-glow" />
              <span className="font-mono text-quantum-glow">Monthly Spend</span>
            </div>
            <div className="text-2xl font-mono text-quantum-neon">
              ${usage?.monthlyCost?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-muted-foreground">
              of ${budgetStatus.budget} budget
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-quantum-particle" />
              <span className="font-mono text-quantum-particle">Total Spend</span>
            </div>
            <div className="text-2xl font-mono text-quantum-neon">
              ${usage?.totalCost?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-muted-foreground">
              All time
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-quantum-energy" />
              <span className="font-mono text-quantum-energy">Monthly Jobs</span>
            </div>
            <div className="text-2xl font-mono text-quantum-neon">
              {usage?.monthlyJobs || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Executed jobs
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-quantum-neon" />
              <span className="font-mono text-quantum-neon">Avg Cost/Job</span>
            </div>
            <div className="text-2xl font-mono text-quantum-neon">
              ${usage?.monthlyJobs > 0 ? (usage.monthlyCost / usage.monthlyJobs).toFixed(3) : '0.000'}
            </div>
            <div className="text-xs text-muted-foreground">
              Per execution
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Status */}
      <Card className="quantum-panel">
        <CardHeader>
          <CardTitle className="text-base font-mono text-quantum-neon flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Budget Status
            <Badge 
              className={
                budgetStatus.status === 'critical' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                budgetStatus.status === 'warning' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                'bg-green-500/20 border-green-500/50 text-green-400'
              }
            >
              {budgetStatus.message}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly Budget Usage</span>
              <span className="font-mono text-quantum-particle">
                {budgetStatus.percentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={budgetStatus.percentage} 
              className={`h-3 ${
                budgetStatus.status === 'critical' ? 'bg-red-500/20' :
                budgetStatus.status === 'warning' ? 'bg-yellow-500/20' :
                'bg-green-500/20'
              }`}
            />
          </div>
          
          {budgetStatus.status === 'critical' && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="text-sm">
                <div className="text-red-400 font-medium">Budget Exceeded</div>
                <div className="text-muted-foreground">
                  You've exceeded your monthly budget. Consider optimizing circuits or reducing shots.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cost Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle className="text-base font-mono text-quantum-neon">
              Daily Spending (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {costTrendData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={costTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64ffda"
                      fontSize={10}
                      fontFamily="monospace"
                      tickFormatter={(value) => new Date(value).getMonth() + 1 + '/' + new Date(value).getDate()}
                    />
                    <YAxis 
                      stroke="#64ffda"
                      fontSize={10}
                      fontFamily="monospace"
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #64ffda',
                        borderRadius: '8px',
                        fontFamily: 'monospace'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any, name) => [`$${value.toFixed(3)}`, 'Daily Cost']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#64ffda" 
                      strokeWidth={2}
                      dot={{ fill: '#64ffda', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No cost data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle className="text-base font-mono text-quantum-neon">
              Spending by Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            {providerData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={providerData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                    >
                      {providerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #64ffda',
                        borderRadius: '8px',
                        fontFamily: 'monospace'
                      }}
                      formatter={(value: any, name, props) => [
                        `$${value.toFixed(2)} (${props.payload.jobs} jobs)`,
                        'Cost'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No provider data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs Cost Breakdown */}
      <Card className="quantum-panel">
        <CardHeader>
          <CardTitle className="text-base font-mono text-quantum-neon">
            Recent Jobs Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedJobs.length > 0 ? (
            <div className="space-y-2">
              {completedJobs.slice(0, 10).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-2 bg-quantum-matrix rounded">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-mono text-sm text-quantum-neon">{job.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {job.device} • {job.shots} shots • {(job.completedAt || job.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-quantum-glow">
                      ${(job.cost.actual || job.cost.estimated).toFixed(3)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${((job.cost.actual || job.cost.estimated) / job.shots * 1000).toFixed(4)}/1K shots
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No completed jobs to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
