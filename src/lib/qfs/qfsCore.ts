import { toast } from 'sonner';

export interface QFSFile {
  id: string;
  name: string;
  type: 'circuit' | 'algorithm' | 'data' | 'folder' | 'qasm' | 'model';
  path: string;
  parentId?: string;
  size: number;
  sizeDisplay: string;
  contentData?: any;
  qasmContent?: string;
  permissions: QFSPermissions;
  metadata: QFSMetadata;
  superposition: boolean;
  favorite: boolean;
  tags: string[];
  versions: QFSVersion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QFSPermissions {
  owner: string;
  readable: boolean;
  writable: boolean;
  executable: boolean;
  shared: boolean;
  public: boolean;
}

export interface QFSMetadata {
  description?: string;
  author?: string;
  version: string;
  format?: string;
  encoding?: string;
  checksum?: string;
}

export interface QFSVersion {
  id: string;
  version: string;
  timestamp: Date;
  changes: string;
  contentData: any;
}

export interface QFSDirectory {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  children: (QFSFile | QFSDirectory)[];
  permissions: QFSPermissions;
  createdAt: Date;
  updatedAt: Date;
}

export class QFSCore {
  private files: Map<string, QFSFile> = new Map();
  private directories: Map<string, QFSDirectory> = new Map();
  private localStorage: Storage;
  private cacheKey = 'qfs_cache';

  constructor() {
    this.localStorage = window.localStorage;
    this.loadFromCache();
    this.initializeRootDirectory();
  }

  // ============= FILE OPERATIONS =============

  saveFile(file: Omit<QFSFile, 'id' | 'createdAt' | 'updatedAt' | 'versions'>): QFSFile {
    const id = this.generateId();
    const now = new Date();
    
    const newFile: QFSFile = {
      ...file,
      id,
      createdAt: now,
      updatedAt: now,
      versions: [{
        id: this.generateId(),
        version: file.metadata.version,
        timestamp: now,
        changes: 'Initial version',
        contentData: file.contentData
      }]
    };

    this.files.set(id, newFile);
    this.saveToCache();
    
    toast.success(`File "${file.name}" saved successfully`);
    return newFile;
  }

  loadFile(id: string): QFSFile | null {
    const file = this.files.get(id);
    if (!file) {
      toast.error('File not found');
      return null;
    }

    if (!file.permissions.readable) {
      toast.error('No read permission for this file');
      return null;
    }

    return file;
  }

  updateFile(id: string, updates: Partial<QFSFile>): boolean {
    const file = this.files.get(id);
    if (!file) {
      toast.error('File not found');
      return false;
    }

    if (!file.permissions.writable) {
      toast.error('No write permission for this file');
      return false;
    }

    const updatedFile = {
      ...file,
      ...updates,
      updatedAt: new Date()
    };

    // Create new version if content changed
    if (updates.contentData && updates.contentData !== file.contentData) {
      const newVersion: QFSVersion = {
        id: this.generateId(),
        version: this.incrementVersion(file.metadata.version),
        timestamp: new Date(),
        changes: 'Content updated',
        contentData: updates.contentData
      };
      
      updatedFile.versions = [...file.versions, newVersion];
      updatedFile.metadata.version = newVersion.version;
    }

    this.files.set(id, updatedFile);
    this.saveToCache();
    
    toast.success(`File "${file.name}" updated successfully`);
    return true;
  }

  deleteFile(id: string): boolean {
    const file = this.files.get(id);
    if (!file) {
      toast.error('File not found');
      return false;
    }

    if (!file.permissions.writable) {
      toast.error('No delete permission for this file');
      return false;
    }

    this.files.delete(id);
    this.saveToCache();
    
    toast.success(`File "${file.name}" deleted successfully`);
    return true;
  }

  // ============= QASM OPERATIONS =============

  exportQASM(fileId: string): string | null {
    const file = this.loadFile(fileId);
    if (!file) return null;

    if (file.type !== 'circuit' && file.type !== 'qasm') {
      toast.error('File is not a quantum circuit');
      return null;
    }

    if (file.qasmContent) {
      return file.qasmContent;
    }

    // Generate QASM from circuit data
    return this.generateQASMFromCircuit(file.contentData);
  }

