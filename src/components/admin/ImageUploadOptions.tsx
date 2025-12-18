import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, HardDrive } from 'lucide-react';
import { ImagePicker } from './ImagePicker';

interface ImageUploadOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  accessToken: string;
}

export function ImageUploadOptions({ isOpen, onClose, onSelectImage, accessToken }: ImageUploadOptionsProps) {
  const [showDrivePicker, setShowDrivePicker] = useState(false);

  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onSelectImage(imageUrl);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleDriveSelect = (imageUrl: string) => {
    onSelectImage(imageUrl);
    setShowDrivePicker(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalUpload}
                  className="hidden"
                  id="local-upload"
                />
                <Button asChild className="w-full h-24 flex-col gap-2">
                  <label htmlFor="local-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8" />
                    Upload from PC
                  </label>
                </Button>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => setShowDrivePicker(true)}
                  variant="outline"
                  className="w-full h-24 flex-col gap-2"
                  disabled={!accessToken}
                >
                  <HardDrive className="h-8 w-8" />
                  Google Drive
                </Button>
              </div>
            </div>

            {!accessToken && (
              <p className="text-xs text-muted-foreground text-center">
                Connect to Google Drive in Setup tab to use Drive upload
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ImagePicker
        isOpen={showDrivePicker}
        onClose={() => setShowDrivePicker(false)}
        onSelectImage={handleDriveSelect}
        accessToken={accessToken}
      />
    </>
  );
}