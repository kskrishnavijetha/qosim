import { useState } from "react";
import { 
  FileText, 
  Download, 
  Trash2, 
  Lock, 
  Unlock, 
  Star, 
  Share2,
  MoreHorizontal,
  Eye,
  Edit,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QFSFile } from "@/lib/qfs/qfsCore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface QFSFileItemProps {
  file: QFSFile;
  onSelect: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onExportQASM: (fileId: string) => void;
  onExportJSON: (fileId: string) => void;
}

export function QFSFileItem({ file, onSelect, onDelete, onExportQASM, onExportJSON }: QFSFileItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = () => {
    switch (file.type) {
      case 'circuit':
      case 'qasm':
        return <FileText className="w-4 h-4 text-quantum-glow" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getFileTypeColor = () => {
    switch (file.type) {
      case 'circuit': return 'bg-quantum-glow/20 text-quantum-glow border-quantum-glow/30';
      case 'qasm': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'algorithm': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'data': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'model': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'view':
        onSelect(file.id);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
          onDelete(file.id);
        }
        break;
      case 'export-qasm':
        if (file.type === 'circuit' || file.type === 'qasm') {
          onExportQASM(file.id);
        } else {
          toast.error('Only circuits can be exported as QASM');
        }
        break;
      case 'export-json':
        onExportJSON(file.id);
        break;
      case 'copy-path':
        navigator.clipboard.writeText(file.path);
        toast.success('File path copied to clipboard');
        break;
      case 'share':
        // Generate share link
        const shareUrl = `${window.location.origin}/file/${file.id}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard');
        break;
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between p-3 rounded-lg border transition-all
        ${isHovered ? 'bg-quantum-glow/5 border-quantum-glow/30' : 'bg-black/20 border-muted/20'}
        hover:shadow-md hover:shadow-quantum-glow/10
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* File Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded border border-muted/30">
          {getFileIcon()}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">{file.name}</h3>
            {file.favorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
            {file.superposition && <Badge variant="outline" className="text-xs">Superposition</Badge>}
          </div>
          
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span>{file.sizeDisplay}</span>
            <span>{file.metadata.version}</span>
            <span>{file.updatedAt.toLocaleDateString()}</span>
            
            {/* Permissions */}
            <div className="flex items-center gap-1">
              {file.permissions.readable && <Eye className="w-3 h-3" />}
              {file.permissions.writable && <Edit className="w-3 h-3" />}
              {file.permissions.shared && <Share2 className="w-3 h-3" />}
              {!file.permissions.public && <Lock className="w-3 h-3" />}
            </div>
          </div>
        </div>

        {/* File Type Badge */}
        <Badge className={`text-xs ${getFileTypeColor()}`}>
          {file.type.toUpperCase()}
        </Badge>

        {/* Tags */}
        <div className="flex gap-1">
          {file.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {file.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{file.tags.length - 2}
            </Badge>
          )}
        </div>
      </div>

      {/* Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="quantum-panel border-quantum-glow/30">
          <DropdownMenuItem onClick={() => handleAction('view')}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleAction('export-json')}>
            <Download className="mr-2 h-4 w-4" />
            Export as JSON
          </DropdownMenuItem>
          
          {(file.type === 'circuit' || file.type === 'qasm') && (
            <DropdownMenuItem onClick={() => handleAction('export-qasm')}>
              <Download className="mr-2 h-4 w-4" />
              Export as QASM
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => handleAction('copy-path')}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Path
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAction('share')}>
            <Share2 className="mr-2 h-4 w-4" />
            Share File
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => handleAction('delete')}
            className="text-red-400 focus:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}