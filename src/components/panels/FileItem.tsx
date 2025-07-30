
import { FileText, Folder, Star, StarOff, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { CircuitPreview } from "../circuits/CircuitPreview";
import { Edit, Copy, Share, History, Trash2, Eye } from "lucide-react";

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  superposition: boolean;
  favorite: boolean;
  tags: string[];
  versions: number;
  lastVersion: string;
}

interface FileItemProps {
  file: File;
  draggedItem: string | null;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetId: string) => void;
  onDragEnd: () => void;
  onToggleFavorite: (id: string) => void;
  onContextAction: (action: string, fileId: string) => void;
  onFileSelect?: (fileId: string) => void;
}

export function FileItem({ 
  file, 
  draggedItem, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onDragEnd, 
  onToggleFavorite, 
  onContextAction,
  onFileSelect 
}: FileItemProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder": return <Folder className="w-4 h-4 text-quantum-neon" />;
      default: return <FileText className="w-4 h-4 text-quantum-glow" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "circuit": return "text-quantum-glow";
      case "algorithm": return "text-quantum-neon";
      case "folder": return "text-quantum-neon";
      case "model": return "text-purple-400";
      case "data": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('FileItem clicked:', file.name, file.id);
    
    if (file.type !== "folder" && onFileSelect) {
      console.log('Calling onFileSelect with:', file.id);
      onFileSelect(file.id);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          draggable
          onDragStart={(e) => onDragStart(e, file.id)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, file.id)}
          onDragEnd={onDragEnd}
          onClick={handleFileClick}
          className={`
            flex items-center justify-between p-3 rounded-lg transition-all duration-300
            hover:bg-quantum-matrix cursor-pointer group
            ${file.superposition ? 'border border-quantum-glow/30 holographic' : 'border border-transparent'}
            ${draggedItem === file.id ? 'opacity-50 scale-95' : ''}
            ${file.type !== "folder" ? 'hover:border-quantum-glow/50' : ''}
          `}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              {getFileIcon(file.type)}
              {file.superposition && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-quantum-glow rounded-full particle-animation" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{file.name}</span>
                {file.favorite && (
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                )}
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground items-center">
                <span className={getTypeColor(file.type)}>{file.type.toUpperCase()}</span>
                <span>{file.size}</span>
                <span>{file.modified}</span>
                <div className="flex gap-1">
                  {file.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Circuit Preview for circuit files */}
            {file.type === "circuit" && (
              <div className="w-24 h-16 bg-quantum-void/50 rounded border border-quantum-glow/20 flex items-center justify-center">
                <CircuitPreview fileId={file.id} />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {file.versions > 1 && (
              <div className="flex items-center gap-1 text-xs text-quantum-neon">
                <GitBranch className="w-3 h-3" />
                <span>{file.lastVersion}</span>
              </div>
            )}
            {file.superposition && (
              <span className="text-xs font-mono text-quantum-glow">|ψ⟩</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(file.id);
              }}
            >
              {file.favorite ? (
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              ) : (
                <StarOff className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="quantum-panel border-quantum-glow/30">
        <ContextMenuItem onClick={() => onContextAction("view", file.id)}>
          <Eye className="w-4 h-4 mr-2" />
          View
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onContextAction("rename", file.id)}>
          <Edit className="w-4 h-4 mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onContextAction("duplicate", file.id)}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onContextAction("share", file.id)}>
          <Share className="w-4 h-4 mr-2" />
          Share
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onContextAction("versions", file.id)}>
          <History className="w-4 h-4 mr-2" />
          Version History
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem 
          onClick={() => onContextAction("delete", file.id)}
          className="text-red-400"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
