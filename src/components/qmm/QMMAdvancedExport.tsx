
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, Video, Image, FileText, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface QMMAdvancedExportProps {
  qubitData: any[];
  fidelityData: any[];
  decoherenceData: any[];
  currentTime: number;
  maxTime: number;
  onExport: (format: string, options: any) => Promise<void>;
}

export function QMMAdvancedExport({
  qubitData,
  fidelityData,
  decoherenceData,
  currentTime,
  maxTime,
  onExport
}: QMMAdvancedExportProps) {
  
  const [exportFormat, setExportFormat] = useState('png');
  const [exportOptions, setExportOptions] = useState({
    includeTimeline: true,
    includeFidelity: true,
    includeHotspots: true,
    includeEducational: false,
    quality: 'high',
    duration: 10, // seconds for video
    fps: 30,
    resolution: '1920x1080',
    includeMetadata: true,
    includeWatermark: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportFormats = [
    { value: 'png', label: 'PNG Image', icon: <Image className="w-4 h-4" /> },
    { value: 'svg', label: 'SVG Vector', icon: <Image className="w-4 h-4" /> },
    { value: 'pdf', label: 'PDF Report', icon: <FileText className="w-4 h-4" /> },
    { value: 'mp4', label: 'MP4 Video', icon: <Video className="w-4 h-4" /> },
    { value: 'gif', label: 'Animated GIF', icon: <Video className="w-4 h-4" /> },
    { value: 'json', label: 'JSON Data', icon: <Download className="w-4 h-4" /> }
  ];

  const qualityOptions = [
    { value: 'low', label: 'Low (Fast)' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High (Slow)' },
    { value: 'ultra', label: 'Ultra HD' }
  ];

  const resolutionOptions = [
    { value: '1280x720', label: '720p HD' },
    { value: '1920x1080', label: '1080p Full HD' },
    { value: '2560x1440', label: '1440p QHD' },
    { value: '3840x2160', label: '4K UHD' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      await onExport(exportFormat, exportOptions);
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      toast.success(`${exportFormat.toUpperCase()} export completed successfully!`);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
      
    } catch (error) {
      setIsExporting(false);
      setExportProgress(0);
      toast.error('Export failed. Please try again.');
    }
  };

  const generateShareableLink = () => {
    const shareData = {
      qubitCount: qubitData.length,
      maxTime,
      timestamp: new Date().toISOString(),
      settings: exportOptions
    };
    
    const encodedData = btoa(JSON.stringify(shareData));
    const shareUrl = `${window.location.origin}/qmm/shared/${encodedData}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success('Shareable link copied to clipboard!');
  };

  const isVideoFormat = exportFormat === 'mp4' || exportFormat === 'gif';
  const isPDFFormat = exportFormat === 'pdf';

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Download className="w-5 h-5" />
          Advanced Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Format Selection */}
        <div>
          <Label className="text-quantum-particle mb-2 block">Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="border-quantum-neon/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-quantum-dark border-quantum-neon/30">
              {exportFormats.map(format => (
                <SelectItem key={format.value} value={format.value}>
                  <div className="flex items-center gap-2">
                    {format.icon}
                    {format.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content Options */}
        <div>
          <Label className="text-quantum-particle mb-2 block">Include Content</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="timeline"
                checked={exportOptions.includeTimeline}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includeTimeline: !!checked }))
                }
              />
              <Label htmlFor="timeline" className="text-quantum-neon text-sm">Timeline Visualization</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fidelity"
                checked={exportOptions.includeFidelity}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includeFidelity: !!checked }))
                }
              />
              <Label htmlFor="fidelity" className="text-quantum-neon text-sm">Fidelity Charts</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hotspots"
                checked={exportOptions.includeHotspots}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includeHotspots: !!checked }))
                }
              />
              <Label htmlFor="hotspots" className="text-quantum-neon text-sm">Decoherence Hotspots</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="educational"
                checked={exportOptions.includeEducational}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includeEducational: !!checked }))
                }
              />
              <Label htmlFor="educational" className="text-quantum-neon text-sm">Educational Annotations</Label>
            </div>
          </div>
        </div>

        {/* Quality Settings */}
        <div>
          <Label className="text-quantum-particle mb-2 block">Quality</Label>
          <Select 
            value={exportOptions.quality} 
            onValueChange={(value) => setExportOptions(prev => ({ ...prev, quality: value }))}
          >
            <SelectTrigger className="border-quantum-neon/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-quantum-dark border-quantum-neon/30">
              {qualityOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Video-specific options */}
        {isVideoFormat && (
          <div className="space-y-3 p-3 border border-quantum-neon/30 rounded">
            <h4 className="text-sm font-medium text-quantum-neon">Video Settings</h4>
            
            <div>
              <Label className="text-quantum-particle mb-1 block text-xs">Resolution</Label>
              <Select 
                value={exportOptions.resolution} 
                onValueChange={(value) => setExportOptions(prev => ({ ...prev, resolution: value }))}
              >
                <SelectTrigger className="border-quantum-neon/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-quantum-dark border-quantum-neon/30">
                  {resolutionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-quantum-particle mb-1 block text-xs">
                Duration: {exportOptions.duration}s
              </Label>
              <input
                type="range"
                min="5"
                max="60"
                value={exportOptions.duration}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value) 
                }))}
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="text-quantum-particle mb-1 block text-xs">
                FPS: {exportOptions.fps}
              </Label>
              <input
                type="range"
                min="15"
                max="60"
                step="15"
                value={exportOptions.fps}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  fps: parseInt(e.target.value) 
                }))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* PDF-specific options */}
        {isPDFFormat && (
          <div className="space-y-3 p-3 border border-quantum-neon/30 rounded">
            <h4 className="text-sm font-medium text-quantum-neon">PDF Settings</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metadata"
                checked={exportOptions.includeMetadata}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includeMetadata: !!checked }))
                }
              />
              <Label htmlFor="metadata" className="text-quantum-neon text-sm">Include Metadata</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="watermark"
                checked={exportOptions.includeWatermark}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includeWatermark: !!checked }))
                }
              />
              <Label htmlFor="watermark" className="text-quantum-neon text-sm">QOSim Watermark</Label>
            </div>
          </div>
        )}

        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-quantum-particle">Exporting...</span>
              <span className="text-quantum-glow">{exportProgress.toFixed(0)}%</span>
            </div>
            <Progress value={exportProgress} className="w-full" />
          </div>
        )}

        {/* Export Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 bg-quantum-glow text-black hover:bg-quantum-glow/80"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}
          </Button>
          
          <Button
            variant="outline"
            onClick={generateShareableLink}
            className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Export Info */}
        <div className="text-xs text-quantum-particle pt-2 border-t border-quantum-matrix">
          <p>
            • PNG/SVG: Single frame at current time ({currentTime.toFixed(2)}μs)
          </p>
          <p>
            • MP4/GIF: Full timeline animation ({maxTime.toFixed(2)}μs total)
          </p>
          <p>
            • PDF: Multi-page report with all selected visualizations
          </p>
          <p>
            • JSON: Raw simulation data for external analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
