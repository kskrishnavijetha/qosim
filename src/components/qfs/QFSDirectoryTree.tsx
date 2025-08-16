
import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface QFSDirectory {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface QFSDirectoryTreeProps {
  directories: QFSDirectory[];
  currentDirectory?: string;
  onNavigate: (directoryId?: string) => void;
}

export function QFSDirectoryTree({ directories, currentDirectory, onNavigate }: QFSDirectoryTreeProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const toggleExpanded = (dirId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dirId)) {
      newExpanded.delete(dirId);
    } else {
      newExpanded.add(dirId);
    }
    setExpandedDirs(newExpanded);
  };

  const handleDirectoryClick = (dirId: string) => {
    console.log('Directory clicked:', dirId);
    onNavigate(dirId);
    // Also expand the directory when clicked
    const newExpanded = new Set(expandedDirs);
    newExpanded.add(dirId);
    setExpandedDirs(newExpanded);
  };

  const renderDirectory = (dir: QFSDirectory, level: number = 0) => {
    const isExpanded = expandedDirs.has(dir.id);
    const isActive = currentDirectory === dir.id;
    const hasChildren = directories.some(d => d.parentId === dir.id);

    return (
      <div key={dir.id} className="select-none">
        <div 
          className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-quantum-matrix/50 transition-colors ${
            isActive ? 'bg-quantum-glow/20 text-quantum-glow' : 'text-quantum-text'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleDirectoryClick(dir.id)}
        >
          {hasChildren ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-4 w-4 mr-1"
              onClick={(e) => toggleExpanded(dir.id, e)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-4 mr-1" />
          )}
          
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 mr-2 text-quantum-neon" />
          ) : (
            <Folder className="w-4 h-4 mr-2 text-quantum-neon" />
          )}
          
          <span className="text-sm font-mono truncate">{dir.name}</span>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {directories
              .filter(d => d.parentId === dir.id)
              .map(childDir => renderDirectory(childDir, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get root directories (those without parentId)
  const rootDirectories = directories.filter(dir => !dir.parentId);

  return (
    <div className="space-y-1">
      {/* Root level */}
      <div 
        className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-quantum-matrix/50 transition-colors ${
          !currentDirectory ? 'bg-quantum-glow/20 text-quantum-glow' : 'text-quantum-text'
        }`}
        onClick={() => onNavigate(undefined)}
      >
        <Folder className="w-4 h-4 mr-2 text-quantum-neon" />
        <span className="text-sm font-mono">Root</span>
      </div>
      
      {/* Directory tree */}
      {rootDirectories.map(dir => renderDirectory(dir))}
    </div>
  );
}
