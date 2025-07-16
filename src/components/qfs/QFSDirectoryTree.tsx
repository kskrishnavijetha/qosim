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

  const toggleExpanded = (dirId: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dirId)) {
      newExpanded.delete(dirId);
    } else {
      newExpanded.add(dirId);
    }
    setExpandedDirs(newExpanded);
  };

  const renderDirectory = (dir: QFSDirectory, level = 0) => {
    const isExpanded = expandedDirs.has(dir.id);
    const isSelected = currentDirectory === dir.id;
    const hasChildren = directories.some(d => d.parentId === dir.id);

    return (
      <div key={dir.id} className="select-none">
        <div
          className={`
            flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-quantum-glow/10
            ${isSelected ? 'bg-quantum-glow/20 text-quantum-glow' : ''}
          `}
          style={{ paddingLeft: `${8 + level * 16}px` }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(dir.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-4" />
          )}
          
          <div
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={() => onNavigate(dir.id)}
          >
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            )}
            <span className="text-sm truncate">{dir.name}</span>
          </div>
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

  const rootDirectories = directories.filter(d => !d.parentId);

  return (
    <div className="space-y-1">
      {/* Root Directory */}
      <div
        className={`
          flex items-center gap-2 py-2 px-2 rounded cursor-pointer hover:bg-quantum-glow/10
          ${!currentDirectory ? 'bg-quantum-glow/20 text-quantum-glow' : ''}
        `}
        onClick={() => onNavigate()}
      >
        <FolderOpen className="h-4 w-4 text-yellow-400" />
        <span className="text-sm font-medium">Root</span>
      </div>

      {/* Child Directories */}
      {rootDirectories.map(dir => renderDirectory(dir))}
    </div>
  );
}