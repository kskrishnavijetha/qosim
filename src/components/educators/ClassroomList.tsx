
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Copy, Settings, Plus, Search } from 'lucide-react';
import { useClassrooms } from '@/hooks/useClassrooms';
import { toast } from 'sonner';

export function ClassroomList() {
  const { classrooms, loading, createClassroom } = useClassrooms();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    description: '',
    subject: '',
    semester: ''
  });

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClassroom = async () => {
    try {
      await createClassroom(newClassroom);
      setShowCreateDialog(false);
      setNewClassroom({ name: '', description: '', subject: '', semester: '' });
      toast.success('Classroom created successfully!');
    } catch (error) {
      toast.error('Failed to create classroom');
    }
  };

  const copyAccessCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Access code copied to clipboard!');
  };

  if (loading) {
    return <div className="text-quantum-glow">Loading classrooms...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-quantum-silver" />
            <Input
              placeholder="Search classrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-quantum-void border-quantum-circuit text-white"
            />
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void">
              <Plus className="w-4 h-4 mr-2" />
              New Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-quantum-matrix border-quantum-circuit">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Classroom</DialogTitle>
              <DialogDescription className="text-quantum-silver">
                Set up a new virtual classroom for your students.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-quantum-glow">Classroom Name</Label>
                <Input
                  id="name"
                  value={newClassroom.name}
                  onChange={(e) => setNewClassroom(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Quantum Computing 101"
                  className="bg-quantum-void border-quantum-circuit text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-quantum-glow">Subject</Label>
                <Input
                  id="subject"
                  value={newClassroom.subject}
                  onChange={(e) => setNewClassroom(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Physics, Computer Science"
                  className="bg-quantum-void border-quantum-circuit text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-quantum-glow">Semester</Label>
                <Input
                  id="semester"
                  value={newClassroom.semester}
                  onChange={(e) => setNewClassroom(prev => ({ ...prev, semester: e.target.value }))}
                  placeholder="e.g., Fall 2024"
                  className="bg-quantum-void border-quantum-circuit text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-quantum-glow">Description</Label>
                <Textarea
                  id="description"
                  value={newClassroom.description}
                  onChange={(e) => setNewClassroom(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the classroom..."
                  className="bg-quantum-void border-quantum-circuit text-white"
                />
              </div>
              <Button 
                onClick={handleCreateClassroom}
                className="w-full bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
              >
                Create Classroom
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classroom Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClassrooms.map((classroom) => (
          <Card key={classroom.id} className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{classroom.name}</CardTitle>
                  <CardDescription className="text-quantum-silver mt-1">
                    {classroom.subject} • {classroom.semester}
                  </CardDescription>
                </div>
                <Badge className={classroom.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                  {classroom.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-quantum-silver text-sm">{classroom.description}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-quantum-glow" />
                  <span className="text-quantum-silver text-sm">12 students</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <code className="bg-quantum-void px-2 py-1 rounded text-quantum-glow text-sm">
                  {classroom.access_code}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyAccessCode(classroom.access_code)}
                  className="text-quantum-silver hover:text-quantum-glow"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="border-quantum-circuit text-quantum-glow">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClassrooms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-quantum-silver mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">No classrooms found</h3>
          <p className="text-quantum-silver mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Create your first classroom to get started.'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Classroom
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
