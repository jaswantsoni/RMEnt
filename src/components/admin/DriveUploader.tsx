import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DriveUploaderProps {
  accessToken: string;
}

export function DriveUploader({ accessToken }: DriveUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadToDrive = async (file: File) => {
    const metadata = {
      name: file.name,
      parents: ['root']
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });

    return response.json();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadToDrive(file);
        setProgress(((i + 1) / files.length) * 100);
      }

      toast({
        title: 'Success',
        description: `${files.length} images uploaded to Google Drive`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Images to Drive</h3>
      
      {uploading && (
        <div className="mb-4">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground mt-1">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        id="drive-upload"
        disabled={uploading}
      />
      
      <Button asChild disabled={uploading} className="w-full">
        <label htmlFor="drive-upload" className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Images to Drive'}
        </label>
      </Button>
    </Card>
  );
}