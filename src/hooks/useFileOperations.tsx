import { useState } from "react";

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

export function useFileOperations(files: File[], setFiles: (files: File[]) => void) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = files.findIndex(f => f.id === draggedId);
    const targetIndex = files.findIndex(f => f.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }
    
    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, draggedFile);
    
    setFiles(newFiles);
    setDraggedItem(null);
  };

  const handleContextAction = (action: string, fileId: string, onShare?: (file: any) => void) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    switch (action) {
      case "rename":
        const newName = prompt("Enter new name:", file.name);
        if (newName && newName !== file.name) {
          setFiles(files.map(f => 
            f.id === fileId ? { ...f, name: newName, modified: new Date().toISOString().slice(0, 16).replace('T', ' ') } : f
          ));
        }
        break;
      case "duplicate":
        const extension = file.name.includes('.') ? file.name.split('.').pop() : '';
        const baseName = file.name.includes('.') ? file.name.split('.').slice(0, -1).join('.') : file.name;
        const duplicated = {
          ...file,
          id: `${file.id}-copy-${Date.now()}`,
          name: extension ? `${baseName}_copy.${extension}` : `${baseName}_copy`,
          modified: new Date().toISOString().slice(0, 16).replace('T', ' '),
          versions: 1,
          lastVersion: "v1.0"
        };
        setFiles([...files, duplicated]);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
          setFiles(files.filter(f => f.id !== fileId));
        }
        break;
      case "share":
        if (onShare) {
          onShare(file);
        } else {
          // Fallback to simple share
          const shareUrl = `${window.location.origin}/shared/${fileId}`;
          navigator.clipboard.writeText(shareUrl).then(() => {
            alert(`Share link copied to clipboard: ${shareUrl}`);
          }).catch(() => {
            alert(`Share link: ${shareUrl}`);
          });
        }
        break;
    }
  };

  const toggleFavorite = (id: string) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, favorite: !file.favorite } : file
    ));
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleContextAction,
    toggleFavorite
  };
}