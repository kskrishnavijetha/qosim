
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClassrooms } from "@/hooks/useClassrooms";
import { Users, Plus, Settings, Copy, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassroomListProps {
  educatorId: string;
}

const ClassroomList: React.FC<ClassroomListProps> = ({ educatorId }) => {
  const { classrooms, loading, createClassroom, updateClassroom } = useClassrooms(educatorId);
  const [isCreating, setIsCreating] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    description: '',
    subject: '',
    semester: '',
    max_students: 30
  });
  const { toast } = useToast();

  const handleCreateClassroom = async () => {
    if (!newClassroom.name.trim()) {
      toast({
        title: "Error",
        description: "Classroom name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createClassroom(newClassroom);
      setNewClassroom({
        name: '',
        description: '',
        subject: '',
        semester: '',
        max_students: 30
      });
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Classroom created successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to create classroom",
        variant: "destructive"
      });
    }
  };

  const copyAccessCode = (accessCode: string) => {
    navigator.clipboard.writeText(accessCode);
    toast({
      title: "Copied!",
      description: "Access code copied to clipboard"
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading classrooms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Classrooms</h2>
          <p className="text-muted-foreground">Manage your quantum computing classes</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Classroom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Classroom</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Classroom Name *</Label>
                <Input
                  id="name"
                  value={newClassroom.name}
                  onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})}
                  placeholder="e.g., Quantum Computing 101"
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select onValueChange={(value) => setNewClassroom({...newClassroom, subject: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quantum_computing">Quantum Computing</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="semester">Semester/Term</Label>
                <Input
                  id="semester"
                  value={newClassroom.semester}
                  onChange={(e) => setNewClassroom({...newClassroom, semester: e.target.value})}
                  placeholder="e.g., Fall 2025"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newClassroom.description}
                  onChange={(e) => setNewClassroom({...newClassroom, description: e.target.value})}
                  placeholder="Brief description of the classroom..."
                />
              </div>
              
              <div>
                <Label htmlFor="max_students">Maximum Students</Label>
                <Input
                  id="max_students"
                  type="number"
                  value={newClassroom.max_students}
                  onChange={(e) => setNewClassroom({...newClassroom, max_students: parseInt(e.target.value) || 30})}
                  min="1"
                  max="100"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateClassroom}>
                  Create Classroom
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {classrooms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Book className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No classrooms yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first classroom to start teaching quantum computing
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Classroom
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{classroom.name}</CardTitle>
                    {classroom.subject && (
                      <Badge variant="secondary" className="mt-1">
                        {classroom.subject.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {classroom.description && (
                  <p className="text-sm text-muted-foreground">
                    {classroom.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Students:</span>
                    <span>0 / {classroom.max_students}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Semester:</span>
                    <span>{classroom.semester || 'Not set'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Access Code</Label>
                  <div className="flex space-x-2">
                    <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                      {classroom.access_code}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyAccessCode(classroom.access_code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Students
                  </Button>
                  <Button size="sm" className="flex-1">
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassroomList;
