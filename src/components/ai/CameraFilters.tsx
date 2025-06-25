
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Download, FileImage, Video, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

export function CameraFilters() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const filters = [
    { id: 'none', name: 'No Filter', css: 'none' },
    { id: 'polaroid', name: 'Polaroid Effect', css: 'sepia(0.5) contrast(1.2) brightness(1.1) saturate(1.3)' },
    { id: 'disposable', name: 'Disposable Camera', css: 'contrast(1.3) brightness(1.2) saturate(0.8) hue-rotate(10deg)' },
    { id: 'vintage', name: 'Old Photo Effect', css: 'sepia(0.8) contrast(1.1) brightness(1.1) saturate(0.7)' },
    { id: 'ccd', name: 'CCD Effect', css: 'contrast(1.4) brightness(0.9) saturate(1.2) hue-rotate(-10deg)' },
    { id: 'chromatic', name: 'Chromatic Effect', css: 'hue-rotate(90deg) saturate(1.5) contrast(1.2)' },
    { id: 'grain', name: 'Film Grain', css: 'contrast(1.2) brightness(0.95) grayscale(0.1) opacity(0.9)' },
  ];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsStreaming(true);
        toast.success('Camera started successfully!');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
    toast.success('Camera stopped');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Apply filter to canvas
      const filterCSS = filters.find(f => f.id === selectedFilter)?.css || 'none';
      ctx.filter = filterCSS;
      
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      toast.success('Photo captured with filter applied!');
    }
  };

  const downloadImage = (format: 'normal' | 'polaroid') => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `vintage-photo-${Date.now()}.png`;
    
    if (format === 'polaroid') {
      // Create polaroid frame effect
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width + 40;
        canvas.height = img.height + 60;
        
        // White polaroid background
        ctx!.fillStyle = '#ffffff';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image with margin
        ctx!.drawImage(img, 20, 20);
        
        // Add polaroid text area
        ctx!.fillStyle = '#f5f5f5';
        ctx!.fillRect(20, img.height + 20, img.width, 40);
        
        link.href = canvas.toDataURL('image/png');
        link.download = `polaroid-${Date.now()}.png`;
        link.click();
      };
      
      img.src = capturedImage;
    } else {
      link.click();
    }
    
    toast.success(`Image downloaded as ${format}!`);
  };

  const addToNotes = () => {
    if (!capturedImage) return;
    
    // This would integrate with the notes system
    const imageHtml = `<div class="note-image" style="text-align: center; margin: 20px 0;"><img src="${capturedImage}" alt="Vintage Photo" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" /><p style="font-size: 12px; color: #666; margin-top: 8px;">Vintage Photo with ${filters.find(f => f.id === selectedFilter)?.name} filter</p></div>`;
    
    // Store in localStorage for now (in real app, this would integrate with the notes system)
    localStorage.setItem('pending-image', imageHtml);
    toast.success('Photo ready to add to notes! Create or open a note to add it.');
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            Vintage Camera Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {!isStreaming ? (
              <Button onClick={startCamera} className="bg-green-500 hover:bg-green-600">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="destructive">
                <StopCircle className="w-4 h-4 mr-2" />
                Stop Camera
              </Button>
            )}
            
            {isStreaming && (
              <Button onClick={capturePhoto} className="bg-blue-500 hover:bg-blue-600">
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Vintage Filter</label>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a filter" />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ 
                    filter: filters.find(f => f.id === selectedFilter)?.css || 'none'
                  }}
                />
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="opacity-75">Click "Start Camera" to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {capturedImage && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Captured Photo</h3>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured with filter"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    onClick={() => downloadImage('normal')} 
                    size="sm"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    onClick={() => downloadImage('polaroid')} 
                    size="sm"
                    variant="outline"
                  >
                    <FileImage className="w-4 h-4 mr-1" />
                    Polaroid Frame
                  </Button>
                  <Button 
                    onClick={addToNotes} 
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Add to Notes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
