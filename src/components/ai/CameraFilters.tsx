
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Download, FileImage, Video, StopCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function CameraFilters() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [customCaption, setCustomCaption] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

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
      
      const filterCSS = filters.find(f => f.id === selectedFilter)?.css || 'none';
      ctx.filter = filterCSS;
      
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      toast.success('Photo captured with filter applied!');
    }
  };

  const generateCaption = async () => {
    if (!capturedImage) return;
    
    setIsGeneratingCaption(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: "Generate a short, meaningful caption for this vintage-style photograph. Make it nostalgic and memory-worthy.", 
          action: 'caption',
          image: capturedImage
        }
      });

      if (error) throw error;
      setCustomCaption(data.result);
      toast.success('Caption generated!');
    } catch (error) {
      console.error('Error generating caption:', error);
      toast.error('Failed to generate caption');
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const downloadPolaroid = () => {
    if (!capturedImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const padding = 40;
      const bottomSpace = 80;
      canvas.width = img.width + (padding * 2);
      canvas.height = img.height + padding + bottomSpace;
      
      // White polaroid background with slight shadow
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle shadow
      ctx!.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx!.shadowBlur = 10;
      ctx!.shadowOffsetX = 5;
      ctx!.shadowOffsetY = 5;
      
      // Draw image
      ctx!.drawImage(img, padding, padding);
      
      // Reset shadow for text
      ctx!.shadowColor = 'transparent';
      ctx!.shadowBlur = 0;
      ctx!.shadowOffsetX = 0;
      ctx!.shadowOffsetY = 0;
      
      // Add caption if provided
      if (customCaption.trim()) {
        ctx!.fillStyle = '#333333';
        ctx!.font = '18px "Courier New", monospace';
        ctx!.textAlign = 'center';
        
        // Word wrap for long captions
        const words = customCaption.split(' ');
        const maxWidth = canvas.width - (padding * 2);
        let line = '';
        let y = img.height + padding + 30;
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx!.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            ctx!.fillText(line, canvas.width / 2, y);
            line = words[n] + ' ';
            y += 25;
          } else {
            line = testLine;
          }
        }
        ctx!.fillText(line, canvas.width / 2, y);
      }
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `polaroid-${Date.now()}.png`;
      link.click();
      
      setShowCaptionModal(false);
      setCustomCaption('');
      toast.success('Polaroid downloaded with caption!');
    };
    
    img.src = capturedImage;
  };

  const downloadImage = (format: 'normal' | 'polaroid') => {
    if (!capturedImage) return;

    if (format === 'polaroid') {
      setShowCaptionModal(true);
    } else {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `vintage-photo-${Date.now()}.png`;
      link.click();
      toast.success('Image downloaded!');
    }
  };

  const addToNotes = () => {
    if (!capturedImage) return;
    
    const imageHtml = `<div class="note-image" style="text-align: center; margin: 20px 0;"><img src="${capturedImage}" alt="Vintage Photo" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" /><p style="font-size: 12px; color: #666; margin-top: 8px;">Vintage Photo with ${filters.find(f => f.id === selectedFilter)?.name} filter</p></div>`;
    
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
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-0">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Vintage Camera Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap gap-2">
            {!isStreaming ? (
              <Button onClick={startCamera} className="bg-green-500 hover:bg-green-600 text-xs sm:text-sm">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="destructive" className="text-xs sm:text-sm">
                <StopCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Stop Camera
              </Button>
            )}
            
            {isStreaming && (
              <Button onClick={capturePhoto} className="bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Capture Photo
              </Button>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">Select Vintage Filter</label>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full text-xs sm:text-sm">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold mb-2">Live Preview</h3>
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
                      <Camera className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                      <p className="opacity-75 text-xs sm:text-sm">Click "Start Camera" to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {capturedImage && (
              <div>
                <h3 className="text-sm sm:text-lg font-semibold mb-2">Captured Photo</h3>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured with filter"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                  <Button 
                    onClick={() => downloadImage('normal')} 
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button 
                    onClick={() => downloadImage('polaroid')} 
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <FileImage className="w-3 h-3 mr-1" />
                    Polaroid Frame
                  </Button>
                  <Button 
                    onClick={addToNotes} 
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 text-xs"
                  >
                    Add to Notes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Caption Modal for Polaroid */}
      {showCaptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Add Polaroid Caption</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Custom Caption</label>
                <Textarea
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  placeholder="Write a caption for your memory..."
                  className="text-xs sm:text-sm"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={generateCaption}
                disabled={isGeneratingCaption}
                variant="outline"
                className="w-full text-xs sm:text-sm"
              >
                {isGeneratingCaption ? (
                  <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-2" />
                )}
                {isGeneratingCaption ? 'Generating...' : 'Generate AI Caption'}
              </Button>
              
              <div className="flex gap-2">
                <Button onClick={downloadPolaroid} className="flex-1 text-xs sm:text-sm">
                  Download Polaroid
                </Button>
                <Button onClick={() => setShowCaptionModal(false)} variant="outline" className="text-xs sm:text-sm">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
