
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEducatorProfile } from "@/hooks/useEducatorProfile";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Building, Users } from "lucide-react";

const EducatorSignupForm: React.FC = () => {
  const { createProfile, loading } = useEducatorProfile();
  const [formData, setFormData] = useState({
    institution_name: '',
    institution_type: 'university' as const,
    department: '',
    subjects: [] as string[],
    plan_type: 'free_classroom' as const
  });
  const { toast } = useToast();

  const subjectOptions = [
    'quantum_computing',
    'physics', 
    'computer_science',
    'mathematics',
    'engineering',
    'chemistry',
    'other'
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
    
    if (!formData.institution_name.trim()) {
      toast({
        title: "Error",
        description: "Institution name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createProfile(formData);
      toast({
        title: "Success!",
        description: "Your educator profile has been created. You can now create classrooms and start teaching."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create educator profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-8 h-8 text-quantum-glow" />
          <div>
            <CardTitle className="text-2xl">Join QOSim for Educators</CardTitle>
            <p className="text-muted-foreground">
              Create your free classroom account and start teaching quantum computing
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Institution Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Building className="w-5 h-5 text-quantum-neon" />
              <h3 className="text-lg font-semibold">Institution Details</h3>
            </div>
            
            <div>
              <Label htmlFor="institution_name">Institution Name *</Label>
              <Input
                id="institution_name"
                value={formData.institution_name}
                onChange={(e) => setFormData({...formData, institution_name: e.target.value})}
                placeholder="e.g., Stanford University"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="institution_type">Institution Type</Label>
              <Select 
                value={formData.institution_type}
                onValueChange={(value: any) => setFormData({...formData, institution_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="middle_school">Middle School</SelectItem>
                  <SelectItem value="elementary">Elementary School</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g., Computer Science, Physics"
              />
            </div>
          </div>

          {/* Teaching Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-quantum-plasma" />
              <h3 className="text-lg font-semibold">Teaching Details</h3>
            </div>
            
            <div>
              <Label>Subjects You Teach</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {subjectOptions.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={subject}
                      checked={formData.subjects.includes(subject)}
                      onCheckedChange={() => handleSubjectToggle(subject)}
                    />
                    <Label htmlFor={subject} className="text-sm">
                      {subject.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <div className="bg-gradient-to-br from-quantum-glow/5 to-quantum-neon/5 p-4 rounded-lg border border-quantum-glow/20">
            <h4 className="font-semibold text-quantum-glow mb-2">Free Classroom Plan</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Up to 30 students per classroom</li>
              <li>• 500 simulations per month</li>
              <li>• Basic analytics dashboard</li>
              <li>• LMS integrations</li>
              <li>• Email support</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Educator Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EducatorSignupForm;
