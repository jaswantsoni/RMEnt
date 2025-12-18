import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Image as ImageIcon } from 'lucide-react';

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  accessToken: string;
}

export function ImagePicker({ isOpen, onClose, onSelectImage, accessToken }: ImagePickerProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchImages();
    }
  }, [isOpen, accessToken]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // Find AH India shared drive
      const drivesResponse = await fetch(
        'https://www.googleapis.com/drive/v3/drives?pageSize=100',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const drivesData = await drivesResponse.json();
      
      const ahIndiaDrive = drivesData.drives?.find((drive: any) => 
        drive.name.toLowerCase().includes('ah india')
      );
      
      if (ahIndiaDrive) {
        console.log('Found AH India drive:', ahIndiaDrive.name);
        const allImages = await searchAllImagesInDrive(ahIndiaDrive.id);
        setImages(allImages);
      } else {
        console.log('AH India drive not found');
        setImages([]);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const searchAllImagesInDrive = async (driveId: string): Promise<any[]> => {
    const query = `(mimeType contains 'image/jpeg' or mimeType contains 'image/jpg' or mimeType contains 'image/png')`;
    
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,parents)&pageSize=1000&driveId=${driveId}&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=drive`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    
    const data = await response.json();
    console.log(`Found ${data.files?.length || 0} images in AH India drive`);
    return data.files || [];
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectImage = (image: any) => {
    // Try multiple URL formats for better compatibility
    const imageUrl = `https://drive.google.com/thumbnail?id=${image.id}&sz=w1000`;
    console.log('Selected image:', image.name, 'URL:', imageUrl);
    onSelectImage(imageUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose Image from Google Drive</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading images...</div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                {images.length === 0 ? 'No images found in Google Drive' : 'No images match your search'}
              </div>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="grid grid-cols-4 gap-4 p-2">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="cursor-pointer group"
                    onClick={() => handleSelectImage(image)}
                  >
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <div className="text-xs text-center p-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
                        <p className="truncate">{image.name}</p>
                      </div>
                    </div>
                    <p className="text-xs mt-1 truncate" title={image.name}>
                      {image.name}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}