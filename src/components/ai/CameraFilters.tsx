import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, Upload, Download, Copy, Check, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CameraFiltersProps {
  selectedTool: string;
}

export function CameraFilters({ selectedTool }: CameraFiltersProps) {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const { toast } = useToast();

  const fonts = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  ];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaServices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
      toast({
        title: "Camera Started",
        description: "Camera is now active. Click capture to take a photo.",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    toast({
      title: "Camera Stopped",
      description: "Camera has been turned off.",
    });
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setImage(imageDataUrl);
        stopCamera();
        toast({
          title: "Photo Captured!",
          description: "Your photo has been captured successfully.",
        });
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaption = async () => {
    if (!image) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `Generate a creative, fun caption for this image. Make it engaging and suitable for social media.`,
          action: 'sticker'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Could not generate caption:", error);
      toast({
        title: "Error",
        description: "Failed to generate caption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const humanizeContent = async () => {
    if (!result) return;
    
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: result,
          action: 'humanize',
          tone: 'friendly',
          complexity: 'simple',
          contractions: true,
          empathy: 'high',
          humor: 'light',
          language: 'english',
          outputLength: 'medium'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
      toast({
        title: "Content Humanized!",
        description: "The text has been made more natural and easy to understand.",
      });
    } catch (error) {
      console.error("Could not humanize content:", error);
      toast({
        title: "Error",
        description: "Failed to humanize content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: `${filename}.txt has been downloaded.`,
    });
  };

  const downloadPolaroid = () => {
    if (!image || !result) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 500;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create image
    const img = new Image();
    img.onload = () => {
      // Draw image (square crop in center)
      const imgSize = 350;
      const imgX = (canvas.width - imgSize) / 2;
      const imgY = 25;
      
      ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

      // Add caption with selected font
      ctx.fillStyle = 'black';
      ctx.font = `16px ${selectedFont}`;
      ctx.textAlign = 'center';
      
      const words = result.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 360) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      const startY = 410;
      lines.slice(0, 4).forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + (index * 20));
      });

      // Download
      const link = document.createElement('a');
      link.download = `polaroid-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Polaroid Downloaded!",
        description: "Your Polaroid image has been saved.",
      });
    };
    img.src = image;
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Content has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Camera & Image Caption Generator</CardTitle>
          <CardDescription>Take a photo or upload an image to generate AI captions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button onClick={showCamera ? stopCamera : startCamera} variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              {showCamera ? 'Stop Camera' : 'Start Camera'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {showCamera && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg border"
              />
              <Button onClick={capturePhoto} className="w-full">
                Capture Photo
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {image && (
            <div className="space-y-4">
              <img src={image} alt="Captured" className="w-full max-w-md mx-auto rounded-lg border" />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Font for Polaroid:</label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font.name} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateCaption} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Caption...
                  </>
                ) : (
                  <>
                    Generate AI Caption
                  </>
                )}
              </Button>
            </div>
          )}

          {result && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Generated Caption</CardTitle>
                  <CardDescription>AI-generated caption for your image</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={humanizeContent}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Humanize
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(result)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    onClick={() => downloadAsText(result, `caption-${Date.now()}`)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
                  {result}
                </div>
                {image && (
                  <Button onClick={downloadPolaroid} className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download as Polaroid
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
