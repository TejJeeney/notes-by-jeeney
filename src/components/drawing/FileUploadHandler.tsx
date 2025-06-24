
import { useRef } from 'react';

interface DrawingObject {
  id: string;
  type: 'image' | 'drawing';
  data: string | ImageData;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface FileUploadHandlerProps {
  onObjectsUpdate: (objects: DrawingObject[]) => void;
  onRedraw: () => void;
}

export function FileUploadHandler({ onObjectsUpdate, onRedraw }: FileUploadHandlerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const newObject: DrawingObject = {
          id: Date.now().toString(),
          type: 'image',
          data: event.target?.result as string,
          x: 50,
          y: 50,
          width: Math.min(img.width, 300),
          height: Math.min(img.height, 300),
          rotation: 0
        };
        onObjectsUpdate([newObject]);
        onRedraw();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button onClick={triggerFileUpload} style={{ display: 'none' }} />
    </>
  );
}

export { FileUploadHandler as default };
export type { FileUploadHandlerProps };
