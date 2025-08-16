
import { useState } from "react";
import { Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QFSDirectory } from "@/lib/qfs/qfsCore";

interface QFSDirectoryTreeProps {
  directories: QFSDirectory[];
  currentDirectory?: string;
  onNavigate: (directoryId?: string) => void;
}

export function QFSDirectoryTree({ directories, currentDirectory, onNavigate }: QFSDirectoryTreeProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  console.log('QFSDirectoryTree - directories:', directories);
  console.log('QFSDirectoryTree - currentDirectory:', currentDirectory);
  console.log('QFSDirectoryTree - expandedDirs:', Array.from(expandedDirs));

  const toggleExpanded = (dirId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggling expansion for directory:', dirId);
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
  };

  const renderDirectory = (dir: QFSDirectory, level = 0) => {
    const isExpanded = expandedDirs.has(dir.id);
    const isSelected = currentDirectory === dir.id;
    const hasChildren = directories.some(d => d.parentId === dir.id);

    console.log(`Rendering directory: ${dir.name}, hasChildren: ${hasChildren}, isExpanded: ${isExpanded}, isSelected: ${isSelected}`);

    return (
      <div key={dir.id} className="select-none">
        <div
          className={`
            flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-quantum-glow/10 transition-colors
            ${isSelected ? 'bg-quantum-glow/20 text-quantum-glow' : 'text-quantum-text'}
          `}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => handleDirectoryClick(dir.id)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-quantum-glow/20"
              onClick={(e) => toggleExpanded(dir.id, e)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-quantum-glow" />
              ) : (
                <ChevronRight className="h-3 w-3 text-quantum-glow" />
              )}
            </Button>
          ) : (
            <div className="w-4 h-4" />
          )}
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            )}
            <span className="text-sm truncate font-medium">{dir.name}</span>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-2">
            {directories
              .filter(d => d.parentId === dir.id)
              .map(childDir => renderDirectory(childDir, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootDirectories = directories.filter(d => !d.parentId);

  return (
    <div className="space-y-1">
      {/* Root Directory */}
      <div
        className={`
          flex items-center gap-2 py-2 px-2 rounded cursor-pointer hover:bg-quantum-glow/10 transition-colors
          ${!currentDirectory ? 'bg-quantum-glow/20 text-quantum-glow' : 'text-quantum-text'}
        `}
        onClick={() => {
          console.log('Root directory clicked');
          onNavigate();
        }}
      >
        <FolderOpen className="h-4 w-4 text-yellow-400" />
        <span className="text-sm font-medium">Root</span>
        {!currentDirectory && (
          <span className="text-xs text-quantum-glow ml-auto">●</span>
        )}
      </div>

      {/* Child Directories */}
      {rootDirectories.map(dir => renderDirectory(dir))}
      
      {directories.length === 0 && (
        <div className="text-xs text-quantum-text/50 px-2 py-1">
          No directories created yet
        </div>
      )}
    </div>
  );
}
