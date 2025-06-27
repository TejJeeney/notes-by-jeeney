
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Download, RotateCcw, Palette } from 'lucide-react';
import { toast } from 'sonner';

const VINTAGE_FILTERS = [
  {
    id: 'polaroid-dream',
    name: 'Polaroid Dream',
    description: 'Iconic Polaroid-style fade with soft vignette and dreamy hues',
    emoji: '📸',
    css: 'sepia(20%) saturate(120%) contrast(85%) brightness(110%) hue-rotate(10deg)'
  },
  {
    id: 'sepia-glow',
    name: 'Sepia Glow',
    description: 'Warm sepia-toned filter with golden glow for old-school portraits',
    emoji: '🌅',
    css: 'sepia(80%) saturate(150%) contrast(90%) brightness(105%) hue-rotate(20deg)'
  },
  {
    id: 'film-grain',
    name: 'Film Grain',
    description: 'Grainy texture with faded colors, mimicking classic film roll look',
    emoji: '🎞️',
    css: 'contrast(110%) brightness(95%) saturate(85%) hue-rotate(-5deg)'
  },
  {
    id: 'retro-chrome',
    name: 'Retro Chrome',
    description: 'Vintage chrome filter with washed-out colors for a 70s vibe',
    emoji: '✨',
    css: 'contrast(120%) brightness(110%) saturate(70%) hue-rotate(15deg)'
  },
  {
    id: 'vintage-noir',
    name: 'Vintage Noir',
    description: 'Black & white with high contrast and rich shadow details',
    emoji: '🎭',
    css: 'grayscale(100%) contrast(150%) brightness(90%)'
  },
  {
    id: 'faded-retro',
    name: 'Faded Retro',
    description: 'Slightly faded, sun-bleached effect from the 80s',
    emoji: '🌴',
    css: 'saturate(70%) contrast(85%) brightness(115%) hue-rotate(25deg)'
  },
  {
    id: 'cinematic-classic',
    name: 'Cinematic Classic',
    description: 'Muted tones with filmic contrast for timeless movie scenes',
    emoji: '🎬',
    css: 'contrast(95%) saturate(80%) brightness(100%) hue-rotate(-10deg)'
  },
  {
    id: 'kodachrome-dreams',
    name: 'Kodachrome Dreams',
    description: 'Bright colors with warm, rich look inspired by Kodachrome film',
    emoji: '🌈',
    css: 'saturate(140%) contrast(110%) brightness(105%) hue-rotate(5deg)'
  },
  {
    id: 'retro-sunset',
    name: 'Retro Sunset',
    description: 'Warm oranges and pinks with vintage California feel',
    emoji: '🌅',
    css: 'saturate(130%) contrast(100%) brightness(110%) hue-rotate(30deg)'
  },
  {
    id: 'bokeh-blast',
    name: 'Bokeh Blast',
    description: 'Soft, colorful bokeh effects for dreamy vintage portraits',
    emoji: '💫',
    css: 'blur(0.5px) saturate(120%) brightness(110%) contrast(90%)'
  },
  {
    id: 'sunfaded-memories',
    name: 'Sunfaded Memories',
    description: 'Sun-bleached effect with washed-out colors and light leaks',
    emoji: '☀️',
    css: 'saturate(60%) contrast(80%) brightness(125%) hue-rotate(35deg)'
  },
  {
    id: 'grunge-aesthetic',
    name: 'Grunge Aesthetic',
    description: 'Gritty, worn-out effect with rough textures and faded tones',
    emoji: '🎸',
    css: 'contrast(130%) saturate(70%) brightness(85%) hue-rotate(-15deg)'
  }
];

const FONT_FAMILIES = [
  { id: 'inter', name: 'Inter', category: 'Clean & Modern' },
  { id: 'poppins', name: 'Poppins', category: 'Clean & Modern' },
  { id: 'roboto', name: 'Roboto', category: 'Clean & Modern' },
  { id: 'lato', name: 'Lato', category: 'Clean & Modern' },
  { id: 'montserrat', name: 'Montserrat', category: 'Clean & Modern' },
  { id: 'raleway', name: 'Raleway', category: 'Aesthetic & Minimal' },
  { id: 'space-grotesk', name: 'Space Grotesk', category: 'Smart & Techy' },
  { id: 'orbitron', name: 'Orbitron', category: 'Smart & Techy' },
  { id: 'comic-neue', name: 'Comic Neue', category: 'Playful & Funky' },
  { id: 'fredoka', name: 'Fredoka', category: 'Playful & Funky' },
  { id: 'cinzel', name: 'Cinzel', category: 'Vintage & Dramatic' },
  { id: 'playfair-display', name: 'Playfair Display', category: 'Vintage & Dramatic' }
];

