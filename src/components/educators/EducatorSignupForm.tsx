
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEducatorProfile } from '@/hooks/useEducatorProfile';
import { toast } from 'sonner';

interface EducatorSignupFormProps {
  onComplete: () => void;
}

export function EducatorSignupForm({ onComplete }: EducatorSignupFormProps) {
  const { createProfile } = useEducatorProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    institution_name: '',
    institution_type: '',
    department: '',
    subjects: [] as string[],
    plan_type: 'free_classroom'
  });

  const institutionTypes = [
    { value: 'university', label: 'University' },
    { value: 'college', label: 'College' },
    { value: 'high_school', label: 'High School' },
    { value: 'middle_school', label: 'Middle School' },
    { value: 'elementary', label: 'Elementary School' },
    { value: 'other', label: 'Other' }
  ];

  const subjectOptions = [
    'Physics', 'Computer Science', 'Mathematics', 'Engineering', 
    'Chemistry', 'Quantum Computing', 'Information Science', 'Other'
  ];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProfile(formData);
      toast.success('Educator profile created successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to create educator profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quantum-void py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Create Your Educator Account</CardTitle>
            <CardDescription className="text-quantum-silver">
              Set up your profile to start managing classrooms and tracking student progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-quantum-glow">Institution Name</Label>
                <Input
                  id="institution"
                  value={formData.institution_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution_name: e.target.value }))}
                  placeholder="Enter your institution name"
                  className="bg-quantum-void border-quantum-circuit text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-quantum-glow">Institution Type</Label>
                <Select value={formData.institution_type} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, institution_type: value }))
                }>
                  <SelectTrigger className="bg-quantum-void border-quantum-circuit text-white">
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-quantum-glow">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g., Physics, Computer Science"
                  className="bg-quantum-void border-quantum-circuit text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-quantum-glow">Teaching Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map(subject => (
                    <Badge
                      key={subject}
                      variant={formData.subjects.includes(subject) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.subjects.includes(subject) 
                          ? 'bg-quantum-glow text-quantum-void' 
                          : 'border-quantum-circuit text-quantum-silver hover:bg-quantum-matrix'
                      }`}
                      onClick={() => handleSubjectToggle(subject)}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-quantum-glow">Plan Selection</Label>
                <div className="grid gap-4">
                  <Card className={`cursor-pointer transition-colors ${
                    formData.plan_type === 'free_classroom' 
                      ? 'border-quantum-glow bg-quantum-circuit/20' 
                      : 'border-quantum-circuit hover:border-quantum-matrix'
                  }`} onClick={() => setFormData(prev => ({ ...prev, plan_type: 'free_classroom' }))}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white font-semibold">Free Classroom</h3>
                          <p className="text-quantum-silver text-sm">Up to 30 students, 500 simulations/month</p>
                        </div>
                        <Badge className="bg-quantum-glow text-quantum-void">$0/month</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Educator Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
