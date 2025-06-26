import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Download, Wand2, Type, Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function CameraFilters() {
  const [selectedFilter, setSelectedFilter] = useState('vintage');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [aiCaption, setAiCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filters = [
    { label: 'Vintage', value: 'vintage' },
    { label: 'Sepia', value: 'sepia' },
    { label: 'Black & White', value: 'bw' },
    { label: 'Retro', value: 'retro' },
    { label: 'Aged', value: 'aged' },
  ];

  const currentFilter = filters.find(f => f.value === selectedFilter)?.label || 'Vintage';

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setProcessedImage(null);
        setAiCaption(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilter = async () => {
    if (!uploadedImage) return;

    setLoading(true);
    setAiCaption(null);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = getFilterStyle(selectedFilter);
      ctx.drawImage(img, 0, 0, img.width, img.height);

      setProcessedImage(canvas.toDataURL());
      setLoading(false);
    };
    img.src = uploadedImage;
  };

  const generateCaption = async () => {
    if (!processedImage) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: 'Write a short, catchy caption for this vintage photo.' }),
      });

      const data = await response.json();
      setAiCaption(data.result);
    } catch (error) {
      console.error("AI Caption Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate caption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilterStyle = (filter: string) => {
    switch (filter) {
      case 'sepia': return 'sepia(100%)';
      case 'bw': return 'grayscale(100%)';
      case 'retro': return 'sepia(80%) contrast(110%) brightness(90%)';
      case 'aged': return 'sepia(50%) blur(2px) contrast(80%)';
      default: return 'sepia(30%) contrast(120%) brightness(85%)'; // Vintage
    }
  };

  const downloadImage = () => {
    if (processedImage && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `vintage-photo-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Downloaded!",
        description: "Your vintage photo has been downloaded.",
      });
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Caption has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadCaption = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `photo-caption-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Caption has been downloaded.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Photo</CardTitle>
          <CardDescription>Add a photo to apply vintage filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="upload-image"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-image">
              <Button asChild variant="secondary">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </label>
            {uploadedImage && (
              <Badge variant="secondary">Image Uploaded</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Apply Filter</CardTitle>
            <CardDescription>Choose a vintage filter to apply</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent>
                  {filters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={applyFilter}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Apply Filter
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {processedImage && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Vintage Photo</CardTitle>
              <CardDescription>Processed with {currentFilter} filter</CardDescription>
            </div>
            <Button
              onClick={downloadImage}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Photo
            </Button>
          </CardHeader>
          <CardContent>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <img
              src={processedImage}
              alt="Vintage Filtered"
              className="w-full rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {processedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Generate AI Caption</CardTitle>
            <CardDescription>Get a perfect caption for your vintage photo</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={generateCaption}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Type className="w-4 h-4 mr-2" />
                  Generate Caption
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {aiCaption && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>AI Generated Caption</CardTitle>
              <CardDescription>Perfect for your vintage photo</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(aiCaption)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={() => downloadCaption(aiCaption)}
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
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              {aiCaption}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