export function CameraFilters() {
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFont, setSelectedFont] = useState('inter');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setShowCamera(true);
        toast.success('Camera ready! Smile for the camera! 📸');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Camera access denied. Please check permissions.');
    } finally {
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
        toast.success('Photo captured! Now choose a vintage filter.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        toast.success('Image uploaded! Ready for vintage magic.');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file.');
    }
  };

  const applyFilter = (filterId: string) => {
    setSelectedFilter(filterId);
    const filter = VINTAGE_FILTERS.find(f => f.id === filterId);
    if (filter) {
      toast.success(`${filter.name} filter applied! ${filter.emoji}`);
    }
  };

  const downloadImage = () => {
    if (capturedImage) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          if (ctx) {
            // Apply filter
            const filter = VINTAGE_FILTERS.find(f => f.id === selectedFilter);
            if (filter) {
              ctx.filter = filter.css;
            }
            
            ctx.drawImage(img, 0, 0);
            
            // Add caption if present
            if (caption.trim()) {
              ctx.filter = 'none';
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
              
              ctx.fillStyle = 'white';
              ctx.font = `24px ${selectedFont}`;
              ctx.textAlign = 'center';
              ctx.fillText(caption, canvas.width / 2, canvas.height - 30);
            }
            
            // Download the image
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `vintage-photo-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('Vintage photo downloaded! 📷✨');
              }
            }, 'image/jpeg', 0.9);
          }
        };
        
        img.src = capturedImage;
      }
    }
  };

  const resetCapture = () => {
    setCapturedImage('');
    setSelectedFilter('');
    setCaption('');
    stopCamera();
    toast.info('Ready for a new vintage moment!');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Camera className="w-5 h-5 text-purple-600" />
            Vintage Camera Filters
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            📸 Capture memories in style! Use your device's camera to snap a picture or upload an existing image, 
            and apply a selection of nostalgic filters that give your photos that timeless retro touch. Whether you want 
            your shot to have that classic film look, soft vintage hues, or a touch of grunge, we've got you covered. 
            Choose your favorite filter below and let's bring your photos back to the golden age of photography!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!capturedImage && !showCamera && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={startCamera} 
                disabled={isCapturing}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
              >
                <Camera className="w-4 h-4" />
                {isCapturing ? 'Starting Camera...' : 'Take Photo'}
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {showCamera && (
            <div className="space-y-4">
              <div className="relative mx-auto max-w-md">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={capturePhoto} className="bg-red-500 hover:bg-red-600">
                  📸 Capture Photo
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-6">
              <div className="relative mx-auto max-w-md">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-lg shadow-lg"
                  style={{
                    filter: selectedFilter ? VINTAGE_FILTERS.find(f => f.id === selectedFilter)?.css : 'none'
                  }}
                />
                {caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 rounded-b-lg">
                    <p className="text-center" style={{ fontFamily: selectedFont }}>
                      {caption}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Add Caption (Optional)</label>
                  <Input
                    placeholder="Add a vintage caption to your photo..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="text-center"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Caption Font</label>
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.id} value={font.id}>
                          <span style={{ fontFamily: font.id }}>
                            {font.name} - {font.category}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {VINTAGE_FILTERS.map((filter) => (
                  <Card 
                    key={filter.id}
                    className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                      selectedFilter === filter.id ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                    onClick={() => applyFilter(filter.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{filter.emoji}</span>
                        <h3 className="font-semibold text-sm">{filter.name}</h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {filter.description}
                      </p>
                      {selectedFilter === filter.id && (
                        <Badge className="mt-2 bg-purple-500">
                          <Palette className="w-3 h-3 mr-1" />
                          Applied
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={downloadImage} className="bg-green-500 hover:bg-green-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download Vintage Photo
                </Button>
                <Button onClick={resetCapture} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Take New Photo
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
}
