import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUploadOptions } from './ImageUploadOptions';
import { Image as ImageIcon } from 'lucide-react';

interface ProductImageCardProps {
  product: any;
  index: number;
  accessToken: string;
  onUpdateProduct: (product: any) => void;
}

export function ProductImageCard({ product, index, accessToken, onUpdateProduct }: ProductImageCardProps) {
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const handleSelectImage = (imageUrl: string) => {
    onUpdateProduct({ ...product, imageUrl });
  };

  return (
    <>
      <Card className="p-4">
        <div className="relative group">
          <div className="w-full h-48 bg-muted rounded mb-4 flex items-center justify-center relative overflow-hidden">
            {product.imageUrl && product.imageUrl !== '/placeholder.svg' ? (
              <>
                <img
                  src={product.imageUrl}
                  alt={String(Object.values(product)[1] || 'Product')}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('Image loaded:', product.imageUrl)}
                  onError={(e) => {
                    console.log('Image failed to load:', product.imageUrl);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-center p-4"><div class="text-xs text-muted-foreground mb-2">Image Preview</div><div class="text-xs font-mono break-all">${product.imageUrl}</div></div>`;
                    }
                  }}
                />
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">No image selected</p>
              </div>
            )}
          </div>
          <Button
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowUploadOptions(true)}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
        <div className="space-y-1">
          {Object.entries(product).map(([key, value]) => {
            if (key === 'id' || key === 'imageUrl') return null;
            return (
              <div key={key}>
                <span className="text-xs font-medium text-muted-foreground">{key}:</span>
                <span className="text-sm ml-2">{String(value)}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <ImageUploadOptions
        isOpen={showUploadOptions}
        onClose={() => setShowUploadOptions(false)}
        onSelectImage={handleSelectImage}
        accessToken={accessToken}
      />
    </>
  );
}