  importQASM(qasmContent: string, fileName: string): QFSFile | null {
    try {
      const parsedContent = this.parseQASM(qasmContent);
      
      const file = this.saveFile({
        name: fileName.endsWith('.qasm') ? fileName : `${fileName}.qasm`,
        type: 'qasm',
        path: `/${fileName}`,
        size: qasmContent.length,
        sizeDisplay: this.formatSize(qasmContent.length),
        contentData: parsedContent,
        qasmContent,
        permissions: this.getDefaultPermissions(),
        metadata: {
          version: 'v1.0',
          format: 'QASM 2.0',
          encoding: 'UTF-8'
        },
        superposition: false,
        favorite: false,
        tags: ['qasm', 'circuit']
      });

      toast.success('QASM file imported successfully');
      return file;
    } catch (error) {
      toast.error('Failed to parse QASM content');
      return null;
    }
  }

  // ============= DIRECTORY OPERATIONS =============

  createDirectory(name: string, parentId?: string): QFSDirectory {
    const id = this.generateId();
    const parentPath = parentId ? this.getDirectoryPath(parentId) : '';
    const path = `${parentPath}/${name}`;

    const directory: QFSDirectory = {
      id,
      name,
      path,
      parentId,
      children: [],
      permissions: this.getDefaultPermissions(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.directories.set(id, directory);
    
    if (parentId) {
      const parent = this.directories.get(parentId);
      if (parent) {
        parent.children.push(directory);
      }
    }

    this.saveToCache();
    toast.success(`Directory "${name}" created`);
    return directory;
  }

  getDirectoryContents(directoryId?: string): (QFSFile | QFSDirectory)[] {
    if (!directoryId) {
      // Return root contents
      return [
        ...Array.from(this.files.values()).filter(f => !f.parentId),
        ...Array.from(this.directories.values()).filter(d => !d.parentId)
      ];
    }

    const directory = this.directories.get(directoryId);
    if (!directory) return [];

    const files = Array.from(this.files.values()).filter(f => f.parentId === directoryId);
    const subdirs = Array.from(this.directories.values()).filter(d => d.parentId === directoryId);
    
    return [...subdirs, ...files];
  }

  moveFile(fileId: string, targetDirectoryId?: string): boolean {
    const file = this.files.get(fileId);
    if (!file) {
      toast.error('File not found');
      return false;
    }

    if (!file.permissions.writable) {
      toast.error('No permission to move this file');
      return false;
    }

    const targetPath = targetDirectoryId ? this.getDirectoryPath(targetDirectoryId) : '';
    const newPath = `${targetPath}/${file.name}`;

    const updatedFile = {
      ...file,
      parentId: targetDirectoryId,
      path: newPath,
      updatedAt: new Date()
    };

    this.files.set(fileId, updatedFile);
    this.saveToCache();
    
    toast.success('File moved successfully');
    return true;
  }

  // ============= PERMISSION MANAGEMENT =============

  setPermissions(fileId: string, permissions: Partial<QFSPermissions>): boolean {
    const file = this.files.get(fileId);
    if (!file) {
      toast.error('File not found');
      return false;
    }

    const updatedFile = {
      ...file,
      permissions: { ...file.permissions, ...permissions },
      updatedAt: new Date()
    };

    this.files.set(fileId, updatedFile);
    this.saveToCache();
    
    toast.success('Permissions updated');
    return true;
  }

  checkPermission(fileId: string, permission: 'read' | 'write' | 'execute'): boolean {
    const file = this.files.get(fileId);
    if (!file) return false;

    switch (permission) {
      case 'read': return file.permissions.readable;
      case 'write': return file.permissions.writable;
      case 'execute': return file.permissions.executable;
      default: return false;
    }
  }

  // ============= SEARCH AND FILTER =============

  searchFiles(query: string): QFSFile[] {
    const results = Array.from(this.files.values()).filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      file.metadata.description?.toLowerCase().includes(query.toLowerCase())
    );

    return results;
  }

  filterByType(type: QFSFile['type']): QFSFile[] {
    return Array.from(this.files.values()).filter(file => file.type === type);
  }

  getFilesByTag(tag: string): QFSFile[] {
    return Array.from(this.files.values()).filter(file => file.tags.includes(tag));
  }

  // ============= CACHE MANAGEMENT =============

  private saveToCache(): void {
    try {
      const cacheData = {
        files: Array.from(this.files.entries()),
        directories: Array.from(this.directories.entries()),
        timestamp: Date.now()
      };
      
      this.localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save QFS cache:', error);
    }
  }

  private loadFromCache(): void {
    try {
      const cached = this.localStorage.getItem(this.cacheKey);
      if (!cached) return;

      const cacheData = JSON.parse(cached);
      
      // Check if cache is not too old (24 hours)
      if (Date.now() - cacheData.timestamp > 24 * 60 * 60 * 1000) {
        this.clearCache();
        return;
      }

      this.files = new Map(cacheData.files);
      this.directories = new Map(cacheData.directories);
      
      console.log('QFS cache loaded successfully');
    } catch (error) {
      console.warn('Failed to load QFS cache:', error);
      this.clearCache();
    }
  }

  clearCache(): void {
    this.localStorage.removeItem(this.cacheKey);
    this.files.clear();
    this.directories.clear();
    this.initializeRootDirectory();
  }

  // ============= UTILITY METHODS =============

  private generateId(): string {
    return `qfs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private incrementVersion(version: string): string {
    const match = version.match(/v(\d+)\.(\d+)/);
    if (match) {
      const major = parseInt(match[1]);
      const minor = parseInt(match[2]) + 1;
      return `v${major}.${minor}`;
    }
    return 'v1.1';
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private getDefaultPermissions(): QFSPermissions {
    return {
      owner: 'current_user',
      readable: true,
      writable: true,
      executable: false,
      shared: false,
      public: false
    };
  }

  private getDirectoryPath(directoryId: string): string {
    const directory = this.directories.get(directoryId);
    return directory?.path || '';
  }

  private generateQASMFromCircuit(circuitData: any): string {
    // Basic QASM generation - expand based on circuit format
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
    
    if (circuitData && circuitData.qubits) {
      qasm += `qreg q[${circuitData.qubits}];\n`;
      qasm += `creg c[${circuitData.qubits}];\n\n`;
      
      // Add gates from circuit data
      if (circuitData.gates) {
        circuitData.gates.forEach((gate: any) => {
          qasm += `${gate.type} q[${gate.qubit}];\n`;
        });
      }
    }
    
    return qasm;
  }

  private parseQASM(qasmContent: string): any {
    // Basic QASM parsing - expand for full QASM support
    const lines = qasmContent.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
    const gates: any[] = [];
    let qubits = 0;

    lines.forEach(line => {
      if (line.startsWith('qreg')) {
        const match = line.match(/qreg\s+\w+\[(\d+)\]/);
        if (match) qubits = parseInt(match[1]);
      } else if (line.includes(' q[')) {
        const parts = line.split(' ');
        const gateType = parts[0];
        const qubitMatch = line.match(/q\[(\d+)\]/);
        if (qubitMatch) {
          gates.push({
            type: gateType,
            qubit: parseInt(qubitMatch[1])
          });
        }
      }
    });

    return { qubits, gates };
  }

  private initializeRootDirectory(): void {
    if (this.directories.size === 0) {
      // Create some initial directories
      this.createDirectory('circuits');
      this.createDirectory('algorithms');
      this.createDirectory('datasets');
      this.createDirectory('models');
    }
  }

  // ============= PUBLIC API =============

  getAllFiles(): QFSFile[] {
    return Array.from(this.files.values());
  }

  getAllDirectories(): QFSDirectory[] {
    return Array.from(this.directories.values());
  }

  getFileStats() {
    const files = this.getAllFiles();
    return {
      totalFiles: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      favoriteCount: files.filter(f => f.favorite).length,
      superpositionCount: files.filter(f => f.superposition).length,
      circuitCount: files.filter(f => f.type === 'circuit').length,
      qasmCount: files.filter(f => f.type === 'qasm').length
    };
  }
}